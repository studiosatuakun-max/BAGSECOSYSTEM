'use client';

import React from 'react';
import { ShieldCheckIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/outline';

const permits = [
  { name: 'Izin Usaha Niaga Gas Bumi (MIGAS)', agency: 'Kementerian ESDM Ditjen Migas', no: 'SK-MIGAS-2025/089', expiry: 'Dec 31, 2028', stat: 'Valid Gold' },
  { name: 'Sertifikat Kalibrasi Metrologi Legal', agency: 'Direktorat Metrologi & Kemendag', no: 'METRO-SKID-250BAR', expiry: 'Oct 15, 2026', stat: 'Valid Gold' },
  { name: 'ATEX Zone 1 Safety Certification', agency: 'SUCOFINDO & HSE Inspectorate', no: 'ATEX-COMP-0091', expiry: 'Nov 30, 2026', stat: 'Valid Gold' },
  { name: 'ESDM Pipeline Right-of-Way Permit', agency: 'BPJT & PGN Pipeline Authority', no: 'ROW-PGN-2026-01', expiry: 'Aug 20, 2026', stat: 'Renewing Soon' },
];

export default function MigasPermitsCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-purple-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 pr-1">
              <p className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider truncate">
                Government Compliance
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5 truncate">
                MIGAS, Metrologi &amp; ESDM Permits
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase tracking-wider whitespace-nowrap shrink-0 align-middle">
            18 Permits Active
          </span>
        </div>

        <div className="space-y-2.5 my-2">
          {permits.map((p, idx) => (
            <div
              key={`prm-${idx}`}
              className={`p-3 rounded-2xl border text-xs transition-all flex items-center justify-between gap-2 ${
                p.stat === 'Renewing Soon'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="font-extrabold text-slate-900 dark:text-white truncate" title={p.name}>{p.name}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[150px]" title={p.agency}>{p.agency}</span>
                  <span>·</span>
                  <span className="font-mono text-[9px]">{p.no}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                  p.stat === 'Renewing Soon'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}>
                  {p.stat === 'Renewing Soon' ? <ClockIcon className="w-3 h-3 text-amber-600" /> : <CheckBadgeIcon className="w-3 h-3 text-emerald-600" />}
                  <span>{p.stat}</span>
                </span>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">Exp: {p.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
          <CheckBadgeIcon className="w-4 h-4" />
          <span>BASKARA Legal Risk Level: 0.0%</span>
        </span>
        <span className="text-[11px]">Audit ESDM Q4 2026</span>
      </div>
    </div>
  );
}
