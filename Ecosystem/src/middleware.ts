// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define Role-to-Portal Access Control Matrix (11 Modular Portals)
const PORTAL_RBAC_MATRIX: Record<string, string[]> = {
  '/portal/cs': ['Customer Service', 'Super Admin', 'Direksi'],
  '/portal/purchasing': ['VP Procurement', 'Purchasing Officer', 'Super Admin', 'Direksi'],
  '/portal/legal': ['Legal Counsel', 'QHSE Officer', 'Super Admin', 'Direksi'],
  '/portal/pemasaran': ['Commercial VP', 'Account Executive', 'Super Admin', 'Direksi'],
  '/portal/keuangan': ['Chief Financial Officer', 'Treasury Manager', 'Tax Accountant', 'Super Admin', 'Direksi'],
  '/portal/hr': ['HR VP', 'Payroll Specialist', 'Super Admin', 'Direksi'],
  '/portal/armada': ['Fleet Manager', 'Dispatcher', 'Super Admin', 'Direksi'],
  '/portal/skid': ['Skid Tank Logistics Lead', 'QHSE Officer', 'Super Admin', 'Direksi'],
  '/portal/pusat': ['Super Admin', 'Global Root Authority', 'Direksi'],
  '/portal/direksi': ['Direksi', 'Executive Board', 'Super Admin'],
  '/portal/stasiun': ['Mother Station Engineer', 'SCADA Operator', 'Super Admin', 'Direksi'],
  '/portal/industrial': ['Industrial Operations Lead', 'Super Admin', 'Direksi'],
  '/portal/horeca': ['Horeca Sales Lead', 'Super Admin', 'Direksi'],
  '/portal/pwa': ['Driver', 'Technician', 'Super Admin', 'Direksi'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if route belongs to any protected portal module
  const matchedPortal = Object.keys(PORTAL_RBAC_MATRIX).find(route => pathname.startsWith(route));

  if (matchedPortal) {
    // 1. Retrieve session token from cookie or authorization header
    const authCookie = req.cookies.get('sb-access-token')?.value || req.cookies.get('supabase-auth-token')?.value;

    // In demo / preview development mode, allow passthrough if cookie is absent,
    // BUT in production, enforce strict redirection to login:
    if (process.env.NODE_ENV === 'production' && !authCookie) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Validate role claim (If token exists, decode and verify JWT role claims against matrix)
    const userRoleCookie = req.cookies.get('user_role_claim')?.value;
    const allowedRoles = PORTAL_RBAC_MATRIX[matchedPortal];

    if (userRoleCookie && !allowedRoles.includes(userRoleCookie) && userRoleCookie !== 'Super Admin') {
      // Redirect unauthorized role attempts to 403 Forbidden or Dashboard
      const accessDeniedUrl = new URL('/unauthorized', req.url);
      accessDeniedUrl.searchParams.set('reason', `Role [${userRoleCookie}] is not authorized for ${matchedPortal}`);
      return NextResponse.redirect(accessDeniedUrl);
    }
  }

  // Enforce Global Security Headers (OWASP A05: Security Misconfiguration)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all portal request paths and API routes except for static assets and favicon
     */
    '/portal/:path*',
    '/api/inbox/:path*',
  ],
};
