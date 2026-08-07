/**
 * CT-i607 Antenna Configuration Script
 * Sets antenna transfer mode to UDP and remote IP to MacBook
 *
 * Usage: node configure-antenna.js
 *
 * Prerequisites:
 * 1. USB-C Ethernet adapter connected to antenna
 * 2. Static IP set: 192.168.0.52/255.255.255.0 on MacBook
 * 3. Antenna IP: 192.168.0.3 (from scan)
 */

const net = require('net');

const ANTENNA_IP = process.env.ANTENNA_IP || '192.168.0.3';
const ANTENNA_PORT = parseInt(process.env.ANTENNA_PORT || '9000', 10);

// MacBook IP for antenna to send UDP responses back to
const MACBOOK_IP = process.env.MACBOOK_IP || '192.168.0.52';
const UDP_LISTEN_PORT = 4002;

function ipToBytes(ip) {
  return ip.split('.').map(Number);
}

function calculateChecksum(buffer, length) {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += buffer[i];
  }
  return (~sum + 1) & 0xFF;
}

// Build SetTransferParam frame (0x44)
// Based on C# SDK RfidReader.SetTransferParam() and RfidTransmissionParam.GetMessageDataFromParam()
function buildSetTransferParamFrame() {
  // param_data layout (35 bytes total):
  const param_data = Buffer.alloc(35);
  let pos = 0;

  // ucParamVersion (1 byte)
  param_data[pos++] = 0x05;

  // ucBaudRate (1 byte) — 0x08 = 115200
  param_data[pos++] = 0x08;

  // ucTransferLink (1 byte) — 0x04 = UDP
  // From SDK: RS232=0x01, RS485=0x02, Wiegand=0x03, UDP=0x04, TCP_Client=0x05
  param_data[pos++] = 0x04;

  // ucTransferProtocol (1 byte) — 0x00 = standard
  param_data[pos++] = 0x00;

  // ucWiegandProtocol (1 byte) — 0x00 = W26
  param_data[pos++] = 0x00;

  // ucWiegandPulseWidth (1 byte) — 10 * 10us = 100 = 0x64
  param_data[pos++] = 0x64;

  // ucWiegandPulsePeriod (1 byte) — 100 * 100us = 1000 = 0x03E8
  // But only 1 byte, so 0xFF max
  param_data[pos++] = 0xFF;

  // ucWiegandInterval (1 byte)
  param_data[pos++] = 0x00;

  // ucWiegandPosition (1 byte)
  param_data[pos++] = 0x00;

  // ucWiegandDirection (1 byte)
  param_data[pos++] = 0x00;

  // mac_addr (6 bytes) — all zeros for auto
  pos += 6;

  // local_ip (4 bytes) — antenna IP
  const antennaIP = ipToBytes(ANTENNA_IP);
  for (let i = 0; i < 4; i++) param_data[pos++] = antennaIP[i];

  // local_port (2 bytes, MSB LSB)
  param_data[pos++] = 0x27; // MSB of 12345
  param_data[pos++] = 0x11; // LSB of 12345

  // sub_mask_addr (4 bytes)
  for (let i = 0; i < 4; i++) param_data[pos++] = 0xFF;

  // gateway (4 bytes)
  for (let i = 0; i < 4; i++) param_data[pos++] = antennaIP[i];

  // remote_ip_addr (4 bytes) — MacBook IP (where to send UDP data)
  const macbookIP = ipToBytes(MACBOOK_IP);
  for (let i = 0; i < 4; i++) param_data[pos++] = macbookIP[i];

  // remote_port (2 bytes, MSB LSB)
  const udpPortBytes = [(UDP_LISTEN_PORT >> 8) & 0xFF, UDP_LISTEN_PORT & 0xFF];
  param_data[pos++] = udpPortBytes[0];
  param_data[pos++] = udpPortBytes[1];

  // config_ip_mode (1 byte) — 0 = use flash config
  param_data[pos++] = 0x00;

  // heartBeates (1 byte) — heartbeat interval in seconds
  param_data[pos++] = 0x00;

  // syris_module_sn (8 bytes)
  pos += 8;

  // syris_module_id (1 byte)
  pos += 1;

  // paramLength = TLV tag(1) + TLV len(1) + param_data(35) = 37
  const paramLength = 2 + param_data.length;
  const totalLen = 8 + paramLength;

  const frame = Buffer.alloc(totalLen);

  // Header 'RF'
  frame[0] = 0x52; frame[1] = 0x46;
  // Frame type (0x00 = command)
  frame[2] = 0x00;
  // Address (2 bytes, MSB LSB) — 0x0000 = broadcast
  frame[3] = 0x00; frame[4] = 0x00;
  // Frame code (0x44 = SetTransferParam)
  frame[5] = 0x44;
  // Param length (2 bytes, MSB LSB)
  frame[6] = (paramLength >> 8) & 0xFF;
  frame[7] = paramLength & 0xFF;

  // TLV Tag (0x24 = Transfer Param TLV)
  frame[8] = 0x24;
  // TLV Length
  frame[9] = param_data.length;

  // param_data
  param_data.copy(frame, 10);

  // Checksum (from header to end of param, excluding checksum byte itself)
  const checksum = calculateChecksum(frame, totalLen - 1);
  frame[totalLen - 1] = checksum;

  return frame;
}

