'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// --- MOCK ANALYTICS DATA ---
const telemetryDataMap: Record<string, Array<{ time: string; apiRequests: number; ssoEvents: number }>> = {
  Today: [
    { time: '00:00', apiRequests: 240, ssoEvents: 45 },
    { time: '04:00', apiRequests: 180, ssoEvents: 30 },
    { time: '08:00', apiRequests: 680, ssoEvents: 320 },
    { time: '12:00', apiRequests: 920, ssoEvents: 410 },
    { time: '16:00', apiRequests: 850, ssoEvents: 390 },
    { time: '20:00', apiRequests: 540, ssoEvents: 180 },
  ],
  '7D': [
    { time: 'Mon', apiRequests: 5400, ssoEvents: 2100 },
    { time: 'Tue', apiRequests: 6200, ssoEvents: 2450 },
    { time: 'Wed', apiRequests: 5900, ssoEvents: 2300 },
    { time: 'Thu', apiRequests: 6800, ssoEvents: 2800 },
    { time: 'Fri', apiRequests: 7100, ssoEvents: 2950 },
    { time: 'Sat', apiRequests: 4200, ssoEvents: 1600 },
    { time: 'Sun', apiRequests: 3800, ssoEvents: 1400 },
  ],
  '30D': [
    { time: 'W1', apiRequests: 38000, ssoEvents: 15400 },
    { time: 'W2', apiRequests: 42000, ssoEvents: 16800 },
    { time: 'W3', apiRequests: 45000, ssoEvents: 18200 },
    { time: 'W4', apiRequests: 48000, ssoEvents: 19500 },
  ],
  Q3: [
    { time: 'Jul', apiRequests: 185000, ssoEvents: 74000 },
    { time: 'Aug', apiRequests: 198000, ssoEvents: 79000 },
    { time: 'Sep', apiRequests: 212000, ssoEvents: 85000 },
  ],
};

const portalTrafficDistribution = [
  { name: 'Mother Station & Telemetry', value: 35, color: '#06B6D4' }, // Cyan
  { name: 'Client Skid & Horeca Portals', value: 28, color: '#6366F1' }, // Indigo
  { name: 'Logistics & Fleet Dispatch', value: 22, color: '#3B82F6' }, // Blue
  { name: 'Commercial CRM & Finance', value: 15, color: '#10B981' }, // Emerald
];

