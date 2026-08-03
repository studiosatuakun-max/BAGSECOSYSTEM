const net = require('net');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

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

const WS_PORT = process.env.WS_PORT || 4001;

// ===== PROTOCOL HELPERS =====
// IMPORTANT: SDK C# sends commands WITHOUT paramLength bytes when no payload.
// - No payload:  RF + 0x00 + 0x00 + 0x00 + frameCode + checksum  (7 bytes)
// - With TLV payload: RF + 0x00 + 0x00 + 0x00 + frameCode + paramLen(2) + TLV + checksum

function calculateChecksum(buffer, length) {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += buffer[i];
  }
  return (~sum + 1) & 0xFF;
}

// No-payload commands: 7 bytes (RF + addr + code + checksum)
function buildSimpleCommandFrame(frameCode) {
  // RF(2) + 0x00 + 0x00 + frameCode(1) = 6 bytes header
  const header = Buffer.from([0x52, 0x46, 0x00, 0x00, 0x00, frameCode]);
  const checksum = calculateChecksum(header, 6);
  return Buffer.concat([header, Buffer.from([checksum])]); // 7 bytes total
}

function buildWriteTagFrame(membank, startAddress, wordLen, writeDataBuffer, password = Buffer.from([0,0,0,0])) {
  const contentLen = wordLen * 2;
  const tlvLen = 8 + contentLen;
  const paramLength = 2 + tlvLen;
  
  const totalLen = 8 + paramLength;
  const frameWithoutChecksum = Buffer.alloc(totalLen);
  
  frameWithoutChecksum[0] = 0x52; // R
  frameWithoutChecksum[1] = 0x46; // F
  frameWithoutChecksum[2] = 0x00; // Command Frame
  frameWithoutChecksum[3] = 0x00; // Addr MSB
  frameWithoutChecksum[4] = 0x00; // Addr LSB
  frameWithoutChecksum[5] = 0x30; // Command Code: Write Tag
  frameWithoutChecksum[6] = (paramLength >> 8) & 0xFF;
  frameWithoutChecksum[7] = paramLength & 0xFF;
  
  let pos = 8;
  frameWithoutChecksum[pos++] = 0x08; // TLV Tag = 0x08 (SDK Correct Tag)
  frameWithoutChecksum[pos++] = tlvLen;
  
  // 4 bytes Password
  password.copy(frameWithoutChecksum, pos);
  pos += 4;
  
  frameWithoutChecksum[pos++] = 0x01; // Constant option byte
  frameWithoutChecksum[pos++] = membank;
  frameWithoutChecksum[pos++] = startAddress;
  frameWithoutChecksum[pos++] = wordLen;
  
  writeDataBuffer.copy(frameWithoutChecksum, pos, 0, contentLen);
  pos += contentLen;

  const checksum = calculateChecksum(frameWithoutChecksum);
  return Buffer.concat([frameWithoutChecksum, Buffer.from([checksum])]);
}

function buildReadTagFrame(membank, startAddress, wordLen, password = Buffer.from([0,0,0,0])) {
  // SDK ReadTag: FillCmdHeader(0x31) + paramLen(0x00, 0x00) + TLV(0x08, len=8, password[4], 0x00, membank, startAddr, length) + checksum
  const tlvLen = 8; // 4 password + 1 option + 1 membank + 1 startAddr + 1 length
  const paramLength = 2 + tlvLen; // 2 for TLV tag+len header
  
  const totalLen = 8 + paramLength;
  const frame = Buffer.alloc(totalLen);
  
  frame[0] = 0x52; frame[1] = 0x46;
  frame[2] = 0x00; // Command Frame
  frame[3] = 0x00; frame[4] = 0x00; // Address
  frame[5] = 0x31; // Read Tag
  frame[6] = (paramLength >> 8) & 0xFF;
  frame[7] = paramLength & 0xFF;
  
  let pos = 8;
  frame[pos++] = 0x08; // TLV Tag
  frame[pos++] = tlvLen;
  
  password.copy(frame, pos);
  pos += 4;
  
  frame[pos++] = 0x00; // Option byte (ReadTag uses 0x00, WriteTag uses 0x01)
  frame[pos++] = membank;
  frame[pos++] = startAddress;
  frame[pos++] = wordLen;

  const checksum = calculateChecksum(frame);
  return Buffer.concat([frame, Buffer.from([checksum])]);
}

