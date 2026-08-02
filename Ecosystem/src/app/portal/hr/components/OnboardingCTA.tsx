'use client';

import React from 'react';
import { UserPlus, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function OnboardingCTA() {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl transition-all duration-300 relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-700">
      <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400 font-bold">
            <UserPlus size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Start ATEX SIO &amp; Crew Onboarding
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Sparkles size={10} className="text-purple-500" />
              4 Personel dalam antrean orientasi
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
          <ShieldCheck size={11} />
          <span>MIGAS QHSE Ready</span>
        </span>
        <button
          onClick={() => alert('Launching SIO ATEX & QHSE Crew Onboarding Checklist...')}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group-hover:underline"
        >
          <span>Buka Checklist</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}