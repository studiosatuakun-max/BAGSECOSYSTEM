'use client';

import React from 'react';
import { ExclamationTriangleIcon, CheckBadgeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const slaMetrics = [
  { metric: 'Gas Purity (Min. 97.5% CH4)', target: '≥ 97.5%', actual: '98.4% CH4', status: 'Safe', risk: 'Rp 0 Penalty' },
  { metric: 'Manifold Delivery Pressure', target: '245 - 250 Bar', actual: '249.2 Bar', status: 'Safe', risk: 'Rp 0 Penalty' },
  { metric: 'Custody Transfer Lead Time SLA', target: '≤ 120 Mins', actual: '108 Mins Avg', status: 'Safe', risk: 'Rp 0 Penalty' },
  { metric: 'Mother Station Uptime Guarantee', target: '99.50% / mo', actual: '99.98% / mo', status: 'Safe', risk: 'Rp 0 Penalty' },
];

export default function SlaBreachRadarCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-amber-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
              <ChartBarIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                SLA Breach Radar
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                B2B Client Guarantee &amp; Penalty Monitor
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
            0 Breach Event
          </span>
        </div>

        <div className="space-y-2.5 my-2">
          {slaMetrics.map((item, idx) => (
            <div
              key={`sla-${idx}`}
              className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs transition-all hover:border-amber-500/40"
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="font-extrabold text-slate-900 dark:text-white truncate" title={item.metric}>{item.metric}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span>Target: <strong className="text-slate-700 dark:text-slate-300">{item.target}</strong></span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">Actual: {item.actual}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckBadgeIcon className="w-3 h-3 text-emerald-600" />
                  <span>{item.status}</span>
                </span>
                <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 mt-0.5">{item.risk}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <ExclamationTriangleIcon className="w-4 h-4" />
          <span>Real-time SCADA Link Active</span>
        </span>
        <span className="text-[11px]">Penalty Cap: 5% Contract Value</span>
      </div>
    </div>
  );
}
