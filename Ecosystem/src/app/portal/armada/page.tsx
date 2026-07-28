'use client';

import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import ActiveDeliveriesTableCard from './components/ActiveDeliveriesTableCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- TIME RANGE DATASET FOR CNG LOGISTICS (MMBTU Transported vs Mileage Km) ---
const fleetDatasets: Record<string, any[]> = {
  Today: [
    { period: '06:00', gasVolume: 1250, mileageKm: 320, activeSkids: 28 },
    { period: '09:00', gasVolume: 3400, mileageKm: 850, activeSkids: 45 },
    { period: '12:00', gasVolume: 5100, mileageKm: 1240, activeSkids: 52 },
    { period: '15:00', gasVolume: 6800, mileageKm: 1680, activeSkids: 58 },
    { period: '18:00', gasVolume: 7900, mileageKm: 1950, activeSkids: 60 },
    { period: '21:00', gasVolume: 8450, mileageKm: 2120, activeSkids: 62 },
  ],
  '7D': [
    { period: 'Sen', gasVolume: 52400, mileageKm: 14200, activeSkids: 58 },
    { period: 'Sel', gasVolume: 58100, mileageKm: 15400, activeSkids: 62 },
    { period: 'Rab', gasVolume: 55300, mileageKm: 14800, activeSkids: 60 },
    { period: 'Kam', gasVolume: 61200, mileageKm: 16200, activeSkids: 64 },
    { period: 'Jum', gasVolume: 59800, mileageKm: 15900, activeSkids: 63 },
    { period: 'Sab', gasVolume: 48500, mileageKm: 13100, activeSkids: 52 },
    { period: 'Min', gasVolume: 42000, mileageKm: 11500, activeSkids: 46 },
  ],
  '1M': [
    { period: 'M1', gasVolume: 224000, mileageKm: 61000, activeSkids: 58 },
    { period: 'M2', gasVolume: 238000, mileageKm: 64500, activeSkids: 62 },
    { period: 'M3', gasVolume: 245000, mileageKm: 66200, activeSkids: 64 },
    { period: 'M4', gasVolume: 252000, mileageKm: 68000, activeSkids: 65 },
  ],
  Q3: [
    { period: 'Jul', gasVolume: 980000, mileageKm: 265000, activeSkids: 62 },
    { period: 'Ags', gasVolume: 1040000, mileageKm: 282000, activeSkids: 65 },
    { period: 'Sep', gasVolume: 1120000, mileageKm: 305000, activeSkids: 68 },
  ],
};

// --- ROUTE ZONE DISTRIBUTION ---
const routeZoneDistribution = [
  { name: 'Surabaya Industrial Estate (SIER)', volume: '3,850 MMBTU', value: 45, color: '#0284c7' },
  { name: 'Gresik Petrochemical Route', volume: '2,120 MMBTU', value: 25, color: '#3b82f6' },
  { name: 'Sidoarjo Commercial Hub', volume: '1,530 MMBTU', value: 18, color: '#6366f1' },
  { name: 'Mojokerto - Pasuruan Zone', volume: '950 MMBTU', value: 12, color: '#06b6d4' },
];



