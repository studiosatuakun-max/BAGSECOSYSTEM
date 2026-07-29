-- ============================================================
-- Seed 01: Demo User Accounts & Profiles
-- ============================================================
-- PERHATIAN: Script ini menggunakan Supabase Admin API untuk create users.
-- Jalankan via Supabase SQL Editor dengan service_role access.
-- Password semua demo account: BaGS@2026!
-- ============================================================

-- STEP 1: Buat demo users via auth.users (hanya bisa dilakukan via Supabase Dashboard atau Admin API)
-- Gunakan Supabase Dashboard > Authentication > Users > Add User untuk membuat accounts berikut:
--
-- | Email                    | Password     | Role di App Metadata |
-- |--------------------------|--------------|----------------------|
-- | admin@baskara.id         | BaGS@2026!   | super_admin          |
-- | stasiun@baskara.id       | BaGS@2026!   | station_operator     |
-- | armada@baskara.id        | BaGS@2026!   | fleet_manager        |
-- | driver@baskara.id        | BaGS@2026!   | fleet_driver         |
-- | keuangan@baskara.id      | BaGS@2026!   | finance_controller   |
-- | hr@baskara.id            | BaGS@2026!   | hr_manager           |
-- | legal@baskara.id         | BaGS@2026!   | legal_officer        |
-- | pemasaran@baskara.id     | BaGS@2026!   | marketing_ae         |
-- | skid@baskara.id          | BaGS@2026!   | skid_operator        |
-- | horeca@baskara.id        | BaGS@2026!   | horeca_sales         |
-- | industrial@baskara.id    | BaGS@2026!   | industrial_director  |

-- STEP 2: Setelah user dibuat, set app_metadata via Supabase Dashboard atau SQL berikut:
-- (Jalankan SETELAH user dibuat, ganti <USER_UUID> dengan UUID actual dari dashboard)

-- Contoh untuk admin:
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "super_admin", "division": "admin"}'
-- WHERE email = 'admin@baskara.id';

-- Script SQL untuk update app_metadata semua users sekaligus:
-- Ganti UUID-nya sesuai actual dari Supabase Auth dashboard

DO $$
DECLARE
  users JSONB := '[
    {"email": "admin@baskara.id",      "role": "super_admin",         "division": "admin",      "name": "Super Admin BaGS"},
    {"email": "stasiun@baskara.id",    "role": "station_operator",    "division": "stasiun",    "name": "Budi Operator MS"},
    {"email": "armada@baskara.id",     "role": "fleet_manager",       "division": "armada",     "name": "Hendra Fleet Manager"},
    {"email": "driver@baskara.id",     "role": "fleet_driver",        "division": "pwa",        "name": "Ahmad Fauzi Driver"},
    {"email": "keuangan@baskara.id",   "role": "finance_controller",  "division": "keuangan",   "name": "Sari CFO"},
    {"email": "hr@baskara.id",         "role": "hr_manager",          "division": "hr",         "name": "Dewi HR Manager"},
    {"email": "legal@baskara.id",      "role": "legal_officer",       "division": "legal",      "name": "Dr. Hendra Legal"},
    {"email": "pemasaran@baskara.id",  "role": "marketing_ae",        "division": "pemasaran",  "name": "Rudi Sales AE"},
    {"email": "skid@baskara.id",       "role": "skid_operator",       "division": "skid",       "name": "Joko Skid Lead"},
    {"email": "horeca@baskara.id",     "role": "horeca_sales",        "division": "horeca",     "name": "Nina Horeca Sales"},
    {"email": "industrial@baskara.id", "role": "industrial_director", "division": "industrial", "name": "Darmawan Director"}
  ]'::JSONB;
  user_record JSONB;
  user_id UUID;
BEGIN
  FOR user_record IN SELECT jsonb_array_elements(users)
  LOOP
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_record->>'email';

    IF user_id IS NOT NULL THEN
      -- Update app_metadata dengan role dan division
      UPDATE auth.users
      SET
        raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::JSONB) ||
          jsonb_build_object('role', user_record->>'role', 'division', user_record->>'division'),
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::JSONB) ||
          jsonb_build_object('full_name', user_record->>'name')
      WHERE id = user_id;

      -- Upsert ke tabel profiles
      INSERT INTO public.profiles (id, full_name, role, division)
      VALUES (
        user_id,
        user_record->>'name',
        user_record->>'role',
        user_record->>'division'
      )
      ON CONFLICT (id) DO UPDATE
      SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        division = EXCLUDED.division,
        updated_at = NOW();

      RAISE NOTICE 'Updated user: % with role: %', user_record->>'email', user_record->>'role';
    ELSE
      RAISE WARNING 'User not found: %. Create this user in Supabase Auth dashboard first.', user_record->>'email';
    END IF;
  END LOOP;
END $$;
