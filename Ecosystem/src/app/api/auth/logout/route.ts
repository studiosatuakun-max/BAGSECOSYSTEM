/**
 * POST /api/auth/logout
 * ─────────────────────────────────────────────────────────────────────────────
 * Endpoint logout — membersihkan session Supabase dan menghapus cookies.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const response = NextResponse.json({ success: true });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // Sign out dari Supabase — otomatis clear cookies session
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[AUTH_LOGOUT] Supabase sign out error:', error.message);
    }

    return NextResponse.json(
      { success: true, message: 'Logout berhasil.' },
      { status: 200, headers: response.headers }
    );
  } catch (err) {
    console.error('[AUTH_LOGOUT] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
