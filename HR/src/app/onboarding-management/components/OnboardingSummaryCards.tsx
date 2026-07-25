import React from 'react';
import { onboardingEmployees } from '@/lib/mockData';
import { ClipboardList, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function OnboardingSummaryCards() {
  const inProgress = onboardingEmployees?.filter((o) => o?.status === 'In Progress')?.length;
  const completed = onboardingEmployees?.filter((o) => o?.status === 'Completed')?.length;
  const overdue = onboardingEmployees?.filter((o) => o?.status === 'Overdue')?.length;

  const cards = [
    { id: 'onb-card-progress', label: 'In Progress', value: inProgress, icon: ClipboardList, color: 'text-primary', bg: 'bg-secondary' },
    { id: 'onb-card-completed', label: 'Completed This Month', value: completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'onb-card-overdue', label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', alert: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards?.map((c) => (
        <div key={c?.id} className={`card-elevated rounded-2xl p-5 ${c?.alert ? 'border-rose-200 bg-rose-50/30' : ''}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c?.bg}`}>
            <c.icon size={18} className={c?.color} />
          </div>
          <p className="text-[11px] font-500 text-muted-foreground uppercase tracking-wide mb-1">{c?.label}</p>
          <p className={`text-3xl font-700 tabular-nums ${c?.color}`}>{c?.value}</p>
        </div>
      ))}
    </div>
  );
}