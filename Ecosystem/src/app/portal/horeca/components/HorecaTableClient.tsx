'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

interface HorecaClient {
  id: string;
  business_name?: string;
  name?: string;
  sector?: string;
  zone?: string;
  supply_type?: string;
  monthly_quota_sm3?: number;
  utilized_sm3?: number;
  mtd_revenue_idr?: number;
  operating_pressure_bar?: number;
  aeName?: string;
  safety_status?: string;
  sla_inspection_date?: string;
  contract_end?: string;
  status?: string;
}

interface HorecaTableClientProps {
  initialClients?: HorecaClient[];
}

const MOCK_CLIENTS: HorecaClient[] = [
  { id: 'CNG-HOR-001', business_name: 'Hotel JW Marriott Surabaya', sector: 'Hotel & Fine Dining', zone: 'Surabaya Pusat - Rute 02', supply_type: 'CNG Micro-bulk VGL', monthly_quota_sm3: 25000, utilized_sm3: 23800, mtd_revenue_idr: 186800000, operating_pressure_bar: 185, aeName: 'Kevin Sanjaya', safety_status: 'Pressure Drop Alert' },
  { id: 'CNG-HOR-002', business_name: 'Solaria Resto Group (Surabaya Chain)', sector: 'Restoran & Franchise', zone: 'Surabaya Barat & Selatan - Rute 05', supply_type: 'CNG 16-Cylinder Cradle Rack', monthly_quota_sm3: 35000, utilized_sm3: 32400, mtd_revenue_idr: 254300000, operating_pressure_bar: 202, aeName: 'Diana Putri', safety_status: 'Normal Secure' },
  { id: 'CNG-HOR-003', business_name: 'Layar Seafood & Resto (Bukit Mas)', sector: 'Restoran & Franchise', zone: 'Surabaya Barat - Rute 03', supply_type: 'CNG 16-Cylinder Cradle Rack', monthly_quota_sm3: 18000, utilized_sm3: 17100, mtd_revenue_idr: 134200000, operating_pressure_bar: 198, aeName: 'Kevin Sanjaya', safety_status: 'SLA Inspection Due' },
  { id: 'CNG-HOR-004', business_name: 'The Westin Surabaya & Pakuwon Mall', sector: 'Hotel & Fine Dining', zone: 'Surabaya Barat - Rute 01', supply_type: 'CNG Micro-bulk VGL', monthly_quota_sm3: 42000, utilized_sm3: 39800, mtd_revenue_idr: 312400000, operating_pressure_bar: 204, aeName: 'Diana Putri', safety_status: 'Normal Secure' },
  { id: 'CNG-HOR-005', business_name: 'Excelso Cafe & Bakery (Jatim Hub)', sector: 'Kafe & Bakery Chain', zone: 'Sidoarjo & Malang - Rute 08', supply_type: 'CNG 8-Cylinder Cascade', monthly_quota_sm3: 15000, utilized_sm3: 14200, mtd_revenue_idr: 111500000, operating_pressure_bar: 200, aeName: 'Agus Santoso', safety_status: 'Normal Secure' },
  { id: 'CNG-HOR-006', business_name: 'RS Siloam Hospitals Surabaya (Central Kitchen & Boiler)', sector: 'Komersial & Laundry', zone: 'Surabaya Pusat - Rute 04', supply_type: 'CNG Micro-bulk VGL', monthly_quota_sm3: 20000, utilized_sm3: 18900, mtd_revenue_idr: 148300000, operating_pressure_bar: 199, aeName: 'Kevin Sanjaya', safety_status: 'Normal Secure' },
];

