'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle, ChevronDown } from 'lucide-react';

type ReportType = 'monthly' | 'quarterly' | 'annual' | 'tax';

const reportOptions: { value: ReportType; label: string; desc: string }[] = [
  { value: 'monthly', label: 'Laporan Bulanan', desc: 'Ringkasan bulan berjalan' },
  { value: 'quarterly', label: 'Laporan Kuartalan', desc: 'Q2 2026 (Apr–Jun)' },
  { value: 'annual', label: 'Laporan Tahunan', desc: 'Proyeksi FY 2026' },
  { value: 'tax', label: 'Laporan Pajak', desc: 'Rekap kewajiban pajak' },
];

export default function GenerateReportCard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('monthly');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selected = reportOptions.find((r) => r.value === selectedType)!;

  function handleGenerate() {
    setLoading(true);
    setSuccess(false);
    // Backend integration point: POST /api/reports/generate with { type: selectedType, period: 'Jul 2026' }
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2200);
  }

  return (
    <div className="bg-primary rounded-2xl border border-primary/20 card-shadow p-5 flex flex-col gap-3 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-foreground/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary-foreground/5 rounded-full translate-y-6 -translate-x-6 pointer-events-none" />

      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
        <FileText size={18} className="text-primary-foreground" />
      </div>

      {/* Label */}
      <div>
        <p className="text-xs font-600 text-primary-foreground/60 uppercase tracking-wider mb-1">
          Laporan Keuangan
        </p>
        <p className="text-[15px] font-700 text-primary-foreground leading-tight">
          Buat Laporan Bulanan
        </p>
      </div>

      {/* Type selector */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between bg-primary-foreground/15 hover:bg-primary-foreground/20 text-primary-foreground text-xs font-600 px-3 py-2 rounded-xl transition-all duration-150"
        >
          <span>{selected.label}</span>
          <ChevronDown size={13} className={`transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl card-shadow-md z-20 overflow-hidden">
            {reportOptions.map((opt) => (
              <button
                key={`report-opt-${opt.value}`}
                onClick={() => {
                  setSelectedType(opt.value);
                  setDropdownOpen(false);
                }}
                className={`w-full flex flex-col items-start px-3 py-2.5 text-left hover:bg-muted transition-colors ${
                  selectedType === opt.value ? 'bg-primary/5' : ''
                }`}
              >
                <span className={`text-xs font-600 ${selectedType === opt.value ? 'text-primary' : 'text-foreground'}`}>
                  {opt.label}
                </span>
                <span className="text-xs text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || success}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 disabled:cursor-not-allowed mt-auto ${
          success
            ? 'bg-positive text-primary-foreground'
            : 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Memproses...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={15} />
            <span>Siap Diunduh</span>
          </>
        ) : (
          <>
            <Download size={15} />
            <span>Buat Laporan</span>
          </>
        )}
      </button>
    </div>
  );
}