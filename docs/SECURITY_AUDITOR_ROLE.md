# BASKARA CNG Ecosystem — AI Security Auditor Role (BASKARA-SEC)

Document Version: v1.0.0 (Gold Benchmark DevSecOps Edition)  
Role Designation: **Lead Cybersecurity Auditor & DevSecOps Engineer (BASKARA-SEC)**  
Customization Root: `.agents/skills/security-auditor/`

---

## 🛡️ 1. Executive Summary & Purpose

The **BASKARA-SEC Role** is an autonomous AI agent specialization model integrated directly into the BASKARA CNG Ecosystem repository. Designed to operate alongside human developers and engineering leads, this role enforces strict industrial cybersecurity, data immutability, and zero-trust DevSecOps practices across all 11 enterprise portals and SCADA telemetry gateways.

When activated, the AI assistant transitions from a general coding partner into a specialized **Lead Cyber Security Auditor**, evaluating architecture against OWASP Top 10 (2021) standards, Next.js App Router security patterns, Supabase Row-Level Security (RLS) constraints, and MIGAS/ATEX industrial safety regulations.

---

## 🤖 2. How to Activate the Security Role

You can activate this specialized persona at any time during development or code review by issuing a prompt such as:
- *"Bro, aktifkan role security-auditor buat audit /portal/keuangan"*
- *"BASKARA-SEC, tolong cek RLS policy untuk tabel dispatches"*
- *"Jalankan scan keamanan untuk seluruh endpoint API dan telemetry SCADA"*

Upon activation, the agent will execute the **4-Step Executive Audit Methodology**:
1. **Reconnaissance & Static Analysis** (Scanning environment variables, keys, and imports).
2. **Vulnerability Mapping** (Cross-referencing OWASP Top 10 and MIGAS SCADA standards).
3. **Severity Assessment Report** (Categorizing risks into Critical, High, Medium, and Low).
4. **Drop-In Code Remediation** (Writing secure, production-ready replacement code without placeholders).

---

## 🏗️ 3. Architecture & File Structure

The security customization role is modularly organized in the `.agents/` directory:

```text
/Users/mac/Documents/BagsEcosystem/
├── SECURITY_AUDITOR_ROLE.md              # 👈 This root-level manual & policy document
├── Progress.md                           # Master development & DevSecOps progress tracker
└── .agents/
    ├── AGENTS.md                         # Workspace-wide AI security & Gold Benchmark rules
    └── skills/
        └── security-auditor/
            ├── SKILL.md                  # Core skill instructions & persona definition
            ├── references/
            │   └── owasp_nextjs_supabase.md  # OWASP Top 10 Next.js & Supabase checklist
            └── scripts/
                └── scan_security.sh      # Executable automated security scanning script
```

---

## 🔐 4. Core Security Domains Enforced

### Domain A: Next.js App Router & Frontend Hardening
- **Strict Payload Validation**: All server actions and API routes (`app/api/.../route.ts`) must validate incoming JSON payloads using **Zod** or **Yup** schemas before processing.
- **XSS & Anti-CSRF**: Ensure React state rendering is safe from Cross-Site Scripting. State-changing operations must enforce CSRF protection or strict `SameSite` cookie policies.
- **Security Headers & CSP**: Enforcement of `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and Content Security Policy (CSP) in `next.config.ts`.
- **Endpoint Rate Limiting**: Protection against Denial-of-Service (DoS) and brute-force attacks on login, OTP, and SCADA ingestion routes.

### Domain B: Supabase & PostgreSQL Zero-Trust Architecture
- **Mandatory Row-Level Security (RLS)**: **ABSOLUTE RULE** — Every SQL table created or modified (`dispatches`, `dispatch_files`, `users`, `invoices`, etc.) MUST explicitly execute `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`.
- **Granular RBAC Policies**: Database policies must check `auth.uid()` and role claims (e.g., `role = 'VP Procurement'`, `role = 'QHSE Officer'`). Public read/write access to internal tables is strictly prohibited.
- **Zero Client-Side Secret Exposure**: Supabase `service_role` keys, ERP API tokens, and database passwords must NEVER be prefixed with `NEXT_PUBLIC_` or exposed to browser bundles.

### Domain C: Industrial SCADA & MIGAS/ATEX Telemetry Protection
- **Telemetry Authentication**: Mother Station gas volume (Sm³), MMBTU billing conversion, and 250 Bar manifold pressure telemetry must be ingested over TLS 1.3 with cryptographic HMAC signatures.
- **Custody Transfer Immutability**: Once a Delivery PO or Custody Transfer E-Faktur is verified and marked as `Delivered`, the database record becomes immutable to standard client roles to prevent billing tampering.

### Domain D: Role-Based Access Control (RBAC) Across 11 Portals
Enforcing strict separation of duties across all modular portals:
1. `/portal/cs` — Customer Service & Dispatch Ticketing
2. `/portal/purchasing` — Procurement, Parts & Vendor POs
3. `/portal/legal` — Contracts, SLAs & MIGAS Permits
4. `/portal/pemasaran` — Commercial CRM & AE Quotations
5. `/portal/keuangan` — Invoices, Tax & Treasury Cash Flow
6. `/portal/hr` — Enterprise Personnel, Org & Payroll
7. `/portal/armada` — Fleet Maintenance & GPS Telemetry
8. `/portal/skid` — Skid Tank ISO 11120 & Custody Transfer
9. `/portal/pusat` — Central Admin & User Governance
10. `/portal/direksi` (B2B / B2C) — Executive Board Monitoring

---

## ⚡ 5. Automated Security Scanner Script

An automated bash scanner is included to allow instant CI/CD or local vulnerability checks.

### Run Locally from Terminal:
```zsh
./.agents/skills/security-auditor/scripts/scan_security.sh
```

### What the Scanner Checks:
1. **Exposed Secrets**: Scans all `.ts`, `.tsx`, `.js`, and `.jsx` files for sensitive variable names or keys prefixed with `NEXT_PUBLIC_`.
2. **Hardcoded Credentials**: Detects hardcoded `service_role` JWTs, API tokens, or passwords in source code.
3. **SQL Injection Risks**: Identifies raw string concatenation inside database query execution blocks.
4. **RLS Audit**: Verifies that local SQL migration files explicitly contain `ENABLE ROW LEVEL SECURITY`.

---

## 📈 6. DevSecOps Commitment

By embedding the **BASKARA-SEC Role** directly into the workspace root and agent configuration, the BASKARA CNG Ecosystem ensures that speed of innovation never compromises industrial safety, data privacy, or financial billing integrity.