function formatRevenue(amount: number | undefined): string {
  if (!amount) return 'Rp 0M';
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function HorecaTableClient({ initialClients = [] }: HorecaTableClientProps) {
  const clients = initialClients.length > 0 ? initialClients : MOCK_CLIENTS;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const name = (c.business_name ?? c.name ?? '').toLowerCase();
      const zone = (c.zone ?? '').toLowerCase();
      const matchSearch = name.includes(searchQuery.toLowerCase()) || zone.includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = selectedSector === 'All' || c.sector === selectedSector;
      const matchStatus = selectedStatus === 'All' || c.safety_status === selectedStatus;
      return matchSearch && matchSector && matchStatus;
    });
  }, [clients, searchQuery, selectedSector, selectedStatus]);

  return (
    <>
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

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Master Database Mitra Horeca &amp; Komersial CNG</h3>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">{filteredClients.length} Mitra Aktif</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kelola suplai rak tabung CNG Cradle Cascades, pantau tekanan gas operasional (Bar), dan validasi inspeksi SLA NFC.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari nama resto/hotel, rute..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-2xs" />
            </div>
            <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs">
              <option value="All">Semua Kategori Mitra</option>
              <option value="Restoran & Franchise">Restoran &amp; Franchise</option>
              <option value="Hotel & Fine Dining">Hotel &amp; Fine Dining</option>
              <option value="Kafe & Bakery Chain">Kafe &amp; Bakery Chain</option>
              <option value="Komersial & Laundry">Komersial &amp; Laundry</option>
            </select>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs">
              <option value="All">Semua Status Safety</option>
              <option value="Normal Secure">Normal Secure (~200 Bar)</option>
              <option value="Pressure Drop Alert">Pressure Drop Alert (&lt;190 Bar)</option>
              <option value="SLA Inspection Due">SLA Inspection Due</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                <th className="py-4 px-6 whitespace-nowrap">Mitra Komersial &amp; Rute Logistik</th>
                <th className="py-4 px-6 whitespace-nowrap">Sektor &amp; Metode Suplai CNG</th>
                <th className="py-4 px-6 whitespace-nowrap">Kuota vs Konsumsi Bulanan (Sm&sup3;)</th>
                <th className="py-4 px-6 whitespace-nowrap">Omzet MTD &amp; AE</th>
                <th className="py-4 px-6 whitespace-nowrap">Tekanan Gas &amp; Safety NFC</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Aksi Strategis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {filteredClients.map((c) => {
                const utilizationRate = Math.round(((c.utilized_sm3 ?? 0) / (c.monthly_quota_sm3 ?? 1)) * 100);
                const isHighUtil = utilizationRate >= 90;
                return (
                  <tr key={c.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          {(c.business_name ?? c.name ?? 'X').split(' ')[1]?.charAt(0) ?? 'X'}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors leading-tight">{c.business_name ?? c.name}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                            <Icon name="MapPinIcon" size={12} className="text-slate-400 shrink-0" />
                            <span>{c.zone ?? ''}</span>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{c.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{c.sector ?? ''}</span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          <Icon name={c.supply_type?.includes('Micro-bulk') ? 'CubeIcon' : 'TruckIcon'} size={14} />
                          <span>{c.supply_type ?? ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="w-48">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-900 dark:text-white font-mono">{(c.utilized_sm3 ?? 0).toLocaleString()} Sm&sup3;</span>
                          <span className={isHighUtil ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>{utilizationRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                          <div className={`h-full rounded-full transition-all duration-500 ${isHighUtil ? 'bg-gradient-to-r from-amber-500 to-emerald-400' : 'bg-amber-600'}`} style={{ width: `${Math.min(100, utilizationRate)}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Total: {(c.monthly_quota_sm3 ?? 0).toLocaleString()} Sm&sup3;/bln</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-black text-base text-slate-900 dark:text-white">{formatRevenue(c.mtd_revenue_idr)}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Icon name="UserCircleIcon" size={14} className="text-slate-400 shrink-0" />
                        <span>AE: {c.aeName ?? ''}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap align-middle">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border whitespace-nowrap shrink-0 ${
                          c.safety_status === 'Normal Secure' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                          c.safety_status === 'SLA Inspection Due' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse' :
                          'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.safety_status === 'Normal Secure' ? 'bg-emerald-500' : c.safety_status === 'SLA Inspection Due' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span>{c.safety_status === 'Normal Secure' ? 'Normal Secure' : c.safety_status === 'SLA Inspection Due' ? 'Inspection Due' : 'Pressure Alert'}</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">Tekanan: {c.operating_pressure_bar ?? 0} Bar</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.safety_status !== 'Normal Secure' && (
                          <button className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-extrabold transition-all shadow-2xs flex items-center gap-1 animate-bounce">
                            <Icon name="WrenchScrewdriverIcon" size={12} /> <span>Safety SLA</span>
                          </button>
                        )}
                        <button className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                          <Icon name="PencilSquareIcon" size={18} variant="outline" />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-all">
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
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
          <div>Menampilkan <span className="font-extrabold text-slate-900 dark:text-white">{filteredClients.length}</span> dari <span className="font-extrabold">{clients.length}</span> total mitra Horeca &amp; Komersial CNG.</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Normal Secure (~200 Bar)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Inspection Due</span>
          </div>
        </div>
      </div>
    </>
  );
}
