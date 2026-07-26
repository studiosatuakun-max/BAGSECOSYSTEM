'use client';

import React from 'react';
import { ClockIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const categories = [
  { label: 'Raw Gas Supply (PGN Pipeline)', time: 'Real-time (0 Days)', stat: 'Instant SLA', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' },
  { label: 'CNG Skid Tube Cylinders (FIBA)', time: '45 Days Lead', stat: 'Import Custom', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800' },
  { label: 'PRMS Valves & Meters (Emerson)', time: '14 Days Lead', stat: 'Regional Stock', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-200 dark:border-indigo-800' },
  { label: 'Prime Mover Spare Parts (Hino)', time: '2 Days Lead', stat: 'Fast Moving', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' },
];

export default function LeadTimeGaugeCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-teal-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Vendor Delivery SLA
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Avg Lead Time by Supply Category
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wider">
            14 Days Avg
          </span>
        </div>

        <div className="space-y-2.5 my-2">
          {categories.map((cat, idx) => (
            <div
              key={`lead-${idx}`}
              className={`p-3 rounded-2xl border ${cat.border} ${cat.bg} flex items-center justify-between text-xs transition-all hover:scale-[1.01]`}
            >
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-900 dark:text-white">{cat.label}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <TruckIcon className="w-3.5 h-3.5" />
                  <span>{cat.time}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${cat.color} bg-white/80 dark:bg-slate-900/80 shadow-2xs border ${cat.border}`}>
                {cat.stat}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>98.6% Vendor SLA Compliance</span>
        </div>
        <span className="text-[11px]">ISO 9001 Supplier Audited</span>
      </div>
    </div>
  );
}
