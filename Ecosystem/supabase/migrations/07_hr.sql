-- ============================================================
-- Migration 07: Modul HR — Enterprise Workforce Management
-- Employees + Trainings + Shift Schedules + Attendance
-- ============================================================

-- ── Table: employees ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_no   TEXT UNIQUE NOT NULL,     -- EMP-001, EMP-002, dll
  full_name     TEXT NOT NULL,
  department    TEXT NOT NULL
                CHECK (department IN (
                  'Skid Fleet & Drivers (ATEX)',
                  'Mother Station Operations',
                  'Horeca & Industrial Sales (AE)',
                  'Engineering & PRMS SCADA',
                  'Corporate Finance & HR',
                  'QHSE & MIGAS Compliance'
                )),
  role_title    TEXT NOT NULL,
  sio_number    TEXT,                     -- SIO-ATEX-2025-089
  sio_type      TEXT
                CHECK (sio_type IN ('SIO-ATEX', 'SIO-MIGAS', 'SIO-HSE', NULL)),
  sio_expiry    DATE,
  join_date     DATE,
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  status        TEXT NOT NULL DEFAULT 'Active'
                CHECK (status IN ('Active', 'Inactive', 'On_Leave', 'Suspended')),
  profile_id    UUID UNIQUE REFERENCES auth.users(id),  -- Link ke Supabase Auth (opsional)
  kpi_score     NUMERIC(5,2),             -- Persentase KPI, misal 94.1
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS emp_department_idx ON employees(department);
CREATE INDEX IF NOT EXISTS emp_status_idx ON employees(status);
CREATE INDEX IF NOT EXISTS emp_sio_expiry_idx ON employees(sio_expiry);

-- ── RLS: employees ────────────────────────────────────────────
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- HR Manager dan Super Admin bisa lihat semua
CREATE POLICY "employees_select_hr"
  ON employees FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );

-- Employee bisa lihat data diri sendiri
CREATE POLICY "employees_select_self"
  ON employees FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "employees_insert"
  ON employees FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );

CREATE POLICY "employees_update"
  ON employees FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );

CREATE POLICY "employees_delete"
  ON employees FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );


-- ── Table: employee_trainings ─────────────────────────────────
CREATE TABLE IF NOT EXISTS employee_trainings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  training_name TEXT NOT NULL,
  training_type TEXT
                CHECK (training_type IN ('ATEX', 'HSE', 'MIGAS', 'OJT', 'Safety', 'Technical', 'Other')),
  training_date DATE NOT NULL,
  expiry_date   DATE,
  venue         TEXT,
  trainer       TEXT,
  certificate_no TEXT,
  status        TEXT NOT NULL DEFAULT 'Scheduled'
                CHECK (status IN ('Scheduled', 'In_Progress', 'Completed', 'Cancelled', 'Failed')),
  notes         TEXT,
  recorded_by   UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trainings_updated_at
  BEFORE UPDATE ON employee_trainings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS trainings_employee_idx ON employee_trainings(employee_id);
CREATE INDEX IF NOT EXISTS trainings_date_idx ON employee_trainings(training_date DESC);

-- ── RLS: employee_trainings ───────────────────────────────────
ALTER TABLE employee_trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainings_select"
  ON employee_trainings FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
    OR employee_id IN (SELECT id FROM employees WHERE profile_id = auth.uid())
  );

CREATE POLICY "trainings_insert_update"
  ON employee_trainings FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );

CREATE POLICY "trainings_update"
  ON employee_trainings FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );

CREATE POLICY "trainings_delete"
  ON employee_trainings FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );


-- ── Table: shift_schedules ────────────────────────────────────
CREATE TABLE IF NOT EXISTS shift_schedules (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id             UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  shift_date              DATE NOT NULL,
  shift_type              TEXT NOT NULL
                          CHECK (shift_type IN ('Pagi', 'Siang', 'Malam', 'Fleksibel', 'Off')),
  role_assigned           TEXT,              -- 'Driver Industri' | 'Operator MS' | dll
  work_location           TEXT,
  estimated_workload_note TEXT,
  is_dynamic_change       BOOLEAN NOT NULL DEFAULT FALSE,
  attendance_in           TIME,             -- jam masuk aktual (dari biometric)
  attendance_out          TIME,
  attendance_status       TEXT DEFAULT 'Scheduled'
                          CHECK (attendance_status IN ('Scheduled', 'Present', 'Absent', 'Late', 'On_Leave')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER shifts_updated_at
  BEFORE UPDATE ON shift_schedules
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX IF NOT EXISTS shifts_employee_idx ON shift_schedules(employee_id);
CREATE INDEX IF NOT EXISTS shifts_date_idx ON shift_schedules(shift_date DESC);

-- ── RLS: shift_schedules ──────────────────────────────────────
ALTER TABLE shift_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shifts_select"
  ON shift_schedules FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
    OR employee_id IN (SELECT id FROM employees WHERE profile_id = auth.uid())
  );

CREATE POLICY "shifts_insert"
  ON shift_schedules FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );

CREATE POLICY "shifts_update"
  ON shift_schedules FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );

CREATE POLICY "shifts_delete"
  ON shift_schedules FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('hr_manager', 'super_admin')
  );
