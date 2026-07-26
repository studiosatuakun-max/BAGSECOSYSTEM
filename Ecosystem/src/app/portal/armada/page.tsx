'use client';

import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';

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

// --- INITIAL MASTER FLEET & TUBE-SKID RECORDS ---
const initialFleetRecords = [
  {
    id: 'TRK-01',
    plat: 'B 9123 GAH',
    driver: 'Dian Prasetyo',
    sioStatus: 'SIO ATEX-2027',
    skidId: 'Skid 40ft-08',
    capacitySm3: 3200,
    pressureBar: 248,
    route: 'Surabaya ➔ PT Unilever (Gresik)',
    status: 'En Route (60 km/h)',
  },
  {
    id: 'TRK-02',
    plat: 'L 8452 TX',
    driver: 'Budi Santoso',
    sioStatus: 'SIO ATEX-2026',
    skidId: 'Skid 40ft-12',
    capacitySm3: 3200,
    pressureBar: 205,
    route: 'Mother Station ➔ SIER Zone',
    status: 'Discharging Gas',
  },
  {
    id: 'TRK-03',
    plat: 'W 9101 BRS',
    driver: 'Andi Wijaya',
    sioStatus: 'SIO ATEX-2028',
    skidId: 'Skid 20ft-04',
    capacitySm3: 1600,
    pressureBar: 250,
    route: 'Standby @ Gresik Mother Station',
    status: 'Standby Mother Stn',
  },
  {
    id: 'TRK-04',
    plat: 'L 1122 PO',
    driver: 'Joko Anwar',
    sioStatus: 'SIO ATEX-2025 (Exp Near)',
    skidId: 'Skid 40ft-03',
    capacitySm3: 3200,
    pressureBar: 142,
    route: 'Workshop Karawang (Tyre Check)',
    status: 'ATEX Maintenance',
  },
  {
    id: 'TRK-05',
    plat: 'B 7788 MXZ',
    driver: 'Hendra Setiawan',
    sioStatus: 'SIO ATEX-2027',
    skidId: 'Skid 40ft-15',
    capacitySm3: 3200,
    pressureBar: 246,
    route: 'Sidoarjo ➔ JW Marriott Surabaya',
    status: 'En Route (45 km/h)',
  },
  {
    id: 'TRK-06',
    plat: 'W 5544 KJD',
    driver: 'Rachmat Hidayat',
    sioStatus: 'SIO ATEX-2026',
    skidId: 'Skid 20ft-09',
    capacitySm3: 1600,
    pressureBar: 251,
    route: 'Pasuruan ➔ PT Gajah Tunggal',
    status: 'Discharging Gas',
  },
];

