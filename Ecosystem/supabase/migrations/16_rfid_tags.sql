-- ============================================
-- MODULE: Stasiun | RFID Tags 
-- ============================================

-- Adapt to the existing table created via dashboard by adding missing columns
ALTER TABLE public.rfid_tags ADD COLUMN IF NOT EXISTS cylinder_serial TEXT;
ALTER TABLE public.rfid_tags ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2);
ALTER TABLE public.rfid_tags ADD COLUMN IF NOT EXISTS hydrotest_expiry DATE;
ALTER TABLE public.rfid_tags ADD COLUMN IF NOT EXISTS fill_status TEXT CHECK (fill_status IN ('ready', 'filled', 'rejected'));

-- Ensure epc_hex is unique so we can upsert safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rfid_tags_epc_hex_key'
  ) THEN
    ALTER TABLE public.rfid_tags ADD CONSTRAINT rfid_tags_epc_hex_key UNIQUE (epc_hex);
  END IF;
END $$;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.rfid_tags ENABLE ROW LEVEL SECURITY;

-- Read Policy: Station Operators, Skid Leads, Super Admins can read
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'rfid_tags_read') THEN
    CREATE POLICY "rfid_tags_read" ON public.rfid_tags
      FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('station_operator', 'skid_operator', 'super_admin', 'admin')
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'rfid_tags_manage') THEN
    CREATE POLICY "rfid_tags_manage" ON public.rfid_tags
      FOR ALL USING (
        auth.jwt() ->> 'role' IN ('super_admin', 'admin')
      );
  END IF;
END $$;

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO public.rfid_tags (epc_hex, tag_type, cylinder_serial, weight_kg, hydrotest_expiry, fill_status)
VALUES 
  -- Cylinders
  ('A3B7C209', 'cylinder', 'CYL-26-CNG-0847', 12.00, '2029-03-15', 'ready'),
  ('F1448D2A', 'cylinder', 'CYL-25-CNG-1203', 12.00, '2026-09-08', 'ready'),
  ('7EC031B5', 'cylinder', 'CYL-23-CNG-0551', 12.00, '2025-12-20', 'rejected'),
  ('8B114A99', 'cylinder', 'CYL-26-CNG-0912', 12.00, '2029-01-10', 'ready'),
  
  -- Extra dummy tags for simulation testing
  ('E20000170217019923902999', 'cylinder', 'CYL-24-CNG-1022', 12.50, '2028-06-12', 'filled'),
  ('B2C3D4E5F6A7B8C9D0E1F2A3', 'cylinder', 'CYL-26-CNG-1100', 12.20, '2029-11-20', 'ready'),
  
  -- Wristbands (Operator tags)
  ('A00000000000000000000001', 'wristband', NULL, NULL, NULL, NULL),
  ('A00000000000000000000002', 'wristband', NULL, NULL, NULL, NULL)
ON CONFLICT (epc_hex) DO UPDATE SET 
  cylinder_serial = EXCLUDED.cylinder_serial,
  weight_kg = EXCLUDED.weight_kg,
  hydrotest_expiry = EXCLUDED.hydrotest_expiry,
  fill_status = EXCLUDED.fill_status;
