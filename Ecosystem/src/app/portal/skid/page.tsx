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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
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
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">250 Bar CNG Manifold</span>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* EXECUTIVE ACRYLIC HERO BANNER (Standardized with Stasiun, HR, CS) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 dark:from-indigo-950 dark:via-blue-950 dark:to-slate-950 text-white shadow-2xl p-6 sm:p-8 border border-indigo-500/30">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-60 h-60 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ISO 11120 Tube Manifold Monitoring &amp; Custody Transfer Billing
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                Skid Tank &amp; Custody Transfer Control Center
              </h1>
              <p className="text-sm text-indigo-100/80 leading-relaxed font-medium">
                Pantau tekanan manifold real-time, laju pembakaran Sm³/hari, serta verifikasi bongkar muat (Custody Transfer) dan E-Faktur penagihan gas CNG industri B2B secara terintegrasi.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                onClick={handleSyncTelemetry}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Icon name="ArrowPathIcon" size={16} className="animate-spin-hover" />
                <span>Sync SCADA Telemetry &amp; E-Faktur</span>
              </button>
              <button
                onClick={() => handleOpenModal('create')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              >
                <Icon name="PlusIcon" size={16} />
                <span>New Skid Delivery PO</span>
              </button>
            </div>
          </div>
        </div>

        {/* KEY METRICS ROW (Frosted Glassmorphism Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Total Delivery Volume</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Icon name="CubeIcon" size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">12,450 <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Sm³/day</span></div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>↑ 8.4%</span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">Aktif di 6 Klien B2B</span>
              </p>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Avg Manifold Pressure</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Icon name="ArrowsRightLeftIcon" size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">235 <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Bar</span></div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>● Nominal Range</span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">Limit: 250 Bar</span>
              </p>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Custody Meter Accuracy</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Icon name="DocumentCheckIcon" size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">99.8% <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Rate</span></div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>✓ Verified</span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">MIGAS &amp; Metrologi</span>
              </p>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">Active Contract Value</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Icon name="BanknotesIcon" size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">Rp 8.5 <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Miliar</span></div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span>Siklus Penagihan Mingguan</span>
              </p>
            </div>
          </div>
        </div>

        {/* EXECUTIVE BENTO GRID (Integrating 5 Upgraded Client Components) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <TankInfoCard />
          </div>
          <div className="col-span-1">
            <PressureGaugeCard />
          </div>
          <div className="col-span-1">
            <ConsumptionTrendCard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
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
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
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

        {/* Footer attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-bold gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <span>Baskara SkidPortal &amp; Custody Transfer v2.5.0 Gold Benchmark</span>
          <span>ISO 11120 Tube Manifold Monitoring · Terverifikasi MIGAS &amp; Metrologi</span>
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