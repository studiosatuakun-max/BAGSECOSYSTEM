-- ====================================================================
-- BASKARA CNG ECOSYSTEM — ZERO-TRUST RLS & IMMUTABILITY POLICIES
-- Document Reference: OWASP Top 10 A01:2021 & A04:2021
-- ====================================================================

-- 1. MANDATORY: Enable Row-Level Security on Core Tables
ALTER TABLE IF EXISTS public.dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.custody_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scada_telemetry ENABLE ROW LEVEL SECURITY;

-- 2. DISPATCHES TABLE POLICIES (Division Isolation)
DROP POLICY IF EXISTS "Allow division read access" ON public.dispatches;
CREATE POLICY "Allow division read access" ON public.dispatches
FOR SELECT USING (
  receiver_division = coalesce((auth.jwt() -> 'user_metadata' ->> 'division'), '')
  OR receiver_division = 'All Divisions'
  OR sender_division = coalesce((auth.jwt() -> 'user_metadata' ->> 'division'), '')
  OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('Super Admin', 'Direksi', 'Chief Financial Officer')
);

DROP POLICY IF EXISTS "Allow authenticated users to insert dispatches" ON public.dispatches;
CREATE POLICY "Allow authenticated users to insert dispatches" ON public.dispatches
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND sender_division = coalesce((auth.jwt() -> 'user_metadata' ->> 'division'), sender_division)
);

DROP POLICY IF EXISTS "Allow recipients or Super Admin to update status" ON public.dispatches;
CREATE POLICY "Allow recipients or Super Admin to update status" ON public.dispatches
FOR UPDATE USING (
  receiver_division = coalesce((auth.jwt() -> 'user_metadata' ->> 'division'), '')
  OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('Super Admin', 'Direksi')
);

-- 3. CUSTODY TRANSFER IMMUTABILITY POLICY (OWASP A04 - Anti-Tamper)
-- Once Custody Transfer is marked 'Delivered' and E-Faktur generated, prevent edits!
DROP POLICY IF EXISTS "Prevent tampering of delivered custody transfers" ON public.custody_transfers;
CREATE POLICY "Prevent tampering of delivered custody transfers" ON public.custody_transfers
FOR UPDATE USING (
  status != 'Delivered'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'Super Admin'
);

-- 4. SCADA TELEMETRY INGESTION PROTECTION (Mother Station 250 Bar CNG)
-- Only Service Role or authenticated SCADA gateways with certificate claims can insert telemetry
DROP POLICY IF EXISTS "Allow SCADA Gateway telemetry insertion" ON public.scada_telemetry;
CREATE POLICY "Allow SCADA Gateway telemetry insertion" ON public.scada_telemetry
FOR INSERT WITH CHECK (
  auth.role() = 'service_role'
  OR (auth.jwt() -> 'user_metadata' ->> 'gateway_type') = 'MotherStationSCADA'
);
