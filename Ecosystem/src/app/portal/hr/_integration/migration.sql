-- ============================================
-- MODULE: HR | Employee Training & Shifts
-- ============================================

CREATE TABLE IF NOT EXISTS public.employee_trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES auth.users(id),
  
  training_name TEXT NOT NULL,
  training_date DATE NOT NULL,
  
  attendance_doc_url TEXT,
  material_doc_url TEXT,
  proof_photo_url TEXT,
  
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Missed')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employee_shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES auth.users(id),
  
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('Pagi', 'Siang', 'Malam', 'Fleksibel')),
  role_assigned TEXT NOT NULL CHECK (role_assigned IN ('Operator MS', 'Driver Industri', 'Driver Horeca', 'Helper')),
  
  estimated_workload_note TEXT,
  is_dynamic_change BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.employee_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_shifts ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Employees can view their own, HR/Managers view all
CREATE POLICY "hr_read_trainings" ON public.employee_trainings
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'GM', 'Planner') OR 
    employee_id = auth.uid()
  );

CREATE POLICY "hr_read_shifts" ON public.employee_shifts
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('Super Admin', 'GM', 'Planner') OR 
    employee_id = auth.uid()
  );

-- 2. Insert/Update Policy: Only Planners and Admins can assign shifts and record trainings
CREATE POLICY "planner_manage_shifts" ON public.employee_shifts
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('Planner', 'Super Admin')
  );
  
CREATE POLICY "admin_manage_trainings" ON public.employee_trainings
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('Super Admin')
  );
