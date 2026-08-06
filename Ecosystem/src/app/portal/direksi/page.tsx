import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

export default function DireksiPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden font-sans text-slate-200 flex flex-col">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/15 blur-[120px] pointer-events-none" />

      <PortalHeader
        title="Board of Directors"
        subtitle="ENTERPRISE EXECUTIVE DASHBOARD (B2B & B2C)"
        roleBadge="Director Access"
        roleColor="amber"
        backUrl="/"
        backText="Exit Portal"
        showInbox={true}
      />
      
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 w-full">
        {/* EXECUTIVE ACRYLIC HERO BANNER */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>LIVE: ENTERPRISE BIG DATA AGGREGATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              B2B & B2C Director Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat pemantauan eksekutif untuk mengawasi seluruh aktivitas operasional, finansial, dan kinerja bisnis PT Baskara Asri Ghas secara menyeluruh (Helicopter View).
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-8 flex flex-col justify-center items-center h-56 hover:bg-white/10 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/30 transition-all duration-300 group">
             <Icon name="ChartBarIcon" size={56} className="text-amber-400 mb-5 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
             <h3 className="text-xl font-extrabold text-white drop-shadow-md">Financial Growth</h3>
             <p className="text-sm text-slate-400 mt-2 text-center font-medium">Consolidated revenue and profitability metrics.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-8 flex flex-col justify-center items-center h-56 hover:bg-white/10 hover:border-orange-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-900/30 transition-all duration-300 group">
             <Icon name="BriefcaseIcon" size={56} className="text-orange-400 mb-5 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
             <h3 className="text-xl font-extrabold text-white drop-shadow-md">B2B Industrial & Horeca</h3>
             <p className="text-sm text-slate-400 mt-2 text-center font-medium">Pipeline, contracts, and delivery SLA performance.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-8 flex flex-col justify-center items-center h-56 hover:bg-white/10 hover:border-yellow-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-900/30 transition-all duration-300 group">
             <Icon name="UserGroupIcon" size={56} className="text-yellow-400 mb-5 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
             <h3 className="text-xl font-extrabold text-white drop-shadow-md">B2C Customer App</h3>
             <p className="text-sm text-slate-400 mt-2 text-center font-medium">Retail gas station queue and customer engagement.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
