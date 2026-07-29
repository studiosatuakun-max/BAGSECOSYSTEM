-- ============================================================
-- Migration 02: Shared Master Data — industrial_clients & horeca_clients
-- Digunakan oleh: Keuangan, Armada, Skid, Industrial, Legal, Pemasaran, Horeca
-- ============================================================

-- ── Table: industrial_clients ─────────────────────────────────
CREATE TABLE IF NOT EXISTS industrial_clients (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name         TEXT UNIQUE NOT NULL,
  sector               TEXT,               -- 'Petrokimia' | 'Food & Beverage' | 'Semen' | 'Tekstil' | dll
  zone                 TEXT,               -- 'Surabaya' | 'Gresik' | 'Pasuruan' | 'Karawang' | dll
  contact_person       TEXT,
  phone_number         TEXT,
  contract_no          TEXT,
  account_executive_id UUID REFERENCES auth.users(id),
  monthly_quota_mmbtu  NUMERIC(12,4) DEFAULT 0,
  used_quota_mmbtu     NUMERIC(12,4) DEFAULT 0,
  price_per_mmbtu_usd  NUMERIC(10,4) DEFAULT 11.50,
  contract_start       DATE,
  contract_end         DATE,
  address              TEXT,
  status               TEXT NOT NULL DEFAULT 'Active'
                       CHECK (status IN ('Active', 'Expiring_Soon', 'Expired', 'Suspended', 'Prospect')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER industrial_clients_updated_at
  BEFORE UPDATE ON industrial_clients
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── RLS: industrial_clients ───────────────────────────────────
ALTER TABLE industrial_clients ENABLE ROW LEVEL SECURITY;

-- Multi-role read: Finance, Fleet, Skid, Industrial, Legal, Marketing, Admin
CREATE POLICY "industrial_clients_select"
  ON industrial_clients FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN (
      'super_admin', 'finance_controller', 'fleet_manager', 'skid_operator',
      'industrial_director', 'legal_officer', 'marketing_ae'
    )
  );

-- Hanya super_admin dan industrial_director yang bisa INSERT/UPDATE/DELETE
CREATE POLICY "industrial_clients_insert"
  ON industrial_clients FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'industrial_director', 'marketing_ae')
  );

CREATE POLICY "industrial_clients_update"
  ON industrial_clients FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'industrial_director', 'marketing_ae')
  );

CREATE POLICY "industrial_clients_delete"
  ON industrial_clients FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'industrial_director')
  );


-- ── Table: horeca_clients ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS horeca_clients (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name          TEXT UNIQUE NOT NULL,
  sector                 TEXT                                    -- 'Hotel' | 'Restaurant' | 'Cafe' | 'Catering' | 'Bakery'
                         CHECK (sector IN ('Hotel', 'Restaurant', 'Cafe', 'Catering', 'Bakery', 'Other')),
  zone                   TEXT,             -- 'Surabaya' | 'Sidoarjo' | 'Malang' | 'Gresik' | dll
  contact_person         TEXT,
  phone_number           TEXT,
  address                TEXT,
  account_executive_id   UUID REFERENCES auth.users(id),
  cradle_rack_qty        INT DEFAULT 0,
  monthly_quota_sm3      NUMERIC(12,4) DEFAULT 0,
  used_quota_sm3         NUMERIC(12,4) DEFAULT 0,
  price_per_tabung_idr   NUMERIC(12,2) DEFAULT 150000,
  operating_pressure_bar NUMERIC(6,2) DEFAULT 200,
  safety_status          TEXT NOT NULL DEFAULT 'Normal'
                         CHECK (safety_status IN ('Normal', 'Warning', 'Critical')),
  sla_inspection_date    DATE,
  contract_start         DATE,
  contract_end           DATE,
  status                 TEXT NOT NULL DEFAULT 'Active'
                         CHECK (status IN ('Active', 'Expiring_Soon', 'Expired', 'Suspended', 'Prospect')),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER horeca_clients_updated_at
  BEFORE UPDATE ON horeca_clients
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── RLS: horeca_clients ───────────────────────────────────────
ALTER TABLE horeca_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "horeca_clients_select"
  ON horeca_clients FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN (
      'super_admin', 'finance_controller', 'fleet_manager',
      'horeca_sales', 'legal_officer', 'marketing_ae'
    )
  );

CREATE POLICY "horeca_clients_insert"
  ON horeca_clients FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'horeca_sales', 'marketing_ae')
  );

CREATE POLICY "horeca_clients_update"
  ON horeca_clients FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'horeca_sales', 'marketing_ae')
  );

CREATE POLICY "horeca_clients_delete"
  ON horeca_clients FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'horeca_sales')
  );
