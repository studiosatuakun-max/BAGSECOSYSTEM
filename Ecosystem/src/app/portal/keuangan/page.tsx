'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import BentoGrid from './components/BentoGrid';
import { Sparkles, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function FinanceDashboardPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleDgtSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div>
        {/* Top Header */}
        <PortalHeader
          title="Baskara Treasury & Finance"
          subtitle="Corporate Cash Flow, Custody Transfer Billing & MIGAS Tax Compliance Engine"
          roleBadge="Chief Financial Officer (CFO)"
          roleColor="amber"
          showInbox={true}
          rightCustom={
            <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-2 backdrop-blur-xl">
              <div className="flex flex-col text-right font-mono leading-tight">
                <span className="text-xs font-black text-amber-400">HBA INDEX $11.50</span>
                <span className="text-[10px] text-slate-400 font-semibold">USD/IDR Rp 16.240</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          }
        />

        {/* Main Content with Spatial Breathing Room */}
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">
          {/* Executive CFO Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap shrink-0 align-middle shadow-sm">
                    <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>MIGAS Treasury Indexing v2.0</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shrink-0 align-middle shadow-sm">
                    <ShieldCheck size={13} />
                    <span>DGT E-Faktur Connected</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Corporate Treasury & B2B Custody Transfer Portal
                </h1>
                <p className="text-sm font-medium text-slate-300 leading-relaxed">
                  Pusat kontrol kas perusahaan, penagihan volume gas CNG (MMBTU/Sm³) berbasis meteran Mother Station, dan rekonsiliasi pajak PPN 11% & PPh 22 MIGAS secara real-time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={handleDgtSync}
                  disabled={isSyncing || syncSuccess}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all duration-300 shadow-xl active:scale-95 disabled:cursor-not-allowed border whitespace-nowrap shrink-0 align-middle ${
                    syncSuccess
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-950/50'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-amber-500/40 text-amber-300 hover:text-white shadow-amber-950/20'
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw size={15} className="animate-spin text-amber-400" />
                      <span>Mensinkronisasi Server DGT...</span>
                    </>
                  ) : syncSuccess ? (
                    <>
                      <CheckCircle2 size={15} className="text-white" />
                      <span>E-Faktur PPN 11% Terkonsolidasi</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={15} />
                      <span>[⚡ Sync E-Faktur DGT Server]</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bento Grid Content */}
          <BentoGrid />
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}