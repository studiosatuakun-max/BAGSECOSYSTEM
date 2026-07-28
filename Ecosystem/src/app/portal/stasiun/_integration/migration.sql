-- ============================================
-- MODULE: Stasiun | Form No. 101 Master Fueling Record
-- ============================================

CREATE TABLE IF NOT EXISTS public.master_fueling_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  queue_no INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  tube_trailer_no TEXT NOT NULL,
  no_pol TEXT NOT NULL,
  lwc NUMERIC(10,2),
  arrival_from TEXT,
  
  start_time TIME NOT NULL,
  finish_time TIME,
  
  -- Safety Constraint: Max 250 Bar
  pressure_initial_bar NUMERIC(6,2) CHECK (pressure_initial_bar <= 250),
  pressure_full_bar NUMERIC(6,2) CHECK (pressure_full_bar <= 250),
  temp_start_c NUMERIC(5,2),
  temp_finish_c NUMERIC(5,2),
  
  fill_post_number TEXT,
  volume_start_nm3 NUMERIC(12,2),
  volume_finish_nm3 NUMERIC(12,2),
  volume_delivery_nm3 NUMERIC(12,2) NOT NULL,
  volume_delivery_kg NUMERIC(12,2) NOT NULL,
  
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Completed', 'Void')),
  operator_id UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CHILD TABLES: ATEX Inspection & Compressor Logs
-- ============================================

CREATE TABLE IF NOT EXISTS public.atex_inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fueling_record_id UUID REFERENCES public.master_fueling_records(id) ON DELETE CASCADE,
  inspection_type TEXT CHECK (inspection_type IN ('PRE_FILL', 'POST_FILL')),
  quick_connect_safety_rope BOOLEAN DEFAULT false,
  grounding_cable_tyre_stopper BOOLEAN DEFAULT false,
  sign_filling_process BOOLEAN DEFAULT false,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compressor_hour_running (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fueling_record_id UUID REFERENCES public.master_fueling_records(id) ON DELETE CASCADE,
  compressor_name TEXT CHECK (compressor_name IN ('IMW-01', 'IMW-02', 'AGIRA')),
  start_hour NUMERIC(10,1) NOT NULL,
  finish_hour NUMERIC(10,1) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_hour_running CHECK (finish_hour >= start_hour)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.master_fueling_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atex_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compressor_hour_running ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: All Operational Managers & Ops Team can read
CREATE POLICY "ops_read_fueling" ON public.master_fueling_records
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'Fleet Manager', 'Operator MS', 'Planner')
  );

-- 2. Insert Policy: Only Station Operators can create new logs
CREATE POLICY "operator_insert_fueling" ON public.master_fueling_records
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' IN ('Operator MS', 'Super Admin')
  );
