-- ============================================================
-- Migration 06: Modul Keuangan — Corporate Finance & Invoicing
-- Invoices Industri (USD/MMBTU) + Invoices Horeca (IDR/tabung)
-- ============================================================
-- PREREQUISITE: Migration 02 (industrial_clients, horeca_clients) harus sudah dijalankan

-- ── Table: invoices_industri ──────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices_industri (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no           TEXT UNIQUE NOT NULL,       -- format: INV/CNG/2026/08/001
  customer_id          UUID REFERENCES industrial_clients(id),
  customer_name        TEXT,                       -- denormalized untuk display
  invoice_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date             DATE NOT NULL,
  billing_period_start DATE,
  billing_period_end   DATE,
  total_volume_mmbtu   NUMERIC(12,4) NOT NULL DEFAULT 0,
  unit_price_usd       NUMERIC(10,4) NOT NULL DEFAULT 11.50,
  subtotal_usd         NUMERIC(15,2) NOT NULL DEFAULT 0,
  tax_rate_percent     NUMERIC(5,2) NOT NULL DEFAULT 11,
  tax_amount_usd       NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_amount_usd     NUMERIC(15,2) NOT NULL DEFAULT 0,
  exchange_rate_idr    NUMERIC(10,2) DEFAULT 16250,  -- Kurs Tengah BI
  total_amount_idr     NUMERIC(20,2),
  payment_term         TEXT NOT NULL DEFAULT 'Tempo'
                       CHECK (payment_term IN ('Tempo', 'Cash_Deposit', 'COD')),
  status               TEXT NOT NULL DEFAULT 'Draft'
                       CHECK (status IN ('Draft', 'Issued', 'Paid', 'Overdue', 'Cancelled')),
  efaktur_no           TEXT,                        -- nomor E-Faktur DGT
  paid_at              TIMESTAMPTZ,
  created_by           UUID REFERENCES auth.users(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER invoices_industri_updated_at
  BEFORE UPDATE ON invoices_industri
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS inv_ind_status_idx ON invoices_industri(status);
CREATE INDEX IF NOT EXISTS inv_ind_customer_idx ON invoices_industri(customer_id);
CREATE INDEX IF NOT EXISTS inv_ind_date_idx ON invoices_industri(invoice_date DESC);

-- ── Table: invoice_items_industri ─────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_items_industri (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id     UUID NOT NULL REFERENCES invoices_industri(id) ON DELETE CASCADE,
  description    TEXT NOT NULL,
  volume_mmbtu   NUMERIC(12,4) NOT NULL DEFAULT 0,
  unit_price_usd NUMERIC(10,4) NOT NULL DEFAULT 11.50,
  subtotal_usd   NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inv_items_invoice_idx ON invoice_items_industri(invoice_id);

-- ── RLS: invoices_industri ────────────────────────────────────
ALTER TABLE invoices_industri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inv_ind_select"
  ON invoices_industri FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
  );

CREATE POLICY "inv_ind_insert"
  ON invoices_industri FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
    AND created_by = auth.uid()
  );

CREATE POLICY "inv_ind_update"
  ON invoices_industri FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
  );

CREATE POLICY "inv_ind_delete"
  ON invoices_industri FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    OR (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'finance_controller'
      AND status = 'Draft'  -- Finance hanya bisa hapus invoice Draft
    )
  );

-- ── RLS: invoice_items_industri ───────────────────────────────
ALTER TABLE invoice_items_industri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inv_items_all"
  ON invoice_items_industri FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
  );


-- ── Table: invoices_horeca ────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices_horeca (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no           TEXT UNIQUE NOT NULL,       -- format: INV/HOR/2026/08/001
  customer_id          UUID REFERENCES horeca_clients(id),
  customer_name        TEXT,
  invoice_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date             DATE NOT NULL,
  total_tabung         INT NOT NULL DEFAULT 0,
  price_per_tabung_idr NUMERIC(12,2) NOT NULL DEFAULT 150000,
  subtotal_idr         NUMERIC(15,2) NOT NULL DEFAULT 0,
  tax_rate_percent     NUMERIC(5,2) NOT NULL DEFAULT 11,
  tax_amount_idr       NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_amount_idr     NUMERIC(15,2) NOT NULL DEFAULT 0,
  payment_term         TEXT NOT NULL DEFAULT 'COD'
                       CHECK (payment_term IN ('COD', 'Termin', 'Credit_7D', 'Credit_14D')),
  status               TEXT NOT NULL DEFAULT 'Draft'
                       CHECK (status IN ('Draft', 'Issued', 'Paid', 'Overdue', 'Cancelled')),
  paid_at              TIMESTAMPTZ,
  created_by           UUID REFERENCES auth.users(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER invoices_horeca_updated_at
  BEFORE UPDATE ON invoices_horeca
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS inv_hor_status_idx ON invoices_horeca(status);
CREATE INDEX IF NOT EXISTS inv_hor_customer_idx ON invoices_horeca(customer_id);

-- ── RLS: invoices_horeca ──────────────────────────────────────
ALTER TABLE invoices_horeca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inv_hor_select"
  ON invoices_horeca FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
  );

CREATE POLICY "inv_hor_insert"
  ON invoices_horeca FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
    AND created_by = auth.uid()
  );

CREATE POLICY "inv_hor_update"
  ON invoices_horeca FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
  );

CREATE POLICY "inv_hor_delete"
  ON invoices_horeca FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    OR (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'finance_controller'
      AND status = 'Draft'
    )
  );
