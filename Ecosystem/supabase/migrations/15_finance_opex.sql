-- ============================================
-- MODULE: Keuangan | Phase 4.5 Updates
-- ============================================

-- Add efaktur_url to existing invoice tables
ALTER TABLE public.invoices_industri ADD COLUMN IF NOT EXISTS efaktur_url TEXT;
ALTER TABLE public.invoices_horeca ADD COLUMN IF NOT EXISTS efaktur_url TEXT;

-- Create Opex table
CREATE TABLE IF NOT EXISTS public.operating_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_idr NUMERIC(15,2) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.operating_expenses ENABLE ROW LEVEL SECURITY;

-- Opex Policies (matches other finance roles)
CREATE POLICY "finance_manage_opex" ON public.operating_expenses
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance_controller', 'super_admin')
  );
