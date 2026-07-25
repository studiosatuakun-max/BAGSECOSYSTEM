'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoFill = () => {
    setEmail('demo@horecagas.io');
    setPassword('demopass123');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      router.push('/portal/horeca/dashboard');
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen md:min-h-full md:h-full px-6 py-8 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex-1 flex flex-col justify-center w-full mx-auto max-w-sm">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/dashboard" className="inline-block mb-6 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted px-3 py-1.5 rounded-xl transition-colors">
            ← Back to Hub
          </Link>
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm overflow-hidden p-2.5">
            <img src="/assets/images/icon.png" alt="BaGS Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">HorecaGas</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your deliveries.</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-card p-6 rounded-[1.5rem] border border-border shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-input border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary transition-all"
                placeholder="name@horecagas.io"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-input border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Auto-fill Helper */}
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={handleAutoFill}
              type="button"
              className="w-full h-10 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[13px] rounded-lg transition-colors hover:brightness-95 flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              Auto-fill Demo Credentials
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
