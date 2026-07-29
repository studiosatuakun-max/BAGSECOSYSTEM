-- ============================================================
-- Migration 05: Modul Armada — Fleet & Logistics
-- Surat Jalan CNF (B2B Industrial) + Delivery Orders (Horeca)
-- ============================================================
-- PREREQUISITE: Migration 02 (industrial_clients, horeca_clients) harus sudah dijalankan

-- ── Table: surat_jalan_cnf ────────────────────────────────────
CREATE TABLE IF NOT EXISTS surat_jalan_cnf (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  no_pengiriman            TEXT UNIQUE NOT NULL,  -- format: SJ/CNG/2026/08/0101
  customer_id              UUID REFERENCES industrial_clients(id),
  customer_address         TEXT,
  no_gtm                   TEXT NOT NULL,          -- nomor tube-skid: GTM-40-02
  no_head                  TEXT NOT NULL,          -- nomor polisi kepala: L 9123 GAH
  driver_id                UUID REFERENCES auth.users(id),
  driver_name              TEXT,
  depart_time              TIMESTAMPTZ,
  depart_pressure_bar      NUMERIC(6,2),
  depart_temp_c            NUMERIC(5,2),
  prs_start_time           TIMESTAMPTZ,            -- waktu mulai discharge di customer
  prs_start_pressure_bar   NUMERIC(6,2),
  prs_finish_time          TIMESTAMPTZ,            -- waktu selesai discharge
  prs_finish_pressure_bar  NUMERIC(6,2),
  return_prs_time          TIMESTAMPTZ,            -- waktu kembali ke Mother Station
  return_pressure_bar      NUMERIC(6,2),
  status                   TEXT NOT NULL DEFAULT 'Dispatched'
                           CHECK (status IN ('Dispatched', 'Discharging', 'Returning', 'Completed', 'Cancelled')),
  signed_by_ppc            BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by_driver         BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by_security       BOOLEAN NOT NULL DEFAULT FALSE,
  signed_by_customer       BOOLEAN NOT NULL DEFAULT FALSE,
  notes                    TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER sjc_updated_at
  BEFORE UPDATE ON surat_jalan_cnf
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS sjc_driver_idx ON surat_jalan_cnf(driver_id);
CREATE INDEX IF NOT EXISTS sjc_status_idx ON surat_jalan_cnf(status);
CREATE INDEX IF NOT EXISTS sjc_date_idx ON surat_jalan_cnf(depart_time DESC);

-- ── RLS: surat_jalan_cnf ──────────────────────────────────────
ALTER TABLE surat_jalan_cnf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sjc_select"
  ON surat_jalan_cnf FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('fleet_manager', 'super_admin')
    OR driver_id = auth.uid()  -- Driver bisa lihat SJ miliknya sendiri
  );

CREATE POLICY "sjc_insert"
  ON surat_jalan_cnf FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('fleet_manager', 'super_admin')
  );

CREATE POLICY "sjc_update"
  ON surat_jalan_cnf FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('fleet_manager', 'super_admin')
    OR driver_id = auth.uid()  -- Driver bisa update status (sign, dll)
  );

CREATE POLICY "sjc_delete"
  ON surat_jalan_cnf FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );


-- ── Table: delivery_orders_horeca ─────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_orders_horeca (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  no_do               TEXT UNIQUE NOT NULL,  -- format: DO/HOR/2026/08/050
  customer_id         UUID REFERENCES horeca_clients(id),
  customer_name       TEXT,
  driver_id           UUID REFERENCES auth.users(id),
  driver_name         TEXT,
  vehicle_type        TEXT,              -- 'Colt Diesel' | 'Pick Up' | 'Motor Box'
  vehicle_plate       TEXT NOT NULL,
  qty_delivered_full  INT NOT NULL DEFAULT 0,
  qty_returned_empty  INT NOT NULL DEFAULT 0,
  depart_time         TIMESTAMPTZ,
  delivered_time      TIMESTAMPTZ,
  status              TEXT NOT NULL DEFAULT 'Pending'
                      CHECK (status IN ('Pending', 'In_Transit', 'Delivered', 'Partial', 'Cancelled')),
  delivery_zone       TEXT,             -- 'Surabaya' | 'Sidoarjo' | 'Malang' | dll
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER do_horeca_updated_at
  BEFORE UPDATE ON delivery_orders_horeca
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS do_horeca_driver_idx ON delivery_orders_horeca(driver_id);
CREATE INDEX IF NOT EXISTS do_horeca_status_idx ON delivery_orders_horeca(status);

-- ── RLS: delivery_orders_horeca ───────────────────────────────
ALTER TABLE delivery_orders_horeca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "do_horeca_select"
  ON delivery_orders_horeca FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('fleet_manager', 'super_admin')
    OR driver_id = auth.uid()
  );

CREATE POLICY "do_horeca_insert"
  ON delivery_orders_horeca FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('fleet_manager', 'super_admin')
  );

CREATE POLICY "do_horeca_update"
  ON delivery_orders_horeca FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('fleet_manager', 'super_admin')
    OR driver_id = auth.uid()
  );

CREATE POLICY "do_horeca_delete"
  ON delivery_orders_horeca FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );
