# Agent Handoff — Session 2026-08-04

## Deployment
**Vercel via GitHub Auto-Webhook.** Setelah commit, push ke `main`:
```bash
git add -A && git commit -m "message" && git push origin main
```
Vercel auto-deploy ~2-3 menit. Monitor: https://vercel.com/dashboard

---

## Bugs Fixed / New Features This Session

### 1. Finance: PDF Auto-Generator & Storage Bucket (Phase 4.5)
- **PDF Generator**: Diimplementasikan menggunakan pendekatan `/print/[type]/[id]` page dengan CSS `@media print` dan `window.print()` di `useEffect` (Zero heavy libraries seperti jsPDF/html2pdf).
- **Storage Bucket**: Terintegrasi `finance-efaktur` Supabase storage bucket via browser client dengan limit file size maks 5MB. URL hasil upload dihubungkan ke field `efaktur_url` di tabel database.
- **Opex System**: Penambahan CRUD `operating_expenses` untuk memisahkan pengeluaran dari pendapatan kas.
- **Cross-Module Automation**: Server actions di `keuangan/actions.ts` sudah siap dieksekusi (dipanggil) oleh agen-agen yang bekerja di modul Skid/Armada.

### 2. Finance: Clipped Modal Bug Fix (Hotfix)
**Root Cause:** Komponen `IssueInvoiceModal` dan `AddExpenseModal` ter-render di dalam card wrapper yang memiliki class `overflow-hidden`, menyebabkan modal terpotong dan tidak *full-screen*.
**Fix:** Membungkus return dari `InvoiceTableCard` dan `CashFlowChartCard` dengan `<React.Fragment>` (`<>`) dan mengeluarkan komponen modal ke luar blok div yang *overflowing*. Class modal menggunakan `fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm`.

### 3. Client-Side Crash on `/portal/stasiun` and `/portal/skid`
**Root Cause:** Server Component passed `data: null` from Supabase (RLS blocks dummy cookie auth) to `MasterFuelingTableCard`. Component did `useState(null)`, then `.filter()` crashed.
**Fix:** Always default to `[]` when Supabase returns null:
```ts
records = (result.data ?? []) as unknown as MasterFuelingRecord[];
```
Applied to: `stasiun/page.tsx`, `skid/page.tsx`, `horeca/page.tsx`, `industrial/page.tsx`

### 4. Import DispatchItem dari API Route
**Root Cause:** `InboxDrawer.tsx` (client component) imported `DispatchItem` from `@/app/api/inbox/dispatches/route` — cross-boundary import causes runtime crash.
**Fix:** Extracted to `src/types/dispatch.ts`, updated both files.

### 5. B2C URL Conflict + Duplicate Login Cards
**Root Cause:** B2B Customer + Skid Lead both used `skid@baskara.id` → same portal.
**Fix:**
- B2B Customer → `pelanggan@baskara.id` → `/portal/pelanggan` (B2C mobile app)
- Skid Lead → `skid@baskara.id` → `/portal/skid` (B2B industrial)
- Added `pelanggan` email → `customer` role mapping in login route
- Added `customer` role to middleware RBAC

---

## IoT: CT-i607 UHF RFID — Live Test Results (2026-08-04)

### Network Topology (Confirmed via live testing)
```
MacBook (192.168.100.52) ←WiFi→ Huawei E5577 Router (192.168.100.1)
                                              │
                               Carrier Cellular Network (NAT)
                                              │
                                    Antenna CT-i607 (192.168.0.7:12345)
                                    Sticker IP: 192.168.0.7 / Port: 12345
                                    Model: CPHG90124WM
```

### Antenna Physical Label (Sticker)
- **IP Address:** `192.168.0.7` ← **NOT `192.168.1.200`** (old IP was wrong)
- **Port:** `12345` ← **NOT `4000`** (port was wrong)
- **Model:** `CPHG90124WM`
- Antenna continuously beeps in continuous inventory mode (factory default)

