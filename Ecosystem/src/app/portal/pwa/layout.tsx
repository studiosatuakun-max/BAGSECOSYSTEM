import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Portal — BaGS Ecosystem',
  description: 'Mobile Driver App for BaGS Ecosystem',
};

export default function MobilePortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-[#F1F5F9] md:bg-slate-950 flex flex-col items-center justify-center md:py-8 md:px-4">
      {/* Mobile Phone Mockup Frame for Desktop */}
      <div className="w-full min-h-screen md:w-[414px] md:h-[860px] md:min-h-0 md:max-h-[92vh] bg-white md:rounded-[48px] md:border-[12px] md:border-slate-800 md:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] md:ring-1 md:ring-slate-700/50 relative flex flex-col overflow-hidden">
        
        {/* iPhone Top Notch/Dynamic Island (Desktop only) */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 items-center justify-center pointer-events-none">
          <div className="w-10 h-1 bg-slate-700 rounded-full mr-2" />
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-700" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative bg-[#FAFAFA]">
          {children}
        </div>

        {/* iPhone Bottom Home Bar (Desktop only) */}
        <div className="hidden md:flex absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-slate-300 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}
