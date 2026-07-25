'use client';

import React, { useState, useMemo } from 'react';
import { leaveRequests, DEPARTMENTS } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import { Search, ChevronLeft, ChevronRight, Check, X, Eye, CalendarDays,  } from 'lucide-react';
import { toast } from 'sonner';

const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Emergency Leave'];

export default function LeaveTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<typeof leaveRequests[0] | null>(null);
  // Backend integration point: replace with API call to fetch/update leave requests
  const [localRequests, setLocalRequests] = useState(leaveRequests);

  const rowsPerPage = 8;

  const filtered = useMemo(() => {
    return localRequests.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.employeeName.toLowerCase().includes(q) || l.employeeId.toLowerCase().includes(q);
      const matchType = typeFilter === 'All' || l.leaveType === typeFilter;
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      const matchDept = deptFilter === 'All' || l.department === deptFilter;
      return matchSearch && matchType && matchStatus && matchDept;
    });
  }, [localRequests, search, typeFilter, statusFilter, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleApprove = (id: string, name: string) => {
    setLocalRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'Approved' as const } : r));
    toast.success(`Leave approved for ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    setLocalRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'Rejected' as const } : r));
    toast.error(`Leave rejected for ${name}`);
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[parseInt(m) - 1]} ${y}`;
  };

  const leaveTypeBadgeColor: Record<string, string> = {
    'Annual Leave': 'bg-blue-50 text-blue-700',
    'Sick Leave': 'bg-rose-50 text-rose-700',
    'Maternity Leave': 'bg-purple-50 text-purple-700',
    'Paternity Leave': 'bg-indigo-50 text-indigo-700',
    'Emergency Leave': 'bg-orange-50 text-orange-700',
  };

  return (
    <>
      <div className="card-elevated rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="text-sm bg-muted border-none rounded-xl px-3 py-2 text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Leave Types</option>
              {LEAVE_TYPES.map((t) => (
                <option key={`lt-opt-${t}`} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm bg-muted border-none rounded-xl px-3 py-2 text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
              className="text-sm bg-muted border-none rounded-xl px-3 py-2 text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={`dept-leave-${d}`} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Employee</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Leave Type</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">From</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">To</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Duration</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Reason</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={CalendarDays}
                      title="No leave requests found"
                      description="No requests match your current filters. Try adjusting the search or filter criteria."
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((req, idx) => (
                  <tr
                    key={req.id}
                    className={`border-b border-border last:border-0 transition-colors group ${
                      req.status === 'Pending' ?'bg-amber-50/30 hover:bg-amber-50/60'
                        : idx % 2 === 1
                        ? 'bg-muted/20 hover:bg-muted/40' :'hover:bg-muted/30'
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-700 text-primary">
                            {req.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-600 text-foreground whitespace-nowrap">{req.employeeName}</p>
                          <p className="text-[10px] text-muted-foreground">{req.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-600 rounded-lg px-2 py-1 whitespace-nowrap ${leaveTypeBadgeColor[req.leaveType] ?? 'bg-muted text-muted-foreground'}`}>
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(req.fromDate)}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(req.toDate)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-600 text-foreground tabular-nums">{req.durationDays}d</span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-xs text-muted-foreground truncate" title={req.reason}>{req.reason}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedLeave(req); setDetailOpen(true); }}
                          title="View leave request details"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-150"
                        >
                          <Eye size={13} />
                        </button>
                        {req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id, req.employeeName)}
                              title={`Approve leave for ${req.employeeName}`}
                              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-700 transition-all duration-150 active:scale-95"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => handleReject(req.id, req.employeeName)}
                              title={`Reject leave for ${req.employeeName} — employee will be notified`}
                              className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600 transition-all duration-150 active:scale-95"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {filtered.length === 0 ? '0' : `${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, filtered.length)}`} of {filtered.length} requests
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={`leave-page-${p}`}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-500 transition-all duration-150 ${
                  p === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Leave Request Details"
        size="md"
      >
        {selectedLeave && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-700 text-primary">
                  {selectedLeave.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-600 text-foreground">{selectedLeave.employeeName}</p>
                <p className="text-xs text-muted-foreground">{selectedLeave.department} · {selectedLeave.employeeId}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selectedLeave.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Leave Type', value: selectedLeave.leaveType },
                { label: 'Duration', value: `${selectedLeave.durationDays} working days` },
                { label: 'From', value: formatDate(selectedLeave.fromDate) },
                { label: 'To', value: formatDate(selectedLeave.toDate) },
                { label: 'Applied On', value: formatDate(selectedLeave.appliedOn) },
              ].map((row) => (
                <div key={`detail-${row.label}`} className="bg-muted/60 rounded-xl p-3">
                  <p className="text-[10px] font-500 text-muted-foreground uppercase tracking-wide mb-1">{row.label}</p>
                  <p className="text-sm font-600 text-foreground">{row.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-muted/60 rounded-xl p-3">
              <p className="text-[10px] font-500 text-muted-foreground uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm text-foreground">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.status === 'Pending' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { handleApprove(selectedLeave.id, selectedLeave.employeeName); setDetailOpen(false); }}
                  className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-600 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all duration-150"
                >
                  Approve Leave
                </button>
                <button
                  onClick={() => { handleReject(selectedLeave.id, selectedLeave.employeeName); setDetailOpen(false); }}
                  className="flex-1 py-2.5 bg-rose-50 text-rose-700 text-sm font-600 rounded-xl hover:bg-rose-100 active:scale-95 transition-all duration-150"
                >
                  Reject Leave
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}