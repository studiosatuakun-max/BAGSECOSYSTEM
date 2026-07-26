'use client';

import React, { useState, useMemo } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

// Import our 5 new B2B CNG Procurement & Supply Chain bento components
import VendorSpendChart from './components/VendorSpendChart';
import LeadTimeGaugeCard from './components/LeadTimeGaugeCard';
import ActiveContractCard from './components/ActiveContractCard';
import CriticalSparePartsCard from './components/CriticalSparePartsCard';
import VendorComplianceCard from './components/VendorComplianceCard';

interface PurchaseOrder {
  id: string;
  vendor: string;
  category: string;
  amt: string;
  date: string;
  stat: 'Approved' | 'Fulfilled' | 'Pending' | 'In Audit';
  pic: string;
}

const initialPOs: PurchaseOrder[] = [
  {
    id: 'PO-CNG-2026-0891',
    vendor: 'PT Pertamina Gas Negara Tbk (PGN)',
    category: 'Raw Gas MMBTU Supply (Mother Station)',
    amt: 'Rp 3.250.000.000',
    date: 'Jul 24, 2026 · 08:30',
    stat: 'Approved',
    pic: 'Ir. Budi Santoso (VP Procurement)',
  },
  {
    id: 'PO-CNG-2026-0892',
    vendor: 'Taylor-Wharton / FIBA Technologies',
    category: 'ISO 11120 Tube Skid Cylinders (40ft)',
    amt: 'Rp 820.000.000',
    date: 'Jul 25, 2026 · 11:15',
    stat: 'Fulfilled',
    pic: 'Rina Wulandari (Supply Chain Mgr)',
  },
  {
    id: 'PO-CNG-2026-0893',
    vendor: 'Emerson Process Management / Fisher',
    category: 'PRMS High-Pressure Regulator Valves',
    amt: 'Rp 340.000.000',
    date: 'Jul 26, 2026 · 14:00',
    stat: 'Pending',
    pic: 'Hendra Saputra (Technical Buyer)',
  },
  {
    id: 'PO-CNG-2026-0894',
    vendor: 'PT Hino Motors Sales Indonesia',
    category: 'Prime Mover Tractor 6x4 Fleet & ATEX Parts',
    amt: 'Rp 1.150.000.000',
    date: 'Jul 27, 2026 · 09:00',
    stat: 'Approved',
    pic: 'Ahmad Fauzi (Fleet Maintenance)',
  },
  {
    id: 'PO-CNG-2026-0895',
    vendor: 'PT Yokogawa Indonesia',
    category: 'Coriolis Mass Flow Meter & SCADA Modules',
    amt: 'Rp 280.000.000',
    date: 'Jul 23, 2026 · 16:45',
    stat: 'In Audit',
    pic: 'Dian Prasetyo (Instrumentation Lead)',
  },
];

