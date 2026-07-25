'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    setTimeout(() => { router.push('/dashboard'); }, 800);
  };

  const autoFill = () => {
    setEmail('marcus.osei@gasdrive.io');
    setPassword('DriveS4fe#2026');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] px-6 py-8">
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--sky-500)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm text-white">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c1.6 4 3.6 4.4 4.8 6A6 6 0 0 1 18 12a6 6 0 0 1-12 0c0-.4 0-.8.1-1.2a2.5 2.5 0 1 0 4-2.4C11.4 7.5 12 2 12 2z"/>
            </svg>
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
              className="w-full h-12 bg-[var(--sky-500)] text-white rounded-xl font-bold mt-2 shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="text-xs font-bold text-[var(--sky-600)] hover:text-[var(--sky-700)] transition-colors inline-flex items-center gap-1.5"
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
