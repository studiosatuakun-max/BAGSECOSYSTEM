'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const TaxComplianceChart = dynamic(() => import('./TaxComplianceChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[180px] animate-pulse bg-slate-100 rounded-xl" />
  ),
});

const taxItems = [
  { id: 'tax-pph21', label: 'PPh 21', value: 100, status: 'Lunas', color: 'text-positive' },
  { id: 'tax-pph23', label: 'PPh 23', value: 87, status: 'Sebagian', color: 'text-warning' },
  { id: 'tax-ppn', label: 'PPN', value: 95, status: 'Lunas', color: 'text-positive' },
  { id: 'tax-pphbadan', label: 'PPh Badan', value: 72, status: 'Proses', color: 'text-accent' },
];

export default function TaxComplianceCard() {
  const overall = Math.round(taxItems?.reduce((a, b) => a + b?.value, 0) / taxItems?.length);

  return (
    <div className="bg-card rounded-2xl border border-border card-shadow p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 rounded-lg bg-positive/10 flex items-center justify-center">
              <ShieldCheck size={15} className="text-positive" />
            </div>
            <h2 className="text-[14px] font-700 text-foreground">Kepatuhan Pajak</h2>
          </div>
          <p className="text-xs text-muted-foreground ml-9">Ringkasan Juli 2026</p>
        </div>
        {overall < 90 && (
          <div className="flex items-center gap-1 bg-warning/10 text-warning text-xs font-600 px-2 py-1 rounded-lg">
            <AlertTriangle size={11} />
            Perlu Tindakan
          </div>
        )}
      </div>
      {/* Radial Chart */}
      <div className="flex items-center justify-center my-2">
        <TaxComplianceChart overall={overall} data={taxItems} />
      </div>
      {/* Overall score */}
      <div className="text-center mb-4">
        <p className="text-3xl font-800 tabular-nums text-foreground">{overall}%</p>
        <p className="text-xs text-muted-foreground font-500 mt-0.5">Kepatuhan Keseluruhan</p>
      </div>
      {/* Per-category breakdown */}
      <div className="space-y-2.5 mt-auto">
        {taxItems?.map((item) => (
          <div key={item?.id} className="flex items-center gap-2">
            <span className="text-xs font-600 text-muted-foreground w-16 flex-shrink-0">{item?.label}</span>
            <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item?.value}%`,
                  backgroundColor:
                    item?.value === 100
                      ? 'var(--positive)'
                      : item?.value >= 90
                      ? 'var(--primary)'
                      : item?.value >= 75
                      ? 'var(--warning)'
                      : 'var(--negative)',
                }}
              />
            </div>
            <span className={`text-xs font-700 tabular-nums w-9 text-right ${item?.color}`}>
              {item?.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}