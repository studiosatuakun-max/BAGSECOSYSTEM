'use client';

import React from 'react';
import { DocumentTextIcon, BuildingOfficeIcon, CheckBadgeIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const contract = {
  id: 'CTR-PGN-2026-X10',
  title: 'Master Gas Supply Agreement (Mother Station)',
  vendor: 'PT Pertamina Gas Negara Tbk (PGN)',
  quota: '50,000 Sm³ / hari',
  price: 'US$ 6.20 / MMBTU (Pegged)',
  expiry: '31 Des 2028 (2.5 Tahun Lagi)',
  status: 'Active · Guaranteed Pipeline',
};

export default function ActiveContractCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-indigo-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <DocumentTextIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Primary Supply Contract
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Master Raw Gas Pipeline Agreement
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
            PGN Pipeline
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <BuildingOfficeIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{contract.vendor}</span>
            </span>
            <span className="text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md">
              {contract.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Daily Allocation Quota</p>
              <p className="font-black text-slate-900 dark:text-white mt-0.5">{contract.quota}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Fixed Contract Rate</p>
              <p className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{contract.price}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
          <span className="flex items-center gap-1.5">
            <CheckBadgeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Masa Berlaku Kontrak Induk:</span>
          </span>
          <span className="font-black text-blue-700 dark:text-blue-300">{contract.expiry}</span>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
        <span>SLA Priority 1 · Mother Station Inlet 23 Bar</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">100% Guaranteed Flow</span>
      </div>
    </div>
  );
}
