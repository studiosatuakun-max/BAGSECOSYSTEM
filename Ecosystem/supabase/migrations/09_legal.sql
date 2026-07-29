-- ============================================================
-- Migration 09: Modul Legal — Contracts, Permits & Compliance
-- ============================================================

-- ── Table: legal_permits ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_permits (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_name       TEXT NOT NULL,
  permit_number     TEXT UNIQUE NOT NULL,
  issuing_authority TEXT NOT NULL,         -- 'Ditjen Migas KESDM' | 'Kementerian Perhubungan' | dll
  issue_date        DATE,
  expiry_date       DATE NOT NULL,
  permit_category   TEXT
                    CHECK (permit_category IN ('MIGAS', 'Transportasi', 'Ketenagakerjaan', 'Lingkungan', 'Other')),
  document_url      TEXT,                  -- URL ke Supabase Storage (opsional)
  status            TEXT NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active', 'Expiring_Soon', 'Expired', 'Revoked', 'Pending_Renewal')),
  renewal_notes     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER legal_permits_updated_at
  BEFORE UPDATE ON legal_permits
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-update status berdasarkan expiry date
CREATE OR REPLACE FUNCTION refresh_permit_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date < CURRENT_DATE THEN
    NEW.status = 'Expired';
  ELSIF NEW.expiry_date < CURRENT_DATE + INTERVAL '30 days' THEN
    NEW.status = 'Expiring_Soon';
  ELSIF NEW.status NOT IN ('Revoked', 'Pending_Renewal') THEN
    NEW.status = 'Active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_permit_status
  BEFORE INSERT OR UPDATE ON legal_permits
  FOR EACH ROW EXECUTE FUNCTION refresh_permit_status();

CREATE INDEX IF NOT EXISTS permits_expiry_idx ON legal_permits(expiry_date);
CREATE INDEX IF NOT EXISTS permits_status_idx ON legal_permits(status);

-- ── RLS: legal_permits ────────────────────────────────────────
ALTER TABLE legal_permits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "permits_select"
  ON legal_permits FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('legal_officer', 'super_admin')
  );

CREATE POLICY "permits_insert"
  ON legal_permits FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('legal_officer', 'super_admin')
  );

CREATE POLICY "permits_update"
  ON legal_permits FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('legal_officer', 'super_admin')
  );

CREATE POLICY "permits_delete"
  ON legal_permits FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );


-- ── Table: legal_contracts ────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_contracts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number      TEXT UNIQUE NOT NULL,    -- format: CTR/FOB/2026/015
  -- Customer reference — bisa ke industrial_clients ATAU horeca_clients
  -- Pakai polymorphic reference dengan customer_type
  customer_id          UUID,                    -- UUID dari tabel yang sesuai
  customer_type        TEXT NOT NULL
                       CHECK (customer_type IN ('Industrial', 'Horeca')),
  customer_name        TEXT NOT NULL,           -- denormalized untuk display
  contract_type        TEXT NOT NULL
                       CHECK (contract_type IN ('B2B_FOB', 'B2B_CNF', 'Horeca_12kg', 'Horeca_Cluster', 'Custom')),
  tube_ownership       TEXT
                       CHECK (tube_ownership IN ('Loaned_With_Deposit', 'BaGS_Owned', 'Customer_Owned', NULL)),
  has_liability_clause BOOLEAN NOT NULL DEFAULT FALSE,
  liability_notes      TEXT,
  contract_value_idr   NUMERIC(20,2),           -- total nilai kontrak
  monthly_quota_mmbtu  NUMERIC(12,4),
  start_date           DATE NOT NULL,
  end_date             DATE NOT NULL,
  document_url         TEXT,                    -- URL ke Supabase Storage
  counsel_name         TEXT,                    -- nama Legal Counsel yang handle
  status               TEXT NOT NULL DEFAULT 'Active'
                       CHECK (status IN ('Active', 'Under_Review', 'Expiring_Soon', 'Expired', 'Terminated', 'Draft')),
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON legal_contracts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-update status berdasarkan end_date
CREATE OR REPLACE FUNCTION refresh_contract_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date < CURRENT_DATE THEN
    NEW.status = 'Expired';
  ELSIF NEW.end_date < CURRENT_DATE + INTERVAL '60 days' THEN
    NEW.status = 'Expiring_Soon';
  ELSIF NEW.status NOT IN ('Terminated', 'Under_Review', 'Draft') THEN
    NEW.status = 'Active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_contract_status
  BEFORE INSERT OR UPDATE ON legal_contracts
  FOR EACH ROW EXECUTE FUNCTION refresh_contract_status();

CREATE INDEX IF NOT EXISTS contracts_end_date_idx ON legal_contracts(end_date);
CREATE INDEX IF NOT EXISTS contracts_status_idx ON legal_contracts(status);
CREATE INDEX IF NOT EXISTS contracts_type_idx ON legal_contracts(contract_type);

-- ── RLS: legal_contracts ──────────────────────────────────────
ALTER TABLE legal_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contracts_select"
  ON legal_contracts FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('legal_officer', 'super_admin', 'industrial_director')
  );

CREATE POLICY "contracts_insert"
  ON legal_contracts FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('legal_officer', 'super_admin')
  );

CREATE POLICY "contracts_update"
  ON legal_contracts FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('legal_officer', 'super_admin')
  );

CREATE POLICY "contracts_delete"
  ON legal_contracts FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );
