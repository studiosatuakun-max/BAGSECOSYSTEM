'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';

const ConsumptionBarChart = dynamic(
  () => import('./ConsumptionBarChartInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[170px] w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
    ),
  }
);

const consumptionData = [
  { day: 'Sen 20', consumption: 1450, date: '20 Jul' },
  { day: 'Sel 21', consumption: 1680, date: '21 Jul' },
  { day: 'Rab 22', consumption: 1520, date: '22 Jul' },
  { day: 'Kam 23', consumption: 1890, date: '23 Jul' },
  { day: 'Jum 24', consumption: 2150, date: '24 Jul' },
  { day: 'Sab 25', consumption: 1940, date: '25 Jul' },
  { day: 'Min 26', consumption: 1820, date: '26 Jul' },
];

const totalWeek = consumptionData?.reduce((a, b) => a + b?.consumption, 0);
const avgDay = Math.round(totalWeek / consumptionData?.length);
const todayVsYesterday = consumptionData?.[6]?.consumption - consumptionData?.[5]?.consumption;

export { consumptionData };

export default function ConsumptionTrendCard() {
  const isDown = todayVsYesterday < 0;
  const totalMMBTU = Math.round(totalWeek * 0.0357);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-indigo-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              <Flame size={18} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Custody Transfer Flow
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                7-Day Skid Gas Usage (Sm³)
              </h3>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full border ${isDown ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'}`}>
            {isDown ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
            <span>{Math.abs(todayVsYesterday)} Sm³ vs Kemarin</span>
          </div>
        </div>

        <div className="w-full my-2">
          <ConsumptionBarChart data={consumptionData} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-0.5">Weekly Volume Total</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{totalWeek?.toLocaleString('id-ID')} Sm³</p>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">({totalMMBTU} MMBTU)</span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-0.5">Daily Average Burn Rate</p>
          <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{avgDay?.toLocaleString('id-ID')} Sm³ / Hari</p>
        </div>
      </div>
    </div>
  );
}