export default function ArmadaDashboardPage() {
  
  const [timeRange, setTimeRange] = useState<'Today' | '7D' | '1M' | 'Q3'>('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');



  const [isSyncingFleet, setIsSyncingFleet] = useState(false);
  const [fleetSyncSuccess, setFleetSyncSuccess] = useState(false);

  const handleTriggerFleetSync = () => {
    setIsSyncingFleet(true);
    setFleetSyncSuccess(false);
    setTimeout(() => {
      setIsSyncingFleet(false);
      setFleetSyncSuccess(true);
      setTimeout(() => setFleetSyncSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative">
      {/* Top Header with Frosted Glass & Cyan Identity Accent Bar */}
      <PortalHeader
        title="Baskara Fleet & Skid Console"
        subtitle="CNG Logistics, Tube-Skid Dispatch & Live Telemetry"
        roleBadge="Fleet Manager"
        roleColor="blue"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">09:14:22 WIB</span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              GPS &amp; ATEX Telemetry Live
            </span>
          </div>
        }
      />

      {/* Gold Benchmark Spacing: pt-10 pb-12 space-y-8 */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">
        {/* EXECUTIVE FLEET & SKID TELEMETRY HERO BANNER (Standardized with Stasiun) */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-xs font-bold text-cyan-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Fleet Logistics Engine v2.4 · GPS &amp; ATEX Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Mother Station Fleet &amp; Skid Dispatch Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali logistik armada Mother Station, pemantauan status pengiriman Skid Tube Trailer (20ft/40ft), kepatuhan sertifikasi ATEX/SIO supir, serta pengiriman darurat (Emergency Dispatch) secara real-time.
            </p>
          </div>

          <button
            onClick={handleTriggerFleetSync}
            disabled={isSyncingFleet || fleetSyncSuccess}
            className={`px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center disabled:cursor-not-allowed ${
              fleetSyncSuccess
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950/50'
                : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white shadow-cyan-500/30'
            }`}
          >
            {isSyncingFleet ? (
              <>
                <Icon name="ArrowPathIcon" size={18} className="animate-spin text-white" />
                <span>Syncing Telemetry...</span>
              </>
            ) : fleetSyncSuccess ? (
              <>
                <Icon name="CheckCircleIcon" size={18} className="text-white" />
                <span>Fleets Synchronized</span>
              </>
            ) : (
              <>
                <Icon name="BoltIcon" size={18} />
                <span>Sync Fleet Telemetry</span>
              </>
            )}
          </button>
        </div>
        
        {/* ROW 1: 4 HERO METRIC CARDS (Frosted Acrylic Glassmorphism + Slim 1-Line Badges) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Card 1: Active Prime Movers */}
          <div 
            className="bg-gradient-to-br from-cyan-50/90 via-white/80 to-blue-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-cyan-950/30 p-6 rounded-3xl border border-cyan-100 dark:border-slate-700/80 shadow-lg shadow-cyan-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ animationDelay: '0ms' }}
          >
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
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">32</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Units Active</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3 border-t border-cyan-100/60 dark:border-slate-800">
              <span>Total Armada Truk</span>
              <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">34 Units</span>
            </div>
          </div>

          {/* Card 2: Tube-Skid Racks Circulating */}
          <div 
            className="bg-gradient-to-br from-blue-50/90 via-white/80 to-indigo-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-blue-950/30 p-6 rounded-3xl border border-blue-100 dark:border-slate-700/80 shadow-lg shadow-blue-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ animationDelay: '150ms' }}
          >
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

          {/* Card 3: Total Gas Transported Today */}
          <div 
            className="bg-gradient-to-br from-indigo-50/90 via-white/80 to-purple-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-indigo-950/30 p-6 rounded-3xl border border-indigo-100 dark:border-slate-700/80 shadow-lg shadow-indigo-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ animationDelay: '300ms' }}
          >
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

          {/* Card 4: Telemetry & ATEX Alerts */}
          <div 
            className="bg-gradient-to-br from-rose-50/90 via-white/80 to-amber-50/50 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-rose-950/30 p-6 rounded-3xl border border-rose-100 dark:border-slate-700/80 shadow-lg shadow-rose-500/5 dark:shadow-none flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ animationDelay: '450ms' }}
          >
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
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">1 Maint · 1 Low Bar</span>
            </div>
          </div>

        </div>

        {/* ROW 2: INTERACTIVE TIME-RANGE ANALYTICS & ROUTE DISTRIBUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Recharts Area Comparison (Span 2) */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    CNG Logistics &amp; Tube-Skid Dispatch Telemetry
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Perbandingan volume gas terkirim (MMBTU) vs total jarak tempuh armada milk-run (km).
                </p>
              </div>

              {/* Multi-tab Time Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700 self-start sm:self-auto">
                {(['Today', '7D', '1M', 'Q3'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTimeRange(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                      timeRange === tab
                        ? 'bg-cyan-600 text-white shadow-sm scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Comparison */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fleetDatasets[timeRange]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#06b6d4', fontWeight: 600 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#3b82f6', fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.1)', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', 
                      color: '#fff',
                      fontSize: '12px',
                      padding: '12px 16px'
                    }} 
                    formatter={(value: number, name: string) => [
                      name === 'gasVolume' ? `${value.toLocaleString()} MMBTU` : `${value.toLocaleString()} km`, 
                      name === 'gasVolume' ? '⚡ Volume Gas Terkirim' : '🚛 Jarak Tempuh Armada'
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                  <Area yAxisId="left" type="monotone" dataKey="gasVolume" name="⚡ Volume Gas Terkirim" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorGas)" />
                  <Area yAxisId="right" type="monotone" dataKey="mileageKm" name="🚛 Jarak Tempuh Armada" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorKm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Route Zone Distribution (Span 1) */}
          <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Distribusi Rute &amp; Kawasan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Alokasi sirkulasi Tube-Skid berdasarkan zona logistik.
              </p>
            </div>

            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={routeZoneDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {routeZoneDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number, name: string, props: any) => [`${val}% (${props.payload.volume})`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Route Zone Breakdown List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {routeZoneDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate" title={item.name}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-slate-400 text-[10px]">{item.volume.split(' ')[0]} MMBTU</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <ActiveDeliveriesTableCard />
        </div>

      </main>

      <Footer />
    </div>
  );
}