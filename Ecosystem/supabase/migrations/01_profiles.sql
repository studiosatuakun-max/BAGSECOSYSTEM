-- ============================================================
-- Migration 01: profiles
-- Anchor table untuk semua user BaGS Ecosystem
-- Terhubung ke auth.users via foreign key
-- ============================================================

-- Auto-update updated_at helper function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Table: profiles ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name    TEXT NOT NULL DEFAULT '',
  role         TEXT NOT NULL DEFAULT 'fleet_driver'
               CHECK (role IN (
                 'super_admin', 'station_operator', 'fleet_manager', 'fleet_driver',
                 'finance_controller', 'hr_manager', 'legal_officer', 'marketing_ae',
                 'skid_operator', 'horeca_sales', 'industrial_director'
               )),
  division     TEXT NOT NULL DEFAULT 'pwa'
               CHECK (division IN (
                 'stasiun', 'armada', 'keuangan', 'hr', 'legal',
                 'pemasaran', 'skid', 'horeca', 'industrial', 'pwa', 'admin'
               )),
  employee_no  TEXT UNIQUE,
  avatar_url   TEXT,
  phone        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- User hanya bisa SELECT profil diri sendiri
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Super admin bisa SELECT semua profil
CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

-- User bisa UPDATE profil sendiri (nama, avatar, phone)
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Super admin bisa UPDATE semua profil
CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

-- INSERT: hanya via trigger atau super admin (user tidak bisa self-insert)
CREATE POLICY "profiles_insert_admin"
  ON profiles FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

-- ── Auto-create profile on new user signup ────────────────────
-- Trigger ini otomatis membuat row di profiles saat user baru dibuat di Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, division)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_app_meta_data ->> 'role', 'fleet_driver'),
    COALESCE(NEW.raw_app_meta_data ->> 'division', 'pwa')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