// ===== TCP CLIENT STATE =====
const ANTENNA_IP = process.env.ANTENNA_IP || '192.168.1.200';
const ANTENNA_PORT = process.env.ANTENNA_PORT || 4000;

let client = null;
let isAntennaConnected = false;
let bufferAccumulator = Buffer.alloc(0);
let pendingWritePayload = null;
let pendingReadPayload = null;
let pendingDeviceInfoCallback = null;
let waitingForInventoryResponse = false;
let lastDataReceivedAt = Date.now();
let inventoryPollTimer = null;
let idleWatchdogTimer = null;
let reconnectTimer = null;

// Debounce logic to prevent UI freeze (only send same EPC once every 2 seconds)
const debounceCache = new Map();
const DEBOUNCE_TIME = 2000;

// ===== WEBSOCKET EVENT HANDLERS =====
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);
  
  // Immediately tell the UI our antenna status
  socket.emit('antenna_status', { connected: isAntennaConnected });

  // --- Write Tag (0x30) ---
  socket.on('write_tag', (payload) => {
    console.log(`[WRITE REQUEST] Bank: ${payload.membank}, Hex: ${payload.hexData}`);

    if (!isAntennaConnected || !client || !client.writable) {
      console.error('[WRITE ERROR] Antenna not connected. Cannot write.');
      io.emit('write_result', { success: false, error: 'Antenna not connected. Please wait for reconnection.' });
      return;
    }

    if (pendingWritePayload) {
      io.emit('write_result', { success: false, error: 'Another write operation is already in progress.' });
      return;
    }

    try {
      const cleanHex = payload.hexData.replace(/[^0-9A-Fa-f]/g, '');
      let dataBuf = Buffer.from(cleanHex, 'hex');

      // Word alignment (2 bytes per word)
      if (dataBuf.length % 2 !== 0) {
        dataBuf = Buffer.concat([dataBuf, Buffer.from([0x00])]);
      }

      const wordLen = dataBuf.length / 2;
      const membank = payload.membank || 1; // 1 = EPC, 3 = USER
      const startAddr = payload.startAddress || (membank === 1 ? 2 : 0);

      const frame = buildWriteTagFrame(membank, startAddr, wordLen, dataBuf);
      console.log(`[BINARY FRAME 0x30] Hex: ${frame.toString('hex').toUpperCase()}`);

      // Timeout: if no response in 5 seconds, fail fast
      const writeTimeout = setTimeout(() => {
        if (pendingWritePayload) {
          console.error('[WRITE SEQ] Timeout waiting for 0x30 response (5s).');
          io.emit('write_result', { success: false, error: 'Antenna did not respond to Write command within 5 seconds. Tag may be locked or out of range.' });
          pendingWritePayload = null;
        }
      }, 5000);

      pendingWritePayload = { frame, cleanHex, timeoutId: writeTimeout };

      // Step 1: Stop any active inventory, then send Write after response
      console.log('[WRITE SEQ] Sending Stop Inventory (0x23) before Write...');
      const stopCmd = buildSimpleCommandFrame(0x23);
      client.write(stopCmd);

    } catch (err) {
      console.error('[WRITE ERROR]', err);
      io.emit('write_result', { success: false, error: err.message });
      pendingWritePayload = null;
    }
  });

  // --- Read Tag Memory (0x31) ---
  socket.on('read_tag_memory', (payload, callback) => {
    console.log(`[READ REQUEST] Bank: ${payload.membank}, StartAddr: ${payload.startAddress}, Words: ${payload.wordLen}`);
    
    if (!isAntennaConnected || !client || !client.writable) {
      if (callback) callback({ success: false, error: 'Antenna not connected.' });
      return;
    }
    if (pendingReadPayload) {
      if (callback) callback({ success: false, error: 'Another read operation is already in progress.' });
      return;
    }

    try {
      const membank = payload.membank || 1;
      const startAddress = payload.startAddress || 0;
      const wordLen = payload.wordLen || 6;
      
      const frame = buildReadTagFrame(membank, startAddress, wordLen);
      console.log(`[BINARY FRAME 0x31] Hex: ${frame.toString('hex').toUpperCase()}`);

      const readTimeout = setTimeout(() => {
        if (pendingReadPayload) {
          console.error('[READ SEQ] Timeout waiting for 0x31 response (5s).');
          if (pendingReadPayload.callback) {
            pendingReadPayload.callback({ success: false, error: 'Antenna did not respond to Read command within 5 seconds.' });
          }
          pendingReadPayload = null;
        }
      }, 5000);

      pendingReadPayload = { callback, timeoutId: readTimeout };

      // Stop inventory first, then send read after 0x23 response
      console.log('[READ SEQ] Sending Stop Inventory (0x23) before Read...');
      const stopCmd = buildSimpleCommandFrame(0x23);
      client.write(stopCmd);

      // After stop is acknowledged, we send the read frame (handled in parseBuffer)
      pendingReadPayload.frame = frame;

    } catch (err) {
      console.error('[READ ERROR]', err);
      if (callback) callback({ success: false, error: err.message });
      pendingReadPayload = null;
    }
  });

  // --- Query Device Info (0x40) ---
  socket.on('query_device_info', (payload, callback) => {
    console.log('[DEVICE INFO] Querying firmware version...');
    
    if (!isAntennaConnected || !client || !client.writable) {
      if (callback) callback({ success: false, error: 'Antenna not connected.' });
      return;
    }

    const infoCmd = buildSimpleCommandFrame(0x40);
    console.log(`[BINARY FRAME 0x40] Hex: ${infoCmd.toString('hex').toUpperCase()}`);
    
    pendingDeviceInfoCallback = callback;
    
    setTimeout(() => {
      if (pendingDeviceInfoCallback) {
        pendingDeviceInfoCallback({ success: false, error: 'No response from antenna for Device Info query.' });
        pendingDeviceInfoCallback = null;
      }
    }, 3000);
    
    client.write(infoCmd);
  });

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

