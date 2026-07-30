'use client';

import React, { useState } from 'react';
import { CustodyTransferSlip } from '../_integration/types';
import { Search, Plus, FileCheck, CheckCircle2, ShieldCheck, Database, FileText, Activity, Beaker } from 'lucide-react';

interface CustodyTransferTableCardProps {
  initialSlips?: CustodyTransferSlip[];
}

export default function CustodyTransferTableCard({ initialSlips = [] }: CustodyTransferTableCardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSlips = initialSlips.filter(slip =>
    slip.fob_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.customer_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Custody Transfer Slips</h2>
            <p className="text-sm text-slate-400 mt-0.5">Bukti Serah Terima Gas (Fillpost vs Micromotion Mass Balance)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search FOB No or Client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
              <th className="p-4 font-medium whitespace-nowrap shrink-0 align-middle">Transfer Slip</th>
              <th className="p-4 font-medium whitespace-nowrap shrink-0 align-middle">Client &amp; Asset</th>
              <th className="p-4 font-medium whitespace-nowrap shrink-0 align-middle">Mass Balance (kg)</th>
              <th className="p-4 font-medium whitespace-nowrap shrink-0 align-middle">Volume (MMBTU)</th>
              <th className="p-4 font-medium whitespace-nowrap shrink-0 align-middle">Gas Quality (GHV)</th>
              <th className="p-4 font-medium text-right whitespace-nowrap shrink-0 align-middle">Signatures</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredSlips.map((slip) => (
              <tr key={slip.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 whitespace-nowrap shrink-0 align-middle">
                  <div className="font-semibold text-white text-sm">{slip.fob_no}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{slip.date_wib} &bull; {slip.time_wib}</div>
                </td>

                <td className="p-4 whitespace-nowrap shrink-0 align-middle">
                  <div className="text-sm font-medium text-emerald-300 truncate max-w-[200px]">{slip.customer_id}</div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Database size={10} className="shrink-0" /> {slip.no_gtm} ({slip.type_gtm}) &bull; {slip.pressure_bar} Bar
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap shrink-0 align-middle">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                      <span className="w-16 text-slate-500 shrink-0">Fillpost:</span> {(slip.fillpost_kg ?? 0).toLocaleString()} kg
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                      <span className="w-16 text-slate-500 shrink-0">Micro:</span> {(slip.micromotion_kg ?? 0).toLocaleString()} kg
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-mono font-bold shrink-0 ${Math.abs(slip.selisih_kg ?? 0) > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      <span className="w-16 text-slate-500 font-normal">Selisih:</span> {(slip.selisih_kg ?? 0) > 0 ? '+' : ''}{slip.selisih_kg} kg
                    </div>
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap shrink-0 align-middle">
                  <div className="text-sm font-bold text-white bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md inline-block">
                    {(slip.volume_mmbtu ?? 0).toLocaleString()} <span className="text-[10px] text-emerald-400/80 font-normal">MMBTU</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">({(slip.volume_nm3 ?? 0).toLocaleString()} Sm&sup3;)</div>
                </td>

                <td className="p-4 whitespace-nowrap shrink-0 align-middle">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                      <Beaker size={10} className="text-slate-500 shrink-0" /> <span className="text-slate-500">GHV:</span> {slip.analisa_gas?.ghv?.toFixed(2) ?? '—'}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                      <Activity size={10} className="text-slate-500 shrink-0" /> <span className="text-slate-500">Dens:</span> {slip.analisa_gas?.density?.toFixed(4) ?? '—'}
                    </div>
                  </div>
                </td>

                <td className="p-4 text-right whitespace-nowrap shrink-0 align-middle">
                  <div className="flex justify-end gap-1.5">
                    <div title="PPC" className={`w-6 h-6 flex items-center justify-center rounded-full border ${slip.signed_by_ppc ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                      <FileCheck size={12} />
                    </div>
                    <div title="Driver" className={`w-6 h-6 flex items-center justify-center rounded-full border ${slip.signed_by_driver ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                      <ShieldCheck size={12} />
                    </div>
                    <div title="Security" className={`w-6 h-6 flex items-center justify-center rounded-full border ${slip.signed_by_security ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                      <CheckCircle2 size={12} />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5">
                    {slip.signed_by_ppc && slip.signed_by_driver && slip.signed_by_security ? 'Fully Validated' : 'Pending Signatures'}
                  </div>
                </td>
              </tr>
            ))}
            {filteredSlips.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-slate-600" />
                    <p className="text-sm font-medium">No custody transfer slips found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
