'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

interface B2BClient {
  id: string;
  company_name?: string;
  name?: string;
  sector?: string;
  zone?: string;
  address?: string;
  supply_method?: string;
  monthly_quota_mmbtu?: number;
  utilized_quota_mmbtu?: number;
  mtd_revenue_idr?: number;
  contract_end?: string;
  expiryDays?: number;
  account_executive_id?: string;
  aeName?: string;
  status?: string;
}

interface IndustrialTableClientProps {
  initialClients?: B2BClient[];
}

const MOCK_CLIENTS: B2BClient[] = [
  { id: 'B2B-IND-001', company_name: 'PT Indofood CBP Sukses Makmur', sector: 'F&B & Farmasi', zone: 'PIER Pasuruan Industrial Estate', supply_method: 'CNG Skid Tube', monthly_quota_mmbtu: 12000, utilized_quota_mmbtu: 11400, mtd_revenue_idr: 1420000000, contract_end: '2027-06-30', expiryDays: 340, aeName: 'Hendra Wijaya', status: 'Active' },
  { id: 'B2B-IND-002', company_name: 'PT Unilever Indonesia Tbk', sector: 'F&B & Farmasi', zone: 'SIER Surabaya Industrial Estate', supply_method: 'PRMS Pipeline', monthly_quota_mmbtu: 15000, utilized_quota_mmbtu: 14250, mtd_revenue_idr: 1850000000, contract_end: '2026-08-12', expiryDays: 18, aeName: 'Siska Lestari', status: 'Critical Expiry' },
  { id: 'B2B-IND-003', company_name: 'PT Astra Honda Motor', sector: 'Manufaktur & Otomotif', zone: 'KIIC Karawang Barat', supply_method: 'CNG Skid Tube', monthly_quota_mmbtu: 10000, utilized_quota_mmbtu: 9100, mtd_revenue_idr: 1150000000, contract_end: '2026-09-08', expiryDays: 45, aeName: 'Bagus Supriyanto', status: 'Renewal Alert' },
  { id: 'B2B-IND-004', company_name: 'PT Mayora Indah Tbk', sector: 'F&B & Farmasi', zone: 'MM2100 Cikarang Barat', supply_method: 'CNG Skid Tube', monthly_quota_mmbtu: 8500, utilized_quota_mmbtu: 8100, mtd_revenue_idr: 980000000, contract_end: '2027-03-15', expiryDays: 232, aeName: 'Hendra Wijaya', status: 'Active' },
  { id: 'B2B-IND-005', company_name: 'PT Gajah Tunggal Tbk', sector: 'Manufaktur & Otomotif', zone: 'Kawasan Industri Jatake', supply_method: 'PRMS Pipeline', monthly_quota_mmbtu: 9000, utilized_quota_mmbtu: 8200, mtd_revenue_idr: 1050000000, contract_end: '2026-08-25', expiryDays: 31, aeName: 'Bagus Supriyanto', status: 'Renewal Alert' },
  { id: 'B2B-IND-006', company_name: 'PT Petrokimia Gresik', sector: 'Petrokimia & Kimia', zone: 'JIIPE Gresik Industrial Park', supply_method: 'PRMS Pipeline', monthly_quota_mmbtu: 20000, utilized_quota_mmbtu: 18900, mtd_revenue_idr: 2380000000, contract_end: '2028-12-31', expiryDays: 889, aeName: 'Rini Andini', status: 'Active' },
];