server.listen(WS_PORT, () => {
  console.log(`[WS] Server listening on port ${WS_PORT}`);
});

// ===== TAG BUSINESS LOGIC =====
function handleDecodedTag(epcHex, rssiHex, timeHex) {
  const now = Date.now();
  if (debounceCache.has(epcHex)) {
    const lastSeen = debounceCache.get(epcHex);
    if (now - lastSeen < DEBOUNCE_TIME) {
      return; // Skip, too soon
    }
  }
  debounceCache.set(epcHex, now);

  const rssiVal = parseInt(rssiHex, 16);
  console.log(`[TAG] EPC: ${epcHex} | RSSI: ${rssiVal}`);

  // Business Logic Parsing (Simulated based on EPC prefix/pattern)
  // TODO: Replace with Supabase rfid_tags table lookup
  if (epcHex.startsWith('A') || epcHex.includes('A3B7C209')) {
    io.emit('wristband_scanned', {
      epc: epcHex,
      rssi: rssiVal,
      timestamp: new Date().toISOString(),
      type: 'wristband'
    });
  } else {
    io.emit('cng_cylinder_scanned', {
      epc: epcHex,
      rssi: rssiVal,
      timestamp: new Date().toISOString(),
      type: 'cylinder',
      weightKg: 12.0 + (rssiVal % 5) / 10,
      hydrotestStatus: rssiVal % 3 === 0 ? 'valid' : (rssiVal % 3 === 1 ? 'expiring-soon' : 'expired'),
      fillStatus: rssiVal % 2 === 0 ? 'ready' : 'filled'
    });
  }
}

