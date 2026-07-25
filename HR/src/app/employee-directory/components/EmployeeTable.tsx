'use client';

import React, { useState, useMemo } from 'react';
import { employees, DEPARTMENTS } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { Search, Filter, ChevronUp, ChevronDown, Eye, Pencil, UserMinus, Download, Users, ChevronLeft, ChevronRight, X, Mail,  } from 'lucide-react';
import { toast } from 'sonner';

type SortField = 'name' | 'department' | 'role' | 'startDate';
type SortDir = 'asc' | 'desc';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function EmployeeTable() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    return employees
      .filter((e) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q);
        const matchDept = deptFilter === 'All' || e.department === deptFilter;
        const matchStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchSearch && matchDept && matchStatus;
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        return a[sortField] > b[sortField] ? dir : -dir;
      });
  }, [search, deptFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const allSelected = paginated.length > 0 && paginated.every((e) => selectedIds.has(e.id));
  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selectedIds);
      paginated.forEach((e) => next.delete(e.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginated.forEach((e) => next.add(e.id));
      setSelectedIds(next);
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-muted-foreground/40" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div className="card-elevated rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 flex-1 min-w-48">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by name, ID, role, or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="text-sm bg-muted border-none rounded-xl px-3 py-2 text-foreground outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={`dept-opt-${d}`} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm bg-muted border-none rounded-xl px-3 py-2 text-foreground outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={() => toast.success('Employee data exported as CSV')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-500 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
        >
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="px-5 py-3 bg-secondary border-b border-border flex items-center gap-3 fade-in">
          <span className="text-sm font-600 text-primary">{selectedIds.size} selected</span>
          <button
            onClick={() => { toast.success(`Email sent to ${selectedIds.size} employees`); setSelectedIds(new Set()); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-150"
          >
            <Mail size={12} /> Send Email
          </button>
          <button
            onClick={() => { toast.error(`${selectedIds.size} employees deactivated`); setSelectedIds(new Set()); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all duration-150"
          >
            <UserMinus size={12} /> Deactivate
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded accent-primary cursor-pointer"
                  aria-label="Select all employees on this page"
                />
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Employee ID
              </th>
              <th
                className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">Name <SortIcon field="name" /></div>
              </th>
              <th
                className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center gap-1">Department <SortIcon field="department" /></div>
              </th>
              <th
                className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-1">Role <SortIcon field="role" /></div>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th
                className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center gap-1">Start Date <SortIcon field="startDate" /></div>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">
                Manager
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-600 uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <EmptyState
                    icon={Users}
                    title="No employees found"
                    description="Try adjusting your search query or filters to find the employees you're looking for."
                  />
                </td>
              </tr>
            ) : (
              paginated.map((emp, idx) => (
                <tr
                  key={emp.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${
                    selectedIds.has(emp.id) ? 'bg-secondary/40' : idx % 2 === 1 ? 'bg-muted/20' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(emp.id)}
                      onChange={() => toggleRow(emp.id)}
                      className="rounded accent-primary cursor-pointer"
                      aria-label={`Select ${emp.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-600 text-muted-foreground font-mono">{emp.employeeId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-700 text-primary">{emp.avatarInitials}</span>
                      </div>
                      <div>
                        <p className="font-600 text-foreground whitespace-nowrap">{emp.name}</p>
                        <p className="text-[10px] text-muted-foreground">{emp.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">{emp.department}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap max-w-[160px] truncate" title={emp.role}>{emp.role}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(emp.startDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">{emp.manager}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{emp.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title={`View ${emp.name}'s profile`}
                        onClick={() => toast.info(`Opening ${emp.name}'s profile`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-150"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        title={`Edit ${emp.name}'s details`}
                        onClick={() => toast.info(`Editing ${emp.name}`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-150"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        title={`Deactivate ${emp.name} — this will revoke system access`}
                        onClick={() => toast.error(`Deactivated ${emp.name}`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-all duration-150"
                      >
                        <UserMinus size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            className="bg-muted rounded-lg px-2 py-1 text-foreground outline-none cursor-pointer"
          >
            {ROWS_PER_PAGE_OPTIONS.map((n) => (
              <option key={`rpp-${n}`} value={n}>{n}</option>
            ))}
          </select>
          <span>
            {filtered.length === 0 ? '0' : `${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, filtered.length)}`} of {filtered.length} employees
          </span>
        </div>

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
              key={`page-${p}`}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-500 transition-all duration-150 ${
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
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
  );
}