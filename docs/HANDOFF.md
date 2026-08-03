# Agent Handoff — Session 2026-08-04

## Deployment
**Vercel via GitHub Auto-Webhook.** Setelah commit, push ke `main`:
```bash
git add -A && git commit -m "message" && git push origin main
```
Vercel auto-deploy ~2-3 menit. Monitor: https://vercel.com/dashboard

---

## Bugs Fixed / New Features This Session

### 1. IoT: CT-i607 UHF RFID Integration — Edge Gateway + Dashboard

#### Problem Summary
TCP connection to antenna succeeds (`Connection to 192.168.1.200 port 4000 succeeded!`) but antenna never sends response frames. Commands sent correctly (7-byte protocol verified against SDK C#), but zero RX data.

#### Root Cause (Suspected)
Antenna firmware still in **RS232 mode** (factory default). TCP port 4000 accepts connections but is a management/config port, not the RFID command channel. RFID commands must go through:
- Serial RS232, OR
- TCP mode must be enabled via C# Demo App on Windows

#### SDK Findings (`CT-I607-SDK/C#`)
- **SDK Demo Config** (`download_ini.ini`): `interface=0` (RS232), `net_protocol=0` — confirms factory default is serial
- SDK C# sends **7-byte frames** for no-payload commands (RF + 0x00 + 0x00 + frameCode + checksum) — NOT 8 bytes
- SDK C# sends **9+ bytes** for TLV-payload commands (includes paramLength fields)
- Supported modes: RS232, RS485, Wiegand, UDP, TCP Client, TCP Server

#### What Was Fixed (Software Side)

| Fix | File | Status |
|-----|------|--------|
| Socket.io ack callback → event-based `write_result` | `server.js`, `UHFCylinderRfidLogCard.tsx` | ✅ Done |
| Frame format: 7-byte for no-payload commands | `server.js` | ✅ Done |
| Auto-fill hex from Read → Write modal | `UHFCylinderRfidLogCard.tsx` | ✅ Done |
| Write spinner + "Do not move tag" warning | `UHFCylinderRfidLogCard.tsx` | ✅ Done |
| Disable Cancel during write | `UHFCylinderRfidLogCard.tsx` | ✅ Done |
| TCP Keep-Alive disabled (CT-i607 crashes on empty ACK probes) | `server.js` | ✅ Done |
| `setNoDelay(true)` (disable Nagle buffering) | `server.js` | ✅ Done |
| Response-gated polling (send next 0x22 only after RX + 300ms) | `server.js` | ✅ Done |
| 30s idle watchdog (force reconnect on silent antenna) | `server.js` | ✅ Done |
| `createNewClient()` factory (fix socket reuse after destroy) | `server.js` | ✅ Done |
| 2s reconnect delay (reduced from 5s) | `server.js` | ✅ Done |
| `antenna_status` broadcast to all WS clients | `server.js` | ✅ Done |
| `write_tag` → `write_result` event (not Socket.io ack) | `server.js` | ✅ Done |
| `query_device_info` (0x40) WebSocket handler | `server.js` + UI | ✅ Done |
| `read_tag_memory` (0x31) WebSocket handler | `server.js` + UI | ✅ Done |
| `tag_written_success` event listener in UI | `UHFCylinderRfidLogCard.tsx` | ✅ Done |
| Write button disabled when antenna offline | `UHFCylinderRfidLogCard.tsx` | ✅ Done |
| SocketProvider singleton (fix multiple WS connections) | `SocketProvider.tsx`, `useSocket.ts`, `layout.tsx` | ✅ Done |
| Auto-fill Write hex from Read result | `UHFCylinderRfidLogCard.tsx` | ✅ Done |
| UDP mode as fallback (`UDP_MODE=true`) | `server.js` | ✅ Done |

#### What Remains (Hardware/Windows Required)

| Task | Priority | Notes |
|------|---------|-------|
| Configure antenna TCP mode via C# app | 🔴 CRITICAL | Windows VM being set up (Parallels Desktop) |
| Physical tag test with Windows C# Demo | 🔴 CRITICAL | Verify antenna works at all |
| `rfid_tags` Supabase table | 🟡 MEDIUM | Table not yet created, code has `TODO` comment |
| Replace hardcoded EPC prefix logic with Supabase lookup | 🟡 MEDIUM | Needs `rfid_tags` table |

#### Next Step (Windows VM)
1. Install Windows on Parallels Desktop
2. Copy `CT-I607-SDK/CPH Demo 2023 en version/RfidReader_EN_V1.1.5.exe` to VM
3. Select **RJ45** tab (NOT Serial Port)
4. Set IP: `192.168.1.200`, Port: `4000`
5. Test Read/Write from C# app
6. If C# app works → configure antenna TCP mode → return to MacBook edge gateway
7. If C# app also times out → antenna hardware/firmware issue

#### Edge Gateway Commands
```bash
# Kill existing
lsof -ti :4001 | xargs kill -9

# TCP mode (default)
node server.js

# UDP mode (fallback)
UDP_MODE=true node server.js
```

#### Network Topology
```
MacBook (WiFi: 192.168.100.50) ←→ Huawei Router ←→ Antenna CT-i607 (192.168.1.200:4000)
```

---

## Bugs Fixed / New Features This Session

### 2. Finance: PDF Auto-Generator & Storage Bucket (Phase 4.5)
- **PDF Generator**: Diimplementasikan menggunakan pendekatan `/print/[type]/[id]` page dengan CSS `@media print` dan `window.print()` di `useEffect` (Zero heavy libraries seperti jsPDF/html2pdf).
- **Storage Bucket**: Terintegrasi `finance-efaktur` Supabase storage bucket via browser client dengan limit file size maks 5MB. URL hasil upload dihubungkan ke field `efaktur_url` di tabel database.
- **Opex System**: Penambahan CRUD `operating_expenses` untuk memisahkan pengeluaran dari pendapatan kas.
- **Cross-Module Automation**: Server actions di `keuangan/actions.ts` sudah siap dieksekusi (dipanggil) oleh agen-agen yang bekerja di modul Skid/Armada.

### 3. Finance: Clipped Modal Bug Fix (Hotfix)
**Root Cause:** Komponen `IssueInvoiceModal` dan `AddExpenseModal` ter-render di dalam card wrapper yang memiliki class `overflow-hidden`, menyebabkan modal terpotong dan tidak *full-screen*.
**Fix:** Membungkus return dari `InvoiceTableCard` dan `CashFlowChartCard` dengan `<React.Fragment>` (`<>`) dan mengeluarkan komponen modal ke luar blok div yang *overflowing*. Class modal menggunakan `fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm`.

### 4. Client-Side Crash on `/portal/stasiun` and `/portal/skid`
**Root Cause:** Server Component passed `data: null` from Supabase (RLS blocks dummy cookie auth) to `MasterFuelingTableCard`. Component did `useState(null)`, then `.filter()` crashed.
**Fix:** Always default to `[]` when Supabase returns null:
```ts
// After (safe)
records = (result.data ?? []) as unknown as MasterFuelingRecord[];
```
Applied to: `stasiun/page.tsx`, `skid/page.tsx`, `horeca/page.tsx`, `industrial/page.tsx`

### 5. Import DispatchItem dari API Route
**Root Cause:** `InboxDrawer.tsx` (client component) imported `DispatchItem` from `@/app/api/inbox/dispatches/route` — cross-boundary import causes runtime crash.
**Fix:** Extracted to `src/types/dispatch.ts`, updated both files.

### 6. B2C URL Conflict + Duplicate Login Cards
**Root Cause:** B2B Customer + Skid Lead both used `skid@baskara.id` → same portal.
**Fix:**
- B2B Customer → `pelanggan@baskara.id` → `/portal/pelanggan` (B2C mobile app)
- Skid Lead → `skid@baskara.id` → `/portal/skid` (B2B industrial)
- Added `pelanggan` email → `customer` role mapping in login route
- Added `customer` role to middleware RBAC

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
