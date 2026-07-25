'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { router.push('/portal/pwa/dashboard'); }, 800);
  };

  const autoFill = () => {
    setEmail('marcus.osei@gasdrive.io');
    setPassword('DriveS4fe#2026');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen md:min-h-full md:h-full bg-[#FAFAFA] px-6 py-8 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/dashboard" className="inline-block mb-6 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors">
            ← Back to Hub
          </Link>
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm overflow-hidden p-2.5">
            <img src="/assets/images/icon.png" alt="BaGS Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Driver Portal</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to start your route.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:border-[var(--sky-500)] focus:ring-2 focus:ring-[var(--sky-100)] transition-all"
                placeholder="name@gasdrive.io"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-900 focus:outline-none focus:border-[var(--sky-500)] focus:ring-2 focus:ring-[var(--sky-100)] transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold mt-2 shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Fill */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={autoFill}
              type="button"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:text-[var(--sky-700)] transition-colors inline-flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.91 8.84 3 9.27l5.46 4.73L6.82 21 12 17.27 17.18 21l-1.64-7 5.46-4.73-6.91-.43z"/></svg>
              Auto-fill Demo Credentials
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
