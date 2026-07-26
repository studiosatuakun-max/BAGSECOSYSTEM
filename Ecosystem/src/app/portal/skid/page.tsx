'use client';

import React, { useState, useMemo } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

// Import our upgraded B2B Skid & Custody Transfer client components
import TankInfoCard from './components/TankInfoCard';
import PressureGaugeCard from './components/PressureGaugeCard';
import ConsumptionTrendCard from './components/ConsumptionTrendCard';
import LatestInvoiceCard from './components/LatestInvoiceCard';
import EmergencyRefillCard from './components/EmergencyRefillCard';

interface CustodyOrder {
  id: string;
  client: string;
  fleet: string;
  driver: string;
  volume: string;
  pressure: string;
  date: string;
  stat: 'Delivered' | 'In Transit' | 'Processing' | 'Scheduled';
  verifier: string;
}

const initialOrders: CustodyOrder[] = [
  {
    id: 'PO-CNG-2026-001',
    client: 'PT Krakatau Baja Smelter',
    fleet: 'Skid B 9120 VGL (Tube 40ft)',
    driver: 'Ahmad Fauzi (ATEX SIO)',
    volume: '3,500 Sm³ (125 MMBTU)',
    pressure: '240 Bar',
    date: 'Jul 24, 2026 · 08:30',
    stat: 'Delivered',
    verifier: 'Rina Wulandari (QHSE Officer)',
  },
  {
    id: 'PO-CNG-2026-002',
    client: 'PT Unilever Foods & Beverages',
    fleet: 'Skid B 9200 VGL (Tube 20ft)',
    driver: 'Dian Prasetyo (ATEX SIO)',
    volume: '2,800 Sm³ (100 MMBTU)',
    pressure: '238 Bar',
    date: 'Jul 25, 2026 · 11:15',
    stat: 'In Transit',
    verifier: 'Hendra Saputra (Dispatch)',
  },
  {
    id: 'PO-CNG-2026-003',
    client: 'PT Indocement Tunggal Prakarsa',
    fleet: 'Skid B 9350 VGL (Tube 40ft)',
    driver: 'Rudi Santoso (ATEX SIO)',
    volume: '5,000 Sm³ (180 MMBTU)',
    pressure: '245 Bar',
    date: 'Jul 26, 2026 · 14:00',
    stat: 'Processing',
    verifier: 'Budi Ariyanto (Plant Mgr)',
  },
  {
    id: 'PO-CNG-2026-004',
    client: 'PT Asahimas Flat Glass Tbk',
    fleet: 'Skid B 9110 VGL (Tube 40ft)',
    driver: 'Wawan Gunawan (ATEX SIO)',
    volume: '4,200 Sm³ (150 MMBTU)',
    pressure: '242 Bar',
    date: 'Jul 27, 2026 · 09:00',
    stat: 'Scheduled',
    verifier: 'Siti Aminah (Admin Sales)',
  },
  {
    id: 'PO-CNG-2026-005',
    client: 'PT Mayora Indah Tbk (Boiler Plant)',
    fleet: 'Skid B 9440 VGL (Tube 20ft)',
    driver: 'Joko Widodo (ATEX SIO)',
    volume: '3,000 Sm³ (107 MMBTU)',
    pressure: '239 Bar',
    date: 'Jul 23, 2026 · 16:45',
    stat: 'Delivered',
    verifier: 'Rina Wulandari (QHSE Officer)',
  },
];

