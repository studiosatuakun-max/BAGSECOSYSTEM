'use client';

import React from 'react';
import { ShieldCheckIcon, CheckBadgeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const vendors = [
  { name: 'PT Pertamina Gas Negara Tbk', role: 'Raw Mother Station Gas', iso: 'ISO 9001 & MIGAS', status: 'Verified Gold', score: '99.9%' },
  { name: 'Taylor-Wharton / FIBA Tech', role: 'CNG Tube Skid Cylinders', iso: 'ISO 11120 Tube Spec', status: 'Verified Gold', score: '99.5%' },
  { name: 'Emerson Process / Fisher', role: 'PRMS Valves & Coriolis', iso: 'ATEX Zone 1 Certified', status: 'Verified Gold', score: '98.8%' },
  { name: 'PT Hino Motors Sales ID', role: 'Prime Mover Tractor 6x4', iso: 'MIGAS Fleet Spec', status: 'Audited', score: '97.2%' },
];

export default function VendorComplianceCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-cyan-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                MIGAS Quality Assurance
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Supplier ISO &amp; ATEX Safety Audit
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
            100% Passed
          </span>
        </div>

        <div className="space-y-2.5 my-2">
          {vendors.map((v, idx) => (
            <div
              key={`ven-${idx}`}
              className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs transition-all hover:border-cyan-500/40"
            >
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-900 dark:text-white">{v.name}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="text-indigo-600 dark:text-indigo-400">{v.role}</span>
                  <span>·</span>
                  <span>{v.iso}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckBadgeIcon className="w-3 h-3 text-emerald-600" />
                  <span>{v.score}</span>
                </span>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase">{v.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
          <CheckBadgeIcon className="w-4 h-4" />
          <span>Top 15 Supplier Validated</span>
        </span>
        <span className="text-[11px]">Next Audit: Q4 2026</span>
      </div>
    </div>
  );
}
