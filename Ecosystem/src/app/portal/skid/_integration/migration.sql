-- ============================================
-- MODULE: Skid | Slip Bukti Serah Terima (Custody Transfer)
-- ============================================

CREATE TABLE IF NOT EXISTS public.custody_transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  fob_no TEXT UNIQUE NOT NULL,
  no_polisi TEXT NOT NULL,
  no_gtm TEXT NOT NULL,
  type_gtm TEXT,
  
  date_wib DATE NOT NULL DEFAULT CURRENT_DATE,
  time_wib TIME NOT NULL,
  pressure_bar NUMERIC(6,2) NOT NULL CHECK (pressure_bar <= 250),
  
  -- Flowmeter Data
  fillpost_kg NUMERIC(12,3) NOT NULL,
  micromotion_kg NUMERIC(12,3) NOT NULL,
  selisih_kg NUMERIC(10,3),
  koreksi_factor NUMERIC(10,5),
  
  -- Billing Volume
  volume_nm3 NUMERIC(12,3) NOT NULL,
  volume_mmbtu NUMERIC(12,4) NOT NULL,
  
  -- Gas Analysis
  ghv NUMERIC(10,5) NOT NULL,
  sg_gas NUMERIC(10,5) NOT NULL,
  sg_fillpost NUMERIC(10,5) NOT NULL,
  density NUMERIC(10,5) NOT NULL,
  
  -- Approval Signatures
  signed_by_ppc BOOLEAN DEFAULT false,
  signed_by_driver BOOLEAN DEFAULT false,
  signed_by_security BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.custody_transfers ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Finance, Planner, and Managers can read
CREATE POLICY "billing_read_custody" ON public.custody_transfers
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'Finance Manager', 'Planner', 'Operator MS')
  );

-- 2. Insert Policy: Planner/Operator MS generates the custody slip
CREATE POLICY "planner_insert_custody" ON public.custody_transfers
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' IN ('Planner', 'Operator MS', 'Super Admin')
  );
