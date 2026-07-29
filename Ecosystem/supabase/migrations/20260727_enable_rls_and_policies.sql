-- ====================================================================
-- BASKARA CNG ECOSYSTEM — ZERO-TRUST RLS & IMMUTABILITY POLICIES
-- Document Reference: OWASP Top 10 A01:2021 & A04:2021
-- Updated: 2026-07-29 — Aligned dengan skema tabel 03_dispatches.sql
--   Column names: receiver_division → to_division, sender_division → from_division
--   Division metadata source: app_metadata (bukan user_metadata) untuk RBAC
--   Note: custody_transfers → custody_transfer_slips (nama tabel di skema baru)
-- ====================================================================

-- 1. MANDATORY: Enable Row-Level Security on Core Tables
-- (IF EXISTS agar tidak error jika tabel belum ada di run pertama)
ALTER TABLE IF EXISTS public.dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.custody_transfer_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scada_telemetry ENABLE ROW LEVEL SECURITY;

-- ── 2. DISPATCHES TABLE POLICIES (Division Isolation) ──────────────────
-- FIX: kolom adalah to_division & from_division (bukan receiver/sender_division)
-- FIX: role dibaca dari app_metadata (RBAC), bukan user_metadata

DROP POLICY IF EXISTS "Allow division read access" ON public.dispatches;
CREATE POLICY "Allow division read access" ON public.dispatches
FOR SELECT USING (
  -- Penerima bisa baca inbox divisinya
  to_division = COALESCE((auth.jwt() -> 'app_metadata' ->> 'division'), '')
  -- Pengirim bisa baca outbox yang dia kirim
  OR from_division = COALESCE((auth.jwt() -> 'app_metadata' ->> 'division'), '')
  OR sent_by = auth.uid()
  -- Super Admin bisa baca semua
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
);

DROP POLICY IF EXISTS "Allow authenticated users to insert dispatches" ON public.dispatches;
CREATE POLICY "Allow authenticated users to insert dispatches" ON public.dispatches
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND sent_by = auth.uid()
  -- Pengirim hanya bisa kirim dari divisinya sendiri
  AND from_division = COALESCE((auth.jwt() -> 'app_metadata' ->> 'division'), from_division)
);

DROP POLICY IF EXISTS "Allow recipients or Super Admin to update status" ON public.dispatches;
CREATE POLICY "Allow recipients or Super Admin to update status" ON public.dispatches
FOR UPDATE USING (
  -- Penerima atau pengirim bisa update status
  to_division = COALESCE((auth.jwt() -> 'app_metadata' ->> 'division'), '')
  OR sent_by = auth.uid()
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
);

-- ── 3. CUSTODY TRANSFER IMMUTABILITY POLICY (OWASP A04 - Anti-Tamper) ──
-- FIX: nama tabel adalah custody_transfer_slips (bukan custody_transfers)
-- FIX: status 'Signed' menggantikan 'Delivered' sebagai state final immutable
DROP POLICY IF EXISTS "Prevent tampering of delivered custody transfers" ON public.custody_transfer_slips;
CREATE POLICY "Prevent tampering of delivered custody transfers" ON public.custody_transfer_slips
FOR UPDATE USING (
  -- Hanya bisa edit jika status masih Draft
  status = 'Draft'
  -- Super admin selalu bisa edit
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
);

-- ── 4. SCADA TELEMETRY INGESTION PROTECTION ─────────────────────────────
-- FIX: Tabel scada_telemetry mungkin belum ada — gunakan IF EXISTS pattern
-- Jalankan bagian ini SETELAH tabel scada_telemetry dibuat di migration terpisah
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'scada_telemetry'
  ) THEN
    -- Enable RLS
    EXECUTE 'ALTER TABLE public.scada_telemetry ENABLE ROW LEVEL SECURITY';

    -- Drop policy lama jika ada
    EXECUTE 'DROP POLICY IF EXISTS "Allow SCADA Gateway telemetry insertion" ON public.scada_telemetry';

    -- Hanya service_role atau gateway SCADA yang terautentikasi yang bisa INSERT
    EXECUTE $policy$
      CREATE POLICY "Allow SCADA Gateway telemetry insertion" ON public.scada_telemetry
      FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
        OR (auth.jwt() -> 'app_metadata' ->> 'gateway_type') = 'MotherStationSCADA'
      )
    $policy$;

    RAISE NOTICE 'SCADA telemetry RLS policy applied.';
  ELSE
    RAISE NOTICE 'Table scada_telemetry does not exist yet. Skipping SCADA policy.';
  END IF;
END $$;
