# Agent Handoff — Session 2026-07-31

## Deployment
**Vercel via GitHub Auto-Webhook.** Setelah commit, push ke `main`:
```bash
git add -A && git commit -m "message" && git push origin main
```
Vercel auto-deploy ~2-3 menit. Monitor: https://vercel.com/dashboard

---

## Bugs Fixed This Session

### 1. Client-Side Crash on `/portal/stasiun` and `/portal/skid`
**Root Cause:** Server Component passed `data: null` from Supabase (RLS blocks dummy cookie auth) to `MasterFuelingTableCard`. Component did `useState(null)`, then `.filter()` crashed.

**Fix:** Always default to `[]` when Supabase returns null:
```ts
// Before (crash)
records = result.data as unknown as MasterFuelingRecord[];
// After (safe)
records = (result.data ?? []) as unknown as MasterFuelingRecord[];
```
Applied to: `stasiun/page.tsx`, `skid/page.tsx`, `horeca/page.tsx`, `industrial/page.tsx`

### 2. Import DispatchItem dari API Route
**Root Cause:** `InboxDrawer.tsx` (client component) imported `DispatchItem` from `@/app/api/inbox/dispatches/route` — cross-boundary import causes runtime crash.

**Fix:** Extracted to `src/types/dispatch.ts`, updated both files.

### 3. B2C URL Conflict + Duplicate Login Cards
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
