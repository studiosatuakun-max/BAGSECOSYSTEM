import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import BentoGrid from './components/BentoGrid';
import { getKeuanganSummary } from './_integration/actions';
import { 
  CheckCircle2, 
  DocumentTextIcon, 
  BanknotesIcon, 
  BuildingOffice2Icon, 
  ShoppingCartIcon, 
  CreditCardIcon, 
  ArchiveBoxIcon 
} from '@heroicons/react/24/outline';

const ZAHIR_MODULES = [
  {
    id: 'hutang-piutang',
    title: 'Hutang Piutang',
    subtitle: 'AR/AP & Aging Schedule',
    icon: DocumentTextIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    href: '/portal/keuangan/hutang-piutang'
  },
  {
    id: 'asset',
    title: 'Asset',
    subtitle: 'Fixed Assets & Penyusutan',
    icon: BuildingOffice2Icon,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    href: '/portal/keuangan/asset'
  },
  {
    id: 'penjualan',
    title: 'Penjualan',
    subtitle: 'Invoicing & Piutang Klien',
    icon: BanknotesIcon,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    href: '/portal/keuangan/penjualan'
  },
  {
    id: 'pembelian',
    title: 'Pembelian',
    subtitle: 'Purchase Orders & Vendor',
    icon: ShoppingCartIcon,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    href: '/portal/keuangan/pembelian'
  },
  {
    id: 'kas-bank',
    title: 'Kas & Bank',
    subtitle: 'Mutasi, Opex, & Rekonsiliasi',
    icon: CreditCardIcon,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    href: '/portal/keuangan/kas-bank'
  },
  {
    id: 'persediaan',
    title: 'Persediaan',
    subtitle: 'Inventory & Stok Gas',
    icon: ArchiveBoxIcon,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    href: '/portal/keuangan/persediaan'
  }
];

export default async function FinanceDashboardPage() {
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
    const summaryResult = await getKeuanganSummary();
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
                <span>MIGAS Treasury Indexing v2.0 &middot; ERP Modular</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Finance &amp; Accounting ERP
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Pilih modul di bawah ini untuk mengelola lembar kerja (worksheet).
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-amber-500/30 shrink-0">
              <CheckCircle2 size={18} className="text-white" />
              <span>Live Synced</span>
            </div>
          </div>

          {/* Module Grid (Zahir Home Screen Style) */}
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {ZAHIR_MODULES.map((mod, idx) => (
              <Link key={mod.id} href={mod.href}>
                <div 
                  className={`flex flex-col items-center justify-center text-center h-48 sm:h-56 bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg rounded-3xl p-6 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group ${mod.bg} hover:${mod.border}`}
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                >
                  <div className={`p-4 rounded-2xl bg-white/10 dark:bg-black/20 group-hover:scale-110 transition-transform duration-300 ${mod.color}`}>
                    <mod.icon className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight group-hover:text-amber-500 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
                    {mod.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </section>

          {/* KPI Metrics Dashboard Overview */}
          <div className="pt-8 border-t border-slate-200/50 dark:border-white/10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Ringkasan Eksekutif (YTD)</h2>
            <BentoGrid summary={summary} />
          </div>

        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
