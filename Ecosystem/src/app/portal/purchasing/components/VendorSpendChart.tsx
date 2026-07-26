'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { BanknotesIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const VendorSpendChartInner = dynamic(
  () => import('./VendorSpendChartInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
    ),
  }
);

const spendData = [
  { month: 'Feb', rawGas: 3200, spareParts: 650, total: 3850, variance: '-2.1%' },
  { month: 'Mar', rawGas: 3450, spareParts: 820, total: 4270, variance: '+1.4%' },
  { month: 'Apr', rawGas: 3100, spareParts: 580, total: 3680, variance: '-4.2%' },
  { month: 'May', rawGas: 3800, spareParts: 950, total: 4750, variance: '+5.8%' },
  { month: 'Jun', rawGas: 3950, spareParts: 1100, total: 5050, variance: '+2.1%' },
  { month: 'Jul (Live)', rawGas: 3750, spareParts: 1100, total: 4850, variance: '-3.9%' },
];

const totalJuly = spendData[5].total;
const totalH1 = spendData.reduce((acc, curr) => acc + curr.total, 0);

export default function VendorSpendChart() {
  const isDown = spendData[5].variance.startsWith('-');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-emerald-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
              <BanknotesIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Supply Chain spend Analytics
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                6-Month Procurement &amp; Raw Gas MMBTU Spend
              </h3>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full border ${isDown ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'}`}>
            {isDown ? <ArrowTrendingDownIcon className="w-3.5 h-3.5" /> : <ArrowTrendingUpIcon className="w-3.5 h-3.5" />}
            <span>{spendData[5].variance} vs Juni</span>
          </div>
        </div>

        <div className="w-full my-2">
          <VendorSpendChartInner data={spendData} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-0.5">July MTD Procurement Total</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">Rp {(totalJuly / 1000).toFixed(2)} Miliar</p>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">(77% Raw Gas PGN)</span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-0.5">6-Month Cumulative Spend</p>
          <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">Rp {(totalH1 / 1000).toFixed(2)} Miliar · Terkontrol ERP</p>
        </div>
      </div>
    </div>
  );
}
