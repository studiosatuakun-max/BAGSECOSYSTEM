'use client';

import React, { useState } from 'react';
import { ShieldCheckIcon, DocumentArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function HseComplianceScoreCard() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAudit = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success('HSE Safety Audit Report Generated', {
        description: 'Laporan kepatuhan keselamatan ATEX Mother Station & Skid Tank (PDF) telah dikirim ke arsip Legal.',
      });
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-emerald-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                QHSE Safety Audit
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Mother Station &amp; Skid HSE Score
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
            Grade A+ Validated
          </span>
        </div>

        <div className="text-center py-4 bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 my-3">
          <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">
            100<span className="text-2xl font-bold">%</span>
          </div>
          <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">
            Zero Lost Time Injury (LTI) · 840 Days
          </p>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Inspeksi gas analyzer &amp; tekanan manifold 250 Bar lulus uji metrologi.
          </p>
        </div>

        <div className="space-y-2 my-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              <span>Mother Station Fire Suppression System</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">PASSED</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              <span>ISO 11120 Tube Cylinder Pressure Leak Test</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">PASSED</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          Auditor: PT SUCOFINDO
        </span>
        <button
          onClick={handleExportAudit}
          disabled={isExporting}
          className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
        >
          <DocumentArrowDownIcon className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Exporting...' : 'Export Audit PDF'}</span>
        </button>
      </div>
    </div>
  );
}
