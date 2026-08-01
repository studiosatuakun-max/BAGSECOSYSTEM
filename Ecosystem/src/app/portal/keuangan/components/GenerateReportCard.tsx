'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
type ReportType = 'monthly' | 'quarterly' | 'annual' | 'tax';

const reportOptions: { value: ReportType; label: string; desc: string }[] = [
  { value: 'monthly', label: 'Laporan Kas Mother Station', desc: 'Ringkasan Juli 2026 (MMBTU vs IDR)' },
  { value: 'quarterly', label: 'Audit Rekonsiliasi Tagihan Q2', desc: 'Revenue Assurance (Fisik MMBTU vs Invoiced)' },
  { value: 'annual', label: 'Proyeksi Revenue HBA Index', desc: 'Analisa keekonomian FY 2026' },
  { value: 'tax', label: 'Rekap E-Faktur PPN 11% & PPh', desc: 'Kewajiban pajak MIGAS DGT' },
];

export default function GenerateReportCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('monthly');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selected = reportOptions.find((r) => r.value === selectedType)!;

  function handleGenerate() {
    router.push(`/portal/keuangan/print-report/${selectedType}`);
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-white rounded-3xl border border-amber-500/30 p-6 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-400/50 transition-all duration-300 group">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 z-10">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
          <FileText size={20} />
        </div>
        <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shrink-0 align-middle shadow-2xs">
          <Sparkles size={11} className="text-amber-400 animate-pulse" />
          <span>Treasury AI</span>
        </span>
      </div>

      {/* Label */}
      <div className="space-y-1 z-10">
        <p className="text-xs font-black text-amber-400/80 uppercase tracking-wider">
          Executive CNG Reporting
        </p>
        <h3 className="text-lg font-black text-white leading-tight tracking-tight">
          {selected.label}
        </h3>
        <p className="text-xs text-slate-400 font-medium">{selected.desc}</p>
      </div>

      {/* Type selector */}
      <div className="relative z-20">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-2xl transition-all duration-150 shadow-sm"
        >
          <span className="truncate">{selected.label}</span>
          <ChevronDown size={14} className={`text-amber-400 transition-transform duration-150 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 overflow-hidden backdrop-blur-xl">
            {reportOptions.map((opt) => (
              <button
                key={`report-opt-${opt.value}`}
                onClick={() => {
                  setSelectedType(opt.value);
                  setDropdownOpen(false);
                }}
                className={`w-full flex flex-col items-start px-3.5 py-2.5 text-left hover:bg-slate-800 transition-colors border-b border-slate-800/60 last:border-0 ${
                  selectedType === opt.value ? 'bg-amber-500/10' : ''
                }`}
              >
                <span className={`text-xs font-extrabold ${selectedType === opt.value ? 'text-amber-400' : 'text-white'}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || success}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all duration-300 active:scale-95 disabled:cursor-not-allowed shadow-lg z-10 ${
          success
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/50 hover:shadow-xl'
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin text-slate-950" />
            <span>Generating CNG Ledger...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={16} className="text-white" />
            <span>Laporan Tersedia (PDF/XLS)</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>Unduh Rekap Keuangan</span>
          </>
        )}
      </button>
    </div>
  );
}