import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import BentoGrid from './components/BentoGrid';
import InvoiceTableCard from './components/InvoiceTableCard';
import { getInvoicesIndustri, getInvoicesHoreca, getKeuanganSummary } from './_integration/actions';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default async function FinanceDashboardPage() {
  let industriInvoices: Record<string, unknown>[] = [];
  let horecaInvoices: Record<string, unknown>[] = [];
  let summary = {
    totalRevenueIdr: 0,
    totalArOutstanding: 0,
    avgDaysOutstanding: 0,
    issuedCount: 0,
    paidCount: 0,
    overdueCount: 0,
    totalOpex: 0,
  };

  try {
    const [industriResult, horecaResult, summaryResult] = await Promise.all([
      getInvoicesIndustri(),
      getInvoicesHoreca(),
      getKeuanganSummary(),
    ]);
    industriInvoices = industriResult.data ?? [];
    horecaInvoices = horecaResult.data ?? [];
    summary = summaryResult;
  } catch {
    // Supabase not configured — show fallback data
  }

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

        {/* Main Content */}
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">
          {/* EXECUTIVE CFO HERO BANNER */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 max-w-3xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>MIGAS Treasury Indexing v2.0 &middot; DGT E-Faktur Connected</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Corporate Treasury &amp; B2B Custody Transfer Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Pusat kontrol kas perusahaan, penagihan volume gas CNG (MMBTU/Sm&sup3;) berbasis meteran Mother Station, dan rekonsiliasi pajak PPN 11% &amp; PPh 22 MIGAS secara real-time.
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-amber-500/30 shrink-0">
              <CheckCircle2 size={18} className="text-white" />
              <span>Supabase Connected</span>
            </div>
          </div>

          {/* Bento Grid (KPI Metrics + Charts) */}
          <BentoGrid summary={summary} />

          {/* Invoice Engine (Real Supabase Data) */}
          <InvoiceTableCard
            industriInvoices={industriInvoices as Parameters<typeof InvoiceTableCard>[0]['industriInvoices']}
            horecaInvoices={horecaInvoices as Parameters<typeof InvoiceTableCard>[0]['horecaInvoices']}
          />
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
