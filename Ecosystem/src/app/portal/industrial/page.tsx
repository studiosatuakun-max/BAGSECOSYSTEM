import { getIndustrialClients } from './_integration/actions';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import IndustrialChartsClient from './components/IndustrialChartsClient';
import IndustrialTableClient from './components/IndustrialTableClient';

export default async function DireksiB2BPage() {
  let clients: Record<string, unknown>[] = [];
  try {
    const result = await getIndustrialClients();
    clients = (result.data ?? []) as unknown as Parameters<typeof IndustrialTableClient>[0]['initialClients'];
  } catch {
    clients = [];
  }

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans relative flex flex-col">
      <PortalHeader
        title="Direksi B2B & Strategis"
        subtitle="Executive Strategic Console · Industrial Gas Division"
        roleBadge="B2B Director Access"
        roleColor="indigo"
        showInbox={true}
        rightCustom={
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Live Telemetry</span>
            </div>
          </div>
        }
      />

      <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-xs font-bold text-indigo-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>Industrial Bulk CNG v2.4 &middot; PRMS Metering Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Industrial Bulk CNG &amp; PRMS Pipeline Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali suplai gas alam padat (CNG) rute manufaktur &amp; kawasan industri berat, pemantauan utilisasi kuota bulanan (MMBTU/Sm&sup3;), serta peringatan dini perpanjangan kontrak SLA B2B.
            </p>
          </div>

          <button className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-cyan-600 text-white shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center">
            <Icon name="BoltIcon" size={18} />
            <span>Sync PRMS Pipeline</span>
          </button>
        </div>

        {/* ROW 1: EXECUTIVE METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">

          {/* Revenue MTD */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-indigo-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="BanknotesIcon" size={16} className="text-indigo-400 shrink-0" />
                  <span>Total Revenue (MTD)</span>
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">Q3 FY26</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                Rp 5.55 <span className="text-lg font-bold text-indigo-300">Triliun</span>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-200">
                <span>Target KPI Achievement</span>
                <span className="text-emerald-400">108.8% (Over Target)</span>
              </div>
              <div className="w-full h-2 bg-indigo-950/80 rounded-full overflow-hidden p-0.5 border border-indigo-800/50">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full w-[100%]" />
              </div>
              <div className="flex justify-between items-center text-[11px] text-indigo-300/80 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Icon name="ArrowTrendingUpIcon" size={12} /> +14.8% YoY Growth
                </span>
                <span>Target: Rp 5.10 T</span>
              </div>
            </div>
          </div>

          {/* Active Contracts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-slate-500 dark:text-slate-400 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mr-1 leading-tight">
                  <Icon name="DocumentTextIcon" size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Active B2B Contracts</span>
                </span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">28 Clients</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                74,480 <span className="text-base font-bold text-slate-500">MMBTU</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Quota Utilization</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200 text-sm">90.4% Efficiency Rate</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                <Icon name="ChartBarIcon" size={20} />
              </div>
            </div>
          </div>

          {/* Renewal Risk */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50/50 dark:from-rose-950/30 dark:to-amber-950/20 p-6 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-lg shadow-rose-100/30 flex flex-col justify-between group hover:border-rose-400 dark:hover:border-rose-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-500/15 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-rose-800 dark:text-rose-300 mr-1 leading-tight">
                  <Icon name="ExclamationTriangleIcon" size={16} className="text-rose-600 animate-bounce shrink-0" />
                  <span>Renewal Risk Radar</span>
                </span>
                <span className="text-[10px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-extrabold shadow-sm animate-pulse whitespace-nowrap shrink-0">3 ACTION REQ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-rose-950 dark:text-rose-100 mt-1">
                2 Klien <span className="text-sm font-bold text-rose-700 dark:text-rose-300">&lt; 30 Hari</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs">
              <div className="text-rose-800 dark:text-rose-300">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider">Total Revenue at Risk</span>
                <span className="font-black text-rose-900 dark:text-rose-100 text-sm">Rp 2.90 Miliar / Bulan</span>
              </div>
              <button className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 shrink-0">
                SLA Alert
              </button>
            </div>
          </div>

          {/* Spread Margin */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-emerald-400 dark:hover:border-emerald-600 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
            <div>
              <div className="flex items-start justify-between text-slate-500 dark:text-slate-400 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mr-1 leading-tight">
                  <Icon name="ScaleIcon" size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Net Spread Margin</span>
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">+$4.20 Spread</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                $12.40 <span className="text-sm font-bold text-slate-500">/ MMBTU</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
              <div className="text-slate-600 dark:text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Feedgas Cost (Mother Stn)</span>
                <span className="font-bold text-slate-900 dark:text-white">$8.20 / MMBTU Base</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                <Icon name="ArrowUpIcon" size={12} />
                <span>33.8% Margin</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: ALERT TICKER */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-rose-950/40 dark:to-indigo-950/40 border border-amber-300/60 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Icon name="BellAlertIcon" size={20} className="animate-wiggle" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Executive Alert: Kontrak Strategis Mendekati Jatuh Tempo (SLA Expiry Radar)</span>
                <span className="hidden md:inline-block bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.2 rounded-md border border-rose-200">High Priority</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                <strong>PT Unilever Indonesia Tbk</strong> (Sisa 18 hari) &amp; <strong>PT Gajah Tunggal Tbk</strong> (Sisa 31 hari) memerlukan tindakan perpanjangan SLA segera.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Icon name="BoltIcon" size={14} />
              <span>Instruksikan AE (Fast Renewal)</span>
            </button>
          </div>
        </div>

        {/* ROW 3: CHARTS (Client-side recharts) */}
        <IndustrialChartsClient />

        {/* ROW 4: CLIENTS TABLE */}
        <IndustrialTableClient initialClients={clients as Parameters<typeof IndustrialTableClient>[0]['initialClients']} />
      </div>

      <Footer />
    </div>
  );
}
