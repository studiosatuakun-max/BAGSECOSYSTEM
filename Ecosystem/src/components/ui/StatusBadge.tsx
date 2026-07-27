import React from 'react';

export type BadgeVariant =
  | 'safe' |'violation' |'warning' |'info' |'neutral' |'active' |'suspended' |'offduty' |'overdue' |'due-soon' |'operational' |'completed' |'in-progress' |'incident';

const variantMap: Record<BadgeVariant, string> = {
  safe: 'bg-green-50 text-green-700 border border-green-200',
  violation: 'bg-red-50 text-red-700 border border-red-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
  active: 'bg-green-50 text-green-700 border border-green-200',
  suspended: 'bg-red-50 text-red-700 border border-red-200',
  offduty: 'bg-slate-100 text-slate-500 border border-slate-200',
  overdue: 'bg-red-50 text-red-700 border border-red-200',
  'due-soon': 'bg-amber-50 text-amber-700 border border-amber-200',
  operational: 'bg-green-50 text-green-700 border border-green-200',
  completed: 'bg-blue-50 text-blue-700 border border-blue-200',
  'in-progress': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  incident: 'bg-red-50 text-red-700 border border-red-200',
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  dot?: boolean;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ variant, label, dot = false, size = 'sm' }: StatusBadgeProps) {
  const base = variantMap[variant] ?? variantMap.neutral;
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-600 ${sizeClass} ${base} whitespace-nowrap`}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
      )}
      {label}
    </span>
  );
}