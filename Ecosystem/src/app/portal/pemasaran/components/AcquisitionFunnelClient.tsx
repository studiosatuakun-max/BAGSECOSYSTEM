'use client';
import React, { useState } from 'react';
import { Users, PhoneCall, FileText, CheckCircle, ChevronRight, Zap } from 'lucide-react';

// Backend integration point: GET /api/funnel/acquisition-stages
const funnelStages = [
  {
    id: 'stage-leads',
    stage: 'Inbound CNG Leads',
    count: 1240,
    percentage: 100,
    dropOff: null,
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800/80',
    barColor: 'from-amber-500 to-amber-600',
    icon: Users,
    description: 'Prospek industri & Horeca dari web portal dan survei AE',
  },
  {
    id: 'stage-contacted',
    stage: 'Technical Survey & AE Contacted',
    count: 832,
    percentage: 67.1,
    dropOff: 32.9,
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/40',
    borderClass: 'border-orange-200 dark:border-orange-800/80',
    barColor: 'from-orange-500 to-orange-600',
    icon: PhoneCall,
    description: 'Inspeksi lokasi PRMS & asesmen kebutuhan kuota Sm³/day',
  },
  {
    id: 'stage-proposal',
    stage: 'MMBTU Quota Proposal Submitted',
    count: 287,
    percentage: 23.1,
    dropOff: 65.5,
    colorClass: 'text-pink-600 dark:text-pink-400',
    bgClass: 'bg-pink-50 dark:bg-pink-950/40',
    borderClass: 'border-pink-200 dark:border-pink-800/80',
    barColor: 'from-pink-500 to-pink-600',
    icon: FileText,
    description: 'Pengiriman proposal harga kontrak SLA & skema logistik Skid',
  },
  {
    id: 'stage-closed',
    stage: 'Closed Won (SLA Active)',
    count: 94,
    percentage: 7.6,
    dropOff: 67.2,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800/80',
    barColor: 'from-emerald-500 to-teal-600',
    icon: CheckCircle,
    description: 'Kontrak SLA ditandatangani dan pasokan Mother Station aktif',
  },
];

const MAX_WIDTH = 100;
const MIN_WIDTH = 38;

function getBarWidth(pct: number) {
  return MIN_WIDTH + (pct / 100) * (MAX_WIDTH - MIN_WIDTH);
}

export default function AcquisitionFunnelClient() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between h-full transition-all duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              B2B Acquisition Funnel
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
              <Zap size={10} className="fill-current" />
              <span>Q3 Pipeline</span>
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            MTD 2026
          </span>
        </div>

        {/* Overall conversion badge */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Overall Lead-to-SLA Conversion</span>
          <span className="font-black text-pink-600 dark:text-pink-400 text-sm tabular-nums">
            7.6%
          </span>
        </div>

        {/* Funnel Stages */}
        <div className="flex flex-col gap-3">
          {funnelStages.map((stage, index) => {
            const Icon = stage.icon;
            const barWidth = getBarWidth(stage.percentage);
            const isHovered = hoveredStage === stage.id;

            return (
              <div key={stage.id} className="relative">
                {/* Connector arrow */}
                {index > 0 && (
                  <div className="flex items-center justify-center -my-1 relative z-10 text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <ChevronRight size={12} className="rotate-90" />
                      {stage.dropOff !== null && (
                        <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                          −{stage.dropOff}% drop
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stage Bar */}
                <button
                  className={`w-full text-left transition-all duration-200 rounded-2xl border p-0 overflow-hidden shadow-sm ${stage.bgClass} ${stage.borderClass} ${
                    isHovered ? 'scale-[1.01] shadow-md' : ''
                  }`}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  aria-label={`${stage.stage}: ${stage.count} (${stage.percentage}%)`}
                >
                  {/* Visual funnel bar width */}
                  <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 h-1.5">
                    <div
                      className={`h-full bg-gradient-to-r ${stage.barColor} transition-all duration-500 rounded-r-full`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 border ${stage.borderClass} ${stage.colorClass}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {stage.stage}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className={`tabular-nums text-sm font-black ${stage.colorClass}`}>
                        {stage.count.toLocaleString('id-ID')}
                      </p>
                      <p className="tabular-nums text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {stage.percentage}%
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer insight */}
      <div className="mt-5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs font-medium text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <span className="text-base leading-none">💡</span>
        <div>
          <strong className="font-extrabold text-amber-950 dark:text-white">AE Pipeline Insight:</strong> Gesekan tertinggi pada tahap <span className="underline font-bold">Survei Teknis → Proposal MMBTU</span> (65.5% drop). Disarankan penambahan kalkulator ROI instalasi Skid otomatis untuk AE.
        </div>
      </div>
    </div>
  );
}