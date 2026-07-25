'use client';

import React from 'react';
import Link from 'next/link';
import { leaveRequests } from '@/lib/mockData';

import { CalendarDays, ArrowRight, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const pending = leaveRequests.filter((l) => l.status === 'Pending').slice(0, 5);

export default function LeaveRequestsList() {
  const handleApprove = (name: string) => {
    toast.success(`Leave approved for ${name}`);
  };
  const handleReject = (name: string) => {
    toast.error(`Leave rejected for ${name}`);
  };

  return (
    <div className="card-elevated rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <CalendarDays size={16} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-600 text-foreground">Leave Requests</h3>
            <p className="text-[10px] text-muted-foreground">
              <span className="font-600 text-amber-600">{pending.length} pending</span> approval
            </p>
          </div>
        </div>
        <Link
          href="/leave-management"
          className="flex items-center gap-1 text-xs font-500 text-primary hover:text-primary/80 transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {pending.map((req) => (
          <div
            key={`leave-list-${req.id}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100 hover:bg-amber-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-700 text-primary">
                {req.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-foreground truncate">{req.employeeName}</p>
              <p className="text-[10px] text-muted-foreground">
                {req.leaveType} · {req.durationDays}d · {req.fromDate}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleApprove(req.employeeName)}
                className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-all duration-150 active:scale-95"
                title={`Approve leave for ${req.employeeName}`}
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => handleReject(req.employeeName)}
                className="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 flex items-center justify-center text-rose-700 transition-all duration-150 active:scale-95"
                title={`Reject leave for ${req.employeeName}`}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}