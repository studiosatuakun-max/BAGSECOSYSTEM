'use client';

import React, { useState, useMemo } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import {
  AreaChart,
  Area,
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

// --- DATA DUMMY & TIMEFRAME CONFIG (CNG COMMERCIAL / HORECA) ---
type TimeRange = '1M' | 'Q3' | 'YTD' | '1Y';

const revenueDatasets: Record<TimeRange, Array<{ period: string; actual: number; target: number; lastYear: number }>> = {
  '1M': [
    { period: 'Week 1', actual: 680, target: 700, lastYear: 550 },
    { period: 'Week 2', actual: 790, target: 750, lastYear: 620 },
    { period: 'Week 3', actual: 850, target: 800, lastYear: 690 },
    { period: 'Week 4', actual: 930, target: 850, lastYear: 740 },
  ],
  'Q3': [
    { period: 'Jul', actual: 3250, target: 3100, lastYear: 2600 },
    { period: 'Aug (Est)', actual: 3450, target: 3200, lastYear: 2750 },
    { period: 'Sep (Est)', actual: 3680, target: 3400, lastYear: 2900 },
  ],
  'YTD': [
    { period: 'Jan', actual: 2800, target: 2700, lastYear: 2300 },
    { period: 'Feb', actual: 2950, target: 2800, lastYear: 2400 },
    { period: 'Mar', actual: 3100, target: 2900, lastYear: 2500 },
    { period: 'Apr', actual: 3050, target: 2950, lastYear: 2450 },
    { period: 'May', actual: 3200, target: 3000, lastYear: 2550 },
    { period: 'Jun', actual: 3350, target: 3100, lastYear: 2650 },
    { period: 'Jul', actual: 3250, target: 3100, lastYear: 2600 },
  ],
  '1Y': [
    { period: 'Q3 25', actual: 8900, target: 8500, lastYear: 7200 },
    { period: 'Q4 25', actual: 9500, target: 9000, lastYear: 7800 },
    { period: 'Q1 26', actual: 9200, target: 8800, lastYear: 7500 },
    { period: 'Q2 26', actual: 9850, target: 9200, lastYear: 8100 },
  ],
};

const sectorDistribution = [
  { name: 'Restoran & Franchise', value: 40, color: '#f59e0b', volume: '185,000 Sm³', zone: 'Surabaya Pusat (Rute 01-04)' },
  { name: 'Hotel & Fine Dining', value: 35, color: '#10b981', volume: '162,000 Sm³', zone: 'Surabaya Barat & Darmo' },
  { name: 'Kafe & Bakery Chain', value: 15, color: '#3b82f6', volume: '69,500 Sm³', zone: 'Sidoarjo Hub & Malang' },
  { name: 'Komersial & Laundry', value: 10, color: '#8b5cf6', volume: '46,200 Sm³', zone: 'Gresik Kota & Sekitar' },
];

export interface CNGHorecaClient {
  id: string;
  name: string;
  sector: 'Restoran & Franchise' | 'Hotel & Fine Dining' | 'Kafe & Bakery Chain' | 'Komersial & Laundry' | 'Lainnya';
  routeZone: string;
  supplyType: 'CNG 16-Cylinder Cradle Rack' | 'CNG Micro-bulk VGL' | 'CNG 8-Cylinder Cascade';
  monthlyQuotaSm3: number; // in Sm3
  utilizedSm3: number; // in Sm3
  mtdRevenue: string;
  operatingPressureBar: number; // e.g. 200 Bar normal
  aeName: string;
  safetyStatus: 'Normal Secure' | 'Pressure Drop Alert' | 'SLA Inspection Due';
}

const initialClients: CNGHorecaClient[] = [
  {
    id: 'CNG-HOR-001',
    name: 'Hotel JW Marriott Surabaya',
    sector: 'Hotel & Fine Dining',
    routeZone: 'Surabaya Pusat - Rute 02',
    supplyType: 'CNG Micro-bulk VGL',
    monthlyQuotaSm3: 25000,
    utilizedSm3: 23800,
    mtdRevenue: 'Rp 186.8M',
    operatingPressureBar: 185, // Normal ~200
    aeName: 'Kevin Sanjaya',
    safetyStatus: 'Pressure Drop Alert',
  },
  {
    id: 'CNG-HOR-002',
    name: 'Solaria Resto Group (Surabaya Chain)',
    sector: 'Restoran & Franchise',
    routeZone: 'Surabaya Barat & Selatan - Rute 05',
    supplyType: 'CNG 16-Cylinder Cradle Rack',
    monthlyQuotaSm3: 35000,
    utilizedSm3: 32400,
    mtdRevenue: 'Rp 254.3M',
    operatingPressureBar: 202,
    aeName: 'Diana Putri',
    safetyStatus: 'Normal Secure',
  },
  {
    id: 'CNG-HOR-003',
    name: 'Layar Seafood & Resto (Bukit Mas)',
    sector: 'Restoran & Franchise',
    routeZone: 'Surabaya Barat - Rute 03',
    supplyType: 'CNG 16-Cylinder Cradle Rack',
    monthlyQuotaSm3: 18000,
    utilizedSm3: 17100,
    mtdRevenue: 'Rp 134.2M',
    operatingPressureBar: 198,
    aeName: 'Kevin Sanjaya',
    safetyStatus: 'SLA Inspection Due',
  },
  {
    id: 'CNG-HOR-004',
    name: 'The Westin Surabaya & Pakuwon Mall',
    sector: 'Hotel & Fine Dining',
    routeZone: 'Surabaya Barat - Rute 01',
    supplyType: 'CNG Micro-bulk VGL',
    monthlyQuotaSm3: 42000,
    utilizedSm3: 39800,
    mtdRevenue: 'Rp 312.4M',
    operatingPressureBar: 204,
    aeName: 'Diana Putri',
    safetyStatus: 'Normal Secure',
  },
  {
    id: 'CNG-HOR-005',
    name: 'Excelso Cafe & Bakery (Jatim Hub)',
    sector: 'Kafe & Bakery Chain',
    routeZone: 'Sidoarjo & Malang - Rute 08',
    supplyType: 'CNG 8-Cylinder Cascade',
    monthlyQuotaSm3: 15000,
    utilizedSm3: 14200,
    mtdRevenue: 'Rp 111.5M',
    operatingPressureBar: 200,
    aeName: 'Agus Santoso',
    safetyStatus: 'Normal Secure',
  },
  {
    id: 'CNG-HOR-006',
    name: 'RS Siloam Hospitals Surabaya (Central Kitchen & Boiler)',
    sector: 'Komersial & Laundry',
    routeZone: 'Surabaya Pusat - Rute 04',
    supplyType: 'CNG Micro-bulk VGL',
    monthlyQuotaSm3: 20000,
    utilizedSm3: 18900,
    mtdRevenue: 'Rp 148.3M',
    operatingPressureBar: 199,
    aeName: 'Kevin Sanjaya',
    safetyStatus: 'Normal Secure',
  },
];

export default function HorecaCommercialPage() {
  // UI State
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [clients, setClients] = useState<CNGHorecaClient[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Modal & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<CNGHorecaClient>({
    id: '',
    name: '',
    sector: 'Restoran & Franchise',
    routeZone: 'Surabaya Pusat - Rute 01',
    supplyType: 'CNG 16-Cylinder Cradle Rack',
    monthlyQuotaSm3: 20000,
    utilizedSm3: 18000,
    mtdRevenue: 'Rp 140.0M',
    operatingPressureBar: 200,
    aeName: 'Kevin Sanjaya',
    safetyStatus: 'Normal Secure',
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
                          c.routeZone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = selectedSector === 'All' || c.sector === selectedSector;
      const matchStatus = selectedStatus === 'All' || c.safetyStatus === selectedStatus;
      return matchSearch && matchSector && matchStatus;
    });
  }, [clients, searchQuery, selectedSector, selectedStatus]);

  // Handle Modal Open
  const handleOpenModal = (mode: 'create' | 'edit', client?: CNGHorecaClient) => {
    setModalMode(mode);
    if (mode === 'edit' && client) {
      setFormData(client);
    } else {
      const randomId = `CNG-HOR-0${Math.floor(10 + Math.random() * 89)}`;
      setFormData({
        id: randomId,
        name: '',
        sector: 'Restoran & Franchise',
        routeZone: 'Surabaya Pusat - Rute 02',
        supplyType: 'CNG 16-Cylinder Cradle Rack',
        monthlyQuotaSm3: 15000,
        utilizedSm3: 0,
        mtdRevenue: 'Rp 0M',
        operatingPressureBar: 200,
        aeName: 'Kevin Sanjaya',
        safetyStatus: 'Normal Secure',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // Save Client
  const handleSave = () => {
    if (!formData.name.trim() || !formData.routeZone.trim()) {
      alert('Nama Mitra dan Rute Logistik wajib diisi.');
      return;
    }
    
    // Auto calculate safety status based on pressure
    let updatedStatus: CNGHorecaClient['safetyStatus'] = 'Normal Secure';
    if (formData.operatingPressureBar < 190 || formData.operatingPressureBar > 215) {
      updatedStatus = 'Pressure Drop Alert';
    } else if (formData.safetyStatus === 'SLA Inspection Due') {
      updatedStatus = 'SLA Inspection Due';
    }
    
    const clientToSave = { ...formData, safetyStatus: updatedStatus };

    if (modalMode === 'create') {
      setClients([clientToSave, ...clients]);
      showToast(`Mitra Horeca baru "${clientToSave.name}" berhasil ditambahkan ke jaringan suplai CNG!`);
    } else {
      setClients(clients.map(c => c.id === clientToSave.id ? clientToSave : c));
      showToast(`Perubahan data mitra "${clientToSave.name}" berhasil diperbarui!`);
    }
    handleCloseModal();
  };

  // Delete Client
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data mitra komersial "${name}"?`)) {
      setClients(clients.filter(c => c.id !== id));
      showToast(`Data mitra "${name}" telah dihapus dari sistem logistik CNG.`);
    }
  };

  // Initiate Safety SLA Inspection
  const handleDispatchSafety = (clientName: string) => {
    showToast(`🚨 Armada Tim Safety & Inspeksi Tekanan CNG resmi diterjunkan ke "${clientName}"!`);
  };

  // Handle Export Commercial Report
  const handleExportReport = () => {
    showToast(`📄 Mengunduh Laporan Eksekutif CNG Komersial & Horeca (Sm³ & Revenue PDF)... Berhasil!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans relative flex flex-col">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 text-white backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
              <Icon name="XMarkIcon" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <PortalHeader
        title="Horeca & Commercial Gas"
        subtitle="Executive Strategic Console · CNG Cradle Cascades & Micro-Bulk Division"
        roleBadge="Commercial Director Access"
        roleColor="amber"
        showInbox={true}
        rightCustom={
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="hidden md:flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Icon name="ArrowDownTrayIcon" size={14} />
              <span>Export Summary</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider">CNG Telemetry Live</span>
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 space-y-6">
        
        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH WARM GOLD/AMBER FROSTED GLASSMORPHISM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          
          {/* Card 1: Commercial Revenue MTD & Target Achievement */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 text-white p-6 rounded-3xl border border-amber-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-600/80 transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between text-amber-300 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
                  <Icon name="BanknotesIcon" size={16} className="text-amber-400" />
                  Commercial Revenue (MTD)
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  Q3 FY26
                </span>
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

          {/* Card 2: Active CNG Cradle Cascades & Volume Deployed */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Icon name="CubeIcon" size={16} className="text-amber-600 dark:text-amber-400" />
                  CNG Cradle Racks Deployed
                </span>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold">
                  450 Units Active
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                462,700 <span className="text-base font-bold text-slate-500">Sm³</span>
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

          {/* Card 3: CNG Pressure & Safety Telemetry Radar (CRITICAL ANOMALY ALERT) */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50/50 dark:from-rose-950/30 dark:to-amber-950/20 p-6 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-lg shadow-rose-100/30 flex flex-col justify-between group hover:border-rose-300 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 text-rose-800 dark:text-rose-300">
                  <Icon name="ShieldExclamationIcon" size={16} className="text-rose-600 animate-bounce" />
                  CNG Safety Anomaly Radar
                </span>
                <span className="text-[10px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-extrabold shadow-sm animate-pulse">
                  2 ACTION REQ
                </span>
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
              <button 
                onClick={() => handleDispatchSafety('All Anomaly Sites')}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 shrink-0"
              >
                Dispatch SLA
              </button>
            </div>
          </div>

          {/* Card 4: Price Spread & CNG Margin Index */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Icon name="ScaleIcon" size={16} className="text-emerald-600 dark:text-emerald-400" />
                  CNG Commercial Spread
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  +Rp 2,750 / Sm³
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Rp 7,850 <span className="text-sm font-bold text-slate-500">/ Sm³</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
              <div className="text-slate-600 dark:text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother Station Feedgas Cost</span>
                <span className="font-bold text-slate-900 dark:text-white">Rp 5,100 / Sm³ Base</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                <Icon name="ArrowUpIcon" size={12} />
                <span>35.0% Margin</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: CRITICAL CNG SAFETY & ANOMALY RADAR TICKER BANNER */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-rose-950/40 dark:to-indigo-950/40 border border-amber-300/60 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Icon name="FireIcon" size={20} className="animate-wiggle" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Executive Alert: Anomali Telemetry Tekanan Rak Tabung CNG &amp; NFC Safety</span>
                <span className="hidden md:inline-block bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.2 rounded-md border border-rose-200">
                  SLA Priority
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                <strong>Hotel JW Marriott Surabaya</strong> (Tekanan drop ke 185 Bar dari normal 200 Bar) &amp; <strong>Layar Seafood Resto</strong> (Jatuh tempo inspeksi SLA selang manifold).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleDispatchSafety('JW Marriott & Layar Resto')}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Icon name="WrenchScrewdriverIcon" size={14} />
              <span>Kirim Tim Teknis &amp; Safety (Fast SLA)</span>
            </button>
          </div>
        </div>

        {/* ROW 3: INTERACTIVE ANALYTICAL CHARTS (3:1 RATIO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Interactive Revenue & Target Comparison Chart (Span 2) */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Analisa Komparasi Revenue CNG Komersial vs Target</span>
                  <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Juta Rupiah (IDR)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Perbandingan performa penjualan gas CNG Horeca aktual terhadap target Direksi dan pencapaian tahun lalu.
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
                        ? 'bg-amber-600 text-white shadow-sm scale-[1.02]'
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
                <AreaChart data={revenueDatasets[timeRange]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActualHoreca" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorTargetHoreca" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `Rp${val}M`} />
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
                      `Rp ${value.toLocaleString()} Juta`, 
                      name === 'actual' ? '⚡ Realisasi Aktual CNG' : name === 'target' ? '🎯 Target KPI' : '📅 Tahun Lalu (YoY)'
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                  <Area type="monotone" dataKey="actual" name="⚡ Realisasi Aktual CNG" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorActualHoreca)" />
                  <Area type="monotone" dataKey="target" name="🎯 Target KPI" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTargetHoreca)" />
                  <Area type="monotone" dataKey="lastYear" name="📅 Tahun Lalu (YoY)" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Sector Breakdown & Milk-Run Zones (Span 1) */}
          <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Konsumsi Sektor &amp; Rute Milk-Run
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Distribusi kuota suplai CNG Cradle Racks &amp; Micro-bulk.
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
                    <span className="text-slate-400 text-[10px]">{item.zone.split(' ')[0]}</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ROW 4: COMMERCIAL CLIENTS MANAGEMENT TABLE & ADVANCED CRUD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden flex flex-col">
          
          {/* Table Header Controls & Filter Bar */}
          <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Master Database Mitra Horeca &amp; Komersial CNG
                </h3>
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  {filteredClients.length} Mitra Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kelola suplai rak tabung CNG Cradle Cascades, pantau tekanan gas operasional (Bar), dan validasi inspeksi SLA NFC.
              </p>
            </div>

            {/* Filter Pills & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Search Box */}
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama resto/hotel, rute..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-2xs"
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
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              >
                <option value="All">Semua Kategori Mitra</option>
                <option value="Restoran & Franchise">Restoran &amp; Franchise</option>
                <option value="Hotel & Fine Dining">Hotel &amp; Fine Dining</option>
                <option value="Kafe & Bakery Chain">Kafe &amp; Bakery Chain</option>
                <option value="Komersial & Laundry">Komersial &amp; Laundry</option>
              </select>

              {/* Safety Status Dropdown Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              >
                <option value="All">Semua Status Safety</option>
                <option value="Normal Secure">Normal Secure (~200 Bar)</option>
                <option value="Pressure Drop Alert">Pressure Drop Alert (&lt;190 Bar)</option>
                <option value="SLA Inspection Due">SLA Inspection Due</option>
              </select>

              {/* Add Client Button */}
              <button
                onClick={() => handleOpenModal('create')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <Icon name="PlusIcon" size={16} variant="solid" />
                <span>Add Horeca Partner</span>
              </button>

            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6">Mitra Komersial &amp; Rute Logistik</th>
                  <th className="py-4 px-6">Sektor &amp; Metode Suplai CNG</th>
                  <th className="py-4 px-6">Kuota vs Konsumsi Bulanan (Sm³)</th>
                  <th className="py-4 px-6">Omzet MTD &amp; AE</th>
                  <th className="py-4 px-6">Tekanan Gas &amp; Safety NFC</th>
                  <th className="py-4 px-6 text-right">Aksi Strategis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {filteredClients.map((c) => {
                  const utilizationRate = Math.round((c.utilizedSm3 / c.monthlyQuotaSm3) * 100);
                  const isHighUtil = utilizationRate >= 90;
                  return (
                    <tr key={c.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors group">
                      
                      {/* Col 1: Company & Location/Route */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            {c.name.split(' ')[0] === 'Hotel' || c.name.split(' ')[0] === 'RS' ? c.name.split(' ')[1].charAt(0) : c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors leading-tight">
                              {c.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                              <Icon name="MapPinIcon" size={12} className="text-slate-400 shrink-0" />
                              <span>{c.routeZone}</span>
                              <span className="text-slate-300 dark:text-slate-600">|</span>
                              <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{c.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Sector & Supply Type */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {c.sector}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            <Icon name={c.supplyType.includes('Micro-bulk') ? 'CubeIcon' : 'TruckIcon'} size={14} />
                            <span>{c.supplyType}</span>
                          </div>
                        </div>
                      </td>

                      {/* Col 3: Quota vs Utilization Progress (Sm3) */}
                      <td className="py-4 px-6">
                        <div className="w-48">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-900 dark:text-white font-mono">{c.utilizedSm3.toLocaleString()} Sm³</span>
                            <span className={isHighUtil ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                              {utilizationRate}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isHighUtil ? 'bg-gradient-to-r from-amber-500 to-emerald-400' : 'bg-amber-600'
                              }`} 
                              style={{ width: `${Math.min(100, utilizationRate)}%` }} 
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                            Total Kuota: {c.monthlyQuotaSm3.toLocaleString()} Sm³/bln
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

                      {/* Col 5: Safety Status & Pressure Bar */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                            c.safetyStatus === 'Normal Secure' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                              : c.safetyStatus === 'SLA Inspection Due'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              c.safetyStatus === 'Normal Secure' ? 'bg-emerald-500' : c.safetyStatus === 'SLA Inspection Due' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            {c.safetyStatus === 'Normal Secure' ? 'Normal Secure' : c.safetyStatus === 'SLA Inspection Due' ? 'Inspection Due' : 'Pressure Alert'}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                            Tekanan Operasi: {c.operatingPressureBar} Bar
                          </span>
                        </div>
                      </td>

                      {/* Col 6: Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.safetyStatus !== 'Normal Secure' && (
                            <button
                              onClick={() => handleDispatchSafety(c.name)}
                              title="Kirim Instruksi Inspeksi Safety ke AE & Tim Teknis"
                              className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-extrabold transition-all shadow-2xs flex items-center gap-1 animate-bounce"
                            >
                              <Icon name="WrenchScrewdriverIcon" size={12} />
                              <span>Safety SLA</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal('edit', c)}
                            title="Edit Data Mitra"
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                          >
                            <Icon name="PencilSquareIcon" size={18} variant="outline" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            title="Hapus Mitra"
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
                        <p className="text-base font-bold text-slate-600 dark:text-slate-300">Tidak ada mitra Horeca yang sesuai filter.</p>
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
              Menampilkan <span className="font-extrabold text-slate-900 dark:text-white">{filteredClients.length}</span> dari <span className="font-extrabold">{clients.length}</span> total mitra Horeca &amp; Komersial CNG.
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Normal Secure (~200 Bar)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Inspection Due</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Pressure Drop (&lt;190 Bar)</span>
            </div>
          </div>
        </div>

        {/* Footer Attribution Strip */}
        <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400 font-medium">
          <span className="font-extrabold text-slate-700 dark:text-slate-300">Baskara Ecosystem Engine v2</span>
        </div>

      </div>

      {/* --- ADVANCED LUXURY CRUD MODAL (CNG COMMERCIAL) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-amber-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
                  <Icon name={modalMode === 'create' ? 'PlusIcon' : 'PencilSquareIcon'} size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">
                    {modalMode === 'create' ? 'Tambah Mitra Horeca / Komersial CNG' : 'Edit Kontrak Suplai CNG Mitra'}
                  </h3>
                  <p className="text-xs text-amber-200 mt-0.5">
                    Pastikan rute Milk-Run, tipe rak tabung Cradle, dan tekanan operasi Bar akurat.
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
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">ID Mitra</label>
                  <input
                    type="text"
                    disabled
                    value={formData.id}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Nama Resto / Hotel / Klien <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Hotel JW Marriott / Solaria Resto"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 2: Sector & Route Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Kategori Sektor</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  >
                    <option value="Restoran & Franchise">Restoran &amp; Franchise</option>
                    <option value="Hotel & Fine Dining">Hotel &amp; Fine Dining</option>
                    <option value="Kafe & Bakery Chain">Kafe &amp; Bakery Chain</option>
                    <option value="Komersial & Laundry">Komersial &amp; Laundry</option>
                    <option value="Lainnya">Lainnya / Umum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Rute Milk-Run / Kawasan <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Surabaya Pusat - Rute 02"
                    value={formData.routeZone}
                    onChange={(e) => setFormData({ ...formData, routeZone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 3: Supply Type & Quota */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Metode Suplai CNG</label>
                  <select
                    value={formData.supplyType}
                    onChange={(e) => setFormData({ ...formData, supplyType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  >
                    <option value="CNG 16-Cylinder Cradle Rack">CNG 16-Cylinder Cradle Rack</option>
                    <option value="CNG Micro-bulk VGL">CNG Micro-bulk VGL</option>
                    <option value="CNG 8-Cylinder Cascade">CNG 8-Cylinder Cascade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Kuota Bulanan (Sm³)</label>
                  <input
                    type="number"
                    value={formData.monthlyQuotaSm3}
                    onChange={(e) => setFormData({ ...formData, monthlyQuotaSm3: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Terpakai (Sm³)</label>
                  <input
                    type="number"
                    value={formData.utilizedSm3}
                    onChange={(e) => setFormData({ ...formData, utilizedSm3: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 4: Revenue & AE Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Kontribusi Omzet MTD</label>
                  <input
                    type="text"
                    placeholder="e.g. Rp 150M / Rp 85M"
                    value={formData.mtdRevenue}
                    onChange={(e) => setFormData({ ...formData, mtdRevenue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Account Executive (AE)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kevin Sanjaya / Diana"
                    value={formData.aeName}
                    onChange={(e) => setFormData({ ...formData, aeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 5: Operating Pressure Bar & Safety Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Tekanan Operasional Rak (Bar)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.operatingPressureBar}
                      onChange={(e) => setFormData({ ...formData, operatingPressureBar: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Bar (Normal ~200)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Status Inspeksi &amp; Telemetry Safety</label>
                  <select
                    value={formData.safetyStatus}
                    onChange={(e) => setFormData({ ...formData, safetyStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  >
                    <option value="Normal Secure">Normal Secure (Tekanan 200 Bar)</option>
                    <option value="Pressure Drop Alert">Pressure Drop Alert (&lt; 190 Bar)</option>
                    <option value="SLA Inspection Due">SLA Inspection Due (Jatuh Tempo NFC)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
                <Icon name="InformationCircleIcon" size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Telemetry Automasi:</strong> Jika tekanan operasional di bawah 190 Bar, sistem akan menaikkan status menjadi <em>Pressure Drop Alert</em> dan menerjunkan tim teknis/safety terdekat via Milk-Run.
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
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>{modalMode === 'create' ? 'Simpan Data Mitra Horeca' : 'Simpan Perubahan'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
