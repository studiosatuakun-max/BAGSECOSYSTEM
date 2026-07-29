/**
 * supabaseServer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-ONLY Supabase client menggunakan service_role key.
 *
 * ⚠️  SECURITY: File ini WAJIB hanya digunakan di:
 *   - Server Actions (`'use server'`)
 *   - API Routes (`app/api/.../route.ts`)
 *   - Server Components yang membutuhkan bypass RLS
 *
 * ❌ DILARANG KERAS diimport di Client Components atau file dengan `'use client'`.
 *    Service role key dapat menembus semua RLS policies!
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('[supabaseServer] NEXT_PUBLIC_SUPABASE_URL is not set.');
}
if (!supabaseServiceRoleKey) {
  throw new Error('[supabaseServer] SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (without NEXT_PUBLIC_ prefix).');
}

/**
 * Admin-level Supabase client — bypasses RLS.
 * Gunakan untuk operasi server-side yang butuh akses penuh (seed data, admin actions).
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
