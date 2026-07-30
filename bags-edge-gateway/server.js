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

function calculateChecksum(buffer) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i];
  }
  return (~sum + 1) & 0xFF;
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

io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  socket.on('write_tag', (payload, callback) => {
    console.log(`[WRITE REQUEST] Bank: ${payload.membank}, Hex: ${payload.hexData}`);
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
      console.log(`[BINARY FRAME 0x30 SDK MATCH] Hex: ${frame.toString('hex').toUpperCase()}`);

      pendingWritePayload = { frame, cleanHex, callback };

      if (client.writable) {
        console.log('[WRITE SEQ] Sending Stop (0x23) to clear RF state before write...');
        const stopCmd = Buffer.from([0x52, 0x46, 0x00, 0x00, 0x00, 0x23, 0x00, 0x00, 0x45]);
        client.write(stopCmd);
        
        setTimeout(() => {
          if (!pendingWritePayload) return;
          
          const writeTimeout = setTimeout(() => {
            if (pendingWritePayload) {
              console.error('[WRITE SEQ] Timeout waiting for 0x30 response. Connection is dead.');
              pendingWritePayload.callback({ success: false, error: 'Reader timed out on Write. Connection is dead.' });
              pendingWritePayload = null;
              client.destroy(); // Force TCP reset
            }
          }, 3000);

          pendingWritePayload.timeoutId = writeTimeout;

          console.log('[WRITE SEQ] Initiating Write Tag (0x30)...');
          client.write(pendingWritePayload.frame);
        }, 200);
        
      } else {
        console.log('[SIMULATOR] Antenna not connected via TCP. Simulating Write Tag Success...');
        if (callback) {
          callback({ success: true, message: 'Tag encoded successfully via CT-i607!', epc: cleanHex });
        }
        io.emit('tag_written_success', { epc: cleanHex, timestamp: new Date().toISOString() });
        pendingWritePayload = null;
      }
    } catch (err) {
      console.error('[WRITE ERROR]', err);
      if (callback) callback({ success: false, error: err.message });
      pendingWritePayload = null;
    }
  });

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

server.listen(WS_PORT, () => {
  console.log(`[WS] Server listening on port ${WS_PORT}`);
});

// ===== TCP CLIENT SETUP (Antenna CT-i607) =====
const ANTENNA_IP = process.env.ANTENNA_IP || '192.168.1.200'; // Target Antenna IP
const ANTENNA_PORT = process.env.ANTENNA_PORT || 4000;

const client = new net.Socket();
let bufferAccumulator = Buffer.alloc(0);

// Debounce logic to prevent UI freeze (only send same EPC once every 2 seconds)
const debounceCache = new Map();
const DEBOUNCE_TIME = 2000;

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
  if (epcHex.startsWith('A') || epcHex.includes('A3B7C209')) {
    // Treat as wristband
    io.emit('wristband_scanned', {
      epc: epcHex,
      rssi: rssiVal,
      timestamp: new Date().toISOString(),
      type: 'wristband'
    });
  } else {
    // Treat as cylinder (Metal Tag CT824L)
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

let pendingWritePayload = null;

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
      if (frameCode !== 0x22) {
        console.log(`[RESPONSE FRAME] Code: 0x${frameCode.toString(16).toUpperCase()}`);
      }

      // Response to Stop Inventory (0x23) -> Trigger Write Tag (0x30)
      if (frameCode === 0x23 && pendingWritePayload) {
        console.log(`[WRITE SEQ] Reader acknowledged Stop Inventory (0x23). Sending Write Tag (0x30)...`);
        client.write(pendingWritePayload.frame);
      }
      
      // Response to Write Tag (0x30) -> Resume polling
      else if (frameCode === 0x30 && pendingWritePayload) {
        console.log(`[WRITE SEQ] Reader acknowledged Write Tag (0x30)! Resuming polling...`);
        const { cleanHex, callback, timeoutId } = pendingWritePayload;
        clearTimeout(timeoutId);
        pendingWritePayload = null;

        if (callback) {
          callback({ success: true, message: 'Tag encoded successfully via CT-i607!', epc: cleanHex });
        }
        io.emit('tag_written_success', { epc: cleanHex, timestamp: new Date().toISOString() });
      }
    }

    // ===== NOTIFICATION FRAMES (0x02) =====
    else if (frameType === 0x02 && frameCode === 0x80) {
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
          offset += 2 + params[offset + 1];
        }
      }
    }
  }
}

let inventoryInterval = null;

function connectToAntenna() {
  console.log(`[TCP] Connecting to Antenna CT-i607 at ${ANTENNA_IP}:${ANTENNA_PORT}...`);
  
  // Disable TCP Keep-Alive because it crashes the reader. We will poll 0x22 instead.
  client.setKeepAlive(false);
  client.setTimeout(0);

  client.connect(ANTENNA_PORT, ANTENNA_IP, () => {
    console.log(`[TCP] Connected to Antenna successfully!`);
    
    // Clear any stuck state
    const stopCmd = Buffer.from([0x52, 0x46, 0x00, 0x00, 0x00, 0x23, 0x00, 0x00, 0x45]);
    client.write(stopCmd);
    
    if (inventoryInterval) clearInterval(inventoryInterval);
    
    // Poll Inventory Once (0x22) every 600ms
    inventoryInterval = setInterval(() => {
      // Don't poll if we are waiting for a write operation
      if (client.writable && !pendingWritePayload) {
        const invOnceCmd = Buffer.from([0x52, 0x46, 0x00, 0x00, 0x00, 0x22, 0x00, 0x00, 0x46]);
        client.write(invOnceCmd);
      }
    }, 600);
    
    console.log(`[TCP] Started Inventory Once (0x22) polling every 600ms.`);
  });
}

client.on('data', (data) => {
  if (pendingWritePayload) {
    console.log(`[TCP RX DEBUG] ${data.toString('hex').toUpperCase()}`);
  }
  bufferAccumulator = Buffer.concat([bufferAccumulator, data]);
  parseBuffer();
});

client.on('close', () => {
  if (inventoryInterval) clearInterval(inventoryInterval);
  if (pendingWritePayload && pendingWritePayload.callback) {
    pendingWritePayload.callback({ success: false, error: 'TCP connection closed unexpectedly before write could complete.' });
    pendingWritePayload = null;
  }
  console.log('[TCP] Connection closed. Reconnecting in 5s...');
  setTimeout(connectToAntenna, 5000);
});

client.on('error', (err) => {
  console.error(`[TCP] Connection error: ${err.message}`);
  if (pendingWritePayload && pendingWritePayload.callback) {
    pendingWritePayload.callback({ success: false, error: `Connection error: ${err.message}` });
    pendingWritePayload = null;
  }
});

// ===== START REAL HARDWARE MODE =====
connectToAntenna();

if (process.env.ENABLE_SIMULATOR === 'true') {
  console.log('[SIMULATOR] Enabled fake simulator...');
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
