import React from 'react';
import { leaveRequests } from '@/lib/mockData';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function LeaveSummaryCards() {
  const total = leaveRequests?.length;
  const pending = leaveRequests?.filter((l) => l?.status === 'Pending')?.length;
  const approved = leaveRequests?.filter((l) => l?.status === 'Approved')?.length;
  const rejected = leaveRequests?.filter((l) => l?.status === 'Rejected')?.length;

  const cards = [
    { id: 'lsc-total', label: 'Total Requests', value: total, icon: FileText, color: 'text-primary', bg: 'bg-secondary' },
    { id: 'lsc-pending', label: 'Pending Approval', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', alert: true },
    { id: 'lsc-approved', label: 'Approved This Month', value: approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'lsc-rejected', label: 'Rejected', value: rejected, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards?.map((c) => (
        <div key={c?.id} className={`card-elevated rounded-2xl p-5 ${c?.alert ? 'border-amber-200 bg-amber-50/30' : ''}`}>
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