// ===== FRAME PARSER =====
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
    
    // ===== RESPONSE FRAMES (0x01) =====
    if (frameType === 0x01) {
      // Log all response frames except high-frequency 0x22
      if (frameCode !== 0x22) {
        console.log(`[RESPONSE 0x01] Code: 0x${frameCode.toString(16).toUpperCase()} | Hex: ${frameData.toString('hex').toUpperCase()}`);
      }

      // --- Response to Stop Inventory (0x23) ---
      if (frameCode === 0x23) {
        // If we have a pending write, send the write frame now
        if (pendingWritePayload) {
          console.log(`[WRITE SEQ] Reader acknowledged Stop (0x23). Sending Write Tag (0x30)...`);
          client.write(pendingWritePayload.frame);
        }
        // If we have a pending read, send the read frame now
        else if (pendingReadPayload && pendingReadPayload.frame) {
          console.log(`[READ SEQ] Reader acknowledged Stop (0x23). Sending Read Tag (0x31)...`);
          client.write(pendingReadPayload.frame);
        }
      }
      
      // --- Response to Write Tag (0x30) ---
      else if (frameCode === 0x30) {
        if (pendingWritePayload) {
          const { cleanHex, timeoutId } = pendingWritePayload;
          clearTimeout(timeoutId);
          pendingWritePayload = null;

          // Check status TLV (0x07) in response
          const statusByte = extractStatusFromResponse(frameData, paramLength);

          if (statusByte === 0x00) {
            console.log(`[WRITE SEQ] ✅ Write Tag SUCCESS! EPC: ${cleanHex}`);
            io.emit('write_result', { success: true, message: 'Tag encoded successfully via CT-i607!', epc: cleanHex });
            io.emit('tag_written_success', { epc: cleanHex, timestamp: new Date().toISOString() });
          } else {
            const errMsg = getStatusMessage(statusByte);
            console.error(`[WRITE SEQ] ❌ Write Tag FAILED! Status: 0x${statusByte.toString(16).toUpperCase()} (${errMsg})`);
            io.emit('write_result', { success: false, error: `Write failed: ${errMsg} (0x${statusByte.toString(16).toUpperCase()})` });
          }

          // Resume polling
          scheduleNextPoll();
        }
      }

      // --- Response to Read Tag (0x31) ---
      else if (frameCode === 0x31) {
        if (pendingReadPayload) {
          const { callback, timeoutId } = pendingReadPayload;
          clearTimeout(timeoutId);
          pendingReadPayload = null;

          const statusByte = extractStatusFromResponse(frameData, paramLength);
          
          if (statusByte === 0x00) {
            // Extract data TLV from response
            const dataTlv = extractDataFromReadResponse(frameData, paramLength);
            console.log(`[READ SEQ] ✅ Read Tag SUCCESS! Data: ${dataTlv}`);
            if (callback) callback({ success: true, data: dataTlv });
          } else {
            const errMsg = getStatusMessage(statusByte);
            console.error(`[READ SEQ] ❌ Read Tag FAILED! Status: 0x${statusByte.toString(16).toUpperCase()} (${errMsg})`);
            if (callback) callback({ success: false, error: `Read failed: ${errMsg}` });
          }
          
          scheduleNextPoll();
        }
      }

      // --- Response to Query Device Info (0x40) ---
      else if (frameCode === 0x40) {
        if (pendingDeviceInfoCallback) {
          const cb = pendingDeviceInfoCallback;
          pendingDeviceInfoCallback = null;
          
          // Parse version TLV (0x20) and device type TLV (0x21)
          const params = frameData.subarray(8, 8 + paramLength);
          let version = 'Unknown';
          let deviceType = 'Unknown';
          
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
          cb({ success: true, firmware: version, deviceType, raw: frameData.toString('hex').toUpperCase() });
        }
      }

      // --- Response to Inventory Once (0x22) ---
      else if (frameCode === 0x22) {
        waitingForInventoryResponse = false;
        // Schedule next poll after a small delay (response-gated polling)
        scheduleNextPoll();
      }

      // --- Response to Start Inventory (0x21) ---
      else if (frameCode === 0x21) {
        // Acknowledged, do nothing special
      }
    }

    // ===== NOTIFICATION FRAMES (0x02) =====
    else if (frameType === 0x02) {
      // 0x80 = Tag Notification, 0x90 = Heartbeat
      if (frameCode === 0x80) {
        const params = frameData.subarray(8, 8 + paramLength);
        let offset = 0;
        while (offset < params.length) {
          const tag = params[offset];
          if (tag === 0x50) {
            const tlvLen = params[offset + 1]; 
            const tlvValue = params.subarray(offset + 2, offset + 2 + tlvLen);
            
            let nestedOffset = 0;
            let epcHex = '';
            let rssiHex = '';
            let timeHex = '';

            while (nestedOffset < tlvValue.length) {
              const nTag = tlvValue[nestedOffset];
              const nLen = tlvValue[nestedOffset + 1];
              const nVal = tlvValue.subarray(nestedOffset + 2, nestedOffset + 2 + nLen);
              
              if (nTag === 0x01) epcHex = nVal.toString('hex').toUpperCase();
              if (nTag === 0x05) rssiHex = nVal.toString('hex');
              if (nTag === 0x06) timeHex = nVal.toString('hex');

              nestedOffset += 2 + nLen;
            }
            
            if (epcHex) {
              handleDecodedTag(epcHex, rssiHex, timeHex);
            }

            offset += 2 + tlvLen;
          } else {
            const skipLen = params[offset + 1];
            if (!skipLen && skipLen !== 0) break; // safety
            offset += 2 + skipLen;
          }
        }
      }
      else if (frameCode === 0x90) {
        // Heartbeat from reader — just update lastDataReceivedAt (already done in on.data)
        console.log('[HEARTBEAT] Reader heartbeat received (0x90).');
      }
      else {
        console.log(`[NOTIFICATION 0x02] Code: 0x${frameCode.toString(16).toUpperCase()} | Hex: ${frameData.toString('hex').toUpperCase()}`);
      }
    }

    // ===== UNKNOWN FRAMES =====
    else {
      console.log(`[UNKNOWN FRAME] Type: 0x${frameType.toString(16).toUpperCase()} Code: 0x${frameCode.toString(16).toUpperCase()} | Hex: ${frameData.toString('hex').toUpperCase()}`);
    }
  }
}

