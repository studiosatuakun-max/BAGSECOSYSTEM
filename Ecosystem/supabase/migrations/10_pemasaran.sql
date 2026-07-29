-- ============================================================
-- Migration 10: Modul Pemasaran — Sales CRM & Pipeline
-- Sales Leads + Marketing Campaigns
-- ============================================================

-- ── Table: sales_leads ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales_leads (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name                 TEXT NOT NULL,
  contact_person               TEXT,
  phone_number                 TEXT,
  email                        TEXT,
  segment                      TEXT NOT NULL
                               CHECK (segment IN ('Industri', 'Horeca', 'Government', 'Other')),
  pipeline_stage               TEXT NOT NULL DEFAULT 'Perkenalan_Awal'
                               CHECK (pipeline_stage IN (
                                 'Perkenalan_Awal',
                                 'Presentasi',
                                 'Penawaran',
                                 'Negosiasi',
                                 'Penyampaian_Kontrak',
                                 'Dealing_Closed_Won',
                                 'Dealing_Closed_Lost'
                               )),
  estimated_volume_mmbtu       NUMERIC(12,4),
  estimated_value_idr          NUMERIC(20,2),
  cluster_location             TEXT,              -- zona geografis
  current_vendor               TEXT,
  competitor_contract_end_date DATE,
  sales_rep_id                 UUID REFERENCES auth.users(id),
  sales_rep_name               TEXT,
  last_contact_date            DATE,
  next_follow_up_date          DATE,
  notes                        TEXT,
  lost_reason                  TEXT,             -- alasan jika Closed_Lost
  converted_to_client_id       UUID,             -- UUID ke industrial/horeca_clients jika won
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER sales_leads_updated_at
  BEFORE UPDATE ON sales_leads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS leads_stage_idx ON sales_leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS leads_segment_idx ON sales_leads(segment);
CREATE INDEX IF NOT EXISTS leads_rep_idx ON sales_leads(sales_rep_id);
CREATE INDEX IF NOT EXISTS leads_follow_up_idx ON sales_leads(next_follow_up_date);

-- ── RLS: sales_leads ──────────────────────────────────────────
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;

-- Marketing AE bisa lihat semua leads (termasuk bukan miliknya — kolaborasi)
CREATE POLICY "leads_select"
  ON sales_leads FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('marketing_ae', 'super_admin', 'industrial_director')
  );

-- AE bisa buat lead baru
CREATE POLICY "leads_insert"
  ON sales_leads FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('marketing_ae', 'super_admin')
    AND sales_rep_id = auth.uid()
  );

-- AE bisa update leads miliknya, super_admin bisa update semua
CREATE POLICY "leads_update"
  ON sales_leads FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    OR (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'marketing_ae'
      AND sales_rep_id = auth.uid()
    )
  );

-- Hanya super_admin yang bisa delete
CREATE POLICY "leads_delete"
  ON sales_leads FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );


-- ── Table: marketing_campaigns ────────────────────────────────
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name    TEXT NOT NULL,
  campaign_type    TEXT
                   CHECK (campaign_type IN ('Digital', 'Event', 'Direct_Visit', 'Telemarketing', 'Other')),
  segment_target   TEXT
                   CHECK (segment_target IN ('Industri', 'Horeca', 'Both')),
  start_date       DATE NOT NULL,
  end_date         DATE,
  budget_idr       NUMERIC(15,2) DEFAULT 0,
  actual_spend_idr NUMERIC(15,2) DEFAULT 0,
  leads_generated  INT DEFAULT 0,
  leads_converted  INT DEFAULT 0,
  revenue_idr      NUMERIC(20,2) DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'Active'
                   CHECK (status IN ('Draft', 'Active', 'Paused', 'Completed', 'Cancelled')),
  created_by       UUID REFERENCES auth.users(id),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── RLS: marketing_campaigns ──────────────────────────────────
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_select"
  ON marketing_campaigns FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('marketing_ae', 'super_admin', 'industrial_director')
  );

CREATE POLICY "campaigns_insert"
  ON marketing_campaigns FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('marketing_ae', 'super_admin')
  );

CREATE POLICY "campaigns_update"
  ON marketing_campaigns FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('marketing_ae', 'super_admin')
  );

CREATE POLICY "campaigns_delete"
  ON marketing_campaigns FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );
