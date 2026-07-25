'use client';

import React, { useState, useMemo } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- DATA DUMMY & TIMEFRAME CONFIG ---
type TimeRange = '1M' | 'Q3' | 'YTD' | '1Y';

const revenueDatasets: Record<TimeRange, Array<{ period: string; actual: number; target: number; lastYear: number }>> = {
  '1M': [
    { period: 'Week 1', actual: 1.1, target: 1.2, lastYear: 0.9 },
    { period: 'Week 2', actual: 1.35, target: 1.25, lastYear: 1.05 },
    { period: 'Week 3', actual: 1.42, target: 1.3, lastYear: 1.15 },
    { period: 'Week 4', actual: 1.68, target: 1.35, lastYear: 1.2 },
  ],
  'Q3': [
    { period: 'Jul', actual: 5.55, target: 5.1, lastYear: 4.3 },
    { period: 'Aug (Est)', actual: 5.8, target: 5.4, lastYear: 4.6 },
    { period: 'Sep (Est)', actual: 6.2, target: 5.7, lastYear: 4.9 },
  ],
  'YTD': [
    { period: 'Jan', actual: 4.8, target: 4.5, lastYear: 3.9 },
    { period: 'Feb', actual: 4.9, target: 4.6, lastYear: 4.0 },
    { period: 'Mar', actual: 5.2, target: 4.8, lastYear: 4.2 },
    { period: 'Apr', actual: 5.1, target: 4.9, lastYear: 4.1 },
    { period: 'May', actual: 5.4, target: 5.0, lastYear: 4.3 },
    { period: 'Jun', actual: 5.6, target: 5.1, lastYear: 4.4 },
    { period: 'Jul', actual: 5.55, target: 5.1, lastYear: 4.3 },
  ],
  '1Y': [
    { period: 'Q3 25', actual: 13.5, target: 13.0, lastYear: 11.2 },
    { period: 'Q4 25', actual: 14.8, target: 14.0, lastYear: 12.5 },
    { period: 'Q1 26', actual: 14.9, target: 13.9, lastYear: 12.1 },
    { period: 'Q2 26', actual: 16.1, target: 15.0, lastYear: 12.8 },
  ],
};

const sectorDistribution = [
  { name: 'Manufaktur & Otomotif', value: 40, color: '#4f46e5', volume: '18,080 MMBTU', region: 'Karawang & Cikarang' },
  { name: 'F&B & Farmasi', value: 35, color: '#06b6d4', volume: '15,820 MMBTU', region: 'SIER Surabaya & Pasuruan' },
  { name: 'Petrokimia & Kimia', value: 15, color: '#10b981', volume: '6,780 MMBTU', region: 'JIIPE Gresik' },
  { name: 'Keramik & Kertas', value: 10, color: '#f59e0b', volume: '4,520 MMBTU', region: 'Ngoro Industrial Park' },
];

export interface B2BClient {
  id: string;
  name: string;
  sector: 'F&B & Farmasi' | 'Manufaktur & Otomotif' | 'Petrokimia & Kimia' | 'Keramik & Kertas' | 'Lainnya';
  location: string;
  supplyMethod: 'CNG Skid Tube' | 'PRMS Pipeline';
  monthlyQuota: number; // in MMBTU
  utilizedQuota: number; // in MMBTU
  mtdRevenue: string;
  contractEnd: string;
  expiryDays: number;
  aeName: string;
  status: 'Active' | 'Renewal Alert' | 'Critical Expiry';
}