export default function PurchasingDashboardPage() {
  const [pos, setPos] = useState<PurchaseOrder[]>(initialPOs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<PurchaseOrder>({
    id: '',
    vendor: 'PT Pertamina Gas Negara Tbk (PGN)',
    category: 'Raw Gas MMBTU Supply',
    amt: 'Rp 350.000.000',
    date: '',
    stat: 'Pending',
    pic: 'Ir. Budi Santoso',
  });

  const handleOpenModal = (mode: 'create' | 'edit', po?: PurchaseOrder) => {
    setModalMode(mode);
    if (mode === 'edit' && po) {
      setFormData(po);
    } else {
      setFormData({
        id: `PO-CNG-2026-0${Math.floor(896 + Math.random() * 99)}`,
        vendor: 'PT Pertamina Gas Negara Tbk (PGN)',
        category: 'Raw Gas MMBTU Supply (Mother Station)',
        amt: 'Rp 450.000.000',
        date: 'Jul 28, 2026 · 10:00',
        stat: 'Pending',
        pic: 'Ir. Budi Santoso (VP Procurement)',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.vendor || !formData.amt) {
      toast.error('Gagal Menyimpan', { description: 'Nama Vendor dan Nilai Amount wajib diisi.' });
      return;
    }
    if (modalMode === 'create') {
      setPos([formData, ...pos]);
      toast.success('Purchase Order Diterbitkan', {
        description: `${formData.id} untuk ${formData.vendor} berhasil masuk antrean otorisasi ERP.`,
      });
    } else {
      setPos(pos.map((p) => (p.id === formData.id ? formData : p)));
      toast.success('Purchase Order Diperbarui', {
        description: `Perubahan spesifikasi dan status ${formData.id} berhasil disimpan.`,
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Purchase Order ini dari sistem rantai pasok?')) {
      setPos(pos.filter((p) => p.id !== id));
      toast.info('PO Dihapus', { description: `Nomor PO ${id} telah dihapus dari log Procurement.` });
    }
  };

  const handleSyncERP = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Menghubungkan ke sistem ERP SAP & PGN Pipeline Gateway...',
        success: 'Data kuota pasokan gas MMBTU, lead time vendor, & stok suku cadang tersinkronisasi 100%!',
        error: 'Gagal menyinkronkan data dari server ERP.',
      }
    );
  };

  // Filtered POs
  const filteredPOs = useMemo(() => {
    return pos.filter((p) => {
      const matchSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || p.stat === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pos, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Top Header */}
      <PortalHeader
        title="Procurement & Supply Chain"
        subtitle="BASKARA CNG Procurement, Parts & Vendor Management"
        roleBadge="VP Procurement Access"
        roleColor="emerald"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">ERP SAP LINK OK</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              PGN Quota 50k Sm³
            </span>
          </div>
        }
      />

      {/* Gold Benchmark Spacing & Width matching /portal/hr */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE ACRYLIC HERO BANNER (Standardized 100% with HR & Stasiun) */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-xs font-bold text-emerald-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ISO 9001 SUPPLY CHAIN &amp; MIGAS PROCUREMENT AUDITED · PGN PIPELINE ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              Enterprise Procurement &amp; Vendor Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali rantai pasok gas mentah MMBTU dari PGN, pengadaan tabung Skid Tank ISO 11120, suku cadang ATEX Mother Station, serta pemantauan SLA dan kepatuhan hukum 42 vendor terverifikasi secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-10 self-stretch sm:self-auto justify-center">
            <button
              onClick={handleSyncERP}
              className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Icon name="ArrowPathIcon" size={18} className="animate-spin-hover text-white" />
              <span>Sync Vendor SLA &amp; ERP</span>
            </button>
            <button
              onClick={() => handleOpenModal('create')}
              className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Icon name="PlusIcon" size={18} className="text-emerald-300" />
              <span>New Purchase Order</span>
            </button>
          </div>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH DEEP DARK ACRYLIC GRADIENTS MATCHING HR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Total Procurement Spend */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-emerald-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="BanknotesIcon" size={16} className="text-emerald-400 shrink-0" />
                  <span>Total Spend (MTD)</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  ↓ 3.9% vs Juni
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                Rp 4.85 <span className="text-sm font-bold text-emerald-400 uppercase">Miliar</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>77% Raw Gas Supply PGN</span>
              <span className="text-emerald-400 font-bold">100% Budget Valid</span>
            </div>
          </div>

          {/* Card 2: Open Purchase Orders */}
          <div className="bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 text-white p-6 rounded-3xl border border-teal-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-teal-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-teal-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-teal-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="DocumentTextIcon" size={16} className="text-teal-400 shrink-0" />
                  <span>Open Purchase Orders</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30 whitespace-nowrap">
                  Active Queue
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                28 <span className="text-sm font-bold text-teal-400 uppercase">POs</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>18 Approved · 10 Pending</span>
              <span className="text-teal-300 font-bold">SLA Tracked</span>
            </div>
          </div>

          {/* Card 3: Active Certified Vendors */}
          <div className="bg-gradient-to-br from-cyan-900 via-cyan-950 to-slate-950 text-white p-6 rounded-3xl border border-cyan-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '160ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-cyan-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="UsersIcon" size={16} className="text-cyan-400 shrink-0" />
                  <span>Active Vendors</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                  MIGAS Audited
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                42 <span className="text-sm font-bold text-cyan-400 uppercase">Suppliers</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-cyan-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>ISO 9001 &amp; ATEX Certified</span>
              <span className="text-cyan-300 font-bold">100% Onboarded</span>
            </div>
          </div>

          {/* Card 4: Vendor SLA Compliance Rate */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 text-white p-6 rounded-3xl border border-amber-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-amber-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ShieldCheckIcon" size={16} className="text-amber-400 shrink-0" />
                  <span>SLA Compliance Rate</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                  14 Days Lead Avg
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                98.6% <span className="text-sm font-bold text-amber-400 uppercase">Rate</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>On-Time Delivery Target</span>
              <span className="text-amber-300 font-bold">ERP Verified</span>
            </div>
          </div>
        </div>

        {/* ROW 2: ASYMMETRIC 2:1 BENTO GRID (Breathing Room Matching HR) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <VendorSpendChart />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <LeadTimeGaugeCard />
          </div>
        </div>

        {/* ROW 3: DETAIL CARDS BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <ActiveContractCard />
          </div>
          <div className="col-span-1">
            <CriticalSparePartsCard />
          </div>
          <div className="col-span-1">
            <VendorComplianceCard />
          </div>
        </div>

        {/* MASTER PROCUREMENT & VENDOR PO DIRECTORY TABLE (CRUD) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  B2B Enterprise Procurement &amp; Vendor PO Directory
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider whitespace-nowrap shrink-0 align-middle">
                  Live ERP Log
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                Jadwal otorisasi PO, kontrak pasokan gas MMBTU, pembelian suku cadang ATEX Mother Station, dan verifikasi faktur vendor.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Cari PO, Vendor, Kategori, atau PIC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="MagnifyingGlassIcon" size={14} />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="Approved">Approved (Otorisasi VP)</option>
                <option value="Fulfilled">Fulfilled (Barang Diterima)</option>
                <option value="Pending">Pending (Menunggu Approval)</option>
                <option value="In Audit">In Audit (Verifikasi Harga)</option>
              </select>

              <button
                onClick={() => handleOpenModal('create')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
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
                  <th className="py-3.5 px-4 whitespace-nowrap">Vendor &amp; Supply Chain Partner</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Category &amp; Specification</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Amount &amp; PIC</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                {filteredPOs.length > 0 ? (
                  filteredPOs.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="py-4 px-4 font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white max-w-[240px] truncate" title={row.vendor}>
                          {row.vendor}
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                          Terverifikasi ISO 9001 &amp; MIGAS
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200 max-w-[260px] truncate" title={row.category}>
                          {row.category}
                        </div>
                        <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                          Tanggal PO: {row.date}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-black text-slate-900 dark:text-white">{row.amt}</div>
                        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]" title={row.pic}>
                          PIC: {row.pic}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border whitespace-nowrap shrink-0 align-middle ${
                            row.stat === 'Approved'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : row.stat === 'Fulfilled'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : row.stat === 'Pending'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse'
                              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              row.stat === 'Approved'
                                ? 'bg-blue-500'
                                : row.stat === 'Fulfilled'
                                ? 'bg-emerald-500'
                                : row.stat === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-purple-500'
                            }`}
                          />
                          {row.stat}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal('edit', row)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            title="Edit PO"
                          >
                            <Icon name="PencilSquareIcon" size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Hapus PO"
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
                      Tidak ada Purchase Order yang sesuai dengan kriteria filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CRUD MODAL FOR PURCHASE ORDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {modalMode === 'create' ? 'Buat Purchase Order Baru' : 'Edit Purchase Order'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Atur vendor pengadaan, spesifikasi barang/jasa CNG, dan otorisasi VP Procurement.
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
                    Status Approval
                  </label>
                  <select
                    value={formData.stat}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pending">Pending (Menunggu Approval)</option>
                    <option value="Approved">Approved (Otorisasi VP)</option>
                    <option value="Fulfilled">Fulfilled (Barang Diterima)</option>
                    <option value="In Audit">In Audit (Verifikasi Harga)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Vendor Name &amp; Legal Entity
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="e.g. PT Pertamina Gas Negara Tbk (PGN)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category &amp; Specification (CNG Supply Chain)
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Raw Gas MMBTU Supply (Mother Station)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Amount (IDR / USD)
                  </label>
                  <input
                    type="text"
                    value={formData.amt}
                    onChange={(e) => setFormData({ ...formData, amt: e.target.value })}
                    placeholder="e.g. Rp 3.250.000.000"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Tanggal Terbit PO
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. Jul 28, 2026 · 10:00"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  PIC Otorisasi (Procurement / Buyer)
                </label>
                <input
                  type="text"
                  value={formData.pic}
                  onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  placeholder="e.g. Ir. Budi Santoso (VP Procurement)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
              >
                {modalMode === 'create' ? 'Terbitkan Purchase Order' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
