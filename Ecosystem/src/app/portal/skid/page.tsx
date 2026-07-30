import { getCustodyTransfers } from './_integration/actions';
import { toast } from 'sonner';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import CustodyTransferTableCard from './components/CustodyTransferTableCard';
import TankInfoCard from './components/TankInfoCard';
import PressureGaugeCard from './components/PressureGaugeCard';
import ConsumptionTrendCard from './components/ConsumptionTrendCard';
import LatestInvoiceCard from './components/LatestInvoiceCard';
import EmergencyRefillCard from './components/EmergencyRefillCard';
import { CustodyTransferSlip } from './_integration/types';

export default async function SkidPortalDashboardPage() {
  let slips: CustodyTransferSlip[] = [];
  try {
    const result = await getCustodyTransfers();
    slips = result.data as unknown as CustodyTransferSlip[];
  } catch {
    slips = [];
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <PortalHeader
        title="SkidPortal B2B"
        subtitle="Industrial Client Portal &amp; Custody Transfer"
        roleBadge="B2B Client & SCADA Access"
        roleColor="indigo"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">SCADA LINK OK</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              250 Bar CNG Manifold
            </span>
          </div>
        }
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE ACRYLIC HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-xs font-bold text-indigo-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ISO 11120 Tube Manifold Monitoring &middot; Custody Transfer Billing Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              Skid Tank &amp; Custody Transfer Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali telemetri tekanan manifold 250 Bar, laju pembakaran Sm&sup3;/hari, serta verifikasi bongkar muat (Custody Transfer) dan otomatisasi E-Faktur penagihan gas CNG industri B2B secara terintegrasi.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-10 self-stretch sm:self-auto justify-center">
            <button className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap cursor-pointer">
              <Icon name="ArrowPathIcon" size={18} />
              <span>Sync SCADA &amp; E-Faktur</span>
            </button>
            <button className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer">
              <Icon name="PlusIcon" size={18} />
              <span>New Delivery PO</span>
            </button>
          </div>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Total Delivery Volume */}
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 text-white p-6 rounded-3xl border border-purple-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-purple-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-purple-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CubeIcon" size={16} className="text-purple-400 shrink-0" />
                  <span>Total Delivery Volume</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  &uarr; 8.4% Q3
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                12,450 <span className="text-sm font-bold text-purple-400 uppercase">Sm&sup3;/day</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Aktif di 6 Klien Industri</span>
              <span className="text-emerald-400 font-bold">100% Custody Valid</span>
            </div>
          </div>

          {/* Card 2: Avg Manifold Pressure */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-indigo-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ArrowsRightLeftIcon" size={16} className="text-indigo-400 shrink-0" />
                  <span>Avg Manifold Pressure</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  Mother Station
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                235 <span className="text-sm font-bold text-indigo-400 uppercase">Bar</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Nominal Operating Range</span>
              <span className="text-indigo-300 font-bold">Limit: 250 Bar</span>
            </div>
          </div>

          {/* Card 3: Custody Meter Accuracy */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '160ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-emerald-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="DocumentCheckIcon" size={16} className="text-emerald-400 shrink-0" />
                  <span>Custody Meter Accuracy</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  MIGAS Certified
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                99.8% <span className="text-sm font-bold text-emerald-400 uppercase">Rate</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Metrologi Terverifikasi</span>
              <span className="text-emerald-300 font-bold">ISO 11120 Spec</span>
            </div>
          </div>

          {/* Card 4: Active Contract Value */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 text-white p-6 rounded-3xl border border-amber-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-amber-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="BanknotesIcon" size={16} className="text-amber-400 shrink-0" />
                  <span>Active Contract Value</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                  Milk-Run Cycle
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                Rp 8.5 <span className="text-sm font-bold text-amber-400 uppercase">Miliar</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Penagihan Mingguan</span>
              <span className="text-amber-300 font-bold">E-Faktur Synced</span>
            </div>
          </div>
        </div>

        {/* ROW 2: ASYMMETRIC 2:1 BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <ConsumptionTrendCard />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <PressureGaugeCard />
          </div>
        </div>

        {/* ROW 3: DETAIL CARDS BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <TankInfoCard />
          </div>
          <div className="col-span-1">
            <LatestInvoiceCard />
          </div>
          <div className="col-span-1">
            <EmergencyRefillCard />
          </div>
        </div>

        {/* ROW 4: CUSTODY TRANSFER TABLE */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <CustodyTransferTableCard initialSlips={slips} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
