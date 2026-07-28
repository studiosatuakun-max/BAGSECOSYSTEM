-- ============================================
-- MODULE: Armada | Form Surat Jalan CNG & HORECA DO
-- ============================================

CREATE TABLE IF NOT EXISTS public.surat_jalan_cnf (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no_pengiriman TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL, -- Relations to customers table
  customer_address TEXT,
  
  no_gtm TEXT NOT NULL,
  no_head TEXT NOT NULL,
  driver_id UUID REFERENCES auth.users(id),
  
  depart_time TIMESTAMPTZ NOT NULL,
  depart_pressure_bar NUMERIC(6,2) NOT NULL CHECK (depart_pressure_bar <= 250),
  depart_temp_c NUMERIC(5,2),
  
  prs_start_time TIMESTAMPTZ,
  prs_start_pressure_bar NUMERIC(6,2),
  prs_start_temp_c NUMERIC(5,2),
  prs_start_meter NUMERIC(15,2),
  
  prs_finish_time TIMESTAMPTZ,
  prs_finish_pressure_bar NUMERIC(6,2),
  prs_finish_temp_c NUMERIC(5,2),
  prs_finish_meter NUMERIC(15,2),
  
  return_prs_time TIMESTAMPTZ,
  arrival_plant_time TIMESTAMPTZ,
  
  signed_by_ppc BOOLEAN DEFAULT false,
  signed_by_driver BOOLEAN DEFAULT false,
  signed_by_security BOOLEAN DEFAULT false,
  signed_by_customer BOOLEAN DEFAULT false,
  
  status TEXT DEFAULT 'Dispatched' CHECK (status IN ('Dispatched', 'Arrived_At_Client', 'Discharging', 'Returning', 'Completed', 'Void')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_prs_pressure CHECK (prs_finish_pressure_bar < depart_pressure_bar)
);

CREATE TABLE IF NOT EXISTS public.delivery_orders_horeca (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no_do TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  driver_id UUID REFERENCES auth.users(id),
  vehicle_type TEXT CHECK (vehicle_type IN ('Colt Diesel', 'Pick Up')),
  vehicle_plate TEXT NOT NULL,
  
  qty_delivered_full INTEGER NOT NULL CHECK (qty_delivered_full > 0),
  qty_returned_empty INTEGER DEFAULT 0 CHECK (qty_returned_empty >= 0),
  
  depart_time TIMESTAMPTZ NOT NULL,
  delivered_time TIMESTAMPTZ,
  
  status TEXT DEFAULT 'In_Transit' CHECK (status IN ('In_Transit', 'Delivered', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.surat_jalan_cnf ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_orders_horeca ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Fleet Manager, Planner, and specific Drivers can read
CREATE POLICY "fleet_read_surat_jalan" ON public.surat_jalan_cnf
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'Fleet Manager', 'Planner') OR 
    driver_id = auth.uid()
  );

-- 2. Insert/Update Policy: Planners and Fleet Managers create dispatch orders
CREATE POLICY "planner_insert_surat_jalan" ON public.surat_jalan_cnf
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' IN ('Planner', 'Fleet Manager', 'Super Admin')
  );

-- 3. Update Policy: Drivers can only update status and fill PRS details
CREATE POLICY "driver_update_surat_jalan" ON public.surat_jalan_cnf
  FOR UPDATE USING (
    driver_id = auth.uid()
  ) WITH CHECK (
    driver_id = auth.uid()
  );
