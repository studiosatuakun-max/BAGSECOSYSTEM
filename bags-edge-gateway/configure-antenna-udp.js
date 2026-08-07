/**
 * CT-i607 Antenna Configuration via UDP
 * Queries and sets antenna transfer mode to UDP
 *
 * Usage: node configure-antenna-udp.js
 */

const dgram = require('dgram');

const ANTENNA_IP = process.env.ANTENNA_IP || '192.168.0.7';
const ANTENNA_PORT = parseInt(process.env.ANTENNA_PORT || '12345', 10);
const LOCAL_PORT = 4002;

const MACBOOK_IP = process.env.MACBOOK_IP || '192.168.0.2';
const UDP_PORT = parseInt(process.env.UDP_PORT || '4002', 10);   // gateway UDP listen port
const TCP_SERVER_PORT = parseInt(process.env.TCP_SERVER_PORT || '9000', 10); // gateway TCP listen port

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

// Build a generic command frame
// SDK C# RfidReader pattern:
//   pos=6: paramLength MSB = 0
//   pos=7: paramLength LSB = tlvLen
// where tlvLen = paramTLV.length
function buildCommandFrame(frameCode, paramTLV = null) {
  const tlvLen = paramTLV ? paramTLV.length : 0;
  // paramLength in frame = number of bytes AFTER paramLength field (MSB+LSB), up to and including checksum
  // SDK C#: cmdBuff[pos++] = (byte)(param_data.Length >> 8); cmdBuff[pos++] = (byte)(param_data.Length + 2);
  // For SetTransferParam: paramLength = 2 + param_data.Length
  // For QueryTransferParam: paramTLV = [0x24, 0x00], paramLength = 2
  // For no-param: paramLength = 0
  const paramLength = tlvLen;

  const totalLen = 8 + paramLength + 1; // +1 checksum

  const frame = Buffer.alloc(totalLen);

  frame[0] = 0x52; frame[1] = 0x46; // 'RF'
  frame[2] = 0x00; // Command frame
  frame[3] = 0x00; frame[4] = 0x00; // Address
  frame[5] = frameCode; // Frame code
  frame[6] = (paramLength >> 8) & 0xFF;
  frame[7] = paramLength & 0xFF;

  let pos = 8;
  if (paramTLV) {
    paramTLV.copy(frame, pos);
    pos += paramTLV.length;
  }

  const checksum = calculateChecksum(frame, totalLen - 1);
  frame[totalLen - 1] = checksum;

  return frame;
}

// Build SetTransferParam TLV (0x44)
// CRITICAL: Must match RfidTransmissionParam.GetMessageDataFromParam() exactly (47 bytes)
// TransferLink values: 0x01=RS232, 0x02=RS485, 0x03=Wiegand, 0x04=UDP, 0x05=TCP_Client
//
// RfidTransmissionParam structure (from SDK C# RfidParameter.cs):
//   ucParamVersion(1) + ucBaudRate(1) + ucTransferLink(1) + ucTransferProtocol(1) +
//   ucWiegandProtocol(1) + ucWiegandPulseWidth(1) + ucWiegandPulsePeriod(1) +
//   ucWiegandInterval(1) + ucWiegandPosition(1) + ucWiegandDirection(1) = 10 fixed
// + mac_addr(6) + local_ip(4) + local_port(2) + sub_mask(4) + gateway(4) +
//   remote_ip(4) + remote_port(2) + config_ip_mode(1) + heartBeates(1) +
//   syris_module_sn(8) + syris_module_id(1) = 37
// = 47 bytes total
//
// local_port and remote_port are 2 bytes MSB LSB (unlike RfidNet which reads them as 1 byte!)
// This was the critical bug in the original script.
function buildSetTransferParamTLV(transferLink = 0x05) {
  const data = Buffer.alloc(47); // 47 bytes, not 36!
  let pos = 0;

  data[pos++] = 0x05; // ucParamVersion
  data[pos++] = 0x08; // ucBaudRate (115200)
  data[pos++] = transferLink; // ucTransferLink (0x04=UDP, 0x05=TCP_Client)
  data[pos++] = 0x00; // ucTransferProtocol
  data[pos++] = 0x00; // ucWiegandProtocol
  data[pos++] = 0x64; // ucWiegandPulseWidth (10*10us = 100us)
  data[pos++] = 0xFF; // ucWiegandPulsePeriod
  data[pos++] = 0x00; // ucWiegandInterval
  data[pos++] = 0x00; // ucWiegandPosition
  data[pos++] = 0x00; // ucWiegandDirection
  // mac_addr (6 bytes) = zeros
  pos += 6;
  // local_ip (4 bytes) — antenna's own IP
  const localIPBytes = [192, 168, 0, 7];
  for (let i = 0; i < 4; i++) data[pos++] = localIPBytes[i];
  // local_port (2 bytes MSB LSB) — antenna's TCP/UDP port
  const localPort = 12345;
  data[pos++] = (localPort >> 8) & 0xFF;
  data[pos++] = localPort & 0xFF;
  // sub_mask (4 bytes)
  for (let i = 0; i < 4; i++) data[pos++] = 0xFF;
  // gateway (4 bytes)
  const gatewayBytes = [192, 168, 0, 1];
  for (let i = 0; i < 4; i++) data[pos++] = gatewayBytes[i];
  // remote_ip (4 bytes) — where antenna sends data (MacBook)
  const remoteIPBytes = ipToBytes(MACBOOK_IP);
  for (let i = 0; i < 4; i++) data[pos++] = remoteIPBytes[i];
  // remote_port (2 bytes MSB LSB)
  // For TCP_Client: this is the TCP port antenna connects TO
  // For UDP: this is the port antenna sends UDP broadcasts TO
  const remotePort = transferLink === 0x04 ? UDP_PORT : TCP_SERVER_PORT;
  data[pos++] = (remotePort >> 8) & 0xFF;
  data[pos++] = remotePort & 0xFF;
  // config_ip_mode (0=flash, 1=DHCP)
  data[pos++] = 0x00;
  // heartBeates (heartbeat interval in seconds, 0=disabled)
  data[pos++] = 0x00;
  // syris_module_sn (8 bytes) = zeros
  pos += 8;
  // syris_module_id (1 byte) = 0
  pos += 1;

  return data;
}

