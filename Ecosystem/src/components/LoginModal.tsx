'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationUrl?: string; // The portal URL the user was trying to access
}

const demoAccounts = [
  { role: 'Super Admin', email: 'admin@baskara.id', pwd: 'password123', icon: 'ShieldCheckIcon', color: 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-100 border-indigo-400/40' },
  { role: 'Station Operator', email: 'stasiun@baskara.id', pwd: 'password123', icon: 'CpuChipIcon', color: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border-emerald-400/40' },
  { role: 'Fleet Manager', email: 'armada@baskara.id', pwd: 'password123', icon: 'TruckIcon', color: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-blue-400/40' },
  { role: 'Finance Controller', email: 'keuangan@baskara.id', pwd: 'password123', icon: 'BanknotesIcon', color: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border-amber-400/40' },
  { role: 'HR Manager', email: 'hr@baskara.id', pwd: 'password123', icon: 'UsersIcon', color: 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-100 border-violet-400/40' },
  { role: 'Skid Operator', email: 'skid@baskara.id', pwd: 'password123', icon: 'ScaleIcon', color: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-100 border-orange-400/40' },
];

export default function LoginModal({ isOpen, onClose, destinationUrl }: LoginModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleAutoFillAndSubmit = async (acc: { email: string; pwd: string }) => {
    setEmail(acc.email);
    setPassword(acc.pwd);
    setErrorMsg(null);
    
    // Simulate auto-typing then submitting
    setIsLoading(true);
    await attemptLogin(acc.email, acc.pwd);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await attemptLogin(email, password);
  };

  const attemptLogin = async (loginEmail: string, loginPwd: string) => {
    setErrorMsg(null);

    if (!loginEmail || !loginPwd) {
      setErrorMsg('Email dan password wajib diisi.');
      setIsLoading(false);
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

      // Priority redirect: 
      // 1. Destination requested by user click
      // 2. Redirect passed in URL
      // 3. Default redirect from API (based on role)
      let redirectTo = destinationUrl || searchParams.get('redirect') || json.redirectTo || '/';
      
      // If Super Admin logs in, they might just want to stay on landing page if no specific destination was clicked
      if (json.redirectTo === '/dashboard' && !destinationUrl && !searchParams.get('redirect')) {
         redirectTo = '/'; 
      }

      router.push(redirectTo);
      router.refresh(); // Force middleware check
      onClose();
    } catch {
      setErrorMsg('Koneksi gagal. Periksa jaringan dan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 my-auto transform transition-all">
        
        {/* Left Side - Quick Roles (Visible on md+) */}
        <div className="hidden md:flex flex-col w-2/5 bg-slate-950 p-8 border-r border-slate-800 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Quick Demo Access
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Select a role below to auto-fill credentials and sign in automatically.</p>
            
            <div className="flex flex-col gap-3">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAutoFillAndSubmit(acc)}
                  className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-md transition-all duration-300 group shadow-sm hover:scale-[1.02] ${acc.color}`}
                >
                  <Icon name={acc.icon} size={20} className="shrink-0" />
                  <span className="font-semibold text-sm tracking-tight">{acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 sm:p-10 relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>

          <div className="text-center md:text-left mb-8 mt-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img src="/assets/images/logo.png" alt="BaGS Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-extrabold text-white tracking-tight">BaGS <span className="text-indigo-400">Ecosystem</span></h1>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In</h2>
            <p className="text-sm text-slate-400 mt-1">Enter credentials to access {destinationUrl ? 'the selected module' : 'your workspace'}.</p>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Icon name="EnvelopeIcon" size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900 transition-all shadow-inner"
                  placeholder="admin@baskara.id"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Icon name="LockClosedIcon" size={18} />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900 transition-all shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Icon name="ExclamationCircleIcon" size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-300 leading-relaxed">{errorMsg}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Icon name="ArrowPathIcon" className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Access
                  <Icon name="ArrowRightIcon" size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Mobile Quick Roles */}
          <div className="md:hidden mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Demo Quick Login</h3>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAutoFillAndSubmit(acc)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${acc.color}`}
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