### Live Test Results
| Test | Result | Notes |
|------|--------|-------|
| TCP connect MacBook → antenna | ✅ SUCCESS | `Connection to 192.168.0.7 port 12345 succeeded` |
| ICMP ping | ❌ FAILED | Carrier NAT blocks ICMP |
| TCP TX (Stop/Inventory commands) | ✅ SUCCESS | Antenna stops beeping when `0x23` sent |
| TCP RX (responses) | ❌ FAILED | Carrier asymmetric NAT — response never returns |
| UDP broadcast RX | ❌ FAILED | Antenna doesn't broadcast UDP to MacBook |
| Windows VM → antenna | ❌ FAILED | Windows also behind carrier NAT (same network) |
| C# app Read/Write | ⚠️ PARTIAL | App detects tag (beep), no data via network |

### Root Cause: Carrier NAT Asymmetric Routing
- All traffic to `192.168.0.x` routes through Huawei router → Carrier cellular network
- TCP connection establishes (SYN reaches antenna)
- Antenna sends response but carrier NAT doesn't forward back to MacBook
- **Antenna firmware is functional** (stops beeping on `0x23` command) but network responses blocked by carrier

### Bugs Fixed in Edge Gateway

#### BUG #1 — KRITIS: `buildWriteTagFrame` paramLength SALAH
- **File:** `bags-edge-gateway/server.js`
- **Bug:** `paramLength = 2 + tlvLen = 18` → antenna reject frame
- **Fix:** `paramLength = 2 + tlvLen` (14 for wordLen=2) — matches SDK C#
- **Verified:** Against SDK C# `WriteTag()` source: `cmdBuff[7] = (byte)(pos - 8)` = paramLength

#### BUG #2 — KRITIS: TCP `error` event tidak cleanup + reconnect
- **File:** `bags-edge-gateway/server.js`
- **Bug:** Empty error handler — pending operations not cleared, no reconnect
- **Fix:** Added `onAntennaDisconnect()` + `reconnectTimer` in error handler

#### BUG #3: Inconsistent Socket.io event pattern (server vs UI)
- **File:** `bags-edge-gateway/server.js` + `UHFCylinderRfidLogCard.tsx`
- **Bug:** `read_tag_memory` + `query_device_info` used Socket.io callbacks (v3 ack pattern) — not compatible with Socket.io v4
- **Fix:** Changed to pure event-based `io.emit()` on server, `socket.on()` listeners in UI

#### BUG #4: No Socket.io payload validation
- **File:** `bags-edge-gateway/server.js`
- **Bug:** No validation on `write_tag` / `read_tag_memory` payloads
- **Fix:** Added null check, type check, hex character filter, range validation

#### BUG #5: debounceCache memory leak
- **File:** `bags-edge-gateway/server.js`
- **Bug:** `Map` entries never cleaned — grows unbounded
- **Fix:** Added `setInterval` (15s) cleanup for stale entries

#### BUG #6: Buffer overflow in TLV parsing
- **File:** `bags-edge-gateway/server.js`
- **Bug:** No bounds check before reading `params[offset + 1]` — crash on malformed frames
- **Fix:** Added `if (offset + 2 > params.length) break;` in all TLV while-loops

### New Feature: Simulator Mode
- **File:** `bags-edge-gateway/server.js` + `UHFCylinderRfidLogCard.tsx`
- **Purpose:** Test full stack without real antenna network connectivity
- **Usage:** `ENABLE_SIMULATOR=true node server.js` (auto-starts) OR toggle via UI button "Sim"
- **UI Button:** Cyan "Sim" button in scanner card → emits fake RFID frames every 6s
- **Events:** `start_simulator`, `stop_simulator`, `simulator_status` (WebSocket)

