'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';

type AccentColor = 'positive' | 'warning' | 'negative' | 'primary';

interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  rawValue: string;
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
  positive: { bg: 'bg-positive/10', icon: 'text-positive', border: 'border-positive/20' },
  warning: { bg: 'bg-warning/10', icon: 'text-warning', border: 'border-warning/20' },
  negative: { bg: 'bg-negative/10', icon: 'text-negative', border: 'border-negative/20' },
  primary: { bg: 'bg-primary/10', icon: 'text-primary', border: 'border-primary/20' },
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
      className={`bg-card rounded-2xl border card-shadow p-5 flex flex-col gap-3 transition-all duration-200 hover:card-shadow-md ${
        isAlert ? 'border-negative/30 bg-negative/3' : 'border-border'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl ${accent.bg} flex items-center justify-center`}>
          <IconComp size={18} className={accent.icon} />
        </div>
        {isAlert && (
          <div className="flex items-center gap-1 bg-negative/10 text-negative text-xs font-600 px-2 py-1 rounded-lg">
            <AlertCircle size={11} />
            Perhatian
          </div>
        )}
      </div>

      {/* Label */}
      <div>
        <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-metric-md font-700 tabular-nums text-foreground leading-none">{value}</p>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5">
        <div
          className={`flex items-center gap-1 text-xs font-600 px-2 py-0.5 rounded-lg ${
            trendPositive
              ? 'bg-positive/10 text-positive' :'bg-negative/10 text-negative'
          }`}
        >
          <TrendIcon size={11} />
          {trend}
        </div>
        <span className="text-xs text-muted-foreground">{subLabel}</span>
      </div>

      {/* Detail */}
      <p className="text-xs text-muted-foreground border-t border-border pt-2.5 mt-auto">{detail}</p>
    </div>
  );
}