export default function SkidPortalDashboardPage() {
  const [orders, setOrders] = useState<CustodyOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<CustodyOrder>({
    id: '',
    client: 'PT Krakatau Baja Smelter',
    fleet: 'Skid B 9120 VGL (Tube 40ft)',
    driver: 'Ahmad Fauzi (ATEX SIO)',
    volume: '3,500 Sm³',
    pressure: '240 Bar',
    date: '',
    stat: 'Processing',
    verifier: 'Rina Wulandari (QHSE)',
  });

  const handleOpenModal = (mode: 'create' | 'edit', order?: CustodyOrder) => {
    setModalMode(mode);
    if (mode === 'edit' && order) {
      setFormData(order);
    } else {
      setFormData({
        id: `PO-CNG-2026-0${Math.floor(10 + Math.random() * 89)}`,
        client: 'PT Krakatau Baja Smelter',
        fleet: 'Skid B 9120 VGL (Tube 40ft)',
        driver: 'Ahmad Fauzi (ATEX SIO)',
        volume: '3,500 Sm³ (125 MMBTU)',
        pressure: '240 Bar',
        date: 'Jul 28, 2026 · 10:00',
        stat: 'Processing',
        verifier: 'Rina Wulandari (QHSE)',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.date || !formData.client) {
      toast.error('Gagal Menyimpan', { description: 'Nama Klien dan Tanggal Pengiriman wajib diisi.' });
      return;
    }
    if (modalMode === 'create') {
      setOrders([formData, ...orders]);
      toast.success('Order Pengiriman Skid Dibuat', {
        description: `${formData.id} untuk ${formData.client} berhasil dijadwalkan.`,
      });
    } else {
      setOrders(orders.map((o) => (o.id === formData.id ? formData : o)));
      toast.success('Order Pengiriman Diperbarui', {
        description: `Perubahan jadwal dan telemetri ${formData.id} berhasil disimpan.`,
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan pengantaran Skid ini?')) {
      setOrders(orders.filter((o) => o.id !== id));
      toast.info('Order Dihapus', { description: `Nomor PO ${id} telah dihapus dari log Custody Transfer.` });
    }
  };

  const handleSyncTelemetry = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Menghubungkan ke Mother Station SCADA & Manifold PRMS...',
        success: 'Telemetri Tekanan, Volume Sm³, & E-Faktur berhasil disinkronkan 100%!',
        error: 'Gagal menyinkronkan telemetri.',
      }
    );
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.fleet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.driver.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || o.stat === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Top Header */}
      <PortalHeader
        title="SkidPortal B2B"
        subtitle="Industrial Client Portal & Custody Transfer"
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

      {/* Gold Benchmark Spacing & Width matching /portal/hr */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE ACRYLIC HERO BANNER (Standardized 100% with HR & Stasiun) */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-xs font-bold text-indigo-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ISO 11120 Tube Manifold Monitoring · Custody Transfer Billing Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              Skid Tank &amp; Custody Transfer Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali telemetri tekanan manifold 250 Bar, laju pembakaran Sm³/hari, serta verifikasi bongkar muat (Custody Transfer) dan otomatisasi E-Faktur penagihan gas CNG industri B2B secara terintegrasi.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-10 self-stretch sm:self-auto justify-center">
            <button
              onClick={handleSyncTelemetry}
              className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Icon name="ArrowPathIcon" size={18} className="animate-spin-hover text-white" />
              <span>Sync SCADA &amp; E-Faktur</span>
            </button>
            <button
              onClick={() => handleOpenModal('create')}
              className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Icon name="PlusIcon" size={18} className="text-indigo-300" />
              <span>New Delivery PO</span>
            </button>
          </div>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH DEEP DARK ACRYLIC GRADIENTS MATCHING HR */}
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
                  ↑ 8.4% Q3
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                12,450 <span className="text-sm font-bold text-purple-400 uppercase">Sm³/day</span>
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

        {/* ROW 2: ASYMMETRIC 2:1 BENTO GRID (Breathing Room Matching HR) */}
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

        {/* MASTER CUSTODY TRANSFER & SKID DELIVERY DIRECTORY TABLE (CRUD) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  B2B Custody Transfer &amp; Skid Delivery Directory
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider whitespace-nowrap shrink-0 align-middle">
                  Live Log
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                Jadwal bongkar muat gas CNG, verifikasi tekanan manifold, dan nomor seri armada Skid Tank di pabrik klien.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Cari PO, Klien, atau Armada Skid..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="MagnifyingGlassIcon" size={14} />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="Delivered">Delivered (Selesai Bongkar)</option>
                <option value="In Transit">In Transit (Dalam Perjalanan)</option>
                <option value="Processing">Processing (Di Mother Station)</option>
                <option value="Scheduled">Scheduled (Terjadwal)</option>
              </select>

              <button
                onClick={() => handleOpenModal('create')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Icon name="PlusIcon" size={14} />
                <span>New PO</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3.5 px-4 whitespace-nowrap">PO Number</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Industrial Account &amp; Fleet</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Volume &amp; Pressure</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Schedule &amp; Verifier</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="py-4 px-4 font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white max-w-[220px] truncate" title={row.client}>
                          {row.client}
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                          <span>🚚 {row.fleet}</span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{row.driver}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 dark:text-white">{row.volume}</div>
                        <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Manifold: {row.pressure}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.date}</div>
                        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]" title={row.verifier}>
                          Verif: {row.verifier}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border whitespace-nowrap shrink-0 align-middle ${
                            row.stat === 'Delivered'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : row.stat === 'In Transit'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-pulse'
                              : row.stat === 'Processing'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              row.stat === 'Delivered'
                                ? 'bg-emerald-500'
                                : row.stat === 'In Transit'
                                ? 'bg-blue-500'
                                : row.stat === 'Processing'
                                ? 'bg-amber-500'
                                : 'bg-slate-500'
                            }`}
                          />
                          {row.stat}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal('edit', row)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit Order"
                          >
                            <Icon name="PencilSquareIcon" size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Hapus Order"
                          >
                            <Icon name="TrashIcon" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-slate-400 font-medium">
                      Tidak ada catatan pengantaran Skid yang sesuai dengan kriteria filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CRUD MODAL FOR DELIVERY PO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {modalMode === 'create' ? 'Buat PO Pengiriman Skid Baru' : 'Edit PO Pengiriman Skid'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Atur jadwal Custody Transfer, nomor seri armada Skid, dan verifikator QHSE.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    PO Number
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Status Pengiriman
                  </label>
                  <select
                    value={formData.stat}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Processing">Processing (Di Mother Station)</option>
                    <option value="In Transit">In Transit (Dalam Perjalanan)</option>
                    <option value="Delivered">Delivered (Selesai Bongkar)</option>
                    <option value="Scheduled">Scheduled (Terjadwal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Akun Industri Klien
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="e.g. PT Krakatau Baja Smelter"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Armada Skid Tank
                  </label>
                  <input
                    type="text"
                    value={formData.fleet}
                    onChange={(e) => setFormData({ ...formData, fleet: e.target.value })}
                    placeholder="e.g. Skid B 9120 VGL (Tube 40ft)"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Driver &amp; Lisensi ATEX
                  </label>
                  <input
                    type="text"
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    placeholder="e.g. Ahmad Fauzi (ATEX SIO)"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Volume Gas (Sm³ / MMBTU)
                  </label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    placeholder="e.g. 3,500 Sm³ (125 MMBTU)"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Tekanan Manifold
                  </label>
                  <input
                    type="text"
                    value={formData.pressure}
                    onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                    placeholder="e.g. 240 Bar"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Tanggal &amp; Waktu Bongkar
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. Jul 28, 2026 · 10:00"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Petugas Verifikator (QHSE)
                  </label>
                  <input
                    type="text"
                    value={formData.verifier}
                    onChange={(e) => setFormData({ ...formData, verifier: e.target.value })}
                    placeholder="e.g. Rina Wulandari (QHSE)"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
              >
                {modalMode === 'create' ? 'Buat PO Pengantaran Skid' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}