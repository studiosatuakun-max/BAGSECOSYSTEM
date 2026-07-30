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

io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);
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
    
    if (frameType === 0x02 && frameCode === 0x80) {
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

function connectToAntenna() {
  console.log(`[TCP] Connecting to Antenna at ${ANTENNA_IP}:${ANTENNA_PORT}...`);
  client.connect(ANTENNA_PORT, ANTENNA_IP, () => {
    console.log(`[TCP] Connected to Antenna successfully!`);
  });
}

client.on('data', (data) => {
  bufferAccumulator = Buffer.concat([bufferAccumulator, data]);
  parseBuffer();
});

client.on('close', () => {
  console.log('[TCP] Connection closed. Reconnecting in 5s...');
  setTimeout(connectToAntenna, 5000);
});

client.on('error', (err) => {
  console.error(`[TCP] Connection error: ${err.message}`);
});

// FAKE SIMULATOR: Send fake data every 10 seconds for Demo
setInterval(() => {
  console.log('[SIMULATOR] Injecting fake notification frame...');
  const fakeData = Buffer.from([
    0x52, 0x46, 0x02, 0x00, 0x00, 0x80, 0x00, 0x15, 
    0x50, 0x13, 
      0x01, 0x0C, 0xE2, 0x00, 0x00, 0x17, 0x02, 0x17, 0x01, 0x99, 0x23, 0x90, 0x21, 0x7D, 
      0x05, 0x01, 0xC3, 
      0x06, 0x04, 0x3D, 0x00, 0x00, 0x00, 
    0x4C 
  ]);
  client.emit('data', fakeData);
  
  setTimeout(() => {
    const fakeWristband = Buffer.from([
      0x52, 0x46, 0x02, 0x00, 0x00, 0x80, 0x00, 0x15,
      0x50, 0x13,
        0x01, 0x0C, 0xA3, 0xB7, 0xC2, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
        0x05, 0x01, 0xA1,
        0x06, 0x04, 0x3D, 0x00, 0x00, 0x00,
      0x4C
    ]);
    client.emit('data', fakeWristband);
  }, 2000);
}, 15000);
