'use client';

import React from 'react';
import { UserPlus, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function OnboardingCTA() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 p-6 text-white shadow-xl flex flex-col justify-between h-full relative overflow-hidden border border-purple-800/60 group hover:border-purple-500 transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-fuchsia-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 backdrop-blur-md border border-purple-500/30 flex items-center justify-center">
            <UserPlus size={20} className="text-purple-300" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck size={11} />
            <span>MIGAS QHSE Ready</span>
          </span>
        </div>
        <h3 className="text-base font-black text-white tracking-tight mb-1">
          Start ATEX SIO &amp; Crew Onboarding
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Pengemudi Skid atau teknisi Mother Station baru? Aktifkan protokol orientasi SIO ATEX, pemeriksaan medis keselamatan kerja, dan penugasan mentor shift sejak hari pertama.
        </p>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-purple-300 font-bold">
          <Sparkles size={14} className="text-fuchsia-400 animate-pulse" />
          <span>4 Personel dalam tahap Onboarding</span>
        </div>
        <button
          onClick={() => alert('Launching SIO ATEX & QHSE Crew Onboarding Checklist...')}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white text-xs font-extrabold rounded-xl px-4 py-2.5 shadow-lg shadow-purple-950/50 hover:shadow-purple-500/20 active:scale-95 transition-all shrink-0"
        >
          <span>Buka Checklist Onboarding</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}