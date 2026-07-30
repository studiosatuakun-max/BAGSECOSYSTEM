# Agent Handoff — Session 2026-07-30

## Deployment Method (IMPORTANT — READ FIRST)
**We do NOT use Vercel CLI.** The app is connected to GitHub via Auto-Webhook Vercel.
- After every commit, run: `git add -A && git commit -m "message" && git push origin main`
- Vercel auto-deploys within ~2-3 minutes. Monitor at https://vercel.com/dashboard

---

## 1. Bug: Client-Side Exception on `/portal/stasiun` and `/portal/skid`

**Error:**
```
Application error: a client-side exception has occurred while loading bagsecosystem.vercel.app
(see the browser console for more information)
```

**Affected URLs:**
- https://bagsecosystem.vercel.app/portal/stasiun
- https://bagsecosystem.vercel.app/portal/skid

**What to check:**
1. Open browser DevTools console on those pages to get the full stack trace
2. Likely culprits after Phase 4B migration:
   - Components still importing from deleted mock data files (`mockStasiunData.ts`, `mockSkidData.ts` — already deleted and committed, but Vercel might be serving stale build)
   - `createSupabaseServerClient()` being called without `await` in some code path
   - recharts SSR hydration mismatch (even though they're in `'use client'` wrappers, check if any server component is passing a class/function to a client component)
   - Missing or mismatched type props being passed from server page → client components
3. Run `npm run build` locally first — it was passing 0 errors before this push, so verify nothing broke

**Fix approach:**
- Read the actual console error first
- Check `stasiun/components/` and `skid/components/` for any remaining mock imports
- Check if any component is dynamically importing something incorrectly
- If build passes locally, the Vercel deploy might just need to rebuild (force a new deploy)

---

## 2. Fix: B2C Customer App URL Conflict

**Problem:** Both "B2B Sales (Horeca Portal)" and "B2C Customer App" nav links point to `/portal/horeca`. They should be different.

**Current nav structure (suspected):**
- `/portal/horeca` = B2B Sales Horeca Portal (Commercial CNG Cradle Cascade management)
- B2C Customer App link also points to `/portal/horeca` (WRONG)

**What B2C Customer App should be:**
- A customer-facing web app with **app-like appearance** (PWA feel, mobile-first, bottom nav bar, card-based UI, clean and simple)
- Looks like a mobile app opened in browser
- Features: order tracking, scan QR, account info, push notification opt-in
- NOT the same as the internal Horeca B2B console

**Action items:**
1. Find where the nav links are defined — likely in `PrimaryPortalsSection.tsx` or similar
2. Create a new portal at `/portal/pelanggan` (already exists as static, but may be placeholder) OR use `/portal/customer`
3. Check what currently lives at `/portal/pelanggan` — it may be the correct B2C app already
4. Update nav so:
   - `/portal/horeca` = B2B Sales (internal Horeca management console)
   - `/portal/pelanggan` = B2C Customer App (customer-facing, app-like UI)
5. Make `/portal/pelanggan` look like a real mobile app (modern PWA-style, not the same B2B executive console look)

**B2C Customer App features to implement (if it doesn't exist):**
- Bottom navigation bar (Home, Orders, Scan, Account)
- Clean card-based order list
- Simple status badges (Menunggu, Diproses, Dikirim, Selesai)
- Mobile-first CSS (max-width on desktop, centered)

---

## 3. Phase 4B Migration Summary (Completed 2026-07-30)

All 9 portals migrated from mock data to Supabase using:
- Async Server Components (page.tsx)
- `'use server'` Server Actions in `_integration/actions.ts`
- `'use client'` wrappers for recharts charts
- `createSupabaseServerClient()` (async, must await)
- `revalidatePath()` after all mutations

**Portals migrated:** stasiun, skid, industrial, horeca (this session) + stasiun, industrial, horeca, armada, hr, keuangan, legal, pemasaran (full Phase 4B)

**Deleted mock files:**
- `Ecosystem/src/data/mockData.ts`
- `Ecosystem/src/app/portal/armada/data/mockArmadaData.ts`
- `Ecosystem/src/app/portal/skid/data/mockSkidData.ts`
- `Ecosystem/src/app/portal/stasiun/data/mockStasiunData.ts`

**Server Actions pattern:**
```ts
// _integration/actions.ts
'use server';
import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

export async function getSomething() {
  const supabase = await createSupabaseServerClient(); // MUST await
  const { data, error } = await supabase.from('table').select('*');
  return { data, error: error?.message ?? null };
}
```

---

## 4. App Stack (Reference)

- **Next.js 15.5.18 + React 19.0.3 + TypeScript 5**
- **Tailwind CSS 3.4.6** + `tailwindcss-animate`
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for auth + Postgres
- **recharts** for charts
- **lucide-react** + `@heroicons/react` for icons
- **sonner** for toasts
- **Deployed to Netlify** via `@netlify/plugin-nextjs` BUT also connected to **Vercel via GitHub Auto-Webhook**

---

## 5. Code Review Checklist Before Committing

- [ ] `createSupabaseServerClient()` is always `await`ed
- [ ] `revalidatePath('/portal/xxx')` after every INSERT/UPDATE/DELETE
- [ ] recharts only in `'use client'` components
- [ ] Server Components do NOT use `useState`, `useEffect`, `onClick` handlers directly
- [ ] No import from deleted mock files
- [ ] `npm run build` exits with 0 errors before pushing
- [ ] Test on browser after Vercel deploys

---

## 6. Running the App Locally

```bash
cd ~/Documents/BagsEcosystem
npm run dev          # run all workspaces
# OR
cd Ecosystem && npm run dev  # primary app only on port 3000
```
