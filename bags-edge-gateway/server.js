const net = require('net');
const dgram = require('dgram');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

// ===== CONFIG =====
const UDP_MODE = process.env.UDP_MODE === 'true';
const WS_PORT = process.env.WS_PORT || 4001;
const UDP_PORT = process.env.UDP_PORT || 4002;
const ANTENNA_IP = process.env.ANTENNA_IP || '192.168.1.200';
const ANTENNA_PORT = parseInt(process.env.ANTENNA_PORT || '4000', 10);

// ===== WEBSOCKET SERVER SETUP =====
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ===== PROTOCOL HELPERS =====
function calculateChecksum(buffer, length) {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += buffer[i];
  }
  return (~sum + 1) & 0xFF;
}

// No-payload commands: 7 bytes (RF + addr + code + checksum) — SDK C# standard
function buildSimpleCommandFrame(frameCode) {
  const header = Buffer.from([0x52, 0x46, 0x00, 0x00, 0x00, frameCode]);
  const checksum = calculateChecksum(header, 6);
  return Buffer.concat([header, Buffer.from([checksum])]);
}


function buildWriteTagFrame(membank, startAddress, wordLen, writeDataBuffer, password = Buffer.from([0,0,0,0])) {
  const contentLen = wordLen * 2;
  const tlvLen = 8 + contentLen;
  const paramLength = 2 + tlvLen;

  const totalLen = 8 + paramLength;
  const frame = Buffer.alloc(totalLen);

  frame[0] = 0x52; frame[1] = 0x46;
  frame[2] = 0x00;
  frame[3] = 0x00; frame[4] = 0x00;
  frame[5] = 0x30;
  frame[6] = (paramLength >> 8) & 0xFF;
  frame[7] = paramLength & 0xFF;

  let pos = 8;
  frame[pos++] = 0x08; // TLV Tag
  frame[pos++] = tlvLen;

  password.copy(frame, pos);
  pos += 4;

  frame[pos++] = 0x01; // Option byte
  frame[pos++] = membank;
  frame[pos++] = startAddress;
  frame[pos++] = wordLen;

  writeDataBuffer.copy(frame, pos, 0, contentLen);
  pos += contentLen;

  const checksum = calculateChecksum(frame, totalLen - 1);
  return Buffer.concat([frame, Buffer.from([checksum])]);
}

function buildReadTagFrame(membank, startAddress, wordLen, password = Buffer.from([0,0,0,0])) {
  const tlvLen = 8;
  const paramLength = 2 + tlvLen;
  const totalLen = 8 + paramLength;
  const frame = Buffer.alloc(totalLen);

  frame[0] = 0x52; frame[1] = 0x46;
  frame[2] = 0x00;
  frame[3] = 0x00; frame[4] = 0x00;
  frame[5] = 0x31;
  frame[6] = (paramLength >> 8) & 0xFF;
  frame[7] = paramLength & 0xFF;

  let pos = 8;
  frame[pos++] = 0x08; // TLV Tag
  frame[pos++] = tlvLen;

  password.copy(frame, pos);
  pos += 4;

  frame[pos++] = 0x00; // Option byte (ReadTag)
  frame[pos++] = membank;
  frame[pos++] = startAddress;
  frame[pos++] = wordLen;

  const checksum = calculateChecksum(frame, totalLen - 1);
  return Buffer.concat([frame, Buffer.from([checksum])]);
}

// ===== SHARED STATE =====
let isAntennaConnected = false;
let bufferAccumulator = Buffer.alloc(0);
let pendingWritePayload = null;
let pendingReadPayload = null;
let pendingDeviceInfoCallback = null;
let lastDataReceivedAt = Date.now();
let inventoryPollTimer = null;
let idleWatchdogTimer = null;
let reconnectTimer = null;
let udpClient = null;
let tcpClient = null;

// Unified send function — works for both TCP and UDP
let sendFn = null;

const debounceCache = new Map();
const DEBOUNCE_TIME = 2000;