const initialClients: B2BClient[] = [
  {
    id: 'B2B-IND-001',
    name: 'PT Indofood CBP Sukses Makmur',
    sector: 'F&B & Farmasi',
    location: 'PIER Pasuruan Industrial Estate',
    supplyMethod: 'CNG Skid Tube',
    monthlyQuota: 12000,
    utilizedQuota: 11400,
    mtdRevenue: 'Rp 1.42B',
    contractEnd: '2027-06-30',
    expiryDays: 340,
    aeName: 'Hendra Wijaya',
    status: 'Active',
  },
  {
    id: 'B2B-IND-002',
    name: 'PT Unilever Indonesia Tbk',
    sector: 'F&B & Farmasi',
    location: 'SIER Surabaya Industrial Estate',
    supplyMethod: 'PRMS Pipeline',
    monthlyQuota: 15000,
    utilizedQuota: 14250,
    mtdRevenue: 'Rp 1.85B',
    contractEnd: '2026-08-12',
    expiryDays: 18,
    aeName: 'Siska Lestari',
    status: 'Critical Expiry',
  },
  {
    id: 'B2B-IND-003',
    name: 'PT Astra Honda Motor',
    sector: 'Manufaktur & Otomotif',
    location: 'KIIC Karawang Barat',
    supplyMethod: 'CNG Skid Tube',
    monthlyQuota: 10000,
    utilizedQuota: 9100,
    mtdRevenue: 'Rp 1.15B',
    contractEnd: '2026-09-08',
    expiryDays: 45,
    aeName: 'Bagus Supriyanto',
    status: 'Renewal Alert',
  },
  {
    id: 'B2B-IND-004',
    name: 'PT Mayora Indah Tbk',
    sector: 'F&B & Farmasi',
    location: 'MM2100 Cikarang Barat',
    supplyMethod: 'CNG Skid Tube',
    monthlyQuota: 8500,
    utilizedQuota: 8100,
    mtdRevenue: 'Rp 980M',
    contractEnd: '2027-03-15',
    expiryDays: 232,
    aeName: 'Hendra Wijaya',
    status: 'Active',
  },
  {
    id: 'B2B-IND-005',
    name: 'PT Gajah Tunggal Tbk',
    sector: 'Manufaktur & Otomotif',
    location: 'Kawasan Industri Jatake',
    supplyMethod: 'PRMS Pipeline',
    monthlyQuota: 9000,
    utilizedQuota: 8200,
    mtdRevenue: 'Rp 1.05B',
    contractEnd: '2026-08-25',
    expiryDays: 31,
    aeName: 'Bagus Supriyanto',
    status: 'Renewal Alert',
  },
  {
    id: 'B2B-IND-006',
    name: 'PT Petrokimia Gresik',
    sector: 'Petrokimia & Kimia',
    location: 'JIIPE Gresik Industrial Park',
    supplyMethod: 'PRMS Pipeline',
    monthlyQuota: 20000,
    utilizedQuota: 18900,
    mtdRevenue: 'Rp 2.38B',
    contractEnd: '2028-12-31',
    expiryDays: 889,
    aeName: 'Rini Andini',
    status: 'Active',
  },
];

