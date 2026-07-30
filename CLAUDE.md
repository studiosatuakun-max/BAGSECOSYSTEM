# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository: BASKARA CNG Ecosystem

Monorepo for an **Advanced Gold Benchmark Operational & Custody Transfer Management System** for PT Baskara Asri Ghas — a CNG (Compressed Natural Gas) operator. The system integrates MIGAS Niaga Bumi safety standards, Metrology, ATEX Zone 1 hardware, and SCADA Mother Station telemetry. All documentation is in Indonesian (Bahasa Indonesia) with English technical terms.

The active application lives in **`Ecosystem/`**. The other top-level workspaces (Armada, Driver, Finance, HR, Horeca, Legal, Marketing, Operations, SkidPortal) are listed in the root `package.json` workspaces but are no longer the primary dev targets — recent work has consolidated into `Ecosystem/`.

## Common Commands

Run from the **repo root** unless noted otherwise.

```bash
# Install all workspaces (root + per-workspace)
npm install

# Run ALL workspaces concurrently (root) — the "dev everything" entrypoint
npm run dev

# Run only the primary Ecosystem app on port 3000
cd Ecosystem && npm run dev

# Production build (entire workspace set)
npm run build
cd Ecosystem && npm run build      # build just the primary app

# Lint / format (Ecosystem workspace)
cd Ecosystem && npm run lint
cd Ecosystem && npm run lint:fix
cd Ecosystem && npm run format
cd Ecosystem && npm run type-check
```

The `Ecosystem/package.json` declares a `rocketCritical` field that warns against removing Next.js / React / Tailwind / recharts / TypeScript dependencies or their scripts — the project is pinned to **Next.js 15.5.18 + React 19.0.3 + Tailwind 3.4.6 + TypeScript 5** and validated against this exact stack.

## High-Level Architecture

### Tech stack
- **Next.js 15 App Router** (TypeScript, strict) — single primary app in `Ecosystem/`
- **Tailwind CSS** + `tailwindcss-animate` + `tailwindcss/forms` + `tailwindcss/typography`
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for auth + Postgres
- **recharts** for charts, **sonner** for toasts, **react-hook-form** + **zod** for forms/validation
- **lucide-react** + `@heroicons/react` for icons
- **@serwist/next** for PWA precaching (Driver app)
- **concurrently** at root to run all workspaces in parallel
- Deployed to **Netlify** (`@netlify/plugin-nextjs`)

### Top-level layout
```
Ecosystem/
├── src/
│   ├── middleware.ts                # Edge RBAC guard (see below)
│   ├── app/
│   │   ├── page.tsx                 # Login page (BASKARA Gold Benchmark UI)
│   │   ├── layout.tsx               # Root layout (favicon, metadata)
│   │   ├── dashboard/               # Shared role-agnostic dashboard
│   │   ├── portal/                  # 11 role-gated portals (see list below)
│   │   ├── api/
│   │   │   ├── auth/{login,logout}/ # Supabase session via httpOnly cookies
│   │   │   └── inbox/{dispatches,files}/
│   │   └── unauthorized/            # RBAC denial landing
│   ├── components/                  # Header, Footer, PortalHeader, ui/
│   ├── data/                        # mockData.ts (per-portal seeds)
│   └── lib/                         # supabaseClient/Server/SSR/Browser helpers
└── supabase/migrations/             # SQL migrations incl. RLS enablement
```

### The 11 portals under `/portal/*`
Each portal lives at `src/app/portal/<slug>/page.tsx` plus a sibling `_integration/` folder holding module-specific `PROGRESS.md` plus local `components/` and `data/` directories.

| Slug | Purpose |
|---|---|
| `/portal/stasiun` | Mother Station SCADA console (compression, ATEX Zone 1) |
| `/portal/skid` | B2B Industrial Custody Transfer, 250 Bar manifold |
| `/portal/armada` | GPS Fleet Dispatch, prime movers, hazard tracking |
| `/portal/legal` | Contracts, SLAs, MIGAS permits |
| `/portal/keuangan` | Invoicing + DJP E-Faktur (Corporate Treasury) |
| `/portal/hr` | Personnel, organization, payroll + SIO ATEX tracking |
| `/portal/pemasaran` | Commercial CRM + AE pipeline |
| `/portal/industrial` | Executive BI dashboard (B2B, `/portal/direksi-b2b` was renamed here) |
| `/portal/horeca` | Commercial / B2C gas (formerly `/portal/direksi-b2c`) |
| `/portal/pelanggan` | Customer App |
| `/portal/pwa` | Driver App |

### Request lifecycle: Auth + RBAC
1. **`src/middleware.ts`** runs on every non-static request (Vercel Edge). It sets baseline security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `HSTS`), then delegates to `createSupabaseMiddlewareClient` to read/refresh the session cookie.
2. **Public routes** (`/`, `/login`, `/unauthorized`, `/api/auth/*`) bypass auth.
3. **Protected prefixes** (`/portal/*`, `/dashboard`) require a session. The role comes from `session.user.app_metadata.role`.
4. **`ROLE_PERMISSIONS`** in `middleware.ts` maps role → allowed route prefixes. Mismatches redirect to `/unauthorized?attempted=…&role=…` with the attempted path recorded.
5. Login is a POST to `/api/auth/login` (Zod-validated, sets httpOnly cookies). Demo accounts on the login page include `admin@baskara.id / fleet@baskara.id / finance@baskara.id / hr@baskara.id` (password `password123`).

