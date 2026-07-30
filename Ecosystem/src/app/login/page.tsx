'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

// The 12 Demo Accounts matching the 12 Portals
const demoAccounts = [
  { role: 'Super Admin', portal: 'Command Center', email: 'admin@baskara.id', pwd: 'BaGS@2026!', icon: 'ShieldCheckIcon', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 border-indigo-500/30' },
  { role: 'B2B Director', portal: 'Industrial Portal', email: 'industrial@baskara.id', pwd: 'BaGS@2026!', icon: 'BuildingOfficeIcon', color: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border-amber-500/30' },
  { role: 'B2B Sales', portal: 'Horeca Portal', email: 'horeca@baskara.id', pwd: 'BaGS@2026!', icon: 'FireIcon', color: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-200 border-orange-500/30' },
  { role: 'Station Operator', portal: 'Stasiun', email: 'stasiun@baskara.id', pwd: 'BaGS@2026!', icon: 'CpuChipIcon', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 border-emerald-500/30' },
  { role: 'Fleet Manager', portal: 'Armada', email: 'armada@baskara.id', pwd: 'BaGS@2026!', icon: 'TruckIcon', color: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 border-blue-500/30' },
  { role: 'B2C Customer', portal: 'Customer App', email: 'customer@baskara.id', pwd: 'BaGS@2026!', icon: 'ShoppingBagIcon', color: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-200 border-yellow-500/30' },
  { role: 'CFO / Finance', portal: 'Keuangan', email: 'keuangan@baskara.id', pwd: 'BaGS@2026!', icon: 'BanknotesIcon', color: 'bg-green-500/10 hover:bg-green-500/20 text-green-200 border-green-500/30' },
  { role: 'Marketing Head', portal: 'Pemasaran', email: 'pemasaran@baskara.id', pwd: 'BaGS@2026!', icon: 'PresentationChartLineIcon', color: 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 border-pink-500/30' },
  { role: 'HR Manager', portal: 'HRD', email: 'hr@baskara.id', pwd: 'BaGS@2026!', icon: 'UsersIcon', color: 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-200 border-violet-500/30' },
  { role: 'Driver', portal: 'GasDrive', email: 'driver@baskara.id', pwd: 'BaGS@2026!', icon: 'MapIcon', color: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 border-cyan-500/30' },
  { role: 'Skid Lead', portal: 'Skid Portal', email: 'skid@baskara.id', pwd: 'BaGS@2026!', icon: 'ScaleIcon', color: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 border-rose-500/30' },
  { role: 'Legal Officer', portal: 'Legal & Compliance', email: 'legal@baskara.id', pwd: 'BaGS@2026!', icon: 'DocumentCheckIcon', color: 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-200 border-slate-500/30' },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const destinationUrl = searchParams.get('redirect');

  const attemptLogin = async (loginEmail: string, loginPwd: string) => {
    setErrorMsg(null);
    if (!loginEmail || !loginPwd) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPwd }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Login gagal. Periksa kembali kredensial Anda.');
        setIsLoading(false);
        return;
      }

      const redirectTo = destinationUrl || json.redirectTo || '/';
      router.push(redirectTo);
      router.refresh();
    } catch {
      setErrorMsg('Koneksi gagal. Periksa jaringan dan coba lagi.');
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await attemptLogin(email, password);
  };

  const handleAutoFillAndSubmit = async (acc: { email: string; pwd: string }) => {
    setEmail(acc.email);
    setPassword(acc.pwd);
    await attemptLogin(acc.email, acc.pwd);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="grain-overlay" aria-hidden="true" />
        <div className="ambient-glow-1 top-0 left-0 w-[800px] h-[800px] opacity-40 blur-[120px]" />
        <div className="ambient-glow-2 bottom-0 right-0 w-[600px] h-[600px] opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col xl:flex-row gap-12 lg:gap-20 items-center justify-between">
        
        {/* Left Side: Login Form (Bento Style) */}
        <div className="w-full xl:w-[450px] flex-shrink-0">
          <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden group shadow-[0_25px_80px_-15px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/images/logo.png" alt="BaGS Logo" className="h-12 w-auto object-contain drop-shadow-md" />
                <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
                  BaGS <span className="text-indigo-400">Ecosystem</span>
                </h1>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Access Portal</h2>
              <p className="text-sm text-slate-400 mt-2">
                {destinationUrl 
                  ? 'Sign in to access your requested secure module.' 
                  : 'Sign in with your enterprise division credentials.'}
              </p>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Icon name="EnvelopeIcon" size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700/60 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all shadow-inner"
                    placeholder="admin@baskara.id"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Icon name="LockClosedIcon" size={18} />
                  </div>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700/60 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
                  <Icon name="ExclamationCircleIcon" size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-200 leading-relaxed">{errorMsg}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-4 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <>
                    <Icon name="ArrowPathIcon" className="animate-spin" size={20} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In Securely
                    <Icon name="ArrowRightIcon" size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Bento Grid of Roles */}
        <div className="w-full flex-1">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-indigo-500" />
            <span className="font-bold uppercase tracking-widest text-indigo-400" style={{ fontSize: '11px' }}>
              Quick Demo Access
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
            Select a division role to auto-fill <br className="hidden md:block" />
            and sign in automatically.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAutoFillAndSubmit(acc)}
                className={`glass-bento rounded-3xl p-5 text-left flex flex-col group border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden relative ${acc.color}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/5`}>
                    <Icon name={acc.icon as any} size={20} className="opacity-90" />
                  </div>
                  <Icon name="ArrowRightIcon" size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white mb-1 drop-shadow-sm">{acc.role}</h3>
                  <p className="text-xs font-semibold opacity-70 drop-shadow-sm">{acc.portal}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
