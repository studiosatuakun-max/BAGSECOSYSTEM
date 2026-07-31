# Agent Handoff — Session 2026-07-31

## Deployment Method (IMPORTANT — READ FIRST)
**We do NOT use Vercel CLI.** The app is connected to GitHub via Auto-Webhook Vercel.
- After every commit, run: `git add -A && git commit -m "message" && git push origin main`
- Vercel auto-deploys within ~2-3 minutes. Monitor at https://vercel.com/dashboard

---

## 1. Bug: Client-Side Exception on `/portal/stasiun` and `/portal/skid` — ROOT CAUSE FOUND ✅ FIXED

**Error:** `Application error: a client-side exception has occurred while loading bagsecosystem.vercel.app`

**Root Cause:** `InboxDrawer.tsx` (a `'use client'` component used inside `PortalHeader.tsx`) was importing `DispatchItem` interface directly from the API route file:
```ts
// WRONG — cross-boundary import from API route
import { DispatchItem } from '@/app/api/inbox/dispatches/route';
```
Next.js does not support importing types/interfaces from API route files into client components — this causes runtime crashes.

**Fix Applied:**
1. Created `Ecosystem/src/types/dispatch.ts` with shared `DispatchItem` interface
2. Updated `InboxDrawer.tsx` → `import { DispatchItem } from '@/types/dispatch'`
3. API route now re-exports `DispatchItem` for backward compatibility

**Verification:** Build passes 0 errors. Commit `3b6e171` pushed.

---

## 2. Fix: B2C Customer App URL Conflict ✅ COMPLETED

**Problem:** B2C Customer App was pointing to `/portal/horeca` (B2B Horeca console).

**Changes Made:**
- Added `customer` role in `ROLE_DEFAULT_PORTAL` → `/portal/pelanggan`
- Added `customer` role to `ROLE_PERMISSIONS` in `middleware.ts`
- Fixed login dummy mode: `customer` emails get `customer` role, `horeca` emails get `horeca_sales` role
- Split demo accounts: B2B Customer (Skid) → `/portal/skid`, B2C Customer App → `/portal/pelanggan`

**Login behavior:**
- `customer@baskara.id` → `/portal/pelanggan` (mobile B2C app with bottom nav)
- `horeca@baskara.id` → `/portal/horeca` (B2B management console)
- `skid@baskara.id` → `/portal/skid` (industrial custody transfer)

---

## 3. App Stack (Reference)

- **Next.js 15.5.18 + React 19.0.3 + TypeScript 5**
- **Tailwind CSS 3.4.6** + `tailwindcss-animate`
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for auth + Postgres
- **recharts** for charts
- **lucide-react** + `@heroicons/react` for icons
- **socket.io-client** for WebSocket (RFID scanner, optional)
- **sonner** for toasts
- **Deployed to Vercel via GitHub Auto-Webhook**

---

## 4. Code Review Checklist Before Committing

- [ ] `createSupabaseServerClient()` is always `await`ed
- [ ] `revalidatePath('/portal/xxx')` after every INSERT/UPDATE/DELETE
- [ ] recharts only in `'use client'` components (or wrapped with `dynamic(..., { ssr: false })`)
- [ ] Server Components do NOT use `useState`, `useEffect`, `onClick` handlers directly
- [ ] No import from deleted mock files
- [ ] **No import from API route files in client components** — use shared types instead
- [ ] `npm run build` exits with 0 errors before pushing
- [ ] Test on browser after Vercel deploys

---

## 5. Key Architecture Notes

### Supabase Client Variants
- `supabaseClient.ts` — anon-key client (safe for client components, has dummy fallback for builds)
- `supabaseBrowser.ts` — browser-side `createBrowserClient`
- `supabaseServer.ts` — **service role bypass RLS** (never put in client bundles!)
- `supabaseSSR.ts` — middleware + server components factory

### Shared Types
- `src/types/dispatch.ts` — `DispatchItem` interface (import from here, NOT from API routes)

### The 11 portals under `/portal/*`
| Slug | Purpose |
|---|---|
| `/portal/stasiun` | Mother Station SCADA console |
| `/portal/skid` | B2B Industrial Custody Transfer |
| `/portal/armada` | GPS Fleet Dispatch |
| `/portal/legal` | Contracts, SLAs, MIGAS permits |
| `/portal/keuangan` | Invoicing + DJP E-Faktur |
| `/portal/hr` | Personnel, payroll + SIO ATEX tracking |
| `/portal/pemasaran` | Commercial CRM + AE pipeline |
| `/portal/industrial` | Executive BI dashboard |
| `/portal/horeca` | B2B Commercial CNG management |
| `/portal/pelanggan` | B2C Customer App (mobile PWA-style) |
| `/portal/pwa` | Driver App |

---

## 6. Running the App Locally

```bash
cd ~/Documents/BagsEcosystem
npm run dev          # run all workspaces
# OR
cd Ecosystem && npm run dev  # primary app only on port 3000
```
