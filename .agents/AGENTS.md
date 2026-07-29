# BASKARA CNG Ecosystem — AI Agent Security & Architecture Constraints

These project-scoped rules apply to all AI agents working on the BASKARA CNG Ecosystem repository (`/Users/mac/Documents/BagsEcosystem`).

## 🛡️ 1. Mandatory Cybersecurity & DevSecOps Rules
When generating or modifying source code, all agents MUST adhere to the following DevSecOps principles:
- **Zero Client-Side Secret Exposure**: Never place sensitive secrets, backend service keys (e.g., Supabase `service_role`), or private API tokens in client-side React components or variables starting with `NEXT_PUBLIC_`.
- **Strict Input Validation**: Whenever creating new API routes (`app/api/.../route.ts`) or server actions, implement schema validation (e.g., Zod) to prevent injection and malformed payload attacks.
- **Supabase Row-Level Security (RLS)**: Whenever creating new SQL tables in Supabase, you MUST explicitly enable RLS (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`) and write granular, role-based access policies. Never leave tables public.
- **SCADA & Telemetry Integrity**: Any telemetry simulation or ingestion for Mother Station manifold pressure (250 Bar CNG), Custody Transfer E-Faktur billing, or fleet GPS tracking must enforce strict type safety and boundary validation.

## 👑 2. UI/UX Gold Benchmark Aesthetics
- Maintain the **BASKARA Gold Benchmark** across all 8 modular portals (`/portal/legal`, `/portal/pemasaran`, `/portal/keuangan`, `/portal/hr`, `/portal/armada`, `/portal/skid`, `/portal/direksi` B2B/B2C, `/portal/stasiun`, `/portal/industrial`, `/portal/horeca`, `/portal/pwa`).
- Use **Deep Dark Acrylic Gradients**, frosted glassmorphism (`backdrop-blur-md`), responsive 2:1 bento grid ratios, and interactive micro-animations.
- Enforce full screen container width: `max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full`.
- **Clean Footer Rule**: Never add redundant attribution text lines right above `<Footer />`.

## 🤖 3. Specialized Role Activation
When the user asks for security audits, vulnerability scanning, code reviews, or DevSecOps hardening, activate the **`security-auditor`** skill located at `.agents/skills/security-auditor/SKILL.md` and execute its 4-step audit methodology.
