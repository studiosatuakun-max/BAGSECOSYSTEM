-- ============================================
-- MODULE: Keuangan | Format Invoice USD & IDR
-- ============================================

CREATE TABLE IF NOT EXISTS public.invoices_industri (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_no TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  
  -- Financial Data (USD)
  total_volume_mmbtu NUMERIC(15,4) NOT NULL,
  subtotal_usd NUMERIC(15,2) NOT NULL,
  tax_rate_percent NUMERIC(5,2) DEFAULT 11.00,
  tax_amount_usd NUMERIC(15,2) NOT NULL,
  total_amount_usd NUMERIC(15,2) NOT NULL,
  
  -- Local Currency Conversion
  exchange_rate_idr NUMERIC(10,2),
  total_amount_idr NUMERIC(15,2),
  
  payment_term TEXT CHECK (payment_term IN ('Cash_Deposit', 'Tempo')),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Issued', 'Paid', 'Overdue', 'Cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoice_industri_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices_industri(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  volume_mmbtu NUMERIC(15,4) NOT NULL,
  unit_price_usd NUMERIC(15,4) NOT NULL,
  subtotal_usd NUMERIC(15,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.invoices_horeca (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_no TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Retail Financial Data (IDR)
  total_tabung INTEGER NOT NULL CHECK (total_tabung > 0),
  price_per_tabung_idr NUMERIC(15,2) NOT NULL,
  subtotal_idr NUMERIC(15,2) NOT NULL,
  tax_amount_idr NUMERIC(15,2) DEFAULT 0,
  total_amount_idr NUMERIC(15,2) NOT NULL,
  
  payment_term TEXT CHECK (payment_term IN ('Cash_Deposit', 'COD', 'Termin')),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Issued', 'Paid', 'Overdue', 'Cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.invoices_industri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_industri_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices_horeca ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Finance team and Super Admins can view all invoices
CREATE POLICY "finance_read_invoices" ON public.invoices_industri
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'Finance Manager', 'Finance Staff')
  );

-- 2. Insert/Update Policy: Only Finance team can issue invoices
CREATE POLICY "finance_manage_invoices" ON public.invoices_industri
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('Finance Manager', 'Finance Staff', 'Super Admin')
  );
