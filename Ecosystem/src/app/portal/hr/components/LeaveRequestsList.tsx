'use client';

import React, { useState } from 'react';
import { CalendarDays, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const initialLeaveRequests = [
  {
    id: 'LR-001',
    employeeName: 'Ahmad Fauzi',
    role: 'Skid Driver (B 9120 VGL)',
    leaveType: 'Cuti Tahunan',
    durationDays: 3,
    fromDate: '28 Jul 2026',
    status: 'Pending',
    atexCovered: true,
  },
  {
    id: 'LR-002',
    employeeName: 'Ir. Hendromartono',
    role: 'Chief PRMS Engineer',
    leaveType: 'Cuti Alasan Penting',
    durationDays: 2,
    fromDate: '30 Jul 2026',
    status: 'Pending',
    atexCovered: true,
  },
  {
    id: 'LR-003',
    employeeName: 'Siti Nurhaliza',
    role: 'B2B Sales Executive',
    leaveType: 'Cuti Sakit / Medical',
    durationDays: 1,
    fromDate: '26 Jul 2026',
    status: 'Pending',
    atexCovered: true,
  },
  {
    id: 'LR-004',
    employeeName: 'Bambang Pamungkas',
    role: 'SIO ATEX Operator Shift 2',
    leaveType: 'Cuti Tahunan',
    durationDays: 4,
    fromDate: '02 Aug 2026',
    status: 'Pending',
    atexCovered: false,
  },
];

export default function LeaveRequestsList() {
  const [requests, setRequests] = useState(initialLeaveRequests);

  const handleApprove = (id: string, name: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    toast.success(`Cuti disetujui untuk ${name} (Jadwal pengganti aktif)`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    toast.error(`Pengajuan cuti ${name} dikembalikan untuk penyesuaian shift`);
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between h-full transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 font-bold">
              <CalendarDays size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Pending Leave &amp; Shift Requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-bold text-amber-600 dark:text-amber-400">{requests.length} pengajuan</span> memerlukan persetujuan manajerial
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Opening full Leave Management schedule matrix...')}
            className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {requests.length === 0 ? (
            <div className="py-10 text-center text-slate-400 dark:text-slate-500 font-medium text-xs">
              Semua pengajuan cuti dan rotasi shift telah diproses! 🎉
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                      {req.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {req.employeeName}
                      </p>
                      {!req.atexCovered && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <ShieldAlert size={10} />
                          <span>Need ATEX Backup</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                      {req.role}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      <span className="font-bold text-amber-600 dark:text-amber-400">{req.leaveType}</span> · {req.durationDays} hari (Mulai {req.fromDate})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleApprove(req.id, req.employeeName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs transition-all active:scale-95 shadow-2xs"
                    title={`Approve leave for ${req.employeeName}`}
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(req.id, req.employeeName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-extrabold text-xs transition-all active:scale-95 shadow-2xs"
                    title={`Reject leave for ${req.employeeName}`}
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
        <span>SLA approval maksimal 24 jam shift</span>
        <span className="text-purple-600 dark:text-purple-400 font-bold">Rotasi Shift Otomatis</span>
      </div>
    </div>
  );
}