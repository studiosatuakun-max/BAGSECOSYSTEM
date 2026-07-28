-- ============================================
-- MODULE: Pemasaran | CRM Sales Leads
-- ============================================

CREATE TABLE IF NOT EXISTS public.sales_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  
  segment TEXT NOT NULL CHECK (segment IN ('Industri', 'Horeca')),
  pipeline_stage TEXT NOT NULL CHECK (pipeline_stage IN ('Perkenalan_Awal', 'Penawaran', 'Follow_Up', 'Penyampaian_Kontrak', 'Negosiasi', 'Dealing_Closed_Won', 'Closed_Lost')),
  
  -- Horeca fields
  cluster_location TEXT,
  current_vendor TEXT,
  competitor_contract_end_date DATE,
  
  -- Industri fields
  estimated_volume_mmbtu NUMERIC(10,2),
  
  sales_rep_id UUID REFERENCES auth.users(id),
  churn_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Sales team can read their own leads, Managers read all
CREATE POLICY "sales_read_leads" ON public.sales_leads
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'Commercial Manager', 'Marketing Manager') OR 
    sales_rep_id = auth.uid()
  );

-- 2. Insert/Update Policy: Sales reps manage their leads
CREATE POLICY "sales_manage_leads" ON public.sales_leads
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('Marketing Manager', 'Super Admin') OR
    sales_rep_id = auth.uid()
  );