// ===== FRAME PARSER (shared between TCP and UDP) =====
function parseBuffer() {
  while (bufferAccumulator.length >= 7) {
    const headerIdx = bufferAccumulator.indexOf(Buffer.from([0x52, 0x46]));
    if (headerIdx === -1) {
      bufferAccumulator = Buffer.alloc(0);
      break;
    }
    if (headerIdx > 0) {
      bufferAccumulator = bufferAccumulator.subarray(headerIdx);
    }
    if (bufferAccumulator.length < 8) break;

    const frameType = bufferAccumulator[2];
    const frameCode = bufferAccumulator[5];
    const paramLength = (bufferAccumulator[6] << 8) | bufferAccumulator[7];

    const totalFrameLength = 8 + paramLength + 1;

    if (bufferAccumulator.length < totalFrameLength) {
      break;
    }

    const frameData = bufferAccumulator.subarray(0, totalFrameLength);
    bufferAccumulator = bufferAccumulator.subarray(totalFrameLength);

    // Log non-inventory frames
    if (frameCode !== 0x22) {
      console.log(`[RX] Type:0x${frameType.toString(16).toUpperCase()} Code:0x${frameCode.toString(16).toUpperCase()} Hex:${frameData.toString('hex').toUpperCase()}`);
    }

    // ===== RESPONSE FRAMES (0x01) =====
    if (frameType === 0x01) {
      // Response to Stop Inventory (0x23)
      if (frameCode === 0x23) {
        if (pendingWritePayload) {
          console.log('[WRITE SEQ] Reader acknowledged Stop (0x23). Sending Write Tag (0x30)...');
          sendFn(buildWriteTagFrame(
            pendingWritePayload.membank,
            pendingWritePayload.startAddr,
            pendingWritePayload.wordLen,
            pendingWritePayload.dataBuf
          ));
        } else if (pendingReadPayload && pendingReadPayload.frame) {
          console.log('[READ SEQ] Reader acknowledged Stop (0x23). Sending Read Tag (0x31)...');
          sendFn(pendingReadPayload.frame);
        }
      }

      // Response to Write Tag (0x30)
      else if (frameCode === 0x30) {
        if (pendingWritePayload) {
          clearTimeout(pendingWritePayload.timeoutId);
          const statusByte = extractStatusFromResponse(frameData, paramLength);
          pendingWritePayload = null;

          if (statusByte === 0x00) {
            console.log(`[WRITE SEQ] ✅ Write Tag SUCCESS!`);
            io.emit('write_result', { success: true, message: 'Tag encoded successfully via CT-i607!' });
            io.emit('tag_written_success', { timestamp: new Date().toISOString() });
          } else {
            const errMsg = getStatusMessage(statusByte);
            console.error(`[WRITE SEQ] ❌ Write Tag FAILED! Status: 0x${statusByte.toString(16).toUpperCase()} (${errMsg})`);
            io.emit('write_result', { success: false, error: `Write failed: ${errMsg}` });
          }
          scheduleNextPoll();
        }
      }

      // Response to Read Tag (0x31)
      else if (frameCode === 0x31) {
        if (pendingReadPayload) {
          clearTimeout(pendingReadPayload.timeoutId);
          const statusByte = extractStatusFromResponse(frameData, paramLength);
          pendingReadPayload = null;

          if (statusByte === 0x00) {
            const dataTlv = extractDataFromReadResponse(frameData, paramLength);
            console.log(`[READ SEQ] ✅ Read Tag SUCCESS! Data: ${dataTlv}`);
            io.emit('read_result', { success: true, data: dataTlv });
          } else {
            const errMsg = getStatusMessage(statusByte);
            console.error(`[READ SEQ] ❌ Read Tag FAILED! Status: 0x${statusByte.toString(16).toUpperCase()} (${errMsg})`);
            io.emit('read_result', { success: false, error: `Read failed: ${errMsg}` });
          }
          scheduleNextPoll();
        }
      }

      // Response to Query Device Info (0x40)
      else if (frameCode === 0x40) {
        if (pendingDeviceInfoCallback) {
          const cb = pendingDeviceInfoCallback;
          pendingDeviceInfoCallback = null;

          const params = frameData.subarray(8, 8 + paramLength);
          let version = 'Unknown', deviceType = 'Unknown';
          let offset = 0;
          while (offset < params.length) {
            const tag = params[offset];
            const len = params[offset + 1];
            if (tag === 0x20 && len >= 3) {
              version = `${params[offset + 2]}.${params[offset + 3]}.${params[offset + 4]}`;
            }
            if (tag === 0x21 && len >= 1) {
              deviceType = `Type-${params[offset + 2]}`;
            }
            offset += 2 + len;
          }
          console.log(`[DEVICE INFO] ✅ Firmware: v${version}, Device: ${deviceType}`);
          cb({ success: true, firmware: version, deviceType });
        }
      }

      // Response to Inventory Once (0x22)
      else if (frameCode === 0x22) {
        scheduleNextPoll();
      }
    }

    // ===== NOTIFICATION FRAMES (0x02) =====
    else if (frameType === 0x02) {
      if (frameCode === 0x80) {
        const params = frameData.subarray(8, 8 + paramLength);
        let offset = 0;
        while (offset < params.length) {
          const tag = params[offset];
          if (tag === 0x50) {
            const tlvLen = params[offset + 1];
            const tlvValue = params.subarray(offset + 2, offset + 2 + tlvLen);
            let epcHex = '', rssiHex = '', timeHex = '';
            let nestedOffset = 0;
            while (nestedOffset < tlvValue.length) {
              const nTag = tlvValue[nestedOffset];
              const nLen = tlvValue[nestedOffset + 1];
              const nVal = tlvValue.subarray(nestedOffset + 2, nestedOffset + 2 + nLen);
              if (nTag === 0x01) epcHex = nVal.toString('hex').toUpperCase();
              if (nTag === 0x05) rssiHex = nVal.toString('hex');
              if (nTag === 0x06) timeHex = nVal.toString('hex');
              nestedOffset += 2 + nLen;
            }
            if (epcHex) handleDecodedTag(epcHex, rssiHex, timeHex);
            offset += 2 + tlvLen;
          } else {
            const skipLen = params[offset + 1];
            if (!skipLen && skipLen !== 0) break;
            offset += 2 + skipLen;
          }
        }
      }
      else if (frameCode === 0x90) {
        console.log('[HEARTBEAT] Reader heartbeat (0x90)');
      }
    }

    // Unknown frames
    else {
      console.log(`[UNKNOWN FRAME] Type:0x${frameType.toString(16).toUpperCase()} Code:0x${frameCode.toString(16).toUpperCase()}`);
    }
  }
}