### Frame Format Verification (vs SDK C# Reference)
| Command | SDK C# | Node.js | Status |
|---------|--------|---------|--------|
| `buildSimpleCommandFrame(0x22)` | 7 bytes | 7 bytes | ✅ |
| `buildReadTagFrame()` | paramLength=10 | paramLength=10, 19 bytes | ✅ |
| `buildWriteTagFrame(wordLen=2)` | paramLength=14 | paramLength=14, 23 bytes | ✅ Fixed (was 18) |
| Checksum algorithm | `~sum + 1` | `(~sum + 1) & 0xFF` | ✅ |

### Socket.io Events (All Verified)
| Event | Server Emits | UI Listens |
|-------|-------------|-----------|
| `antenna_status` | ✅ | ✅ |
| `cng_cylinder_scanned` | ✅ | ✅ |
| `wristband_scanned` | ✅ | ✅ |
| `write_result` | ✅ | ✅ |
| `tag_written_success` | ✅ | ✅ |
| `read_result` | ✅ | ✅ |
| `device_info_result` | ✅ | ✅ |
| `simulator_status` | ✅ | ✅ |

### Full Stack Verified Working
- ✅ Edge gateway connects to antenna IP
- ✅ Frame parser decodes RFID frames (EPC + RSSI) correctly
- ✅ WebSocket events emit to all clients
- ✅ UI renders tag data from events
- ✅ Simulator injects fake data → portal shows 17 detected, 4 valid
- ✅ Write/Read/Info buttons emit commands

### Remaining Issues

#### 🔴 CRITICAL: Antenna Network Response Blocked
Antenna reachable via TCP (can send commands, antenna stops beeping) but **cannot receive responses** due to carrier asymmetric NAT. Commands arrive but response packets don't return to MacBook.

**Solutions (in order of effort):**
1. **Deploy gateway to carrier-connected device** — Run edge gateway on a device WITHIN the carrier network (e.g., a Raspberry Pi behind the same Huawei router, or the Windows VM with direct Ethernet to antenna)
2. **USB Ethernet direct connection** — Connect antenna directly to MacBook via USB-to-Ethernet adapter, bypassing carrier NAT
3. **WiFi direct** — If antenna supports WiFi AP mode, connect MacBook directly to antenna's WiFi
4. **TCP Server mode** — Antenna acts as TCP client, connects to a reachable server (complex)
5. **Change antenna IP** — If antenna is connected to a local switch/router on `192.168.100.x`, change antenna to same subnet (needs physical access to antenna config)

#### 🟡 MEDIUM: `rfid_tags` Supabase Table
Table not yet created. Needed to replace hardcoded EPC prefix logic (`epc.startsWith('A')` etc.) with real database lookup for cylinder metadata (weight, hydrotest date, fill status).

#### 🟡 MEDIUM: Supabase RLS Migrations
Local SQL migration files for Row-Level Security policies not yet version-controlled. Required for production security.

---

## Edge Gateway Commands
```bash
cd ~/Documents/BagsEcosystem/bags-edge-gateway

# Kill existing
lsof -ti :4001 | xargs kill -9

# TCP mode (connect to antenna at ANTENNA_IP:ANTENNA_PORT)
ANTENNA_IP=192.168.0.7 ANTENNA_PORT=12345 node server.js

# UDP mode (listen for broadcasts, send commands via UDP)
ANTENNA_IP=192.168.0.7 ANTENNA_PORT=12345 UDP_MODE=true node server.js

# With simulator (fake RFID frames every 6s — no antenna needed)
ENABLE_SIMULATOR=true node server.js
```

---

## App Stack
- **Next.js 15.5.18 + React 19.0.3 + TypeScript 5**
- **Tailwind CSS 3.4.6** + `tailwindcss-animate`
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) — auth + Postgres
- **recharts** — charts
- **lucide-react** + `@heroicons/react` — icons
- **socket.io-client** — WebSocket (RFID scanner, optional)
- **sonner** — toasts

---

## Architecture

