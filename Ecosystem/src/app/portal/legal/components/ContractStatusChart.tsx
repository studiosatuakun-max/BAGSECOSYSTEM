'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ScaleIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const ChartInner = dynamic(() => import('./ContractStatusChartInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[240px] flex items-center justify-center text-xs font-bold text-slate-400 dark:text-slate-500 animate-pulse">
      Memuat Distribusi SLA &amp; Kontrak Hukum MIGAS...
    </div>
  ),
});

export default function ContractStatusChart() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-indigo-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
              <ScaleIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 pr-1">
              <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider truncate">
                Corporate Legal Portfolio
              </p>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5 truncate">
                B2B Contracts &amp; MIGAS Niaga Bumi SLAs
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider whitespace-nowrap shrink-0 align-middle">
            <DocumentCheckIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>108 Total SLAs</span>
          </span>
        </div>

        <div className="my-2">
          <ChartInner />
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>100% Custody Transfer E-Faktur Validated</span>
        </span>
        <span className="text-[11px]">QHSE &amp; ESDM Pipeline Audited</span>
      </div>
    </div>
  );
}