function extractStatusFromResponse(frameData, paramLength) {
  const params = frameData.subarray(8, 8 + paramLength);
  let offset = 0;
  while (offset < params.length) {
    const tag = params[offset];
    const len = params[offset + 1];
    if (tag === 0x07 && len >= 1) return params[offset + 2];
    offset += 2 + len;
  }
  return 0xFE;
}

function extractDataFromReadResponse(frameData, paramLength) {
  const params = frameData.subarray(8, 8 + paramLength);
  let offset = 0;
  while (offset < params.length) {
    const tag = params[offset];
    const len = params[offset + 1];
    if (tag === 0x08 && len > 0) {
      return params.subarray(offset + 2, offset + 2 + len).toString('hex').toUpperCase();
    }
    offset += 2 + len;
  }
  return '';
}

function getStatusMessage(statusByte) {
  const STATUS_MAP = {
    0x00: 'Success',
    0x14: 'Parameter unsupported',
    0x15: 'Parameter length error',
    0x16: 'Parameter content error',
    0x17: 'Unsupported command',
    0x18: 'Device address error',
    0x20: 'Checksum error',
    0x21: 'Unsupported TLV type',
    0x22: 'Flash error',
    0xFE: 'Unknown status',
    0xFF: 'Internal error',
  };
  return STATUS_MAP[statusByte] || `Unknown (0x${statusByte.toString(16).toUpperCase()})`;
}

function handleDecodedTag(epcHex, rssiHex, _timeHex) {
  const now = Date.now();
  if (debounceCache.has(epcHex)) {
    const lastSeen = debounceCache.get(epcHex);
    if (now - lastSeen < DEBOUNCE_TIME) return;
  }
  debounceCache.set(epcHex, now);

  const rssiVal = parseInt(rssiHex || '0', 16);
  console.log(`[TAG] EPC: ${epcHex} | RSSI: ${rssiVal}`);

  if (epcHex.startsWith('A') || epcHex.includes('A3B7C209')) {
    io.emit('wristband_scanned', { epc: epcHex, rssi: rssiVal, timestamp: new Date().toISOString(), type: 'wristband' });
  } else {
    io.emit('cng_cylinder_scanned', {
      epc: epcHex, rssi: rssiVal, timestamp: new Date().toISOString(), type: 'cylinder',
      weightKg: 12.0 + (rssiVal % 5) / 10,
      hydrotestStatus: rssiVal % 3 === 0 ? 'valid' : (rssiVal % 3 === 1 ? 'expiring-soon' : 'expired'),
      fillStatus: rssiVal % 2 === 0 ? 'ready' : 'filled'
    });
  }
}