### Supabase Clients
| File | Purpose | RLS |
|---|---|---|
| `supabaseClient.ts` | anon-key, safe for client components | Enforced |
| `supabaseBrowser.ts` | browser SSR factory | Enforced |
| `supabaseServer.ts` | **service role**, bypass RLS | **Bypassed** |
| `supabaseSSR.ts` | middleware + server components | Enforced |

### Shared Types
- `src/types/dispatch.ts` — `DispatchItem` interface
- `src/app/portal/*/_integration/types.ts` — per-portal types

### Server Actions Pattern
```ts
'use server';
import { createSupabaseServerClient } from '@/lib/supabaseSSR';

export async function getSomething() {
  const supabase = await createSupabaseServerClient(); // MUST await
  const { data, error } = await supabase.from('table').select('*');
  return { data: data ?? [], error: error?.message ?? null }; // always default to []
}
```

### Auth Flow (Dummy Mode)
Login API at `src/app/api/auth/login/route.ts` supports dummy mode for demo:
- Email matching logic assigns roles (e.g., `stasiun@` → `station_operator`)
- Sets `dummy_role` httpOnly cookie
- Middleware checks `dummyRoleCookie || session.user.app_metadata.role`

---

## The 11 Portals

| Slug | Purpose | Role |
|---|---|---|
| `/portal/stasiun` | Mother Station SCADA (ATEX Zone 1) | `station_operator` |
| `/portal/skid` | B2B Industrial Custody Transfer | `skid_operator` |
| `/portal/armada` | GPS Fleet Dispatch | `fleet_manager` |
| `/portal/legal` | Contracts, SLAs, MIGAS permits | `legal_officer` |
| `/portal/keuangan` | Invoicing + DJP E-Faktur | `finance_controller` |
| `/portal/hr` | Personnel, payroll + SIO ATEX | `hr_manager` |
| `/portal/pemasaran` | Commercial CRM + AE pipeline | `marketing_ae` |
| `/portal/industrial` | Executive BI dashboard | `industrial_director` |
| `/portal/horeca` | B2B Commercial CNG management | `horeca_sales` |
| `/portal/pelanggan` | B2C Customer App (mobile PWA-style) | `customer` |
| `/portal/pwa` | Driver App | `fleet_driver` |

---

## Demo Accounts

| Email | Role | Portal |
|---|---|---|
| `admin@baskara.id` | Super Admin | `/` |
| `stasiun@baskara.id` | Station Operator | `/portal/stasiun` |
| `skid@baskara.id` | Skid Lead | `/portal/skid` |
| `armada@baskara.id` | Fleet Manager | `/portal/armada` |
| `keuangan@baskara.id` | CFO / Finance | `/portal/keuangan` |
| `hr@baskara.id` | HR Manager | `/portal/hr` |
| `legal@baskara.id` | Legal Officer | `/portal/legal` |
| `pemasaran@baskara.id` | Marketing Head | `/portal/pemasaran` |
| `industrial@baskara.id` | B2B Director | `/portal/industrial` |
| `horeca@baskara.id` | B2B Sales | `/portal/horeca` |
| `pelanggan@baskara.id` | B2C Customer | `/portal/pelanggan` |
| `driver@baskara.id` | Driver | `/portal/pwa` |

Password for all: `BaGS@2026!`

---

## Code Review Checklist
- [ ] `createSupabaseServerClient()` always `await`ed
- [ ] Server action returns `data ?? []` to prevent null crashes
- [ ] `revalidatePath()` after every INSERT/UPDATE/DELETE
- [ ] recharts only in `'use client'` or wrapped with `dynamic(..., { ssr: false })`
- [ ] No import from API routes in client components — use `src/types/` instead
- [ ] No `useState(null)` without default — always `useState<T[]>([])` or default to `[]`
- [ ] `npm run build` exits 0 errors before pushing

---

## Running Locally
```bash
cd ~/Documents/BagsEcosystem
npm run dev          # all workspaces
cd Ecosystem && npm run dev  # primary app only
```
