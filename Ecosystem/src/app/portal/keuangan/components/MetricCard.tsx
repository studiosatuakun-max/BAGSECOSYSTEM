'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';

type AccentColor = 'positive' | 'warning' | 'negative' | 'primary';

interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  rawValue?: string;
  trend: string;
  trendDir: 'up' | 'down' | 'up-bad' | 'down-good';
  subLabel: string;
  accentColor: AccentColor;
  icon: 'TrendingUp' | 'TrendingDown' | 'Clock';
  detail: string;
  isAlert?: boolean;
}

const iconMap = {
  TrendingUp,
  TrendingDown,
  Clock,
};

const accentMap: Record<AccentColor, { bg: string; icon: string; border: string }> = {
  positive: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-950/60', icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  negative: { bg: 'bg-rose-50 dark:bg-rose-950/60', icon: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  primary: { bg: 'bg-blue-50 dark:bg-blue-950/60', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
};

export default function MetricCard({
  label,
  value,
  trend,
  trendDir,
  subLabel,
  accentColor,
  icon,
  detail,
  isAlert,
}: MetricCardProps) {
  const IconComp = iconMap[icon];
  const accent = accentMap[accentColor];

  const trendPositive = trendDir === 'up' || trendDir === 'down-good';
  const TrendIcon = trendDir === 'up' || trendDir === 'up-bad' ? TrendingUp : TrendingDown;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 flex flex-col justify-between gap-4 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group ${
        isAlert
          ? 'border-rose-300 dark:border-rose-900/80 hover:border-rose-500 shadow-rose-500/10'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-2xl ${accent.bg} border ${accent.border} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300`}>
          <IconComp size={20} className={accent.icon} />
        </div>
        {isAlert && (
          <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shrink-0 align-middle shadow-2xs animate-pulse">
            <AlertCircle size={12} className="text-rose-500" />
            <span>Perhatian</span>
          </span>
        )}
      </div>

      {/* Label & Value */}
      <div className="space-y-1">
        <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-3xl sm:text-4xl font-black tabular-nums text-slate-900 dark:text-white leading-tight tracking-tight">
          {value}
        </p>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 align-middle shadow-2xs ${
            trendPositive
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300'
          }`}
        >
          <TrendIcon size={12} />
          <span>{trend}</span>
        </span>
        <span className="text-xs text-slate-400 font-semibold truncate">{subLabel}</span>
      </div>

      {/* Detail */}
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
        {detail}
      </p>
    </div>
  );
}