function scheduleNextPoll() {
  if (!isAntennaConnected) return;
  if (pendingWritePayload || pendingReadPayload) return;
  if (inventoryPollTimer) clearTimeout(inventoryPollTimer);

  inventoryPollTimer = setTimeout(() => {
    if (isAntennaConnected && !pendingWritePayload && !pendingReadPayload) {
      sendFn(buildSimpleCommandFrame(0x22));
    }
  }, 300);
}

function startWatchdog() {
  if (idleWatchdogTimer) clearInterval(idleWatchdogTimer);
  idleWatchdogTimer = setInterval(() => {
    const idleMs = Date.now() - lastDataReceivedAt;
    if (idleMs > 30000) {
      console.warn(`[WATCHDOG] No data for ${(idleMs / 1000).toFixed(0)}s. Force reconnecting...`);
      if (UDP_MODE) {
        udpClient.close();
        setTimeout(startUDP, 2000);
      } else {
        tcpClient.destroy();
      }
    }
  }, 10000);
}

function onAntennaConnect() {
  isAntennaConnected = true;
  lastDataReceivedAt = Date.now();
  io.emit('antenna_status', { connected: true });

  sendFn(buildSimpleCommandFrame(0x23));
  console.log('[ANT] Sent Stop Inventory (0x23). Starting polling in 500ms...');

  setTimeout(() => {
    scheduleNextPoll();
  }, 500);

  startWatchdog();
}

function onAntennaDisconnect() {
  if (isAntennaConnected) {
    isAntennaConnected = false;
    io.emit('antenna_status', { connected: false });
  }

  if (inventoryPollTimer) { clearTimeout(inventoryPollTimer); inventoryPollTimer = null; }
  if (idleWatchdogTimer) { clearInterval(idleWatchdogTimer); idleWatchdogTimer = null; }

  if (pendingWritePayload) {
    clearTimeout(pendingWritePayload.timeoutId);
    io.emit('write_result', { success: false, error: 'Connection closed.' });
    pendingWritePayload = null;
  }
  if (pendingReadPayload) {
    clearTimeout(pendingReadPayload.timeoutId);
    io.emit('read_result', { success: false, error: 'Connection closed.' });
    pendingReadPayload = null;
  }
  if (pendingDeviceInfoCallback) {
    pendingDeviceInfoCallback({ success: false, error: 'Connection closed.' });
    pendingDeviceInfoCallback = null;
  }
}

// ===== UDP MODE =====
function startUDP() {
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }

  console.log(`[UDP] Starting UDP server on port ${UDP_PORT}...`);
  console.log(`[UDP] Expecting broadcasts from antenna ${ANTENNA_IP}:${ANTENNA_PORT}`);

  udpClient = dgram.createSocket({ type: 'udp4', reuseAddr: true });

  udpClient.on('message', (msg, rinfo) => {
    lastDataReceivedAt = Date.now();
    console.log(`[UDP RX] From ${rinfo.address}:${rinfo.port} | Hex: ${msg.toString('hex').toUpperCase()}`);
    bufferAccumulator = Buffer.concat([bufferAccumulator, msg]);
    parseBuffer();
  });

  udpClient.on('listening', () => {
    udpClient.setBroadcast(true);
    const addr = udpClient.address();
    console.log(`[UDP] Listening on ${addr.address}:${addr.port}`);
    console.log(`[UDP] UDP broadcast enabled — antenna should send to this port`);

    // Send test ping
    const ping = buildSimpleCommandFrame(0x40);
    udpClient.send(ping, ANTENNA_PORT, ANTENNA_IP, (err) => {
      if (err) {
        console.error(`[UDP] Failed to send initial ping: ${err.message}`);
      } else {
        console.log(`[UDP] Sent Query Device Info (0x40) to ${ANTENNA_IP}:${ANTENNA_PORT}`);
      }
    });

    // Assume connected after we successfully bind and send
    onAntennaConnect();
  });

  udpClient.on('error', (err) => {
    console.error(`[UDP] Error: ${err.message}`);
    udpClient.close();
    reconnectTimer = setTimeout(startUDP, 2000);
  });

  udpClient.on('close', () => {
    console.log('[UDP] Socket closed.');
    const wasConnected = isAntennaConnected;
    onAntennaDisconnect();
    if (wasConnected) {
      console.log('[UDP] Reconnecting in 2s...');
      reconnectTimer = setTimeout(startUDP, 2000);
    }
  });

  udpClient.bind(UDP_PORT);
  sendFn = (data) => {
    if (!udpClient) return;
    udpClient.send(data, ANTENNA_PORT, ANTENNA_IP, (err) => {
      if (err) console.error(`[UDP TX ERROR] ${err.message}`);
      else console.log(`[UDP TX] Hex: ${data.toString('hex').toUpperCase()}`);
    });
  };
}

