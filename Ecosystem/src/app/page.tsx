'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient';

const demoAccounts = [
  { role: 'Super Admin', email: 'admin@baskara.id', pwd: 'password123', icon: 'ShieldCheckIcon', color: 'bg-white/20 hover:bg-white/35 text-white border-white/40 backdrop-blur-md shadow-md hover:scale-[1.02]' },
  { role: 'Fleet Manager', email: 'fleet@baskara.id', pwd: 'password123', icon: 'TruckIcon', color: 'bg-white/20 hover:bg-white/35 text-white border-white/40 backdrop-blur-md shadow-md hover:scale-[1.02]' },
  { role: 'Finance Director', email: 'finance@baskara.id', pwd: 'password123', icon: 'BanknotesIcon', color: 'bg-white/20 hover:bg-white/35 text-white border-white/40 backdrop-blur-md shadow-md hover:scale-[1.02]' },
  { role: 'HR Manager', email: 'hr@baskara.id', pwd: 'password123', icon: 'UsersIcon', color: 'bg-white/20 hover:bg-white/35 text-white border-white/40 backdrop-blur-md shadow-md hover:scale-[1.02]' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoFill = (acc: any) => {
    setEmail(acc.email);
    setPassword(acc.pwd);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert('Please enter email and password');
    
    setIsLoading(true);
    
    // Attempt Supabase Authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      console.warn('Supabase Auth Error:', error.message);
      // Suppress alert for a seamless demo experience
    } else {
      console.log('Supabase Auth Success!', data);
    }

    // Redirect to dashboard (fallback logic for demo if users aren't created yet)
    window.location.href = '/dashboard';
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/background.png')" }}
    >
      
      {/* Overlay to ensure text readability if background is busy */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] z-0" />

      {/* Ambient background glows */}
      <div className="ambient-glow-1 -top-20 -left-20 z-0 opacity-70" />
      <div className="ambient-glow-2 bottom-0 right-0 z-0 opacity-60" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 my-auto py-8">
        
        {/* Left Side - Branding / Welcome */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-7 flex-col justify-center space-y-6 pr-4 lg:pr-8">
          <div className="flex items-center gap-3">
            <img src="/assets/images/logo.png" alt="BaGS Logo" className="h-24 w-auto object-contain drop-shadow-md" />
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">BaGS <span className="text-indigo-400">Ecosystem</span></h1>
          </div>
          <p className="text-slate-200 text-base lg:text-lg font-normal leading-relaxed text-balance opacity-90">
            Welcome to the centralized management portal for PT Baskara Asri Ghas. 
            Access all enterprise modules, from Fleet Tracking to Financial Analytics, in one secure platform.
          </p>
          
          <div className="pt-6 mt-6 border-t border-white/15">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Quick Demo Access
            </h3>
            <p className="text-xs text-slate-300 mb-4 font-light">Select a role below to auto-fill authenticated credentials.</p>
            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAutoFill(acc)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border font-semibold text-xs lg:text-sm transition-all duration-300 ${acc.color}`}
                >
                  <Icon name={acc.icon} size={18} className="text-indigo-300" />
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form (Modern Frosted Glass Panel) */}
        <div className="md:col-span-6 lg:col-span-5 glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group hover:shadow-[0_25px_80px_-15px_rgba(79,46,229,0.25)] transition-all duration-500">
          
          {/* Subtle Ambient Glow inside form */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Mobile Branding (Only visible on small screens) */}
          <div className="md:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/assets/images/logo.png" alt="BaGS Logo" className="h-24 w-auto object-contain" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">BaGS <span className="text-indigo-600 dark:text-indigo-400">Ecosystem</span></h1>
          </div>

          <div className="text-center mb-8 md:text-left relative z-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sign In</h2>
            <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 mt-1.5 font-medium">Enter your credentials to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Icon name="EnvelopeIcon" size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/80 dark:border-slate-700/80 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/95 dark:focus:bg-slate-800 transition-all shadow-inner"
                  placeholder="admin@baskara.id"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Icon name="LockClosedIcon" size={18} />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/80 dark:border-slate-700/80 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/95 dark:focus:bg-slate-800 transition-all shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Icon name="ArrowPathIcon" className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <Icon name="ArrowRightIcon" size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Mobile Auto-fill options */}
          <div className="md:hidden mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 relative z-10">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 text-center">Demo Auto-fill</h3>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAutoFill(acc)}
                  className="p-2.5 rounded-xl border border-slate-300/60 bg-white/40 backdrop-blur-md font-bold text-xs text-slate-800 dark:text-white text-center hover:bg-white/70 transition-all shadow-sm"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer / Copyright */}
      <div className="absolute bottom-6 w-full text-center text-xs font-medium text-slate-400">
        &copy; {new Date().getFullYear()} PT Baskara Asri Ghas. All rights reserved.
      </div>
    </div>
  );
}