// ===== RESPONSE HELPERS =====
function extractStatusFromResponse(frameData, paramLength) {
  const params = frameData.subarray(8, 8 + paramLength);
  let offset = 0;
  while (offset < params.length) {
    const tag = params[offset];
    const len = params[offset + 1];
    if (tag === 0x07 && len >= 1) {
      return params[offset + 2]; // Status byte
    }
    offset += 2 + len;
  }
  return 0xFE; // Unknown status
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

// ===== RESPONSE-GATED INVENTORY POLLING =====
function scheduleNextPoll() {
  // Only schedule if we're connected and not doing a write/read operation
  if (!isAntennaConnected || !client || !client.writable) return;
  if (pendingWritePayload || pendingReadPayload) return;
  
  if (inventoryPollTimer) clearTimeout(inventoryPollTimer);
  
  inventoryPollTimer = setTimeout(() => {
    if (isAntennaConnected && client && client.writable && !pendingWritePayload && !pendingReadPayload) {
      waitingForInventoryResponse = true;
      const invOnceCmd = buildSimpleCommandFrame(0x22);
      client.write(invOnceCmd);
    }
  }, 300); // 300ms delay between polls (response-gated, not blind interval)
}

// ===== TCP CLIENT FACTORY (FIX: Kendala #4) =====
function createNewClient() {
  // Destroy old client if exists
  if (client) {
    client.removeAllListeners();
    client.destroy();
    client = null;
  }

  client = new net.Socket();
  client.setNoDelay(true);   // Disable Nagle algorithm
  client.setKeepAlive(false); // CT-i607 can't handle TCP Keep-Alive probes
  client.setTimeout(0);       // No Node.js-level timeout
  
  // --- DATA EVENT ---
  client.on('data', (data) => {
    lastDataReceivedAt = Date.now();
    
    // Debug logging for non-inventory frames or pending operations
    if (pendingWritePayload || pendingReadPayload || pendingDeviceInfoCallback) {
      console.log(`[TCP RX] ${data.toString('hex').toUpperCase()}`);
    }
    
    bufferAccumulator = Buffer.concat([bufferAccumulator, data]);
    parseBuffer();
  });
  
  // --- CLOSE EVENT ---
  client.on('close', () => {
    const wasConnected = isAntennaConnected;
    isAntennaConnected = false;
    
    if (inventoryPollTimer) { clearTimeout(inventoryPollTimer); inventoryPollTimer = null; }
    if (idleWatchdogTimer) { clearInterval(idleWatchdogTimer); idleWatchdogTimer = null; }
    
    // Fail any pending operations
    if (pendingWritePayload) {
      if (pendingWritePayload.timeoutId) clearTimeout(pendingWritePayload.timeoutId);
      io.emit('write_result', { success: false, error: 'TCP connection closed.' });
      pendingWritePayload = null;
    }
    if (pendingReadPayload) {
      if (pendingReadPayload.timeoutId) clearTimeout(pendingReadPayload.timeoutId);
      if (pendingReadPayload.callback) pendingReadPayload.callback({ success: false, error: 'TCP connection closed.' });
      pendingReadPayload = null;
    }
    if (pendingDeviceInfoCallback) {
      pendingDeviceInfoCallback({ success: false, error: 'TCP connection closed.' });
      pendingDeviceInfoCallback = null;
    }
    
    if (wasConnected) {
      io.emit('antenna_status', { connected: false });
    }
    
    console.log('[TCP] Connection closed. Reconnecting in 2s...');
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connectToAntenna, 2000);
  });
  
  // --- ERROR EVENT ---
  client.on('error', (err) => {
    console.error(`[TCP] Connection error: ${err.message}`);
    // close event will fire after this, which handles cleanup
  });
  
  return client;
}

