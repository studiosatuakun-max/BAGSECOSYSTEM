-- ============================================
-- MODULE: Legal | Permits & Contracts
-- ============================================

CREATE TABLE IF NOT EXISTS public.legal_permits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_name TEXT NOT NULL,
  permit_number TEXT UNIQUE NOT NULL,
  issuing_authority TEXT NOT NULL,
  
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Expiring_Soon', 'Expired', 'Renewing')),
  document_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_permit_dates CHECK (expiry_date > issue_date)
);

CREATE TABLE IF NOT EXISTS public.legal_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  
  contract_type TEXT NOT NULL CHECK (contract_type IN ('B2B_FOB', 'B2B_CNF', 'Horeca_12kg')),
  tube_ownership TEXT NOT NULL CHECK (tube_ownership IN ('BaGS_Owned', 'Customer_Owned', 'Loaned_With_Deposit', 'Loaned_No_Deposit')),
  
  has_liability_clause BOOLEAN DEFAULT false,
  liability_notes TEXT,
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Under_Review', 'Terminated', 'Expired')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_contract_dates CHECK (end_date > start_date)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.legal_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_contracts ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Legal, Commercial, and Managers can read
CREATE POLICY "legal_read_documents" ON public.legal_permits
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'Legal Manager', 'Commercial Manager', 'GM')
  );

CREATE POLICY "contracts_read_documents" ON public.legal_contracts
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'Legal Manager', 'Commercial Manager', 'GM', 'Finance Manager')
  );

-- 2. Manage Policy: Only Legal team can create/edit documents
CREATE POLICY "legal_manage_documents" ON public.legal_permits
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('Legal Manager', 'Super Admin')
  );

CREATE POLICY "contracts_manage_documents" ON public.legal_contracts
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('Legal Manager', 'Super Admin')
  );
