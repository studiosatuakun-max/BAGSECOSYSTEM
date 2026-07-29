-- ============================================================
-- Migration 08: Modul Skid — B2B Custody Transfer
-- Custody Transfer Slips (Slip Bukti Serah Terima)
-- ============================================================
-- PREREQUISITE: Migration 02 (industrial_clients) harus sudah dijalankan

CREATE TABLE IF NOT EXISTS custody_transfer_slips (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       UUID REFERENCES industrial_clients(id),
  customer_name     TEXT,
  fob_no            TEXT UNIQUE NOT NULL,  -- format: FOB/2026/08/1001
  no_polisi         TEXT NOT NULL,         -- nomor polisi tube-skid
  no_gtm            TEXT NOT NULL,         -- kode GTM: GTM-40-05
  type_gtm          TEXT
                    CHECK (type_gtm IN ('20FT', '40FT')),
  date_wib          DATE NOT NULL DEFAULT CURRENT_DATE,
  time_wib          TIME NOT NULL DEFAULT CURRENT_TIME,
  pressure_bar      NUMERIC(6,2),
  -- Pengukuran massa gas
  fillpost_kg       NUMERIC(10,3),         -- berat dari fill post meter
  micromotion_kg    NUMERIC(10,3),         -- berat dari micromotion flowmeter
  selisih_kg        NUMERIC(8,3) GENERATED ALWAYS AS (micromotion_kg - fillpost_kg) STORED,
  koreksi_factor    NUMERIC(8,6) DEFAULT 1.0000,
  -- Pengukuran volume
  volume_nm3        NUMERIC(12,4),
  volume_mmbtu      NUMERIC(12,4),
  -- Analisa Gas Chromatograph
  ghv               NUMERIC(12,4),         -- Gross Heating Value (BTU/SCF)
  sg_gas            NUMERIC(8,6),          -- Specific Gravity Gas
  sg_fillpost       NUMERIC(8,6),          -- Specific Gravity Fillpost
  density           NUMERIC(8,6),          -- Density (kg/Nm3)
  -- Tanda tangan digital
  signed_by_ppc     BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by_driver  BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by_security BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by_customer BOOLEAN NOT NULL DEFAULT FALSE,
  -- Metadata
  created_by        UUID REFERENCES auth.users(id),
  notes             TEXT,
  status            TEXT NOT NULL DEFAULT 'Draft'
                    CHECK (status IN ('Draft', 'Signed', 'Disputed', 'Archived')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER cts_updated_at
  BEFORE UPDATE ON custody_transfer_slips
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS cts_customer_idx ON custody_transfer_slips(customer_id);
CREATE INDEX IF NOT EXISTS cts_date_idx ON custody_transfer_slips(date_wib DESC);
CREATE INDEX IF NOT EXISTS cts_status_idx ON custody_transfer_slips(status);

-- ── RLS: custody_transfer_slips ───────────────────────────────
ALTER TABLE custody_transfer_slips ENABLE ROW LEVEL SECURITY;

-- Skid Operator, Finance (untuk billing), dan Super Admin bisa SELECT
CREATE POLICY "cts_select"
  ON custody_transfer_slips FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('skid_operator', 'finance_controller', 'super_admin')
  );

CREATE POLICY "cts_insert"
  ON custody_transfer_slips FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('skid_operator', 'super_admin')
    AND created_by = auth.uid()
  );

CREATE POLICY "cts_update"
  ON custody_transfer_slips FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('skid_operator', 'super_admin')
  );

CREATE POLICY "cts_delete"
  ON custody_transfer_slips FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    OR (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'skid_operator'
      AND status = 'Draft'  -- Skid operator hanya bisa hapus Draft
    )
  );
