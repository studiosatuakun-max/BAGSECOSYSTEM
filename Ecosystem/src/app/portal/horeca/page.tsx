import { getHorecaClients } from './_integration/actions';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import HorecaChartsClient from './components/HorecaChartsClient';
import HorecaTableClient from './components/HorecaTableClient';

interface HorecaClient {
  id: string;
  business_name?: string;
  name?: string;
  sector?: string;
  zone?: string;
  supply_type?: string;
  monthly_quota_sm3?: number;
  utilized_sm3?: number;
  mtd_revenue_idr?: number;
  operating_pressure_bar?: number;
  aeName?: string;
  safety_status?: string;
}

export default async function HorecaCommercialPage() {
  let clients: HorecaClient[] = [];
  try {
    const result = await getHorecaClients();
    clients = (result.data ?? []) as unknown as HorecaClient[];
  } catch {
    clients = [];
  }

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans relative flex flex-col">
      <PortalHeader
        title="Horeca & Commercial Gas"
        subtitle="Executive Strategic Console · CNG Cradle Cascades &amp; Micro-Bulk Division"
        roleBadge="Commercial Director Access"
        roleColor="amber"
        showInbox={true}
        rightCustom={
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider">CNG Telemetry Live</span>
            </div>
          </div>
        }
      />

      <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">

        {/* EXECUTIVE HERO BANNER */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Commercial CNG Engine v2.4 &middot; Cradle &amp; Cascade Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Horeca &amp; Commercial CNG Division Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali logistik dan distribusi CNG kemasan (Cradle Cascades &amp; Micro-Bulk VGL) untuk rute Hotel, Restoran, Kafe, dan Industri Komersial ringan dengan pemantauan SLA inspeksi tekanan aman.
            </p>
          </div>

          <button className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center">
            <Icon name="BoltIcon" size={18} />
            <span>Sync Cradle Telemetry</span>
          </button>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">

          {/* Card 1: Commercial Revenue MTD */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 text-white p-6 rounded-3xl border border-amber-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-amber-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="BanknotesIcon" size={16} className="text-amber-400 shrink-0" />
                  <span>Commercial Revenue (MTD)</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">Q3 FY26</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                Rp 3.25 <span className="text-lg font-bold text-amber-300">Miliar</span>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-amber-200">
                <span>Target KPI Achievement</span>
                <span className="text-emerald-400">104.8% (Over Target)</span>
              </div>
              <div className="w-full h-2 bg-amber-950/80 rounded-full overflow-hidden p-0.5 border border-amber-800/50">
                <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full w-[100%]" />
              </div>
              <div className="flex justify-between items-center text-[11px] text-amber-300/80 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Icon name="ArrowTrendingUpIcon" size={12} /> +18.4% YoY Growth
                </span>
                <span>Target: Rp 3.10 M</span>
              </div>
            </div>
          </div>

          {/* Card 2: CNG Cradle Racks Deployed */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-amber-400 dark:hover:border-amber-600 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-slate-500 dark:text-slate-400 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mr-1 leading-tight">
                  <Icon name="CubeIcon" size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>CNG Cradle Racks Deployed</span>
                </span>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">450 Units</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                462,700 <span className="text-base font-bold text-slate-500">Sm&sup3;</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Milk-Run Fleet Utilization</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200 text-sm">92.4% Cradle Turnover</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shrink-0">
                <Icon name="TruckIcon" size={20} />
              </div>
            </div>
          </div>

          {/* Card 3: CNG Safety Anomaly Radar */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50/50 dark:from-rose-950/30 dark:to-amber-950/20 p-6 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-lg shadow-rose-100/30 flex flex-col justify-between group hover:border-rose-400 dark:hover:border-rose-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-500/15 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-rose-800 dark:text-rose-300 mr-1 leading-tight">
                  <Icon name="ShieldExclamationIcon" size={16} className="text-rose-600 animate-bounce shrink-0" />
                  <span>CNG Safety Anomaly Radar</span>
                </span>
                <span className="text-[10px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-extrabold shadow-sm animate-pulse whitespace-nowrap shrink-0">2 ACTION REQ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-rose-950 dark:text-rose-100 mt-1">
                2 Mitra <span className="text-sm font-bold text-rose-700 dark:text-rose-300">Pressure / NFC Alert</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs">
              <div className="text-rose-800 dark:text-rose-300">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider">Telemetry Pressure Drop</span>
                <span className="font-black text-rose-900 dark:text-rose-100 text-sm">JW Marriott &amp; Layar Resto</span>
              </div>
              <button className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 shrink-0">
                Dispatch SLA
              </button>
            </div>
          </div>

          {/* Card 4: Price Spread & CNG Margin Index */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-emerald-400 dark:hover:border-emerald-600 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
            <div>
              <div className="flex items-start justify-between text-slate-500 dark:text-slate-400 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mr-1 leading-tight">
                  <Icon name="ScaleIcon" size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>CNG Commercial Spread</span>
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">+Rp 2,750 / Sm&sup3;</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Rp 7,850 <span className="text-sm font-bold text-slate-500">/ Sm&sup3;</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
              <div className="text-slate-600 dark:text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother Station Feedgas Cost</span>
                <span className="font-bold text-slate-900 dark:text-white">Rp 5,100 / Sm&sup3; Base</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                <Icon name="ArrowUpIcon" size={12} />
                <span>35.0% Margin</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: ALERT TICKER */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-rose-950/40 dark:to-indigo-950/40 border border-amber-300/60 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Icon name="FireIcon" size={20} className="animate-wiggle" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Executive Alert: Anomali Telemetry Tekanan Rak Tabung CNG &amp; NFC Safety</span>
                <span className="hidden md:inline-block bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.2 rounded-md border border-rose-200">SLA Priority</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                <strong>Hotel JW Marriott Surabaya</strong> (Tekanan drop ke 185 Bar dari normal 200 Bar) &amp; <strong>Layar Seafood Resto</strong> (Jatuh tempo inspeksi SLA selang manifold).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Icon name="WrenchScrewdriverIcon" size={14} />
              <span>Kirim Tim Teknis &amp; Safety (Fast SLA)</span>
            </button>
          </div>
        </div>

        {/* ROW 3: CHARTS (Client-side recharts) */}
        <HorecaChartsClient />

        {/* ROW 4: CLIENTS TABLE */}
        <HorecaTableClient initialClients={clients as Parameters<typeof HorecaTableClient>[0]['initialClients']} />
      </div>

      <Footer />
    </div>
  );
}
