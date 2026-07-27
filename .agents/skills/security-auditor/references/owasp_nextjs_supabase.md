# OWASP Top 10 — Next.js & Supabase Security Checklist

This reference document guides the `security-auditor` agent during deep security reviews of the BASKARA CNG Ecosystem.

---

## 1. Broken Access Control (OWASP A01:2021)
- [ ] **Supabase RLS Enabled**: Confirm every table has RLS active.
  ```sql
  ALTER TABLE public.dispatches ENABLE ROW LEVEL SECURITY;
  ```
- [ ] **Strict Policy Verification**: Verify that users can only modify records belonging to their division or ID:
  ```sql
  CREATE POLICY "Allow division read access" ON public.dispatches
  FOR SELECT USING (
    auth.jwt() ->> 'user_metadata' ->> 'role' = division_required
    OR auth.jwt() ->> 'email' LIKE '%@baskaracng.com'
  );
  ```
- [ ] **API Route Authorization**: In App Router (`app/api/.../route.ts`), always verify session tokens before executing queries:
  ```typescript
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  ```

---

## 2. Cryptographic Failures & Secret Exposure (OWASP A02:2021)
- [ ] **No Client-Side Secrets**: Ensure `SUPABASE_SERVICE_ROLE_KEY`, database connection strings, and ERP API keys are NEVER exposed to the browser.
- [ ] **Environment Variable Prefixing**: Only non-sensitive variables should be prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [ ] **HTTPS / TLS Enforcement**: All SCADA telemetry data transmitted from Mother Station or Skid Tank manifolds must use TLS 1.3 or HTTPS encryption.

---

## 3. Injection & Data Integrity (OWASP A03:2021)
- [ ] **Parameterized Queries**: Always use Supabase PostgREST client methods (`.select()`, `.insert()`, `.eq()`) instead of raw SQL concatenation.
- [ ] **Payload Sanitization**: When receiving JSON in API routes, validate schema with Zod:
  ```typescript
  import { z } from 'zod';
  
  const TelemetrySchema = z.object({
    skidId: z.string().regex(/^SKD-[A-Z0-9-]+$/),
    pressureBar: z.number().min(0).max(300),
    volumeSm3: z.number().positive(),
  });
  
  const parseResult = TelemetrySchema.safeParse(await req.json());
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid payload schema' }, { status: 400 });
  }
  ```

---

## 4. Insecure Design & SCADA Custody Tampering (OWASP A04:2021)
- [ ] **Immutable Billing Logs**: Custody Transfer delivery volumes and E-Faktur totals must be write-protected once approved by QHSE & Verifiers.
- [ ] **Audit Logging**: Any update or deletion of operational records (POs, Invoices, Dispatches) must generate an audit log entry in a secure `security_audit_logs` table.
