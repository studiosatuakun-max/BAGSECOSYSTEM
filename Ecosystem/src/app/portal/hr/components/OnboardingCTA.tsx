import React from 'react';
import Link from 'next/link';
import { UserPlus, ArrowRight, Sparkles } from 'lucide-react';

export default function OnboardingCTA() {
  return (
    <div className="rounded-2xl bg-primary p-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
          <UserPlus size={20} className="text-white" />
        </div>
        <h3 className="text-base font-700 text-white mb-1">Start Onboarding</h3>
        <p className="text-xs text-white/70 leading-relaxed">
          New hire joining? Set up their onboarding checklist, assign a buddy, and track progress from day one.
        </p>
      </div>

      <div className="relative z-10 mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] text-white/60">
          <Sparkles size={10} />
          <span>3 new hires currently in onboarding</span>
        </div>
        <Link
          href="/onboarding-management"
          className="flex items-center justify-center gap-2 bg-white text-primary text-sm font-600 rounded-xl px-4 py-2.5 hover:bg-white/90 active:scale-95 transition-all duration-150"
        >
          Open Onboarding <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}