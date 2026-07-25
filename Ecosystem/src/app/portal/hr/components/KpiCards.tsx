import React from 'react';
import { Users, UserCheck, ClipboardList, TrendingUp, AlertTriangle } from 'lucide-react';

const kpiData = [
  {
    id: 'kpi-headcount',
    label: 'Total Headcount',
    value: '201',
    sub: '+3 this month',
    trend: 'up',
    icon: Users,
    spanTwo: true,
    color: 'text-primary',
    bg: 'bg-secondary',
  },
  {
    id: 'kpi-attendance',
    label: 'Attendance Rate Today',
    value: '90.0%',
    sub: '181 of 201 present',
    trend: 'neutral',
    icon: UserCheck,
    spanTwo: false,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 'kpi-leave',
    label: 'Pending Leave Requests',
    value: '7',
    sub: 'Needs approval',
    trend: 'alert',
    icon: AlertTriangle,
    spanTwo: false,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    id: 'kpi-onboarding',
    label: 'Active Onboarding',
    value: '3',
    sub: '1 overdue task',
    trend: 'warn',
    icon: ClipboardList,
    spanTwo: false,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    id: 'kpi-performance',
    label: 'Avg Performance Score',
    value: '86.3',
    sub: '+2.1 vs last quarter',
    trend: 'up',
    icon: TrendingUp,
    spanTwo: false,
    color: 'text-primary',
    bg: 'bg-secondary',
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-6">
      {kpiData?.map((kpi, i) => (
        <div
          key={kpi?.id}
          className={`card-elevated p-5 rounded-2xl flex flex-col gap-3 ${kpi?.spanTwo ? 'col-span-2 md:col-span-1 xl:col-span-1' : ''} ${kpi?.trend === 'alert' ? 'border-amber-200 bg-amber-50/40' : ''} ${kpi?.trend === 'warn' ? 'border-rose-200 bg-rose-50/40' : ''}`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi?.bg}`}>
              <kpi.icon size={18} className={kpi?.color} />
            </div>
            {kpi?.trend === 'alert' && (
              <span className="text-[10px] font-600 text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">Action needed</span>
            )}
            {kpi?.trend === 'warn' && (
              <span className="text-[10px] font-600 text-rose-600 bg-rose-100 rounded-full px-2 py-0.5">Overdue</span>
            )}
          </div>
          <div>
            <p className="text-[11px] font-500 text-muted-foreground uppercase tracking-wide mb-1">{kpi?.label}</p>
            <p className={`text-3xl font-700 tabular-nums ${kpi?.color}`}>{kpi?.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi?.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}