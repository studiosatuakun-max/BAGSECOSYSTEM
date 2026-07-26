'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import CampaignROIChart from './components/CampaignROIChart';
import AcquisitionFunnel from './components/AcquisitionFunnel';
import TopClientsTable from './components/TopClientsTable';

const initialCampaigns = [
  { id: 'CMP-01', name: 'B2B Smelter & Metallurgy Q3 Retargeting', plat: 'LinkedIn', stat: 'Running', budget: 'Rp 45.0 Jt', leads: 412, conversion: '12.4%' },
  { id: 'CMP-02', name: 'Horeca & Commercial VGL Promo Merdeka', plat: 'Instagram', stat: 'Running', budget: 'Rp 28.5 Jt', leads: 320, conversion: '9.8%' },
  { id: 'CMP-03', name: 'Industrial Bulk CNG Awareness Push', plat: 'Google Ads', stat: 'Paused', budget: 'Rp 60.0 Jt', leads: 280, conversion: '7.1%' },
  { id: 'CMP-04', name: 'Skid Tube Trailer Milk-Run Expansion', plat: 'Email B2B', stat: 'Draft', budget: 'Rp 15.0 Jt', leads: 128, conversion: '14.2%' },
];

export default function MarketingDashboardPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', name: '', plat: 'LinkedIn', stat: 'Draft', budget: 'Rp 20.0 Jt', leads: 100, conversion: '8.5%' });
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);
  const [crmSyncSuccess, setCrmSyncSuccess] = useState(false);

  const handleOpenModal = (mode: 'create' | 'edit', campaign: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && campaign) {
      setFormData(campaign);
    } else {
      setFormData({ id: `CMP-0${Math.floor(5 + Math.random() * 9)}`, name: '', plat: 'LinkedIn', stat: 'Draft', budget: 'Rp 25.0 Jt', leads: 150, conversion: '10.0%' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.name) return alert('Campaign Name is required');
    if (modalMode === 'create') {
      setCampaigns([formData, ...campaigns]);
    } else {
      setCampaigns(campaigns.map(c => c.id === formData.id ? formData : c));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this CNG marketing campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const handleTriggerCrmSync = () => {
    setIsSyncingCrm(true);
    setCrmSyncSuccess(false);
    setTimeout(() => {
      setIsSyncingCrm(false);
      setCrmSyncSuccess(true);
      setTimeout(() => setCrmSyncSuccess(false), 4000);
    }, 1500);
  };

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

      {/* Gold Benchmark Spacing: pt-10 pb-12 space-y-8 */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE CMO CRM & AE PIPELINE HERO BANNER (Standardized with Stasiun) */}
        <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-pink-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 text-xs font-bold text-pink-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span>B2B Gas Growth Engine v2.4 · AE CRM Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              B2B Commercial Gas Growth &amp; Pipeline Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali akuisisi prospek manufaktur berat &amp; Horeca (Sm³/day), pemantauan konversi kuota MMBTU, serta analisis ROI kampanye pemasaran gas secara real-time.
            </p>
          </div>

          <button
            onClick={handleTriggerCrmSync}
            disabled={isSyncingCrm || crmSyncSuccess}
            className={`px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center disabled:cursor-not-allowed ${
              crmSyncSuccess
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950/50'
                : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-pink-500/30'
            }`}
          >
            {isSyncingCrm ? (
              <>
                <Icon name="ArrowPathIcon" size={18} className="animate-spin text-white" />
                <span>Syncing AE CRM...</span>
              </>
            ) : crmSyncSuccess ? (
              <>
                <Icon name="CheckCircleIcon" size={18} className="text-white" />
                <span>Pipeline Verified</span>
              </>
            ) : (
              <>
                <Icon name="BoltIcon" size={18} />
                <span>Sync AE CRM Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH FROSTED GLASSMORPHISM & ACCENT GLOWS */}
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

          {/* Card 4: CAC (Cost Per Acquisition) */}
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

        {/* ROW 2: ANALYTICS BENTO GRID (ROI CHART + ACQUISITION FUNNEL) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CampaignROIChart />
          </div>
          <div className="lg:col-span-1">
            <AcquisitionFunnel />
          </div>
        </div>

        {/* ROW 3: ENTERPRISE TOP CLIENTS TABLE */}
        <div className="w-full">
          <TopClientsTable />
        </div>

        {/* ROW 4: ACTIVE MARKETING CAMPAIGNS (CRUD) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl overflow-hidden transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Active Marketing &amp; Retargeting Campaigns
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                  {campaigns.length} Operations
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Kelola anggaran promosi, ekspansi rute Skid Tube Trailer baru, dan kampanye retargeting untuk sektor manufaktur, peleburan logam, dan Horeca.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal('create')}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Icon name="PlusIcon" size={15} />
              <span>Add New Campaign</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Platform Channel</th>
                  <th className="py-3 px-4 text-right">Allocated Budget</th>
                  <th className="py-3 px-4 text-right">Leads Generated</th>
                  <th className="py-3 px-4 text-right">Conv. Rate</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {campaigns.map((row) => (
                  <tr key={row.id} className="hover:bg-pink-50/30 dark:hover:bg-pink-950/20 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                        {row.plat}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {row.budget || 'Rp 25.0 Jt'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-pink-600 dark:text-pink-400 tabular-nums">
                      {row.leads || 120}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {row.conversion || '10.5%'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        row.stat === 'Running' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                        row.stat === 'Paused' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700' :
                        'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.stat === 'Running' ? 'bg-emerald-500 animate-pulse' : row.stat === 'Paused' ? 'bg-slate-400' : 'bg-amber-500'}`} />
                        <span>{row.stat}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal('edit', row)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          title="Edit Campaign"
                        >
                          <Icon name="PencilSquareIcon" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Campaign"
                        >
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No active marketing campaigns found. Click &quot;Add New Campaign&quot; to launch a new promo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {modalMode === 'create' ? 'Launch New CNG Campaign' : 'Edit Campaign Strategy'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Atur parameter target pasar dan alokasi anggaran Mother Station.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder-slate-400"
                  placeholder="e.g. Q4 Bulk Smelter Expo Promo"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Platform Channel
                  </label>
                  <select
                    value={formData.plat}
                    onChange={(e) => setFormData({ ...formData, plat: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="LinkedIn">LinkedIn B2B</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Email B2B">Email B2B</option>
                    <option value="Industry Expo">Industry Expo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.stat}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Running">Running</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Allocated Budget
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Rp 30.0 Jt"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Conv. Rate
                  </label>
                  <input
                    type="text"
                    value={formData.conversion}
                    onChange={(e) => setFormData({ ...formData, conversion: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="12.0%"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
              >
                {modalMode === 'create' ? 'Launch Campaign' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}