function formatRevenue(amount: number | undefined): string {
  if (!amount) return 'Rp 0M';
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)}M`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function IndustrialTableClient({ initialClients = [] }: IndustrialTableClientProps) {
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
      const name = (c.company_name ?? c.name ?? '').toLowerCase();
      const zone = (c.zone ?? '').toLowerCase();
      const matchSearch = name.includes(searchQuery.toLowerCase()) || zone.includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = selectedSector === 'All' || c.sector === selectedSector;
      const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
      return matchSearch && matchSector && matchStatus;
    });
  }, [clients, searchQuery, selectedSector, selectedStatus]);

  const handleInitiateRenewal = (clientName: string) => {
    showToast(`🚀 Tiket Perpanjangan SLA Kontrak untuk "${clientName}" resmi dikirim ke Tim Legal & AE!`);
  };

  return (
    <>
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

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Master Database Klien Industri B2B</h3>
              <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">{filteredClients.length} Klien Aktif</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kelola perjanjian kontrak suplai gas, pantau kuota pemakaian bulanan, dan jadwal perpanjangan SLA.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari nama klien, kawasan, ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs" />
            </div>
            <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs">
              <option value="All">Semua Sektor Industri</option>
              <option value="F&B & Farmasi">F&amp;B &amp; Farmasi</option>
              <option value="Manufaktur & Otomotif">Manufaktur &amp; Otomotif</option>
              <option value="Petrokimia & Kimia">Petrokimia &amp; Kimia</option>
              <option value="Keramik & Kertas">Keramik &amp; Kertas</option>
            </select>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs">
              <option value="All">Semua Status SLA</option>
              <option value="Active">Active Kontrak</option>
              <option value="Renewal Alert">Renewal Alert (&lt; 60 Hari)</option>
              <option value="Critical Expiry">Critical Expiry (&lt; 30 Hari)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                <th className="py-4 px-6 whitespace-nowrap">Perusahaan &amp; Kawasan</th>
                <th className="py-4 px-6 whitespace-nowrap">Sektor &amp; Metode Suplai</th>
                <th className="py-4 px-6 whitespace-nowrap">Kuota vs Utilisasi Bulanan</th>
                <th className="py-4 px-6 whitespace-nowrap">Omzet MTD &amp; AE</th>
                <th className="py-4 px-6 whitespace-nowrap">Status SLA Kontrak</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Aksi Strategis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {filteredClients.map((c) => {
                const utilizationRate = Math.round(((c.utilized_quota_mmbtu ?? 0) / (c.monthly_quota_mmbtu ?? 1)) * 100);
                const isHighUtil = utilizationRate >= 90;
                return (
                  <tr key={c.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          {(c.company_name ?? c.name ?? 'X').split(' ')[1]?.charAt(0) ?? 'X'}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors leading-tight">{c.company_name ?? c.name}</div>
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
                        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          <Icon name={c.supply_method === 'PRMS Pipeline' ? 'PipelineIcon' : 'TruckIcon'} size={14} />
                          <span>{c.supply_method ?? ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="w-48">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-900 dark:text-white font-mono">{(c.utilized_quota_mmbtu ?? 0).toLocaleString()} MMBTU</span>
                          <span className={isHighUtil ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>{utilizationRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                          <div className={`h-full rounded-full transition-all duration-500 ${isHighUtil ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' : 'bg-indigo-600'}`} style={{ width: `${Math.min(100, utilizationRate)}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Total: {(c.monthly_quota_mmbtu ?? 0).toLocaleString()} MMBTU/bln</span>
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
                          c.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                          c.status === 'Renewal Alert' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse' :
                          'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.status === 'Active' ? 'bg-emerald-500' : c.status === 'Renewal Alert' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span>{c.status === 'Active' ? 'SLA Aman' : c.status === 'Renewal Alert' ? 'Renewal Alert' : 'Critical Expiry'}</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">End: {c.contract_end ?? ''} ({c.expiryDays ?? 0} hr)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status !== 'Active' && (
                          <button onClick={() => handleInitiateRenewal(c.company_name ?? c.name ?? '')} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-extrabold transition-all shadow-2xs flex items-center gap-1 animate-bounce">
                            <Icon name="BoltIcon" size={12} /> <span>SLA</span>
                          </button>
                        )}
                        <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all">
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
                      <p className="text-base font-bold text-slate-600 dark:text-slate-300">Tidak ada data klien yang sesuai filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
          <div>Menampilkan <span className="font-extrabold text-slate-900 dark:text-white">{filteredClients.length}</span> dari <span className="font-extrabold">{clients.length}</span> total klien industri B2B.</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> SLA &gt; 60 Hari</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Renewal Alert (30-60 Hari)</span>
          </div>
        </div>
      </div>
    </>
  );
}
