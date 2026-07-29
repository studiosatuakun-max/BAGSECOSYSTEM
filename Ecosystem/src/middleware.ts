/**
 * middleware.ts — Next.js Edge Middleware (RBAC Guard)
 * ─────────────────────────────────────────────────────────────────────────────
 * Berjalan di Vercel Edge Runtime SEBELUM setiap request masuk ke route handler.
 * Fungsi: Validasi session user dan enforce Role-Based Access Control (RBAC).
 *
 * ALUR:
 * 1. Ambil session dari cookie (via Supabase SSR)
 * 2. Jika belum login & akses route protected → redirect ke /login
 * 3. Jika sudah login → ekstrak role dari user.app_metadata.role
 * 4. Cek apakah role diizinkan mengakses route yang diminta
 * 5. Jika tidak diizinkan → redirect ke /unauthorized
 * 6. Refresh session token jika expired (silent refresh)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabaseSSR';

// ─── RBAC Role-to-Route Mapping ───────────────────────────────────────────────
const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    '/portal/stasiun',
    '/portal/armada',
    '/portal/keuangan',
    '/portal/hr',
    '/portal/legal',
    '/portal/pemasaran',
    '/portal/skid',
    '/portal/horeca',
    '/portal/industrial',
    '/portal/pelanggan',
    '/portal/pwa',
    '/dashboard',
    '/api',
  ],
  station_operator: ['/portal/stasiun', '/dashboard'],
  fleet_manager: ['/portal/armada', '/dashboard'],
  fleet_driver: ['/portal/pwa', '/dashboard'],
  finance_controller: ['/portal/keuangan', '/dashboard'],
  hr_manager: ['/portal/hr', '/dashboard'],
  legal_officer: ['/portal/legal', '/dashboard'],
  marketing_ae: ['/portal/pemasaran', '/dashboard'],
  skid_operator: ['/portal/skid', '/dashboard'],
  horeca_sales: ['/portal/horeca', '/dashboard'],
  industrial_director: ['/portal/industrial', '/dashboard'],
};

// ─── Routes yang TIDAK perlu auth (public) ───────────────────────────────────
const PUBLIC_ROUTES = ['/', '/login', '/unauthorized'];
const PUBLIC_PREFIXES = ['/api/auth', '/_next', '/static'];

// ─── Routes yang perlu dilindungi ────────────────────────────────────────────
const PROTECTED_PREFIXES = ['/portal/', '/dashboard'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function hasPermission(role: string, pathname: string): boolean {
  const allowedRoutes = ROLE_PERMISSIONS[role] ?? [];
  return allowedRoutes.some((allowed) => pathname.startsWith(allowed));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Selalu izinkan: static files, _next, file ekstensi
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    /\.\w+$/.test(pathname) // file dengan ekstensi
  ) {
    return NextResponse.next();
  }

  // Buat response base dulu (wajib agar cookie bisa di-refresh oleh SSR client)
  const response = NextResponse.next({ request });

  // Tambahkan Security Headers (OWASP A05)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // ── Route public → langsung lolos ─────────────────────────────────────────
  if (isPublicRoute(pathname)) {
    return response;
  }

  // Buat Supabase client dengan cookie context (untuk session refresh)
  const supabase = createSupabaseMiddlewareClient(request, response);

  // Ambil session user (otomatis refresh token jika expired)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ── Route protected → wajib login ─────────────────────────────────────────
  if (isProtectedRoute(pathname)) {
    if (!session) {
      // Belum login → redirect ke /login dengan param return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ── Cek RBAC permission ──────────────────────────────────────────────────
    const userRole = (session.user.app_metadata?.role as string) ?? 'fleet_driver';

    // /dashboard boleh diakses semua role yang sudah login
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      return response;
    }

    // Cek apakah role punya akses ke portal yang diminta
    if (pathname.startsWith('/portal/') && !hasPermission(userRole, pathname)) {
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      unauthorizedUrl.searchParams.set('attempted', pathname);
      unauthorizedUrl.searchParams.set('role', userRole);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return response;
}

// Konfigurasi: middleware berjalan di semua path kecuali static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
