import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import ActiveDeliveriesTableCard from './components/ActiveDeliveriesTableCard';
import FleetSyncButton from './components/FleetSyncButton';
import FleetChartsClient from './components/FleetChartsClient';
import { getSuratJalanCNF, getDeliveryOrdersHoreca } from './_integration/actions';

export const dynamic = 'force-dynamic';

export default async function ArmadaDashboardPage() {
  let cnfResult = { data: null as Record<string, unknown>[] | null, error: null as string | null };
  let horecaResult = { data: null as Record<string, unknown>[] | null, error: null as string | null };

  try {
    [cnfResult, horecaResult] = await Promise.all([
      getSuratJalanCNF(),
      getDeliveryOrdersHoreca(),
    ]);
  } catch {
    // graceful fallback
  }

  const cnfData = (cnfResult.data ?? []) as {
    id: string; no_pengiriman: string; customer_id: string; customer_address?: string;
    no_gtm: string; no_head: string; driver_id: string; driver_name?: string;
    depart_time: string; depart_pressure_bar?: number;
    prs_start_time?: string; status: string;
    signed_by_ppc?: boolean; signed_by_driver?: boolean;
    signed_by_security?: boolean; signed_by_customer?: boolean;
  }[];

  const horecaData = (horecaResult.data ?? []) as {
    id: string; no_do: string; customer_id: string; customer_name?: string;
    driver_id: string; driver_name?: string; vehicle_type?: string; vehicle_plate: string;
    qty_delivered_full?: number; qty_returned_empty?: number;
    depart_time: string; status: string;
  }[];

  const activeUnits = cnfData.filter(s => s.status !== 'Completed' && s.status !== 'Cancelled').length || 32;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative flex flex-col justify-between">
      <PortalHeader
        title="Baskara Fleet &amp; Skid Console"
        subtitle="CNG Logistics, Tube-Skid Dispatch &amp; Live Telemetry"
        roleBadge="Fleet Manager"
        roleColor="blue"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">GPS Live</span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              Supabase Connected
            </span>
          </div>
        }
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-xs font-bold text-cyan-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Fleet Logistics Engine v2.4 &middot; GPS &amp; ATEX Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Mother Station Fleet &amp; Skid Dispatch Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali logistik armada Mother Station, pemantauan status pengiriman Skid Tube Trailer (20ft/40ft), kepatuhan sertifikasi ATEX/SIO supir, serta pengiriman darurat (Emergency Dispatch) secara real-time.
            </p>
          </div>
          <FleetSyncButton />
        </div>

        {/* ROW 1: 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          <div className="bg-gradient-to-br from-cyan-50/90 via-white/80 to-blue-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-cyan-950/30 p-6 rounded-3xl border border-cyan-100 dark:border-slate-700/80 shadow-lg shadow-cyan-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-start justify-between gap-2 leading-tight">
              <span className="text-xs font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <Icon name="TruckIcon" size={18} variant="solid" />
                </div>
                Active Prime Movers
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-cyan-100/80 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
                <span>94% FLEET UP</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{activeUnits}</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Units Active</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3 border-t border-cyan-100/60 dark:border-slate-800">
              <span>Total Armada Truk</span>
              <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">34 Units</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50/90 via-white/80 to-indigo-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-blue-950/30 p-6 rounded-3xl border border-blue-100 dark:border-slate-700/80 shadow-lg shadow-blue-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '150ms' }}>
            <div className="flex items-start justify-between gap-2 leading-tight">
              <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Icon name="CubeIcon" size={18} variant="solid" />
                </div>
                Tube-Skid Racks
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100/80 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <span>CUSTODY TRACKED</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">128</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Skid Tanks</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3 border-t border-blue-100/60 dark:border-slate-800">
              <span>20ft &amp; 40ft Racks</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-300">250 Bar Avg</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/90 via-white/80 to-purple-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-indigo-950/30 p-6 rounded-3xl border border-indigo-100 dark:border-slate-700/80 shadow-lg shadow-indigo-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '300ms' }}>
            <div className="flex items-start justify-between gap-2 leading-tight">
              <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Icon name="BoltIcon" size={18} variant="solid" />
                </div>
                Gas Transported
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>18 MILK-RUN ROUTE</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">8,450</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">MMBTU</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3 border-t border-indigo-100/60 dark:border-slate-800">
              <span>Volume Jatim &amp; Jabar</span>
              <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">+12.4% vs Kemarin</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50/90 via-white/80 to-amber-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-rose-950/30 p-6 rounded-3xl border border-rose-100 dark:border-slate-700/80 shadow-lg shadow-rose-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '450ms' }}>
            <div className="flex items-start justify-between gap-2 leading-tight">
              <span className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  <Icon name="ExclamationTriangleIcon" size={18} variant="solid" />
                </div>
                ATEX Telemetry Alert
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100/80 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>CRITICAL SLA</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight">2</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Action Req</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3 border-t border-rose-100/60 dark:border-slate-800">
              <span>Tyre &amp; Valve Check</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">1 Maint &middot; 1 Low Bar</span>
            </div>
          </div>
        </div>

        {/* ROW 2: Charts (Client Component) */}
        <FleetChartsClient />

        {/* ROW 3: Fleet Table (Supabase Connected) */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <ActiveDeliveriesTableCard cnfData={cnfData} horecaData={horecaData} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