function parseResponse(data) {
  if (data.length < 8) return;

  const frameType = data[2];
  const frameCode = data[5];
  const paramLength = (data[6] << 8) | data[7];

  console.log(`[UDP RX] Type: 0x${frameType.toString(16)}, Code: 0x${frameCode.toString(16)}, ParamLen: ${paramLength}`);
  console.log(`[UDP RX] Hex: ${data.toString('hex').toUpperCase()}`);

  if (data.length < 8 + paramLength + 1) {
    console.log('[UDP RX] Incomplete frame, waiting for more data...');
    return;
  }

  const params = data.subarray(8, 8 + paramLength);
  console.log(`[UDP RX] Params: ${params.toString('hex').toUpperCase()}`);

  // Parse TLVs
  let offset = 0;
  while (offset < params.length) {
    if (offset + 2 > params.length) break;
    const tag = params[offset];
    const len = params[offset + 1];
    if (offset + 2 + len > params.length) break;
    const value = params.subarray(offset + 2, offset + 2 + len);

    const tagNames = {
      0x07: 'Status',
      0x24: 'TransferParam',
      0x20: 'FirmwareVersion',
      0x21: 'DeviceType',
    };

    console.log(`  TLV: Tag=0x${tag.toString(16)} (${tagNames[tag] || 'Unknown'}), Len=${len}, Value=${value.toString('hex').toUpperCase()}`);

    if (tag === 0x24 && value.length >= 4) {
      const transferLink = value[2];
      const linkNames = { 0x01: 'RS232', 0x02: 'RS485', 0x03: 'Wiegand', 0x04: 'UDP', 0x05: 'TCP_Client' };
      console.log(`\n  Current TransferLink: 0x${transferLink.toString(16)} = ${linkNames[transferLink] || 'Unknown'}`);

      // RfidTransmissionParam structure offsets (from SDK C#):
      // 0:ucParamVersion, 1:ucBaudRate, 2:ucTransferLink, 3:ucTransferProtocol,
      // 4-9: ucWiegand..., 10-15:mac_addr, 16-19:local_ip, 20-21:local_port(2bytes),
      // 22-25:sub_mask, 26-29:gateway, 30-33:remote_ip, 34-35:remote_port(2bytes),
      // 36:config_ip_mode, 37:heartBeates, 38-45:syris_sn, 46:syris_id
      if (value.length >= 36) {
        const remoteIP = `${value[30]}.${value[31]}.${value[32]}.${value[33]}`;
        const remotePort = (value[34] << 8) | value[35];
        console.log(`  Remote IP: ${remoteIP}`);
        console.log(`  Remote Port: ${remotePort}`);
      }
      if (value.length >= 20) {
        const localIP = `${value[16]}.${value[17]}.${value[18]}.${value[19]}`;
        const localPort = (value[20] << 8) | value[21];
        console.log(`  Local IP: ${localIP}`);
        console.log(`  Local Port: ${localPort}`);
      }
    }

    if (tag === 0x07) {
      const status = value[0];
      const statusNames = { 0x00: 'Success', 0x14: 'Unsupported', 0x15: 'Len Error', 0x16: 'Content Error', 0x17: 'Unsupported Cmd' };
      console.log(`  Status: 0x${status.toString(16)} = ${statusNames[status] || 'Unknown'}`);
    }

    offset += 2 + len;
  }
}

