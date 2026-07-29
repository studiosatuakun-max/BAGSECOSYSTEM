/**
 * supabaseBrowser.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Browser-side Supabase client menggunakan anon key.
 * Dipakai di Client Components ('use client') untuk operasi yang butuh
 * autentikasi user (RLS akan berjalan berdasarkan session cookie user).
 *
 * ✅ Aman dipakai di: Client Components, hooks, event handlers browser
 * ❌ Jangan gunakan untuk operasi admin / bypass RLS
 */
'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Singleton browser client — gunakan ini di semua Client Components.
 * Session otomatis dibaca dari cookie yang di-set oleh server.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
