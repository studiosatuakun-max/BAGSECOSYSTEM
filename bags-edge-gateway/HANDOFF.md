# Agent Handoff — CT-i607 UHF RFID Integration
## Session: 2026-08-05 | Status: BLOCKED — Antenna TCP Client Mode

---

## Current Situation

### Network Topology (CONFIRMED)
```
MacBook (192.168.0.2/24) ← USB-C Ethernet ← Antenna (192.168.0.7:12345)
         │
         └── WiFi (internet client)
```

- `ping 192.168.0.7` → ✅ Success (46ms)
- UDP port 12345 → ✅ Open
- TCP ports 12345, 9000 → ❌ Refused/Closed

### Root Cause: Antenna in TCP Client Mode
Antenna CT-i607 (CPHG90124WM, label: 192.168.0.7:12345) is configured as **TCP Client**. It connects OUT to a remote server. Cannot accept incoming TCP connections, and UDP commands sent to it get no response.

**Evidence:**
- SDK Scan tool shows antenna at 192.168.0.3 (actually MacBook's IP from antenna's perspective)
- `nc -z -v 192.168.0.7 12345` → TCP refused
- `nc -z -u -v 192.168.0.7 12345` → UDP open (port reachable) but antenna does NOT respond to any commands
- `SetTransferParam` commands sent → no response → settings not persisted after restart

---

## What Was Tried

| Approach | Command | Result |
|---|---|---|
| TCP Client (default) | `node server.js` | `ECONNREFUSED` |
| UDP Mode | `UDP_MODE=true node server.js` | Port open, commands sent, **no response** |
| TCP Server (gateway listen) | `TCP_SERVER=true node server.js` | Added, works, waiting for antenna to connect |
| SetTransferParam via UDP | `node configure-antenna-udp.js` | Commands sent, **no response**, not persisted |
| SDK Demo App | UHF RFID Test Demo V1.1.5 | Shows antenna scan, antenna connects to app then disconnects |

---

## Files Created/Modified

### `bags-edge-gateway/server.js` — Edge Gateway
- ✅ TCP Client mode (original)
- ✅ UDP Mode (broadcast)
- ✅ TCP Server mode (new — antenna connects TO gateway)
- ✅ Simulator mode (fake RFID frames)
- Known bugs fixed:
  - `buildWriteTagFrame` paramLength (was 18, fixed to 14)
  - TCP error handler + reconnect
  - Socket.io event pattern (no ack callbacks)
  - Payload validation
  - debounceCache memory leak (cleanup every 15s)
  - Buffer overflow in TLV parsing
  - `isSimulatorActive` state ordering bug in UI
  - Debounce timeout 2s → 8s

### `bags-edge-gateway/configure-antenna.js` — TCP Config (BROKEN)
TCP connection refused by antenna. Not usable.

### `bags-edge-gateway/configure-antenna-udp.js` — UDP Config
- Sends `QueryDeviceInfo (0x40)`, `QueryTransferParam (0x43)`, `SetTransferParam (0x44)`, `RestartDevice (0x10)`
- Antenna does NOT respond to any commands via UDP
- Settings not persisted after antenna restart

### `Ecosystem/src/providers/SocketProvider.tsx`
- Added `simulator_status` listener
- Added `isSimulatorActive` to context

### `Ecosystem/src/app/portal/stasiun/components/UHFCylinderRfidLogCard.tsx`
- Fixed `isSimulatorActive` declaration order (was AFTER useEffect that used it)
- Fixed useEffect deps
- Connected to Supabase `rfid_tags` for metadata lookup

### `Ecosystem/supabase/migrations/16_rfid_tags.sql`
- Seeded 6 cylinders + 2 wristbands
- RLS policy role names fixed (`'station_operator'`, `'skid_operator'`, `'super_admin'`, `'admin'`)

### `docs/HANDOFF.md`
- Full session handoff from 2026-08-04

---

## Available Scripts

```bash
cd ~/Documents/BagsEcosystem/bags-edge-gateway

# TCP Client mode (default — antenna must accept connections)
ANTENNA_IP=192.168.0.7 ANTENNA_PORT=12345 node server.js

# UDP mode (gateway broadcasts, antenna may not respond)
UDP_MODE=true ANTENNA_IP=192.168.0.7 ANTENNA_PORT=12345 node server.js

# TCP Server mode (gateway listens, antenna connects to us)
# Requires antenna to be set as TCP Client pointing to MacBook IP
TCP_SERVER=true node server.js

# Configure antenna (UDP — BROKEN, antenna doesn't respond)
node configure-antenna-udp.js

# Simulator mode (fake tags for testing without antenna)
ENABLE_SIMULATOR=true node server.js
```

