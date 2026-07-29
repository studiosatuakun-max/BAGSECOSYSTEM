'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, Lock, ArrowLeft, Home } from 'lucide-react';

// Role → Portal label mapping untuk UX yang informatif
const ROLE_PORTAL_MAP: Record<string, { label: string; href: string; color: string }> = {
  super_admin:        { label: 'Dashboard Utama',         href: '/dashboard',         color: 'text-purple-400' },
  station_operator:  { label: 'Portal Stasiun',          href: '/portal/stasiun',    color: 'text-emerald-400' },
  fleet_manager:     { label: 'Portal Armada',           href: '/portal/armada',     color: 'text-cyan-400' },
  fleet_driver:      { label: 'Driver App',              href: '/portal/pwa',        color: 'text-sky-400' },
  finance_controller:{ label: 'Portal Keuangan',         href: '/portal/keuangan',   color: 'text-amber-400' },
  hr_manager:        { label: 'Portal HR',               href: '/portal/hr',         color: 'text-violet-400' },
  legal_officer:     { label: 'Portal Legal',            href: '/portal/legal',      color: 'text-indigo-400' },
  marketing_ae:      { label: 'Portal Pemasaran',        href: '/portal/pemasaran',  color: 'text-rose-400' },
  skid_operator:     { label: 'Portal Skid',             href: '/portal/skid',       color: 'text-orange-400' },
  horeca_sales:      { label: 'Portal Horeca',           href: '/portal/horeca',     color: 'text-yellow-400' },
  industrial_director:{ label: 'Portal Industrial',      href: '/portal/industrial', color: 'text-blue-400' },
};

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const attempted = searchParams.get('attempted') ?? '/portal/unknown';
  const role = searchParams.get('role') ?? 'unknown';

  const authorizedPortal = ROLE_PORTAL_MAP[role];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-950"
      style={{ backgroundImage: "url('/assets/images/background.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-0" />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center backdrop-blur-md shadow-2xl shadow-red-500/10">
              <Lock className="w-12 h-12 text-red-400" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
          </div>
        </div>

        {/* Main Content Panel */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* Error Code */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-400/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-bold text-red-400 tracking-widest uppercase">403 — Akses Ditolak</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
            Tidak Punya Izin
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Role kamu saat ini tidak memiliki akses ke portal{' '}
            <code className="px-2 py-0.5 rounded-lg bg-slate-800 text-red-300 text-xs font-mono border border-slate-700">
              {attempted}
            </code>
            . Sistem RBAC BaGS Ecosystem membatasi akses berdasarkan divisi dan jabatan.
          </p>

          {/* Divider */}
          <div className="border-t border-white/10 mb-8" />

          {/* Role Info */}
          <div className="bg-slate-900/60 rounded-2xl p-5 mb-6 text-left border border-white/5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hak Akses Kamu</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Role:{' '}
                  <span className="text-indigo-400 font-mono">
                    {role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </p>
                {authorizedPortal ? (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Portal kamu:{' '}
                    <span className={`font-semibold ${authorizedPortal.color}`}>
                      {authorizedPortal.label}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hubungi administrator untuk mengatur akses.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>
            
            {authorizedPortal ? (
              <button
                onClick={() => router.push(authorizedPortal.href)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-indigo-600/25"
              >
                <Home className="w-4 h-4" />
                Ke Portal Saya
              </button>
            ) : (
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-indigo-600/25"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-xs text-slate-600">
          © {new Date().getFullYear()} PT Baskara Asri Ghas · BaGS Ecosystem Security Layer
        </p>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="w-6 h-6 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