// Build QueryTransferParam frame (0x43) — to read current settings
function buildQueryTransferParamFrame() {
  // paramLength = TLV tag(1) + TLV len(1) = 2
  const paramLength = 2;
  const totalLen = 8 + paramLength + 1; // +1 for checksum

  const frame = Buffer.alloc(totalLen);

  frame[0] = 0x52; frame[1] = 0x46;
  frame[2] = 0x00;
  frame[3] = 0x00; frame[4] = 0x00;
  frame[5] = 0x43; // QueryTransferParam
  frame[6] = 0x00;
  frame[7] = paramLength & 0xFF;
  frame[8] = 0x24; // TLV Tag for transfer param
  frame[9] = 0x00; // TLV Length

  const checksum = calculateChecksum(frame, totalLen - 1);
  frame[totalLen - 1] = checksum;

  return frame;
}

// Parse TransferParam response
function parseTransferParamResponse(data) {
  if (data.length < 10) return null;

  const frameType = data[2];
  const frameCode = data[5];
  const paramLength = (data[6] << 8) | data[7];

  if (frameType !== 0x01 || frameCode !== 0x43) return null;

  console.log(`\n[QUERY RESPONSE] Frame type: 0x${frameType.toString(16)}, Code: 0x${frameCode.toString(16)}`);
  console.log(`[QUERY RESPONSE] Hex: ${data.toString('hex').toUpperCase()}`);

  // Extract status TLV
  const params = data.subarray(8, 8 + paramLength);
  console.log(`[QUERY RESPONSE] Params hex: ${params.toString('hex').toUpperCase()}`);

  // Parse TLVs
  let offset = 0;
  while (offset < params.length) {
    const tag = params[offset];
    const len = params[offset + 1];
    if (len === undefined) break;
    const value = params.subarray(offset + 2, offset + 2 + len);

    const tagNames = {
      0x07: 'Status',
      0x24: 'TransferParam',
    };

    console.log(`  TLV Tag: 0x${tag.toString(16)} (${tagNames[tag] || 'Unknown'}), Length: ${len}, Value: ${value.toString('hex').toUpperCase()}`);

    if (tag === 0x24 && len >= 4) {
      // Parse TransferParam
      let p = 0;
      const version = value[p++];
      const baudRate = value[p++];
      const transferLink = value[p++];
      const transferProtocol = value[p++];

      const linkNames = { 0x01: 'RS232', 0x02: 'RS485', 0x03: 'Wiegand', 0x04: 'UDP', 0x05: 'TCP_Client' };

      console.log(`\n[ANTENNA CURRENT SETTINGS]`);
      console.log(`  Version: ${version}`);
      console.log(`  BaudRate: ${baudRate}`);
      console.log(`  TransferLink: 0x${transferLink.toString(16)} (${linkNames[transferLink] || 'Unknown'})`);
      console.log(`  TransferProtocol: 0x${transferProtocol.toString(16)}`);

      if (len >= 15) {
        const remoteIP = `${value[p+28]}.${value[p+29]}.${value[p+30]}.${value[p+31]}`;
        const remotePort = (value[p+32] << 8) | value[p+33];
        console.log(`  RemoteIP: ${remoteIP}`);
        console.log(`  RemotePort: ${remotePort}`);
      }
    }

    offset += 2 + len;
  }

  return true;
}

// Main
async function main() {
  console.log('===========================================');
  console.log('CT-i607 Antenna Configuration Script');
  console.log('===========================================');
  console.log(`Antenna: ${ANTENNA_IP}:${ANTENNA_PORT}`);
  console.log(`MacBook IP: ${MACBOOK_IP}`);
  console.log(`UDP Port: ${UDP_LISTEN_PORT}`);
  console.log('');

  const client = new net.Socket();
  client.setNoDelay(true);

  let responseData = Buffer.alloc(0);

  client.on('data', (chunk) => {
    responseData = Buffer.concat([responseData, chunk]);
    console.log(`[TCP RX] ${chunk.toString('hex').toUpperCase()}`);

    // Try to parse as query response
    if (chunk.length >= 8) {
      parseTransferParamResponse(responseData);
    }
  });

  client.on('close', () => {
    console.log('\n[TCP] Connection closed.');
  });

  client.on('error', (err) => {
    console.error(`[TCP] Error: ${err.message}`);
  });

  // Connect to antenna
  await new Promise((resolve, reject) => {
    client.connect(ANTENNA_PORT, ANTENNA_IP, () => {
      console.log(`[TCP] Connected to antenna at ${ANTENNA_IP}:${ANTENNA_PORT}`);
      resolve();
    });
    client.on('error', reject);
  });

  // Step 1: Query current transfer param
  console.log('\n[1] Querying current transfer param...');
  const queryFrame = buildQueryTransferParamFrame();
  console.log(`[TX] QueryTransferParam: ${queryFrame.toString('hex').toUpperCase()}`);
  client.write(queryFrame);

  // Wait for response
  await new Promise(r => setTimeout(r, 2000));

  // Step 2: Set transfer param to UDP
  console.log('\n[2] Setting transfer mode to UDP...');
  const setFrame = buildSetTransferParamFrame();
  console.log(`[TX] SetTransferParam: ${setFrame.toString('hex').toUpperCase()}`);
  client.write(setFrame);

  // Wait for response
  await new Promise(r => setTimeout(r, 2000));

  // Step 3: Query again to verify
  console.log('\n[3] Verifying new settings...');
  client.write(queryFrame);

  await new Promise(r => setTimeout(r, 2000));

  client.end();
  console.log('\n[DONE] Script completed.');
  console.log('\nNOTE: Antenna may need to be power-cycled for settings to take effect.');
}

main().catch(console.error);
