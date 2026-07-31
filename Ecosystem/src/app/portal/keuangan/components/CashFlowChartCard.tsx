'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, MoreHorizontal, Download, Sparkles, PlusCircle } from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';

const CashFlowChart = dynamic(() => import('./CashFlowChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-xs text-slate-400 font-bold">
      Loading Recharts Telemetry...
    </div>
  ),
});

const periods = [
  { label: '6M', value: '6m' },
  { label: '12M', value: '12m' },
  { label: 'YTD', value: 'ytd' },
  { label: 'Q3 Proyeksi', value: 'q3' },
];

export default function CashFlowChartCard() {
  const [activePeriod, setActivePeriod] = useState('12m');
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between gap-5 group">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Tren Arus Kas Custody Transfer CNG
              </h2>
              <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
                <Sparkles size={10} />
                <span>MMBTU Billing</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Pendapatan Penjualan Gas vs Biaya Operasional Mother Station & Kompresi (Rp Juta)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Period selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1 border border-slate-200/60 dark:border-slate-700/60">
            {periods.map((p) => (
              <button
                key={`period-${p.value}`}
                onClick={() => setActivePeriod(p.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  activePeriod === p.value
                    ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all text-xs">
            <PlusCircle size={14} />
            Catat Pengeluaran
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-150 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 px-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs shadow-emerald-500/50" />
          <span className="text-xs text-slate-600 dark:text-slate-300 font-extrabold">Pendapatan CNG (B2B Industrial & Horeca)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-2xs shadow-amber-500/50" />
          <span className="text-xs text-slate-600 dark:text-slate-300 font-extrabold">Biaya Operasional Mother Station</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
            Net Margin Avg: +64.2%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[280px] w-full">
        <CashFlowChart period={activePeriod} />
      </div>

      {/* Summary footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center sm:text-left">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue YTD</span>
          <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5">Rp 12.450.000.000</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ops Expense YTD</span>
          <p className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums mt-0.5">Rp 4.455.000.000</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Treasury Surplus</span>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">+ Rp 7.995.000.000</p>
        </div>
      </div>
      </div>

      {showExpenseModal && <AddExpenseModal onClose={() => setShowExpenseModal(false)} />}
    </>
  );
}