### Supabase client variants (`src/lib/`)
- `supabaseClient.ts` — anon-key client (safe for client components)
- `supabaseBrowser.ts` — browser-side `createBrowserClient` (SSR cookie integration)
- `supabaseServer.ts` — server components / server actions / route handlers
- `supabaseSSR.ts` — middleware-only factory `createSupabaseMiddlewareClient(req, res)`

Use **server** for any code path that needs to bypass RLS with a service role; **never** put `service_role` in `NEXT_PUBLIC_*` env vars or client bundles.

### Inter-division Inbox (`/api/inbox/*`)
An enterprise memo/dispatch system (`InboxWidget` + `InboxDrawer` UI) backed by:
- `POST/GET /api/inbox/dispatches` — Zod-validated create + list, priority `Normal|High|Urgent`, status `Unread|Read|In Review|Resolved`, attachments up to 25 MB / 5 per dispatch. HTML is stripped from `subject`/`content` against XSS.
- `/api/inbox/files` — file upload/listing for attachments.
Fallback mock dispatches are inlined in the route so the demo works without Supabase configured.

### UI / UX conventions ("BASKARA Gold Benchmark")
- **Deep Dark Acrylic Gradients**, frosted glassmorphism (`backdrop-blur-md/xl`), responsive 2:1 bento grid ratios, interactive micro-animations.
- Standard page container: `max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full`.
- Full **dark-mode** support: every bento card uses `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`.
- All table cells and status badges use `whitespace-nowrap shrink-0 align-middle` ("1-line slim badge rule").
- Use `<PortalHeader />` (shared `src/components/PortalHeader.tsx`) — sticky, translucent blur, with bottom 2px accent gradient. Inbox notification bell lives in this topbar, not floating.
- **No redundant attribution lines directly above `<Footer />`.** Footer text is the corporate telemetry footer `© 2026 PT Baskara Asri Ghas | 🟢 SECURE ENVIRONMENT • REAL-TIME TELEMETRY | Privacy • Terms • Support`.
- Icons go through the shared `AppIcon` (`src/components/ui/AppIcon.tsx`) — lucide / heroicons name strings.

## Mandatory Security Rules (from `.agents/AGENTS.md`)

These are non-negotiable project-wide constraints:

1. **No client-side secrets.** Never put `service_role` keys or private tokens in React components or `NEXT_PUBLIC_*` env vars.
2. **Validate every API route / server action** with Zod (or equivalent) before processing.
3. **Supabase RLS is mandatory.** Every new SQL table must `ALTER TABLE … ENABLE ROW LEVEL SECURITY;` and define role-based policies.
4. **Telemetry integrity.** Any SCADA / Mother Station (250 Bar CNG manifold), Custody Transfer E-Faktur billing, or fleet GPS ingestion must enforce type safety and boundary validation.
5. For security audits / vulnerability scans / code reviews / DevSecOps hardening, activate the **`security-auditor`** skill at `.agents/skills/security-auditor/SKILL.md`. It defines the 4-step audit methodology (recon → OWASP/MIGAS mapping → severity report → remediation) and references `.agents/skills/security-auditor/scripts/scan_security.sh` and `.agents/skills/security-auditor/references/owasp_nextjs_supabase.md`.

## Working Effectively Here

- **Start dev from `Ecosystem/`.** All primary portals and APIs live there. Running `npm run dev` from the root fires every workspace concurrently — useful for end-to-end smoke but noisy.
- **Search by domain, not by file.** When looking for portal behavior, prefer `Ecosystem/src/app/portal/<slug>/page.tsx` + its sibling `components/` and `_integration/`. Per-portal changelog is in `<slug>/_integration/PROGRESS.md`; an executive overview is at `docs/Progress.md`.
- **Before changing portal UI**, skim the matching `PROGRESS.md` — they record the "Gold Benchmark" styling, accent colors (e.g. emerald/cyan for `/portal/stasiun`, amber/gold for `/portal/horeca`, indigo/blue for `/portal/industrial`, gold/emerald for `/portal/keuangan`), and which components are intended to live in the bento grid. Removing or orphaning them is a regression.
- **Adding a new portal?** Mirror the layout of an existing one: `page.tsx` + `_integration/PROGRESS.md` + `components/` + `data/`. Add the slug to both `ROLE_PERMISSIONS` in `middleware.ts` and any role navigation that should see it.
- **Adding a new Supabase table?** Migration goes under `Ecosystem/supabase/migrations/` (follow the existing `YYYYMMDD_enable_rls_and_policies.sql` naming); RLS is required, not optional.
- **Build verification**: `cd Ecosystem && npm run build` should exit clean before merging. Recent builds finish in ~9–11s with no errors.

## Reference docs worth knowing
- `README.md` — repo overview, portal list, dev quickstart
- `docs/Progress.md` — executive changelog (per-portal Gold Benchmark upgrades)
- `docs/SECURITY_AUDITOR_ROLE.md` — security auditor SOP
- `docs/SECURITY_AUDIT_REPORT.md` — current vulnerability audit findings
- `docs/Sec_Update.md` — daily DevSecOps hardening log
- `docs/Stasiun_SCADA_Architecture.md` — Mother Station SCADA architecture
- `.agents/AGENTS.md` — agent security/architecture constraints (quoted above)
- `.agents/skills/security-auditor/SKILL.md` — BASKARA-SEC role definition