// --- INITIAL SYSTEM LOGS ---
const initialSystemLogs = [
  { id: 'LOG-RT-901', timestamp: '2026-07-25 14:32:10', division: 'Stasiun', action: 'ATEX Telemetry Protocol Sync', actor: 'System Core API (10.0.4.12)', status: 'Valid SSL', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
  { id: 'LOG-RT-902', timestamp: '2026-07-25 13:45:02', division: 'Pemasaran', action: 'MIGAS Price Index Policy Applied', actor: 'Bagus S. (Super Admin)', status: 'MIGAS Sync', statusColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800' },
  { id: 'LOG-RT-903', timestamp: '2026-07-25 12:18:55', division: 'Armada', action: 'Driver PIN Matrix Rotated (412 PINs)', actor: 'Security Cron Job #4', status: 'Token Refreshed', statusColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800' },
  { id: 'LOG-RT-904', timestamp: '2026-07-25 10:05:12', division: 'Keuangan', action: 'Billing Engine USD/IDR Rate Locked', actor: 'Rini Andini (Finance Mgr)', status: 'Rate Limiting', statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-800' },
  { id: 'LOG-RT-905', timestamp: '2026-07-25 08:30:00', division: 'Pusat', action: 'Database Cluster Daily Checkpoint', actor: 'Root Automation', status: 'Valid SSL', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
];

export default function PusatDashboardOverview() {
  const [logs, setLogs] = useState(initialSystemLogs);
  const [timeTab, setTimeTab] = useState<'Today' | '7D' | '30D' | 'Q3'>('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivFilter, setSelectedDivFilter] = useState('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    id: '',
    timestamp: '2026-07-25 15:00:00',
    division: 'Pusat',
    action: '',
    actor: 'Bagus S. (Super Admin)',
    status: 'Root Override',
    statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-800',
  });

  const chartData = useMemo(() => telemetryDataMap[timeTab], [timeTab]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiv = selectedDivFilter === 'ALL' || l.division === selectedDivFilter;
      return matchSearch && matchDiv;
    });
  }, [logs, searchQuery, selectedDivFilter]);

  const handleOpenModal = (mode: 'create' | 'edit', logItem: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && logItem) {
      setFormData(logItem);
    } else {
      const randomNum = Math.floor(906 + Math.random() * 90);
      setFormData({
        id: `LOG-RT-${randomNum}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        division: 'Pusat',
        action: '',
        actor: 'Bagus S. (Super Admin)',
        status: 'Root Override',
        statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!formData.action.trim()) {
      alert('Action description cannot be empty');
      return;
    }
    if (modalMode === 'create') {
      setLogs([formData, ...logs]);
    } else {
      setLogs(logs.map((item) => (item.id === formData.id ? formData : item)));
    }
    setIsModalOpen(false);
  };

  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handleTriggerCheckpoint = () => {
    setIsPurging(true);
    setPurgeSuccess(false);
    setTimeout(() => {
      setIsPurging(false);
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 4000);
    }, 1500);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm(`Are you sure you want to purge telemetry audit log ${id}?`)) {
      setLogs(logs.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* EXECUTIVE ROOT GOVERNANCE HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap shrink-0 align-middle shadow-sm">
                <Icon name="ShieldCheckIcon" size={14} className="text-indigo-400" />
                <span>Root Governance Core v2.4</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap shrink-0 align-middle shadow-sm">
                <Icon name="ServerStackIcon" size={14} />
                <span>9 Portals Synchronized</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Enterprise Root Governance & Telemetry Console
            </h1>
            <p className="text-sm font-medium text-slate-300 leading-relaxed">
              Pusat kendali supremasi sistem BASKARA, pemantauan latensi API Gateway 9 portal, sinkronisasi harga gas nasional (MIGAS HBA), serta pengaturan otoritas RBAC & PIN pengemudi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleTriggerCheckpoint}
              disabled={isPurging || purgeSuccess}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all duration-300 shadow-xl active:scale-95 disabled:cursor-not-allowed border whitespace-nowrap shrink-0 align-middle ${
                purgeSuccess
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-950/50'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-indigo-500/40 text-indigo-300 hover:text-white shadow-indigo-950/20'
              }`}
            >
              {isPurging ? (
                <>
                  <Icon name="ArrowPathIcon" size={15} className="animate-spin text-indigo-400" />
                  <span>Flushing Gateway Cache...</span>
                </>
              ) : purgeSuccess ? (
                <>
                  <Icon name="CheckCircleIcon" size={15} className="text-white" />
                  <span>Cluster Checkpoint Verified</span>
                </>
              ) : (
                <>
                  <Icon name="BoltIcon" size={15} />
                  <span>[⚡ Trigger Core Checkpoint]</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* ROW 1: EXECUTIVE ROOT HERO METRICS (4 CARDS) WITH ROYAL INDIGO / PURPLE GLASSMORPHISM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        
        {/* Card 1: Active Tenant Sessions */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
          <div>
            <div className="flex items-start justify-between text-indigo-300 mb-2 gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                <Icon name="ShieldCheckIcon" size={16} className="text-indigo-400 shrink-0" />
                <span>Active Tenant Sessions</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap shrink-0 align-middle">
                ● 100% SECURE SSL
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-3">
              142 <span className="text-sm font-semibold text-indigo-300">Tenants</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-800/40 flex items-center justify-between text-xs text-indigo-300 font-medium">
            <span>Across 9 Ecosystem Portals</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Icon name="ArrowTrendingUpIcon" size={14} className="text-emerald-400" />
              +12% vs last mo
            </span>
          </div>
        </div>

        {/* Card 2: API Gateway Load */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-6 rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/40 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all duration-500 pointer-events-none" />
          <div>
            <div className="flex items-start justify-between text-slate-400 mb-2 gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                <Icon name="ServerStackIcon" size={16} className="text-cyan-400 shrink-0" />
                <span>API Gateway Load</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap shrink-0 align-middle">
                ● 12ms AVG LATENCY
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-3">
              8.4M <span className="text-sm font-semibold text-slate-400">Req/24h</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>99.999% Gateway Uptime</span>
            <span className="font-bold text-cyan-400 flex items-center gap-1">
              <Icon name="CheckCircleIcon" size={14} />
              Zero Packet Loss
            </span>
          </div>
        </div>

        {/* Card 3: MIGAS Reference Index */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/40 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all duration-500 pointer-events-none" />
          <div>
            <div className="flex items-start justify-between text-slate-400 mb-2 gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                <Icon name="BanknotesIcon" size={16} className="text-amber-400 shrink-0" />
                <span>MIGAS Reference Index</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap shrink-0 align-middle">
                ● BRENT LINKED
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-3">
              $12.40 <span className="text-sm font-semibold text-slate-400">/ MMBTU</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>National HBA Base Price</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Icon name="LockClosedIcon" size={14} />
              Locked by Core
            </span>
          </div>
        </div>

        {/* Card 4: SSO Security Events */}
        <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-purple-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-purple-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/50 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500 pointer-events-none" />
          <div>
            <div className="flex items-start justify-between text-purple-300 mb-2 gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                <Icon name="KeyIcon" size={16} className="text-purple-400 shrink-0" />
                <span>SSO Security Events</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap shrink-0 align-middle">
                ● 2FA ENFORCED
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-3">
              0 <span className="text-sm font-semibold text-purple-300">Critical Alerts</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs text-purple-300 font-medium">
            <span>412 Active Personnel PINs</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Icon name="ShieldCheckIcon" size={14} />
              Audit Passed
            </span>
          </div>
        </div>

      </div>

      {/* ROW 2: INTERACTIVE ANALYTICS SECTION (RECHARTS AREA + PIE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: API Gateway Load vs Auth SSO Traffic Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Ecosystem Gateway Throughput vs SSO Auth Traffic
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time monitoring of REST API requests (in thousands/hr) compared against SSO credential validations across all portals.
              </p>
            </div>
            
            {/* Time Filter Tabs */}
            <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto">
              {(['Today', '7D', '30D', 'Q3'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTimeTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeTab === tab
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'Today' ? 'Today (24H)' : tab === '7D' ? '7 Days' : tab === '30D' ? '30 Days' : 'Q3 2026'}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(51, 65, 85, 0.8)',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value.toLocaleString()} ${name === 'apiRequests' ? 'k Req' : 'Auths'}`,
                    name === 'apiRequests' ? 'API Gateway Load' : 'SSO Validations',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="apiRequests"
                  name="apiRequests"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorApi)"
                />
                <Area
                  type="monotone"
                  dataKey="ssoEvents"
                  name="ssoEvents"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSso)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs font-semibold text-slate-500 gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                <span>API Gateway Load (k Req/hr)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span>SSO Validations & Token Refreshes</span>
              </div>
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Icon name="ShieldCheckIcon" size={14} /> Root Rate Limiting Active
            </div>
          </div>
        </div>

        {/* Right Col: Portal Traffic Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Portal Telemetry Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Breakdown of system API bandwidth consumption by division cluster.
            </p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portalTrafficDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {portalTrafficDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(51, 65, 85, 0.8)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}% Bandwidth`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {portalTrafficDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white shrink-0">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROW 3: GLOBAL SECURITY & SYSTEM AUDIT LOG TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Table Header Controls */}
        <div className="p-6 sm:p-7 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Icon name="CommandLineIcon" size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Global Root Audit Trail & System Log</span>
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Live audit events logged by Super Admin API root triggers across all 9 ecosystem portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Division Filter */}
            <select
              value={selectedDivFilter}
              onChange={(e) => setSelectedDivFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Divisions (9 Portals)</option>
              <option value="Pusat">Modul Pusat (Root)</option>
              <option value="Stasiun">Modul Stasiun</option>
              <option value="Pemasaran">Modul Pemasaran</option>
              <option value="Armada">Modul Armada</option>
              <option value="Keuangan">Modul Keuangan</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit action, actor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Create Root Event Log Button */}
            <button
              onClick={() => handleOpenModal('create')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-indigo-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap shrink-0"
            >
              <Icon name="PlusIcon" size={16} />
              <span>Simulate Root Event</span>
            </button>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">LOG ID</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">TIMESTAMP & DIVISION</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">SECURITY ACTION / PROTOCOL</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">ACTOR / IP ADDRESS</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">TELEMETRY STATUS</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap shrink-0 align-middle">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    
                    {/* Log ID */}
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap shrink-0 align-middle">
                      {item.id}
                    </td>

                    {/* Timestamp & Division */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 dark:text-white">{item.timestamp}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          Modul {item.division}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white max-w-md align-middle">
                      {item.action}
                    </td>

                    {/* Actor */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px] border border-slate-200 dark:border-slate-700">
                        <Icon name="UserIcon" size={12} className="text-indigo-500" />
                        {item.actor}
                      </span>
                    </td>

                    {/* Slim 1-Line Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${item.statusColor} whitespace-nowrap shrink-0 align-middle shadow-2xs`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap shrink-0 align-middle">
                      <div className="inline-flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal('edit', item)}
                          title="Edit Log Telemetry"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all"
                        >
                          <Icon name="PencilSquareIcon" size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(item.id)}
                          title="Purge Audit Log"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-all"
                        >
                          <Icon name="TrashIcon" size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    No telemetry logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
          <div>
            Showing <span className="font-extrabold text-slate-900 dark:text-white">{filteredLogs.length}</span> of <span className="font-extrabold">{logs.length}</span> system root audit logs.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Valid SSL / Verified</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> MIGAS Policy Sync</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Root Override Active</span>
          </div>
        </div>

      </div>

      {/* --- ADVANCED LUXURY SYSTEM LOG MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 to-purple-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
                  <Icon name={modalMode === 'create' ? 'PlusIcon' : 'PencilSquareIcon'} size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    {modalMode === 'create' ? 'Simulate Root System Event' : 'Modify Audit Log Entry'}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Super Admin Root Authority protocol override.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Action / Security Protocol Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  placeholder="e.g., MIGAS Quota Threshold Override Applied..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Division
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pusat">Modul Pusat (Root)</option>
                    <option value="Stasiun">Modul Stasiun</option>
                    <option value="Pemasaran">Modul Pemasaran</option>
                    <option value="Armada">Modul Armada</option>
                    <option value="Keuangan">Modul Keuangan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Telemetry Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      let color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
                      if (val === 'MIGAS Sync') color = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
                      if (val === 'Root Override') color = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-800';
                      if (val === 'Rate Limiting') color = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-800';
                      setFormData({ ...formData, status: val, statusColor: color });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Root Override">Root Override</option>
                    <option value="Valid SSL">Valid SSL / Verified</option>
                    <option value="MIGAS Sync">MIGAS Sync</option>
                    <option value="Rate Limiting">Rate Limiting</option>
                    <option value="Token Refreshed">Token Refreshed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Actor / IP Address Telemetry
                </label>
                <input
                  type="text"
                  value={formData.actor}
                  onChange={(e) => setFormData({ ...formData, actor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>{modalMode === 'create' ? 'Deploy Audit Log' : 'Save Changes'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
