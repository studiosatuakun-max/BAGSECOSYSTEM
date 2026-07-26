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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
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
            <div className="hidden sm:flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-2 backdrop-blur-xl shadow-sm">
              <div className="flex flex-col text-right font-mono leading-tight">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">HBA INDEX $11.50</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">USD/IDR Rp 16.240</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          }
        />

        {/* Main Content with Spatial Breathing Room */}
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">
          {/* EXECUTIVE CFO HERO BANNER (Standardized with Stasiun) */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 max-w-3xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>MIGAS Treasury Indexing v2.0 · DGT E-Faktur Connected</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Corporate Treasury &amp; B2B Custody Transfer Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Pusat kontrol kas perusahaan, penagihan volume gas CNG (MMBTU/Sm³) berbasis meteran Mother Station, dan rekonsiliasi pajak PPN 11% &amp; PPh 22 MIGAS secara real-time.
              </p>
            </div>

            <button
              onClick={handleDgtSync}
              disabled={isSyncing || syncSuccess}
              className={`px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center disabled:cursor-not-allowed ${
                syncSuccess
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950/50'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-500/30'
              }`}
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={18} className="animate-spin text-white" />
                  <span>Mensinkronisasi DGT...</span>
                </>
              ) : syncSuccess ? (
                <>
                  <CheckCircle2 size={18} className="text-white" />
                  <span>E-Faktur Terkonsolidasi</span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  <span>Log / Sync E-Faktur DGT</span>
                </>
              )}
            </button>
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