// ===== TCP MODE =====
function createNewClient() {
  if (tcpClient) {
    tcpClient.removeAllListeners();
    tcpClient.destroy();
    tcpClient = null;
  }

  tcpClient = new net.Socket();
  tcpClient.setNoDelay(true);
  tcpClient.setKeepAlive(false);
  tcpClient.setTimeout(0);

  tcpClient.on('data', (data) => {
    lastDataReceivedAt = Date.now();
    if (pendingWritePayload || pendingReadPayload || pendingDeviceInfoCallback) {
      console.log(`[TCP RX] ${data.toString('hex').toUpperCase()}`);
    }
    bufferAccumulator = Buffer.concat([bufferAccumulator, data]);
    parseBuffer();
  });

  tcpClient.on('close', () => {
    const wasConnected = isAntennaConnected;
    onAntennaDisconnect();
    if (wasConnected) {
      console.log('[TCP] Connection closed. Reconnecting in 2s...');
      reconnectTimer = setTimeout(connectTCP, 2000);
    }
  });

  tcpClient.on('error', (err) => {
    console.error(`[TCP] Connection error: ${err.message}`);
  });

  sendFn = (data) => {
    if (!tcpClient || !tcpClient.writable) {
      console.error('[TCP TX] Socket not writable!');
      return;
    }
    console.log(`[TCP TX] Hex: ${data.toString('hex').toUpperCase()}`);
    tcpClient.write(data);
  };

  return tcpClient;
}
function connectTCP() {
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }

  console.log(`[TCP] Connecting to Antenna at ${ANTENNA_IP}:${ANTENNA_PORT}...`);

  createNewClient();
  bufferAccumulator = Buffer.alloc(0);

  tcpClient.connect(ANTENNA_PORT, ANTENNA_IP, () => {
    console.log('[TCP] Connected!');
    onAntennaConnect();
  });
}

