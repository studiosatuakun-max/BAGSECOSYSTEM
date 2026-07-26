'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';

const TaxComplianceChart = dynamic(() => import('./TaxComplianceChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[180px] w-[180px] animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-[10px] text-slate-400 font-bold">
      Loading Radial...
    </div>
  ),
});

const taxItems = [
  { id: 'tax-ppn', label: 'PPN 11% Keluaran', value: 100, status: 'Lunas DGT', color: 'text-emerald-600 dark:text-emerald-400', hex: '#10b981' },
  { id: 'tax-pph22', label: 'PPh 22 MIGAS Gas', value: 100, status: 'Lunas', color: 'text-emerald-600 dark:text-emerald-400', hex: '#059669' },
  { id: 'tax-pph23', label: 'PPh 23 Jasa Kompresi', value: 94, status: 'Proses E-Faktur', color: 'text-amber-600 dark:text-amber-400', hex: '#f59e0b' },
  { id: 'tax-pphbadan', label: 'PPh Badan FY26', value: 85, status: 'Cicilan Tahapan', color: 'text-blue-600 dark:text-blue-400', hex: '#3b82f6' },
];

export default function TaxComplianceCard() {
  const overall = Math.round(taxItems.reduce((a, b) => a + b.value, 0) / taxItems.length);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between gap-5 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Kepatuhan Pajak MIGAS
              </h2>
              <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
                <Sparkles size={10} />
                <span>DGT Online</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Rekap E-Faktur & Kewajiban PPh CNG Juli 2026
            </p>
          </div>
        </div>
        {overall < 100 && (
          <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shrink-0 align-middle shadow-2xs">
            <AlertTriangle size={12} className="text-amber-500" />
            <span>2 Menunggu</span>
          </span>
        )}
      </div>

      {/* Radial Chart & Overall Score */}
      <div className="flex flex-col items-center justify-center my-2">
        <TaxComplianceChart overall={overall} data={taxItems} />
      </div>

      {/* Per-category breakdown */}
      <div className="space-y-3.5 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
        {taxItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: item.hex }} />
              <span className="font-extrabold text-slate-700 dark:text-slate-300 truncate">{item.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 align-middle">
                {item.status}
              </span>
              <span className={`font-black tabular-nums w-10 text-right ${item.color}`}>
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}