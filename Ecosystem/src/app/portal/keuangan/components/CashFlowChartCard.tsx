'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, MoreHorizontal, Download } from 'lucide-react';

const CashFlowChart = dynamic(() => import('./CashFlowChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[260px] animate-pulse bg-slate-100 rounded-xl" />
  ),
});

const periods = [
  { label: '6 Bln', value: '6m' },
  { label: '12 Bln', value: '12m' },
  { label: 'YTD', value: 'ytd' },
];

export default function CashFlowChartCard() {
  const [activePeriod, setActivePeriod] = useState('12m');

  return (
    <div className="bg-card rounded-2xl border border-border card-shadow p-5 lg:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp size={15} className="text-primary" />
            </div>
            <h2 className="text-[15px] font-700 text-foreground">Tren Arus Kas</h2>
          </div>
          <p className="text-xs text-muted-foreground ml-9">Pendapatan vs. Pengeluaran (Rp Juta)</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center bg-secondary rounded-xl p-0.5">
            {periods?.map((p) => (
              <button
                key={`period-${p?.value}`}
                onClick={() => setActivePeriod(p?.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 ${
                  activePeriod === p?.value
                    ? 'bg-card text-primary card-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {p?.label}
              </button>
            ))}
          </div>
          <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150">
            <Download size={15} />
          </button>
          <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground font-500">Pendapatan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-xs text-muted-foreground font-500">Pengeluaran</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-positive" style={{ borderTop: '2px dashed var(--positive)' }} />
          <span className="text-xs text-muted-foreground font-500">Net Cash</span>
        </div>
      </div>
      {/* Chart */}
      <div className="flex-1 min-h-[240px]">
        <CashFlowChart period={activePeriod} />
      </div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
        {[
          { label: 'Total Pendapatan', value: 'Rp 8,7 M', color: 'text-primary' },
          { label: 'Total Pengeluaran', value: 'Rp 3,2 M', color: 'text-accent' },
          { label: 'Net Cash Flow', value: 'Rp 5,5 M', color: 'text-positive' },
        ]?.map((s) => (
          <div key={`summary-${s?.label}`} className="text-center">
            <p className="text-xs text-muted-foreground font-500 mb-0.5">{s?.label}</p>
            <p className={`text-sm font-700 tabular-nums ${s?.color}`}>{s?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}