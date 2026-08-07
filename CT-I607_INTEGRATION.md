# CT-I607 UHF RFID Integration — Session State

## Current Status: BLOCKED — Antenna TCP Client Mode

### Hardware Setup
- **Antenna:** CT-i607 (CPHG90124WM), IP `192.168.0.7`, Port `12345`
- **Physical connectors:** RJ45 (Ethernet), DB9 (RS232), RS485, Wiegand, Relay, Trigger
- **USB-to-Ethernet Adapter:** Connected

### Network Status (Confirmed 2026-08-05)
- MacBook Ethernet IP: `192.168.0.2/24`
- `ping 192.168.0.7` → Success (46ms)
- UDP port 12345 → Open
- TCP port 12345 → Refused

### Root Cause
Antenna is configured as **TCP Client** — it connects OUT to a remote server. Cannot accept incoming connections. UDP commands sent to it get no response. `SetTransferParam` not persisted after restart.

### Software Setup
- **Edge Gateway:** `bags-edge-gateway/server.js` — TCP Client + UDP + TCP Server modes
- **Supabase:** Migration `16_rfid_tags.sql` DONE, RLS policies fixed
- **Dashboard:** `Ecosystem/src/app/portal/stasiun/` — live via Vercel
- **Socket.io:** WebSocket for real-time RFID events

## Bugs Fixed This Session (2026-08-04)
1. `isSimulatorActive` declared AFTER useEffect — runtime crash
2. Simulator debounce timeout 2s → 8s (was too short for 6s interval)
3. `simulator_status` not synced on Socket.io connect
4. RLS policy role names mismatch (`'Station Operator'` → `'station_operator'`)
5. useEffect deps pollution in UHFCylinderRfidLogCard.tsx

## Available Scripts

```bash
cd ~/Documents/BagsEcosystem/bags-edge-gateway

# TCP Client (default — antenna must accept connections)
ANTENNA_IP=192.168.0.7 ANTENNA_PORT=12345 node server.js

# UDP mode (gateway broadcasts, antenna may not respond)
UDP_MODE=true ANTENNA_IP=192.168.0.7 ANTENNA_PORT=12345 node server.js

# TCP Server mode (gateway listens, antenna connects to us)
TCP_SERVER=true node server.js

# Configure antenna via UDP (BROKEN — antenna doesnt respond)
node configure-antenna-udp.js

# Simulator mode (fake tags for testing without antenna)
ENABLE_SIMULATOR=true node server.js
```

## Next Steps (Priority Order)

### CRITICAL: Configure Antenna TCP Client Remote IP
Antenna must be configured as TCP Client with remote IP = `192.168.0.2` (MacBook), port `9000`.

Options to try:
1. **SDK Demo App** — use "Scan" + check for "Set Param" / "Config" section
2. **Web config page** — try `http://192.168.0.7` in browser
3. **Contact vendor** — TTL serial or factory reset
4. **RS232 Serial** — use USB-to-Serial adapter + DB9 cable direct to antenna
5. **Different UDP command format** — compare against SDK C# more carefully

### MEDIUM: Physical Tag EPC Check
Once antenna works: read physical tag EPC → update Supabase `rfid_tags`

### MEDIUM: Production Demo Setup
```bash
# Terminal 1: Gateway
TCP_SERVER=true node server.js

# Terminal 2: Ngrok
ngrok http 4001

# Vercel env: NEXT_PUBLIC_WS_URL=https://abc123.ngrok.io
```

## Demo Flow (Target)
1. **Read Tag:** Click "Read" → hold tag → EPC appears → metadata shown
2. **Encode Tag:** Click "Encode" → input HEX → tag written
3. **Simulator (Fallback):** Click "Sim" → fake tags every 6s

## Key Files
- `bags-edge-gateway/server.js` — edge gateway (TCP Client/Server + UDP)
- `bags-edge-gateway/configure-antenna-udp.js` — antenna config script (broken)
- `bags-edge-gateway/HANDOFF.md` — full handoff doc
- `Ecosystem/src/app/portal/stasiun/` — stasiun portal
- `Ecosystem/src/providers/SocketProvider.tsx` — socket context
- `docs/HANDOFF.md` — full session handoff