---

## Next Steps (Priority Order)

### 🔴 CRITICAL: Configure Antenna TCP Client Remote IP

The antenna must be configured as **TCP Client** with remote IP = MacBook's Ethernet IP (`192.168.0.2`) and remote port = `9000` (TCP Server port). Currently the `SetTransferParam` command via UDP is NOT working — antenna ignores all commands.

**Options to try:**

1. **Use SDK Demo App's Scan + Set feature**
   - Open `UHF RFID Test Demo V1.1.5`
   - Use "Scan" to find antenna
   - Look for a "Set Param" or "Config" section in the app
   - Set Transfer Mode to **UDP** or **TCP Client** with remote IP = `192.168.0.2`

2. **Check if antenna has a web config page**
   - Try opening `http://192.168.0.7` in browser
   - Some antennas have HTTP-based configuration

3. **Contact antenna vendor/manufacturer**
   - Ask how to configure TCP Client remote IP remotely
   - The antenna may need factory reset or TTL serial access to configure

4. **Try RS232/Serial configuration**
   - Antenna has DB9 RS232 port
   - Use USB-to-Serial adapter to connect directly
   - Send configuration commands via serial (bypasses network entirely)
   - SDK has `MSerialReader.cs` with serial support

5. **Try different UDP command format**
   - Current commands may have wrong TLV structure
   - Compare against SDK C# `RfidReader.cs` frame building more carefully
   - May need different TLV tag for SetTransferParam

### 🟡 MEDIUM: Physical Tag EPC Check

Once antenna is connected, need to read EPC from physical UHF tags:
1. Run gateway in working mode
2. Click "Read" in dashboard
3. Hold tag near antenna
4. Copy EPC from gateway log
5. Update Supabase `rfid_tags` with real EPCs

### 🟡 MEDIUM: Production Demo Setup

For client presentation with Vercel dashboard:
```bash
# Terminal 1: Run gateway
cd ~/Documents/BagsEcosystem/bags-edge-gateway
TCP_SERVER=true node server.js

# Terminal 2: Ngrok tunnel
ngrok http 4001

# Set Vercel env: NEXT_PUBLIC_WS_URL=https://abc123.ngrok.io
# Commit & push to Vercel
```

---

## SDK Reference Files

| File | Purpose |
|---|---|
| `CT-I607-SDK/C#/RfidSdk/RfidReader.cs` | Frame building (WriteTag, ReadTag, SetTransferParam) |
| `CT-I607-SDK/C#/RfidSdk/MSerialReader.cs` | Serial port implementation |
| `CT-I607-SDK/C#/RfidSdk/RfidNet.cs` | TCP/UDP socket implementation |
| `CT-I607-SDK/C#/RfidSdk/RfidParameter.cs` | Parameter structs (TransferParam, WorkParam) |
| `CT-I607-SDK/C#/doc/Demo_Operating_Manual.txt` | SDK usage + transfer mode options |
| `CT-I607-SDK/UHF communication protocol.txt` | Protocol spec (frame format, TLV, commands) |
| `docs/UHF_RFID_PROTOCOL.md` | Protocol doc in repo |

## Key Protocol Values

- **SetTransferParam frame code:** `0x44`
- **QueryTransferParam frame code:** `0x43`
- **TransferParam TLV tag:** `0x24`
- **TransferLink values:** `0x01`=RS232, `0x02`=RS485, `0x03`=Wiegand, `0x04`=UDP, `0x05`=TCP_Client

---

## Antenna Label Info

```
IP Address: 192.168.0.7
Port: 12345
Model: CPHG90124WM

Connectors:
- WIEGAND (D0, GND, D1)
- RS485 (D0, GND, D1, A+, B-)
- RELAY (D0, GND, D1, NO, COM, NC)
- TRIGGER (+, T+, -)
- DB9 RS232 (for serial config)
- RJ45 Ethernet
```

---

## Demo Flow (Target)

1. **Read Tag:** Click "Read" → hold tag near antenna → EPC appears → metadata shown
2. **Encode Tag:** Click "Encode" → input HEX data → tag written
3. **Simulator (Fallback):** Click "Sim" → fake tags every 6 seconds

---

Last updated: 2026-08-05 by Claude Code
