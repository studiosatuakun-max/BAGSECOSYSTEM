import React from 'react';

type BadgeVariant = 'nominal' | 'warning' | 'critical' | 'paid' | 'unpaid' | 'overdue' | 'pending' | 'approved' | 'dispatched' | 'info';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

const variantMap: Record<BadgeVariant, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  nominal:    { bg: 'bg-success-bg', text: 'text-success-foreground', dot: 'bg-success', defaultLabel: 'Nominal' },
  warning:    { bg: 'bg-warning-bg', text: 'text-warning-foreground', dot: 'bg-warning', defaultLabel: 'Warning' },
  critical:   { bg: 'bg-danger-bg',  text: 'text-danger-foreground',  dot: 'bg-danger',  defaultLabel: 'Critical' },
  paid:       { bg: 'bg-success-bg', text: 'text-success-foreground', dot: 'bg-success', defaultLabel: 'Paid' },
  unpaid:     { bg: 'bg-warning-bg', text: 'text-warning-foreground', dot: 'bg-warning', defaultLabel: 'Unpaid' },
  overdue:    { bg: 'bg-danger-bg',  text: 'text-danger-foreground',  dot: 'bg-danger',  defaultLabel: 'Overdue' },
  pending:    { bg: 'bg-info-bg',    text: 'text-info-foreground',    dot: 'bg-info',    defaultLabel: 'Pending' },
  approved:   { bg: 'bg-success-bg', text: 'text-success-foreground', dot: 'bg-success', defaultLabel: 'Approved' },
  dispatched: { bg: 'bg-info-bg',    text: 'text-info-foreground',    dot: 'bg-info',    defaultLabel: 'Dispatched' },
  info:       { bg: 'bg-info-bg',    text: 'text-info-foreground',    dot: 'bg-info',    defaultLabel: 'Info' },
};

export default function StatusBadge({ variant, label, size = 'md' }: StatusBadgeProps) {
  const v = variantMap[variant];
  const sizeClasses = size === 'sm' ?'text-[11px] px-2 py-0.5 gap-1' :'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${v.bg} ${v.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot} flex-shrink-0`} />
      {label ?? v.defaultLabel}
    </span>
  );
}