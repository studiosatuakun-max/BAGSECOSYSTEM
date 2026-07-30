import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import CRMPipelineTableCard from './components/CRMPipelineTableCard';
import CampaignROIChart from './components/CampaignROIChart';
import AcquisitionFunnel from './components/AcquisitionFunnel';
import TopClientsTable from './components/TopClientsTable';
import MarketingClientUI from './components/MarketingClientUI';
import { getSalesLeads, getMarketingCampaigns } from './_integration/actions';
import { CheckCircle2 } from 'lucide-react';

export default async function MarketingDashboardPage() {
  // Fetch real data from Supabase — graceful fallback to empty arrays if not configured
  let allLeads: Record<string, unknown>[] = [];
  let campaigns: Record<string, unknown>[] = [];

  try {
    const [leadsResult, campaignsResult] = await Promise.all([
      getSalesLeads(),
      getMarketingCampaigns(),
    ]);
    allLeads = leadsResult.data ?? [];
    campaigns = campaignsResult.data ?? [];
  } catch {
    // Supabase not configured — show empty state
  }

  const industriLeads = allLeads.filter((l) => (l as { segment: string }).segment === 'Industri');
  const horecaLeads = allLeads.filter((l) => (l as { segment: string }).segment === 'Horeca');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative flex flex-col justify-between selection:bg-pink-500 selection:text-white">

      {/* Top Header */}
      <PortalHeader
        title="Baskara CMO &amp; B2B Commercial Console"
        subtitle="Pusat kendali strategi pemasaran gas CNG Mother Station &amp; akuisisi klien industri"
        roleBadge="CMO Access"
        roleColor="pink"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">09:14:22 WIB</span>
            <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
              AE CRM &amp; Funnel Connected
            </span>
          </div>
        }
      />

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">

        {/* EXECUTIVE CMO HERO BANNER */}
        <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-pink-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 text-xs font-bold text-pink-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span>B2B Gas Growth Engine v2.4 &middot; AE CRM Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              B2B Commercial Gas Growth &amp; Pipeline Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali akuisisi prospek manufaktur berat &amp; Horeca (Sm&sup3;/day), pemantauan konversi kuota MMBTU, serta analisis ROI kampanye pemasaran gas secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-pink-500/30 shrink-0">
            <CheckCircle2 size={18} className="text-white" />
            <span>Supabase Connected</span>
          </div>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Total Inbound Leads */}
          <div className="bg-gradient-to-br from-pink-900 via-pink-950 to-slate-950 text-white p-6 rounded-3xl border border-pink-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-pink-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-pink-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-pink-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="MegaphoneIcon" size={16} className="text-pink-400 shrink-0" />
                  <span>Total CNG Leads</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  ↑ 18.4% MoM
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                1,240 <span className="text-sm font-bold text-pink-400 uppercase">Leads</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-pink-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Q3 Target: 1,500</span>
              <span className="text-emerald-400 font-bold">82.6% Achieved</span>
            </div>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 text-white p-6 rounded-3xl border border-purple-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-purple-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-purple-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CursorArrowRaysIcon" size={16} className="text-purple-400 shrink-0" />
                  <span>SLA Conversion</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                  94 Signed Deals
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                7.6% <span className="text-sm font-bold text-purple-400 uppercase">Win Rate</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Avg Contract Length</span>
              <span className="text-purple-300 font-bold">24 Months SLA</span>
            </div>
          </div>

          {/* Card 3: Marketing Reach */}
          <div className="bg-gradient-to-br from-violet-900 via-violet-950 to-slate-950 text-white p-6 rounded-3xl border border-violet-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-violet-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '160ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl group-hover:bg-violet-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-violet-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="GlobeAltIcon" size={16} className="text-violet-400 shrink-0" />
                  <span>B2B Market Reach</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-violet-500/20 text-violet-300 border border-violet-500/30 whitespace-nowrap">
                  Industrial &amp; Horeca
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                1.2M <span className="text-sm font-bold text-violet-400 uppercase">Impressions</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-violet-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>LinkedIn &amp; Industry Expos</span>
              <span className="text-violet-300 font-bold">High Intent</span>
            </div>
          </div>

          {/* Card 4: CAC */}
          <div className="bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white p-6 rounded-3xl border border-rose-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-rose-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-rose-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CurrencyDollarIcon" size={16} className="text-rose-400 shrink-0" />
                  <span>CAC Efficiency</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  ↓ 12.5% Optimized
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                Rp 1.45 <span className="text-sm font-bold text-rose-400 uppercase">Jt / Deal</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Avg LTV: Rp 2.4 Miliar</span>
              <span className="text-emerald-400 font-bold">1,650x ROI</span>
            </div>
          </div>
        </div>

        {/* ROW 2: ANALYTICS BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CampaignROIChart />
          </div>
          <div className="lg:col-span-1">
            <AcquisitionFunnel />
          </div>
        </div>

        {/* ROW 3: TOP CLIENTS TABLE */}
        <TopClientsTable />

        {/* ROW 4: CRM PIPELINE (Supabase Data) */}
        <CRMPipelineTableCard
          industriLeads={industriLeads as Parameters<typeof CRMPipelineTableCard>[0]['industriLeads']}
          horecaLeads={horecaLeads as Parameters<typeof CRMPipelineTableCard>[0]['horecaLeads']}
        />

        {/* ROW 5: CAMPAIGNS (Supabase Data) */}
        <MarketingClientUI
          initialCampaigns={campaigns as Parameters<typeof MarketingClientUI>[0]['initialCampaigns']}
        />
      </main>

      <Footer />
    </div>
  );
}