async function main() {
  const MODE = process.env.MODE || 'tcp_client'; // 'tcp_client' or 'udp'
  const TRANSFER_LINK = MODE === 'udp' ? 0x04 : 0x05;

  console.log('===========================================');
  console.log('CT-i607 Antenna Configuration via UDP');
  console.log('Mode: ' + (MODE === 'udp' ? 'UDP Broadcast' : 'TCP Client (Recommended)'));
  console.log('===========================================');
  console.log(`Antenna:        ${ANTENNA_IP}:${ANTENNA_PORT}`);
  console.log(`MacBook IP:     ${MACBOOK_IP}`);
  console.log(`Local UDP:      ${LOCAL_PORT} (config script listens)`);
  console.log(`Gateway UDP:    ${UDP_PORT} (gateway listens)`);
  console.log(`Gateway TCP:    ${TCP_SERVER_PORT} (gateway TCP server port)`);
  console.log(`Transfer Link:  0x${TRANSFER_LINK.toString(16)} (${MODE === 'udp' ? 'UDP' : 'TCP_Client'})`);
  console.log('');

  const client = dgram.createSocket({ type: 'udp4', reuseAddr: true });
  let recvBuffer = Buffer.alloc(0);

  await new Promise((resolve, reject) => {
    client.on('message', (msg, rinfo) => {
      console.log(`[UDP RX] From ${rinfo.address}:${rinfo.port} | Hex: ${msg.toString('hex').toUpperCase()}`);
      recvBuffer = Buffer.concat([recvBuffer, msg]);
      parseResponse(recvBuffer);
    });

    client.on('error', (err) => {
      console.error(`[UDP] Error: ${err.message}`);
      reject(err);
    });

    client.on('listening', () => {
      client.setBroadcast(true);
      const addr = client.address();
      console.log(`[UDP] Listening on ${addr.address}:${addr.port} (broadcast enabled)`);
      resolve();
    });

    client.bind(LOCAL_PORT);
  });

  function send(frame, description) {
    console.log(`\n[TX] ${description}`);
    console.log(`[TX] Hex: ${frame.toString('hex').toUpperCase()}`);
    client.send(frame, ANTENNA_PORT, ANTENNA_IP, (err) => {
      if (err) console.error(`[UDP TX Error] ${err.message}`);
    });
  }

  // Step 1: Query Device Info
  console.log('\n--- Step 1: Query Device Info ---');
  send(buildCommandFrame(0x40), 'QueryDeviceInfo (0x40)');
  await new Promise(r => setTimeout(r, 1500));

  // Step 2: Query Current Transfer Param
  console.log('\n--- Step 2: Query Current Transfer Param ---');
  const queryFrame = buildCommandFrame(0x43, Buffer.from([0x24, 0x00]));
  send(queryFrame, 'QueryTransferParam (0x43)');
  await new Promise(r => setTimeout(r, 1500));

  // Step 3: Set Transfer Param
  console.log(`\n--- Step 3: Set Transfer Param to ${MODE === 'udp' ? 'UDP' : 'TCP Client'} ---`);
  const setTLV = buildSetTransferParamTLV(TRANSFER_LINK);
  const setFrame = buildCommandFrame(0x44, Buffer.concat([Buffer.from([0x24]), setTLV]));
  console.log(`[CONFIG] TransferLink=0x${TRANSFER_LINK.toString(16)}, Remote=${MACBOOK_IP}:${TRANSFER_LINK === 0x04 ? UDP_PORT : TCP_SERVER_PORT}`);
  send(setFrame, `SetTransferParam ${MODE === 'udp' ? 'UDP' : 'TCP Client'} (0x44)`);
  await new Promise(r => setTimeout(r, 1500));

  // Step 4: Verify
  console.log('\n--- Step 4: Verify New Settings ---');
  send(queryFrame, 'QueryTransferParam (0x43)');
  await new Promise(r => setTimeout(r, 1500));

  // Step 5: Restart
  console.log('\n--- Step 5: Restart Device ---');
  send(buildCommandFrame(0x10), 'RestartDevice (0x10) — antenna will restart in ~5s');
  await new Promise(r => setTimeout(r, 3000));

  console.log('\n===========================================');
  if (MODE === 'tcp_client') {
    console.log('SUCCESS: Antenna configured as TCP Client');
    console.log(`Remote IP:   ${MACBOOK_IP}`);
    console.log(`Remote Port: ${TCP_SERVER_PORT}`);
    console.log('');
    console.log('NEXT: Run gateway as TCP SERVER:');
    console.log(`TCP_SERVER=true node server.js`);
  } else {
    console.log('SUCCESS: Antenna configured as UDP');
    console.log(`Antenna will broadcast to: ${MACBOOK_IP}:${UDP_PORT}`);
    console.log('');
    console.log('NEXT: Run gateway as UDP:');
    console.log(`UDP_MODE=true ANTENNA_IP=${ANTENNA_IP} ANTENNA_PORT=${ANTENNA_PORT} node server.js`);
  }
  console.log('===========================================');

  client.close();
}

main().catch(console.error);
