/**
 * supabaseSSR.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side Supabase client menggunakan cookie-based session.
 * Dipakai di:
 *   - Server Components (read-only, menggunakan session user yang login)
 *   - Next.js Middleware (untuk validasi JWT / RBAC)
 *   - Route Handlers yang butuh user context (bukan admin bypass)
 *
 * RLS TETAP BERJALAN — client ini tidak bypass RLS.
 * Session user diambil dari cookie HTTP-only yang diset saat login.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Buat Supabase client untuk Server Components.
 * Harus dipanggil inside async Server Component karena menggunakan `cookies()`.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll dipanggil dari Server Component — ignore, middleware yang handle refresh
        }
      },
    },
  });
}

/**
 * Buat Supabase client untuk Next.js Middleware.
 * Menerima request & response untuk bisa set/get cookies di edge.
 */
export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
}

/**
 * Buat Supabase admin client untuk Server Actions.
 * Bypass RLS karena kita menggunakan Dummy Auth di fase development.
 */
export function createSupabaseAdmin() {
  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() { return []; },
      setAll() {},
    },
  });
}
