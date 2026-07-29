-- ============================================================
-- Migration 04: Modul Stasiun — Mother Station Operations
-- Form 101 (Master Fueling Records) + Form 102 (ATEX Inspections)
-- + Compressor Logs
-- ============================================================

-- ── Table: master_fueling_records ────────────────────────────
CREATE TABLE IF NOT EXISTS master_fueling_records (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_no             INT NOT NULL,
  customer_name        TEXT NOT NULL,
  date                 DATE NOT NULL DEFAULT CURRENT_DATE,
  tube_trailer_no      TEXT NOT NULL,
  no_pol               TEXT NOT NULL,
  lwc                  NUMERIC(10,2),
  arrival_from         TEXT DEFAULT 'Customer Site',
  start_time           TIME,
  finish_time          TIME,
  pressure_initial_bar NUMERIC(6,2),
  pressure_full_bar    NUMERIC(6,2),
  temp_start_c         NUMERIC(5,2),
  temp_finish_c        NUMERIC(5,2),
  fill_post_number     TEXT,          -- '01' | '02' | '03'
  volume_start_nm3     NUMERIC(15,4),
  volume_finish_nm3    NUMERIC(15,4),
  volume_delivery_nm3  NUMERIC(12,4),
  volume_delivery_kg   NUMERIC(10,3),
  operator_id          UUID REFERENCES auth.users(id),
  status               TEXT NOT NULL DEFAULT 'Draft'
                       CHECK (status IN ('Draft', 'In_Progress', 'Completed', 'Cancelled')),
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER mfr_updated_at
  BEFORE UPDATE ON master_fueling_records
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS mfr_date_idx ON master_fueling_records(date DESC);
CREATE INDEX IF NOT EXISTS mfr_status_idx ON master_fueling_records(status);

-- ── RLS: master_fueling_records ───────────────────────────────
ALTER TABLE master_fueling_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mfr_select"
  ON master_fueling_records FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('station_operator', 'super_admin')
  );

CREATE POLICY "mfr_insert"
  ON master_fueling_records FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('station_operator', 'super_admin')
    AND operator_id = auth.uid()
  );

CREATE POLICY "mfr_update"
  ON master_fueling_records FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('station_operator', 'super_admin')
  );

CREATE POLICY "mfr_delete"
  ON master_fueling_records FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );


-- ── Table: atex_inspections ────────────────────────────────────
CREATE TABLE IF NOT EXISTS atex_inspections (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fueling_record_id            UUID NOT NULL REFERENCES master_fueling_records(id) ON DELETE CASCADE,
  type                         TEXT NOT NULL
                               CHECK (type IN ('PRE_FILL', 'POST_FILL')),
  quick_connect_safety_rope    BOOLEAN NOT NULL DEFAULT FALSE,
  grounding_cable_tyre_stopper BOOLEAN NOT NULL DEFAULT FALSE,
  sign_filling_process         BOOLEAN NOT NULL DEFAULT FALSE,
  rfid_card_scanned            BOOLEAN NOT NULL DEFAULT FALSE,  -- Alien H9 RFID card
  rfid_card_no                 TEXT,                           -- nomor kartu Alien H9
  recorded_by                  UUID REFERENCES auth.users(id),
  recorded_by_name             TEXT,
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS atex_fueling_record_idx ON atex_inspections(fueling_record_id);

-- ── RLS: atex_inspections ─────────────────────────────────────
ALTER TABLE atex_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "atex_inspections_all"
  ON atex_inspections FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('station_operator', 'super_admin')
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('station_operator', 'super_admin')
  );


-- ── Table: compressor_logs ────────────────────────────────────
CREATE TABLE IF NOT EXISTS compressor_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fueling_record_id UUID NOT NULL REFERENCES master_fueling_records(id) ON DELETE CASCADE,
  compressor_name   TEXT NOT NULL,       -- 'IMW-01' | 'IMW-02' | 'IMW-03'
  start_hour        NUMERIC(12,1),
  finish_hour       NUMERIC(12,1),
  runtime_hours     NUMERIC(8,2) GENERATED ALWAYS AS (finish_hour - start_hour) STORED,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comp_logs_fueling_idx ON compressor_logs(fueling_record_id);

-- ── RLS: compressor_logs ──────────────────────────────────────
ALTER TABLE compressor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compressor_logs_all"
  ON compressor_logs FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('station_operator', 'super_admin')
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('station_operator', 'super_admin')
  );
