'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient';

const demoAccounts = [
  { role: 'Super Admin', email: 'admin@baskara.id', pwd: 'password123', icon: 'ShieldCheckIcon', color: 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200' },
  { role: 'Fleet Manager', email: 'fleet@baskara.id', pwd: 'password123', icon: 'TruckIcon', color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' },
  { role: 'Finance Director', email: 'finance@baskara.id', pwd: 'password123', icon: 'BanknotesIcon', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' },
  { role: 'HR Manager', email: 'hr@baskara.id', pwd: 'password123', icon: 'UsersIcon', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-200' },
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
      alert(`Supabase Auth Failed: ${error.message}\n\n(Bypassing for Demo Purposes)`);
    } else {
      console.log('Supabase Auth Success!', data);
    }

    // Redirect to dashboard (fallback logic for demo if users aren't created yet)
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
        
        {/* Left Side - Branding / Welcome */}
        <div className="hidden md:flex flex-col justify-center space-y-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="CubeTransparentIcon" className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">BaGS <span className="text-indigo-600">Ecosystem</span></h1>
          </div>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            Welcome to the centralized management portal for PT Baskara Asri Ghas. 
            Access all enterprise modules, from Fleet Tracking to Financial Analytics, in one secure platform.
          </p>
          
          <div className="pt-8 mt-8 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Demo Access</h3>
            <p className="text-xs text-slate-500 mb-4">Select a role below to auto-fill the login credentials.</p>
            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAutoFill(acc)}
                  className={`flex items-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all duration-200 ${acc.color}`}
                >
                  <Icon name={acc.icon} size={18} />
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
          
          {/* Mobile Branding (Only visible on small screens) */}
          <div className="md:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <Icon name="CubeTransparentIcon" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">BaGS <span className="text-indigo-600">Ecosystem</span></h1>
          </div>

          <div className="text-center mb-8 md:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Enter your credentials to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Icon name="EnvelopeIcon" size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="admin@baskara.id"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Icon name="LockClosedIcon" size={18} />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Icon name="ArrowPathIcon" className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <Icon name="ArrowRightIcon" size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Mobile Auto-fill options */}
          <div className="md:hidden mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 text-center">Demo Auto-fill</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAutoFill(acc)}
                  className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-all ${acc.color}`}
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
