'use client';

import React from 'react';
import { ScaleIcon, ChatBubbleBottomCenterTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const advices = [
  {
    topic: 'Regulasi Harga Gas MMBTU ESDM 2026',
    counsel: 'Dr. Hendra Gunawan, SH, MH (Lead Counsel)',
    date: 'Jul 26, 2026',
    summary: 'Penyesuaian adendum harga pasokan PGN telah sesuai dengan Kepmen ESDM No. 91. Siap untuk penandatanganan Direksi.',
    priority: 'High',
  },
  {
    topic: 'Klausul Force Majeure pada Custody Transfer Skid',
    counsel: 'Anita Rahmawati, SH, LLM',
    date: 'Jul 24, 2026',
    summary: 'Penambahan klausul kompensasi keterlambatan akibat blokade jalur tol atau pembatasan jam operasional armada CNG.',
    priority: 'Normal',
  },
  {
    topic: 'Perpanjangan Sertifikat ATEX Mother Station',
    counsel: 'Bambang Soemantri, SH',
    date: 'Jul 21, 2026',
    summary: 'Inspeksi fisik dari Ditjen Migas dijadwalkan September 2026. Seluruh berkas pemeliharaan kompresor telah disiapkan.',
    priority: 'Normal',
  },
];

export default function LegalCounselAdviceCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-indigo-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Corporate Counsel Notes
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Legal Advisory &amp; Regulatory Feed
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            3 Live Advisory
          </span>
        </div>

        <div className="space-y-2.5 my-2">
          {advices.map((adv, idx) => (
            <div
              key={`adv-${idx}`}
              className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5 transition-all hover:border-indigo-500/40"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate" title={adv.topic}>
                  {adv.topic}
                </p>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 ${
                  adv.priority === 'High'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {adv.priority}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                &ldquo;{adv.summary}&rdquo;
              </p>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 pt-0.5">
                <span className="truncate max-w-[180px]" title={adv.counsel}>{adv.counsel}</span>
                <span>{adv.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
          <ScaleIcon className="w-4 h-4" />
          <span>Retained Counsel: PT Asri Legal Partner</span>
        </span>
        <span className="text-[11px]">24/7 Consultation</span>
      </div>
    </div>
  );
}