// ===== ANTENNA CONNECTION =====
function connectToAntenna() {
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  
  console.log(`[TCP] Connecting to Antenna CT-i607 at ${ANTENNA_IP}:${ANTENNA_PORT}...`);
  
  // Create fresh socket every time (FIX: Kendala #4)
  createNewClient();
  bufferAccumulator = Buffer.alloc(0);
  waitingForInventoryResponse = false;
  
  client.connect(ANTENNA_PORT, ANTENNA_IP, () => {
    console.log(`[TCP] Connected to Antenna successfully!`);
    isAntennaConnected = true;
    lastDataReceivedAt = Date.now();
    
    io.emit('antenna_status', { connected: true });
    
    // Clear any stuck state by sending Stop Inventory (0x23) first
    const stopCmd = buildSimpleCommandFrame(0x23);
    client.write(stopCmd);
    console.log(`[TCP] Sent Stop Inventory (0x23) to clear state.`);
    
    // Start response-gated polling after a brief delay
    setTimeout(() => {
      console.log(`[TCP] Starting response-gated Inventory Once (0x22) polling.`);
      scheduleNextPoll();
    }, 500);
    
    // Start idle watchdog: if no data received for 30 seconds, force reconnect
    if (idleWatchdogTimer) clearInterval(idleWatchdogTimer);
    idleWatchdogTimer = setInterval(() => {
      const idleMs = Date.now() - lastDataReceivedAt;
      if (idleMs > 30000) {
        console.warn(`[WATCHDOG] No data received for ${(idleMs / 1000).toFixed(0)}s. Force reconnecting...`);
        client.destroy(); // Will trigger close event → reconnect
      }
    }, 10000);
  });
}

// ===== START =====
connectToAntenna();

if (process.env.ENABLE_SIMULATOR === 'true') {
  console.log('[SIMULATOR] Enabled fake tag injection...');
  setInterval(() => {
    console.log('[SIMULATOR] Injecting fake notification frame...');
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
    client.emit('data', fakeData);
  }, 6000);
} else {
  console.log('---------------------------------------------------------');
  console.log('🚀 [REAL MODE ACTIVE] Waiting for PHYSICAL RFID TAGS!');
  console.log('   Sweep your CT824L Metal Tags, Alien H9 Cards, or Wristbands');
  console.log('   in front of the CT-i607 Antenna!');
  console.log('---------------------------------------------------------');
}