export default function ArmadaDashboardPage() {
  const [fleet, setFleet] = useState(initialFleetRecords);
  const [timeRange, setTimeRange] = useState<'Today' | '7D' | '1M' | 'Q3'>('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    id: '',
    plat: '',
    driver: '',
    sioStatus: 'SIO ATEX-2027',
    skidId: 'Skid 40ft-01',
    capacitySm3: 3200,
    pressureBar: 250,
    route: '',
    status: 'Standby Mother Stn',
  });

  // Filtered Records
  const filteredFleet = useMemo(() => {
    return fleet.filter((item) => {
      const matchSearch =
        item.plat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skidId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.route.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || item.status.toLowerCase().includes(statusFilter.toLowerCase());
      return matchSearch && matchStatus;
    });
  }, [fleet, searchQuery, statusFilter]);

  const handleOpenModal = (mode: 'create' | 'edit', record: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && record) {
      setFormData(record);
    } else {
      setFormData({
        id: `TRK-0${Math.floor(7 + Math.random() * 9)}`,
        plat: '',
        driver: '',
        sioStatus: 'SIO ATEX-2027',
        skidId: `Skid ${Math.random() > 0.5 ? '40ft' : '20ft'}-${Math.floor(10 + Math.random() * 89)}`,
        capacitySm3: 3200,
        pressureBar: 250,
        route: 'Mother Station ➔ Client Zone',
        status: 'Standby Mother Stn',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.plat || !formData.driver) {
      alert('Plat Nomor dan Nama Driver wajib diisi!');
      return;
    }
    if (modalMode === 'create') {
      setFleet([formData, ...fleet]);
    } else {
      setFleet(fleet.map((v) => (v.id === formData.id ? formData : v)));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data armada & Skid ini?')) {
      setFleet(fleet.filter((v) => v.id !== id));
    }
  };

  const handleDispatchEmergency = (plat: string, skidId: string) => {
    alert(`⚡ INSTRUKSI EMERGENCY DISPATCH:\nTim teknis ATEX & Mother Station telah dikerahkan untuk pemeriksaan tekanan pada armada ${plat} (${skidId}).`);
  };

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
        {/* EXECUTIVE FLEET & SKID TELEMETRY HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/90 to-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap shrink-0 align-middle shadow-sm">
                  <Icon name="TruckIcon" size={14} className="text-cyan-400" />
                  <span>Fleet Logistics Engine v2.4</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shrink-0 align-middle shadow-sm">
                  <Icon name="CheckCircleIcon" size={14} />
                  <span>GPS &amp; ATEX Connected</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Mother Station Fleet &amp; Skid Dispatch Console
              </h1>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                Pusat kendali logistik armada Mother Station, pemantauan status pengiriman Skid Tube Trailer (20ft/40ft), kepatuhan sertifikasi ATEX/SIO supir, serta pengiriman darurat (Emergency Dispatch) secara real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleTriggerFleetSync}
                disabled={isSyncingFleet || fleetSyncSuccess}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all duration-300 shadow-xl active:scale-95 disabled:cursor-not-allowed border whitespace-nowrap shrink-0 align-middle ${
                  fleetSyncSuccess
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-950/50'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-cyan-500/40 text-cyan-300 hover:text-white shadow-cyan-950/20'
                }`}
              >
                {isSyncingFleet ? (
                  <>
                    <Icon name="ArrowPathIcon" size={15} className="animate-spin text-cyan-400" />
                    <span>Syncing GPS Telemetry...</span>
                  </>
                ) : fleetSyncSuccess ? (
                  <>
                    <Icon name="CheckCircleIcon" size={15} className="text-white" />
                    <span>All Fleets Synchronized</span>
                  </>
                ) : (
                  <>
                    <Icon name="BoltIcon" size={15} />
                    <span>[⚡ Sync Fleet Telemetry]</span>
                  </>
                )}
              </button>
            </div>
          </div>
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

        {/* ROW 3: MASTER DATABASE ARMADA & TUBE-SKID + ADVANCED CRUD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden flex flex-col">
          
          {/* Table Header Controls & Filter Bar */}
          <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Master Database Armada &amp; Tube-Skid CNG
                </h3>
                <span className="bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                  {filteredFleet.length} Armada Terdaftar
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pantau sirkulasi tangki Skid 20ft/40ft, validasi sertifikat SIO ATEX sopir, dan tekanan operasi (Bar).
              </p>
            </div>

            {/* Filter Pills & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Search Box */}
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari plat, Skid ID, sopir, rute..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Icon name="XMarkIcon" size={14} />
                  </button>
                )}
              </div>

              {/* Status Dropdown Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-2xs cursor-pointer"
              >
                <option value="ALL">All Status ({fleet.length})</option>
                <option value="En Route">En Route</option>
                <option value="Discharging">Discharging Gas</option>
                <option value="Standby">Standby Mother Stn</option>
                <option value="Maintenance">ATEX Maintenance</option>
              </select>

              {/* Add Record Button */}
              <button
                onClick={() => handleOpenModal('create')}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <Icon name="PlusIcon" size={16} variant="solid" />
                <span>Add Vehicle &amp; Skid</span>
              </button>

            </div>
          </div>

          {/* Table Container - Protected with whitespace-nowrap and shrink-0 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                  <th className="py-4 px-6 whitespace-nowrap">Armada &amp; Plat Nomor</th>
                  <th className="py-4 px-6 whitespace-nowrap">Driver &amp; Sertifikasi ATEX</th>
                  <th className="py-4 px-6 whitespace-nowrap">Tube-Skid Attached</th>
                  <th className="py-4 px-6 whitespace-nowrap">Rute &amp; Klien Tujuan</th>
                  <th className="py-4 px-6 whitespace-nowrap">Status Operasional &amp; GPS</th>
                  <th className="py-4 px-6 text-right whitespace-nowrap">Aksi Strategis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {filteredFleet.map((row) => {
                  const isLowPressure = row.pressureBar < 180;
                  const isMaintenance = row.status.includes('Maintenance');
                  return (
                    <tr key={row.id} className="hover:bg-cyan-50/40 dark:hover:bg-slate-800/50 transition-colors group">
                      
                      {/* Col 1: Truck ID & Plat */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            <Icon name="TruckIcon" size={20} variant="solid" />
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-tight">
                              {row.plat}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                              <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">{row.id}</span>
                              <span className="text-slate-300 dark:text-slate-600">|</span>
                              <span>Prime Mover</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Driver & SIO ATEX Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-black text-slate-900 dark:text-white">
                          {row.driver}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold mt-0.5">
                          <Icon name="ShieldCheckIcon" size={14} className={row.sioStatus.includes('Exp') ? 'text-amber-500' : 'text-emerald-500'} />
                          <span className={row.sioStatus.includes('Exp') ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}>
                            {row.sioStatus}
                          </span>
                        </div>
                      </td>

                      {/* Col 3: Skid Tank & Pressure Telemetry */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                          <Icon name="CubeIcon" size={16} className="text-cyan-600 dark:text-cyan-400" />
                          <span>{row.skidId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold mt-0.5">
                          <span className="text-slate-500">{row.capacitySm3.toLocaleString()} Sm³</span>
                          <span className="text-slate-300">|</span>
                          <span className={isLowPressure ? 'text-rose-600 font-black animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}>
                            {row.pressureBar} Bar
                          </span>
                        </div>
                      </td>

                      {/* Col 4: Route & Target Client */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                          <Icon name="MapPinIcon" size={14} className="text-slate-400 shrink-0" />
                          <span>{row.route}</span>
                        </div>
                      </td>

                      {/* Col 5: Operational Status Badge - Locked 1-Line with whitespace-nowrap shrink-0 */}
                      <td className="py-4 px-6 whitespace-nowrap align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border whitespace-nowrap shrink-0 ${
                          row.status.includes('En Route') 
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                            : row.status.includes('Discharging')
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : row.status.includes('Standby')
                            ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            row.status.includes('En Route') ? 'bg-blue-500 animate-pulse' : 
                            row.status.includes('Discharging') ? 'bg-emerald-500 animate-pulse' : 
                            row.status.includes('Standby') ? 'bg-cyan-500' : 'bg-rose-500'
                          }`} />
                          <span>{row.status}</span>
                        </span>
                      </td>

                      {/* Col 6: Strategic Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          {(isLowPressure || isMaintenance) && (
                            <button
                              onClick={() => handleDispatchEmergency(row.plat, row.skidId)}
                              title="Kirim Instruksi Emergency Maintenance ke Tim Teknis ATEX"
                              className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-extrabold transition-all shadow-2xs flex items-center gap-1 animate-bounce"
                            >
                              <Icon name="WrenchScrewdriverIcon" size={12} />
                              <span>ATEX SLA</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal('edit', row)}
                            title="Edit Spesifikasi Armada & Skid"
                            className="p-2 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                          >
                            <Icon name="PencilSquareIcon" size={18} variant="outline" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            title="Hapus Record Armada"
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                          >
                            <Icon name="TrashIcon" size={18} variant="outline" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredFleet.length === 0 && (
            <div className="py-16 text-center">
              <Icon name="TruckIcon" size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">Tidak ada armada atau Skid yang sesuai kriteria.</p>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
            </div>
          )}

        </div>

      </main>

      {/* MODAL CRUD: ADD / EDIT ARMADA & SKID RECORD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black">
                  <Icon name="TruckIcon" size={20} variant="solid" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                    {modalMode === 'create' ? 'Daftarkan Armada & Skid Baru' : 'Edit Spesifikasi Armada'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pastikan sertifikasi SIO ATEX sopir dan uji tekan tabung valid.
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Plat Nomor Armada <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.plat}
                    onChange={(e) => setFormData({...formData, plat: e.target.value})}
                    placeholder="e.g. B 9123 GAH"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Kode Unit Truk
                  </label>
                  <input 
                    type="text" 
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    placeholder="e.g. TRK-01"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Nama Sopir <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.driver}
                    onChange={(e) => setFormData({...formData, driver: e.target.value})}
                    placeholder="e.g. Dian Prasetyo"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Validitas SIO ATEX
                  </label>
                  <select 
                    value={formData.sioStatus}
                    onChange={(e) => setFormData({...formData, sioStatus: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  >
                    <option value="SIO ATEX-2028">SIO ATEX-2028 (Valid)</option>
                    <option value="SIO ATEX-2027">SIO ATEX-2027 (Valid)</option>
                    <option value="SIO ATEX-2026">SIO ATEX-2026 (Valid)</option>
                    <option value="SIO ATEX-2025 (Exp Near)">SIO ATEX-2025 (Exp Near)</option>
                    <option value="SIO EXPIRED">SIO EXPIRED (Barred)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Tube-Skid Attached
                  </label>
                  <input 
                    type="text" 
                    value={formData.skidId}
                    onChange={(e) => setFormData({...formData, skidId: e.target.value})}
                    placeholder="Skid 40ft-08"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Kapasitas (Sm³)
                  </label>
                  <input 
                    type="number" 
                    value={formData.capacitySm3}
                    onChange={(e) => setFormData({...formData, capacitySm3: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Tekanan Gas (Bar)
                  </label>
                  <input 
                    type="number" 
                    value={formData.pressureBar}
                    onChange={(e) => setFormData({...formData, pressureBar: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Rute Logistik &amp; Klien Tujuan
                </label>
                <input 
                  type="text" 
                  value={formData.route}
                  onChange={(e) => setFormData({...formData, route: e.target.value})}
                  placeholder="e.g. Surabaya ➔ PT Unilever (Gresik)"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Status Operasional &amp; GPS Telemetri
                </label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                >
                  <option value="Standby Mother Stn">Standby Mother Stn</option>
                  <option value="En Route (60 km/h)">En Route (60 km/h)</option>
                  <option value="En Route (45 km/h)">En Route (45 km/h)</option>
                  <option value="Discharging Gas">Discharging Gas (Inlet Custody)</option>
                  <option value="ATEX Maintenance">ATEX Maintenance / Inspection</option>
                </select>
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>{modalMode === 'create' ? 'Daftarkan Armada' : 'Simpan Perubahan'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}