export default function DireksiB2BPage() {
  // UI State
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [clients, setClients] = useState<B2BClient[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Modal & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<B2BClient>({
    id: '',
    name: '',
    sector: 'Manufaktur & Otomotif',
    location: '',
    supplyMethod: 'CNG Skid Tube',
    monthlyQuota: 10000,
    utilizedQuota: 8500,
    mtdRevenue: 'Rp 1.0B',
    contractEnd: '2027-12-31',
    expiryDays: 365,
    aeName: 'Hendra Wijaya',
    status: 'Active',
  });

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = selectedSector === 'All' || c.sector === selectedSector;
      const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
      return matchSearch && matchSector && matchStatus;
    });
  }, [clients, searchQuery, selectedSector, selectedStatus]);

  // Handle Modal Open
  const handleOpenModal = (mode: 'create' | 'edit', client?: B2BClient) => {
    setModalMode(mode);
    if (mode === 'edit' && client) {
      setFormData(client);
    } else {
      const randomId = `B2B-IND-0${Math.floor(10 + Math.random() * 89)}`;
      setFormData({
        id: randomId,
        name: '',
        sector: 'Manufaktur & Otomotif',
        location: 'SIER Surabaya Industrial Estate',
        supplyMethod: 'CNG Skid Tube',
        monthlyQuota: 10000,
        utilizedQuota: 0,
        mtdRevenue: 'Rp 0M',
        contractEnd: '2027-07-31',
        expiryDays: 365,
        aeName: 'Hendra Wijaya',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // Save Client
  const handleSave = () => {
    if (!formData.name.trim() || !formData.location.trim()) {
      alert('Nama Perusahaan dan Lokasi wajib diisi.');
      return;
    }
    
    // Auto calculate expiry status based on days
    let updatedStatus: B2BClient['status'] = 'Active';
    if (formData.expiryDays <= 30) updatedStatus = 'Critical Expiry';
    else if (formData.expiryDays <= 60) updatedStatus = 'Renewal Alert';
    
    const clientToSave = { ...formData, status: updatedStatus };

    if (modalMode === 'create') {
      setClients([clientToSave, ...clients]);
      showToast(`Klien baru "${clientToSave.name}" berhasil ditambahkan ke database B2B!`);
    } else {
      setClients(clients.map(c => c.id === clientToSave.id ? clientToSave : c));
      showToast(`Perubahan data klien "${clientToSave.name}" berhasil diperbarui!`);
    }
    handleCloseModal();
  };

  // Delete Client
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data klien strategis "${name}"?`)) {
      setClients(clients.filter(c => c.id !== id));
      showToast(`Data klien "${name}" telah dihapus dari sistem.`);
    }
  };

  // Initiate SLA Renewal
  const handleInitiateRenewal = (clientName: string) => {
    showToast(`🚀 Tiket Perpanjangan SLA Kontrak untuk "${clientName}" resmi dikirim ke Tim Legal & AE!`);
  };

  // Handle Export Executive Report
  const handleExportReport = () => {
    showToast(`📄 Mengunduh Laporan Eksekutif B2B (PDF & Excel Summary)... Berhasil!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans relative flex flex-col">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 text-white backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
              <Icon name="XMarkIcon" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <PortalHeader
        title="Direksi B2B & Strategis"
        subtitle="Executive Strategic Console · Industrial Gas Division"
        roleBadge="B2B Director Access"
        roleColor="indigo"
        showInbox={true}
        rightCustom={
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Icon name="ArrowDownTrayIcon" size={14} />
              <span>Export Summary</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Live Telemetry</span>
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">
        
        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH FROSTED GLASSMORPHISM & ACCENT GLOWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          
          {/* Card 1: Revenue MTD & Target Achievement */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-indigo-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="BanknotesIcon" size={16} className="text-indigo-400 shrink-0" />
                  <span>Total Revenue (MTD)</span>
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">
                  Q3 FY26
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                Rp 5.55 <span className="text-lg font-bold text-indigo-300">Triliun</span>
              </div>
            </div>
            
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-200">
                <span>Target KPI Achievement</span>
                <span className="text-emerald-400">108.8% (Over Target)</span>
              </div>
              <div className="w-full h-2 bg-indigo-950/80 rounded-full overflow-hidden p-0.5 border border-indigo-800/50">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full w-[100%]" />
              </div>
              <div className="flex justify-between items-center text-[11px] text-indigo-300/80 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Icon name="ArrowTrendingUpIcon" size={12} /> +14.8% YoY Growth
                </span>
                <span>Target: Rp 5.10 T</span>
              </div>
            </div>
          </div>

          {/* Card 2: Active Industrial Contracts & Volume Utilization */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-slate-500 dark:text-slate-400 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mr-1 leading-tight">
                  <Icon name="DocumentTextIcon" size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Active B2B Contracts</span>
                </span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">
                  28 Clients
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                74,480 <span className="text-base font-bold text-slate-500">MMBTU</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Quota Utilization</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200 text-sm">90.4% Efficiency Rate</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                <Icon name="ChartBarIcon" size={20} />
              </div>
            </div>
          </div>

          {/* Card 3: Contract Expiry Radar (CRITICAL EXECUTIVE RISK ALERT) */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50/50 dark:from-rose-950/30 dark:to-amber-950/20 p-6 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-lg shadow-rose-100/30 flex flex-col justify-between group hover:border-rose-400 dark:hover:border-rose-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-500/15 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-rose-800 dark:text-rose-300 mr-1 leading-tight">
                  <Icon name="ExclamationTriangleIcon" size={16} className="text-rose-600 animate-bounce shrink-0" />
                  <span>Renewal Risk Radar</span>
                </span>
                <span className="text-[10px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-extrabold shadow-sm animate-pulse whitespace-nowrap shrink-0">
                  3 ACTION REQ
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-rose-950 dark:text-rose-100 mt-1">
                2 Klien <span className="text-sm font-bold text-rose-700 dark:text-rose-300">&lt; 30 Hari</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs">
              <div className="text-rose-800 dark:text-rose-300">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider">Total Revenue at Risk</span>
                <span className="font-black text-rose-900 dark:text-rose-100 text-sm">Rp 2.90 Miliar / Bulan</span>
              </div>
              <button 
                onClick={() => handleInitiateRenewal('All Critical Contracts')}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 shrink-0"
              >
                SLA Alert
              </button>
            </div>
          </div>

          {/* Card 4: Price Spread & Margin Index */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-emerald-400 dark:hover:border-emerald-600 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
            <div>
              <div className="flex items-start justify-between text-slate-500 dark:text-slate-400 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mr-1 leading-tight">
                  <Icon name="ScaleIcon" size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Net Spread Margin</span>
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">
                  +$4.20 Spread
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                $12.40 <span className="text-sm font-bold text-slate-500">/ MMBTU</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
              <div className="text-slate-600 dark:text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Feedgas Cost (Mother Stn)</span>
                <span className="font-bold text-slate-900 dark:text-white">$8.20 / MMBTU Base</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                <Icon name="ArrowUpIcon" size={12} />
                <span>33.8% Margin</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: CRITICAL RENEWAL RADAR TICKER BANNER */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-rose-950/40 dark:to-indigo-950/40 border border-amber-300/60 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Icon name="BellAlertIcon" size={20} className="animate-wiggle" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Executive Alert: Kontrak Strategis Mendekati Jatuh Tempo (SLA Expiry Radar)</span>
                <span className="hidden md:inline-block bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.2 rounded-md border border-rose-200">
                  High Priority
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                <strong>PT Unilever Indonesia Tbk</strong> (Sisa 18 hari) &amp; <strong>PT Gajah Tunggal Tbk</strong> (Sisa 31 hari) memerlukan tindakan perpanjangan SLA segera.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleInitiateRenewal('PT Unilever & PT Gajah Tunggal')}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Icon name="BoltIcon" size={14} />
              <span>Instruksikan AE (Fast Renewal)</span>
            </button>
          </div>
        </div>

        {/* ROW 3: INTERACTIVE ANALYTICAL CHARTS (3:1 RATIO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Interactive Revenue & Target Comparison Chart (Span 2) */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
                  <span>Analisa Komparasi Revenue vs Target KPI</span>
                  <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                    Triliun Rupiah (IDR)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Perbandingan performa aktual terhadap target Direksi dan pencapaian tahun lalu.
                </p>
              </div>

              {/* Time Range Selector Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0">
                {(['1M', 'Q3', 'YTD', '1Y'] as TimeRange[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTimeRange(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                      timeRange === tab
                        ? 'bg-indigo-600 text-white shadow-sm scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area & Line Comparison */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueDatasets[timeRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `Rp${val}T`} />
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
                      `Rp ${value.toFixed(2)} Triliun`, 
                      name === 'actual' ? '⚡ Realisasi Aktual' : name === 'target' ? '🎯 Target KPI' : '📅 Tahun Lalu (YoY)'
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                  <Area type="monotone" dataKey="actual" name="⚡ Realisasi Aktual" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                  <Area type="monotone" dataKey="target" name="🎯 Target KPI" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
                  <Area type="monotone" dataKey="lastYear" name="📅 Tahun Lalu (YoY)" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Sector Distribution & Industrial Zones (Span 1) */}
          <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Komposisi Sektor &amp; Kawasan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Distribusi kuota suplai B2B Jawa Timur &amp; Jakarta.
              </p>
            </div>

            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorDistribution.map((entry, index) => (
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

            {/* Sector Breakdown List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {sectorDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate" title={item.name}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-slate-400 text-[10px]">{item.region.split(' ')[0]}</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ROW 4: ENTERPRISE CLIENTS MANAGEMENT TABLE & ADVANCED CRUD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden flex flex-col">
          
          {/* Table Header Controls & Filter Bar */}
          <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Master Database Klien Industri B2B
                </h3>
                <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  {filteredClients.length} Klien Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kelola perjanjian kontrak suplai gas, pantau kuota pemakaian bulanan, dan jadwal perpanjangan SLA.
              </p>
            </div>

            {/* Filter Pills & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Search Box */}
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama klien, kawasan, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Icon name="XMarkIcon" size={14} />
                  </button>
                )}
              </div>

              {/* Sector Dropdown Filter */}
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              >
                <option value="All">Semua Sektor Industri</option>
                <option value="F&B & Farmasi">F&amp;B &amp; Farmasi</option>
                <option value="Manufaktur & Otomotif">Manufaktur &amp; Otomotif</option>
                <option value="Petrokimia & Kimia">Petrokimia &amp; Kimia</option>
                <option value="Keramik & Kertas">Keramik &amp; Kertas</option>
              </select>

              {/* Status Dropdown Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              >
                <option value="All">Semua Status SLA</option>
                <option value="Active">Active Kontrak</option>
                <option value="Renewal Alert">Renewal Alert (&lt; 60 Hari)</option>
                <option value="Critical Expiry">Critical Expiry (&lt; 30 Hari)</option>
              </select>

              {/* Add Client Button */}
              <button
                onClick={() => handleOpenModal('create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <Icon name="PlusIcon" size={16} variant="solid" />
                <span>Add B2B Client</span>
              </button>

            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6">Perusahaan &amp; Kawasan</th>
                  <th className="py-4 px-6">Sektor &amp; Metode Suplai</th>
                  <th className="py-4 px-6">Kuota vs Utilisasi Bulanan</th>
                  <th className="py-4 px-6">Omzet MTD &amp; AE</th>
                  <th className="py-4 px-6">Status SLA Kontrak</th>
                  <th className="py-4 px-6 text-right">Aksi Strategis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {filteredClients.map((c) => {
                  const utilizationRate = Math.round((c.utilizedQuota / c.monthlyQuota) * 100);
                  const isHighUtil = utilizationRate >= 90;
                  return (
                    <tr key={c.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors group">
                      
                      {/* Col 1: Company & Location */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            {c.name.split(' ')[1] ? c.name.split(' ')[1].charAt(0) : c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors leading-tight">
                              {c.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                              <Icon name="MapPinIcon" size={12} className="text-slate-400 shrink-0" />
                              <span>{c.location}</span>
                              <span className="text-slate-300 dark:text-slate-600">|</span>
                              <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{c.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Sector & Supply Method */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {c.sector}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            <Icon name={c.supplyMethod === 'PRMS Pipeline' ? 'PipelineIcon' : 'TruckIcon'} size={14} />
                            <span>{c.supplyMethod}</span>
                          </div>
                        </div>
                      </td>

                      {/* Col 3: Quota vs Utilization Progress */}
                      <td className="py-4 px-6">
                        <div className="w-48">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-900 dark:text-white font-mono">{c.utilizedQuota.toLocaleString()} MMBTU</span>
                            <span className={isHighUtil ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                              {utilizationRate}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isHighUtil ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' : 'bg-indigo-600'
                              }`} 
                              style={{ width: `${Math.min(100, utilizationRate)}%` }} 
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                            Total Kuota: {c.monthlyQuota.toLocaleString()} MMBTU/bln
                          </span>
                        </div>
                      </td>

                      {/* Col 4: MTD Revenue & AE Name */}
                      <td className="py-4 px-6">
                        <div className="font-black text-base text-slate-900 dark:text-white">
                          {c.mtdRevenue}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                          <Icon name="UserCircleIcon" size={14} className="text-slate-400" />
                          <span>AE: {c.aeName}</span>
                        </div>
                      </td>

                      {/* Col 5: SLA Expiry Status Badge */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                            c.status === 'Active' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                              : c.status === 'Renewal Alert'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              c.status === 'Active' ? 'bg-emerald-500' : c.status === 'Renewal Alert' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            {c.status === 'Active' ? 'SLA Aman' : c.status === 'Renewal Alert' ? 'Renewal Alert' : 'Critical Expiry'}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            End: {c.contractEnd} ({c.expiryDays} hr)
                          </span>
                        </div>
                      </td>

                      {/* Col 6: Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.status !== 'Active' && (
                            <button
                              onClick={() => handleInitiateRenewal(c.name)}
                              title="Kirim Instruksi Perpanjangan ke AE & Legal"
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-extrabold transition-all shadow-2xs flex items-center gap-1 animate-bounce"
                            >
                              <Icon name="BoltIcon" size={12} />
                              <span>SLA</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal('edit', c)}
                            title="Edit Data Klien"
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                          >
                            <Icon name="PencilSquareIcon" size={18} variant="outline" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            title="Hapus Klien"
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                          >
                            <Icon name="TrashIcon" size={18} variant="outline" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}

                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Icon name="FolderOpenIcon" size={48} className="text-slate-300 mb-2 stroke-1" />
                        <p className="text-base font-bold text-slate-600 dark:text-slate-300">Tidak ada data klien yang sesuai filter.</p>
                        <p className="text-xs mt-1">Coba gunakan kata kunci pencarian lain atau ganti filter sektor/status di atas.</p>
                        <button
                          onClick={() => { setSearchQuery(''); setSelectedSector('All'); setSelectedStatus('All'); }}
                          className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          Reset Semua Filter
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
            <div>
              Menampilkan <span className="font-extrabold text-slate-900 dark:text-white">{filteredClients.length}</span> dari <span className="font-extrabold">{clients.length}</span> total klien industri B2B.
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> SLA &gt; 60 Hari</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Renewal Alert (30-60 Hari)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical Expiry (&lt; 30 Hari)</span>
            </div>
          </div>
        </div>

        {/* Footer Attribution Strip */}
        <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400 font-medium">
          <span className="font-extrabold text-slate-700 dark:text-slate-300">Baskara Ecosystem Engine v2</span>
        </div>

      </div>

      {/* --- ADVANCED LUXURY CRUD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
                  <Icon name={modalMode === 'create' ? 'PlusIcon' : 'PencilSquareIcon'} size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">
                    {modalMode === 'create' ? 'Tambah Perjanjian Suplai B2B Baru' : 'Edit Kontrak Klien Strategis'}
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Pastikan kuota MMBTU dan tanggal berakhir SLA sesuai dokumen kontrak resmi.
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 dark:text-slate-200">
              
              {/* Row 1: ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">ID Kontrak</label>
                  <input
                    type="text"
                    disabled
                    value={formData.id}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Nama Perusahaan Klien <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. PT Indofood Sukses Makmur Tbk"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 2: Sector & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Sektor Industri</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  >
                    <option value="F&B & Farmasi">F&amp;B &amp; Farmasi</option>
                    <option value="Manufaktur & Otomotif">Manufaktur &amp; Otomotif</option>
                    <option value="Petrokimia & Kimia">Petrokimia &amp; Kimia</option>
                    <option value="Keramik & Kertas">Keramik &amp; Kertas</option>
                    <option value="Lainnya">Lainnya / Umum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Kawasan / Lokasi Pabrik <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. JIIPE Gresik / SIER Surabaya"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 3: Supply Method & Quota */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Metode Suplai</label>
                  <select
                    value={formData.supplyMethod}
                    onChange={(e) => setFormData({ ...formData, supplyMethod: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  >
                    <option value="CNG Skid Tube">CNG Skid Tube Trailer</option>
                    <option value="PRMS Pipeline">PRMS Direct Pipeline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Kuota Bulanan (MMBTU)</label>
                  <input
                    type="number"
                    value={formData.monthlyQuota}
                    onChange={(e) => setFormData({ ...formData, monthlyQuota: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Terpakai (MMBTU)</label>
                  <input
                    type="number"
                    value={formData.utilizedQuota}
                    onChange={(e) => setFormData({ ...formData, utilizedQuota: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 4: Revenue & AE Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Kontribusi Omzet MTD</label>
                  <input
                    type="text"
                    placeholder="e.g. Rp 1.5B / Rp 850M"
                    value={formData.mtdRevenue}
                    onChange={(e) => setFormData({ ...formData, mtdRevenue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Account Executive (AE)</label>
                  <input
                    type="text"
                    placeholder="e.g. Hendra Wijaya / Siska"
                    value={formData.aeName}
                    onChange={(e) => setFormData({ ...formData, aeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 5: Expiry End Date & Days Left */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Tanggal Akhir Kontrak (SLA)</label>
                  <input
                    type="date"
                    value={formData.contractEnd}
                    onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Sisa Hari SLA (Expiry Alarm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.expiryDays}
                      onChange={(e) => setFormData({ ...formData, expiryDays: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Hari</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
                <Icon name="InformationCircleIcon" size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Otomatisasi Status:</strong> Jika sisa hari SLA &le; 30 hari, sistem akan menaikkan status menjadi <em>Critical Expiry</em> dan mengirim alarm ke AE terkait.
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>{modalMode === 'create' ? 'Simpan Data Klien B2B' : 'Simpan Perubahan'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
