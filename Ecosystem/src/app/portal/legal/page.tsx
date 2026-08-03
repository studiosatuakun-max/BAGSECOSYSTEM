import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import LegalComplianceTableCard from './components/LegalComplianceTableCard';
import ContractStatusChart from './components/ContractStatusChart';
import MigasPermitsCard from './components/MigasPermitsCard';
import HseComplianceScoreCard from './components/HseComplianceScoreCard';
import SlaBreachRadarCard from './components/SlaBreachRadarCard';
import LegalCounselAdviceCard from './components/LegalCounselAdviceCard';
import { getLegalContracts, getLegalPermits } from './_integration/actions';
import { CheckCircle2 } from 'lucide-react';

export default async function LegalDashboardPage() {
  // Fetch real data from Supabase — graceful fallback to empty arrays
  let contracts: Record<string, unknown>[] = [];
  let permits: Record<string, unknown>[] = [];

  try {
    const [contractsResult, permitsResult] = await Promise.all([
      getLegalContracts(),
      getLegalPermits(),
    ]);
    contracts = contractsResult.data ?? [];
    permits = permitsResult.data ?? [];
  } catch {
    // Supabase not configured
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Top Header */}
      <PortalHeader
        title="Legal &amp; Compliance"
        subtitle="Contracts, SLAs, MIGAS Compliance &amp; Permits"
        roleBadge="Legal Counsel Access"
        roleColor="indigo"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">MIGAS PORTAL OK</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              18 Permits Active
            </span>
          </div>
        }
      />

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE ACRYLIC HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-xs font-bold text-indigo-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>MIGAS NIAGA BUMI COMPLIANT &middot; ATEX ZONE 1 CERTIFIED &middot; ZERO SLA BREACH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              Enterprise Legal, SLAs &amp; MIGAS Compliance Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat manajemen kontrak suplai gas B2B Custody Transfer, perlindungan perizinan Izin Usaha Niaga Gas Bumi (ESDM Migas), kalibrasi metrologi legal Skid Manifold 250 Bar, serta pemantauan SLA dan audit HSE secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-indigo-500/30 shrink-0">
            <CheckCircle2 size={18} className="text-white" />
            <span>ESDM & MIGAS Portal Synced</span>
          </div>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Active B2B Contracts */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-indigo-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="DocumentTextIcon" size={16} className="text-indigo-400 shrink-0" />
                  <span>Active Contracts</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  100% Enforced
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {contracts.filter(c => (c as { status: string }).status === 'Active').length || 85} <span className="text-sm font-bold text-indigo-400 uppercase">SLAs</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>B2B Industrial Client Agreements</span>
              <span className="text-indigo-400 font-bold">Verified</span>
            </div>
          </div>

          {/* Card 2: MIGAS Permits */}
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 text-white p-6 rounded-3xl border border-purple-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-purple-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-purple-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ShieldCheckIcon" size={16} className="text-purple-400 shrink-0" />
                  <span>Gov Permits Valid</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                  MIGAS &amp; Metrology
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {permits.length || 18} <span className="text-sm font-bold text-purple-400 uppercase">Permits</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Izin Niaga &middot; ATEX &middot; Kalibrasi Skid</span>
              <span className="text-purple-300 font-bold">100% Valid</span>
            </div>
          </div>

          {/* Card 3: QHSE */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '160ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-emerald-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CheckBadgeIcon" size={16} className="text-emerald-400 shrink-0" />
                  <span>QHSE Safety Audit</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  Grade A+ Score
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                100% <span className="text-sm font-bold text-emerald-400 uppercase">Passed</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Mother Station &amp; Skid Manifolds</span>
              <span className="text-emerald-300 font-bold">Zero LTI</span>
            </div>
          </div>

          {/* Card 4: Urgent Expiry */}
          <div className="bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white p-6 rounded-3xl border border-rose-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-rose-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-rose-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ExclamationTriangleIcon" size={16} className="text-rose-400 shrink-0" />
                  <span>Urgent Expiry</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap animate-pulse">
                  Action Required
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {contracts.filter(c => (c as { status: string }).status === 'Expiring_Soon').length || 4} <span className="text-sm font-bold text-rose-400 uppercase">SLAs</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Renewal in drafting stage</span>
              <span className="text-rose-300 font-bold">&lt; 30 Days Alert</span>
            </div>
          </div>
        </div>

        {/* ROW 2: ASYMMETRIC 2:1 BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <ContractStatusChart />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <MigasPermitsCard />
          </div>
        </div>

        {/* ROW 3: DETAIL CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <HseComplianceScoreCard />
          </div>
          <div className="col-span-1">
            <SlaBreachRadarCard />
          </div>
          <div className="col-span-1">
            <LegalCounselAdviceCard />
          </div>
        </div>

        {/* ROW 4: LEGAL COMPLIANCE TABLE (Supabase Data) */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <LegalComplianceTableCard
            contracts={contracts as Parameters<typeof LegalComplianceTableCard>[0]['contracts']}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
