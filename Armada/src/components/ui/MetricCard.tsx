import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'alert' | 'warning' | 'positive';
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-card border-border',
  alert: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  positive: 'bg-green-50 border-green-200',
};

const trendColors: Record<string, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-muted-foreground',
};

export default function MetricCard({
  label,
  value,
  subtext,
  trend,
  trendValue,
  variant = 'default',
  icon,
  className = '',
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={`rounded-xl border p-5 shadow-card flex flex-col gap-3 ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-600 uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-hero-metric text-foreground tabular-nums">{value}</span>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-600 ${trendColors[trend]} mb-1`}>
            <TrendIcon size={13} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      {subtext && (
        <p className="text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
}