// ===== WEBSOCKET EVENT HANDLERS =====
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);
  socket.emit('antenna_status', { connected: isAntennaConnected });
  socket.emit('connection_mode', { mode: UDP_MODE ? 'udp' : 'tcp' });

  // Write Tag (0x30)
  socket.on('write_tag', (payload) => {
    console.log(`[WRITE REQUEST] Bank: ${payload.membank}, Hex: ${payload.hexData}`);

    if (!isAntennaConnected) {
      io.emit('write_result', { success: false, error: 'Antenna not connected.' });
      return;
    }
    if (pendingWritePayload) {
      io.emit('write_result', { success: false, error: 'Another write operation in progress.' });
      return;
    }

    try {
      const cleanHex = payload.hexData.replace(/[^0-9A-Fa-f]/g, '');
      let dataBuf = Buffer.from(cleanHex, 'hex');
      if (dataBuf.length % 2 !== 0) dataBuf = Buffer.concat([dataBuf, Buffer.from([0x00])]);

      const wordLen = dataBuf.length / 2;
      const membank = payload.membank || 1;
      const startAddr = payload.startAddress || (membank === 1 ? 2 : 0);

      const frame = buildWriteTagFrame(membank, startAddr, wordLen, dataBuf);
      console.log(`[WRITE FRAME 0x30] Hex: ${frame.toString('hex').toUpperCase()}`);

      const writeTimeout = setTimeout(() => {
        if (pendingWritePayload) {
          console.error('[WRITE SEQ] Timeout waiting for 0x30 response.');
          io.emit('write_result', { success: false, error: 'Antenna did not respond within 5 seconds. Tag may be locked or out of range.' });
          pendingWritePayload = null;
        }
      }, 5000);

      pendingWritePayload = { membank, startAddr, wordLen, dataBuf, timeoutId: writeTimeout };
      sendFn(buildSimpleCommandFrame(0x23));

    } catch (err) {
      console.error('[WRITE ERROR]', err);
      io.emit('write_result', { success: false, error: err.message });
    }
  });

  // Read Tag Memory (0x31)
  socket.on('read_tag_memory', (payload, callback) => {
    console.log(`[READ REQUEST] Bank: ${payload.membank}, Addr: ${payload.startAddress}, Words: ${payload.wordLen}`);

    if (!isAntennaConnected) {
      if (callback) callback({ success: false, error: 'Antenna not connected.' });
      return;
    }
    if (pendingReadPayload) {
      if (callback) callback({ success: false, error: 'Another read operation in progress.' });
      return;
    }

    try {
      const membank = payload.membank || 1;
      const startAddress = payload.startAddress || 0;
      const wordLen = payload.wordLen || 6;
      const frame = buildReadTagFrame(membank, startAddress, wordLen);

      console.log(`[READ FRAME 0x31] Hex: ${frame.toString('hex').toUpperCase()}`);

      const readTimeout = setTimeout(() => {
        if (pendingReadPayload) {
          console.error('[READ SEQ] Timeout waiting for 0x31 response.');
          io.emit('read_result', { success: false, error: 'Antenna did not respond within 5 seconds.' });
          pendingReadPayload = null;
        }
      }, 5000);

      pendingReadPayload = { frame, timeoutId: readTimeout };
      sendFn(buildSimpleCommandFrame(0x23));

    } catch (err) {
      console.error('[READ ERROR]', err);
      if (callback) callback({ success: false, error: err.message });
    }
  });

  // Query Device Info (0x40)
  socket.on('query_device_info', (_payload, callback) => {
    console.log('[DEVICE INFO] Querying...');
    if (!isAntennaConnected) {
      if (callback) callback({ success: false, error: 'Antenna not connected.' });
      return;
    }

    pendingDeviceInfoCallback = callback;
    sendFn(buildSimpleCommandFrame(0x40));

    setTimeout(() => {
      if (pendingDeviceInfoCallback === callback) {
        pendingDeviceInfoCallback = null;
        callback({ success: false, error: 'No response within 3 seconds.' });
      }
    }, 3000);
  });

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

// ===== START =====
server.listen(WS_PORT, () => {
  console.log(`[WS] Server listening on port ${WS_PORT}`);
});

if (UDP_MODE) {
  console.log('===========================================================');
  console.log('🚀 [UDP MODE ACTIVE] Listening for antenna broadcasts...');
  console.log(`   UDP Port: ${UDP_PORT} | Antenna: ${ANTENNA_IP}:${ANTENNA_PORT}`);
  console.log('   Set UDP_MODE=false + ANTENNA_IP to use TCP instead.');
  console.log('===========================================================');
  startUDP();
} else {
  console.log('===========================================================');
  console.log('🚀 [TCP MODE ACTIVE] Connecting to antenna...');
  console.log(`   Antenna: ${ANTENNA_IP}:${ANTENNA_PORT}`);
  console.log('   Set UDP_MODE=true to switch to UDP broadcast mode.');
  console.log('===========================================================');
  connectTCP();
}

if (process.env.ENABLE_SIMULATOR === 'true') {
  console.log('[SIMULATOR] Injecting fake tag frames...');
  setInterval(() => {
    const randomLastByte = Math.floor(Math.random() * 255);
    const randomRssi = 150 + Math.floor(Math.random() * 80);
    const fakeData = Buffer.from([
      0x52, 0x46, 0x02, 0x00, 0x00, 0x80, 0x00, 0x15,
      0x50, 0x13,
      0x01, 0x0C, 0xE2, 0x00, 0x00, 0x17, 0x02, 0x17, 0x01, 0x99, 0x23, 0x90, 0x21, randomLastByte,
      0x05, 0x01, randomRssi,
      0x06, 0x04, 0x3D, 0x00, 0x00, 0x00,
      0x4C
    ]);
    bufferAccumulator = Buffer.concat([bufferAccumulator, fakeData]);
    parseBuffer();
  }, 6000);
}
