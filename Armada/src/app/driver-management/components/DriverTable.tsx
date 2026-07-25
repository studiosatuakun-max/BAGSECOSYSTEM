'use client';

import React, { useState, useMemo } from 'react';
import { drivers, Driver } from '@/data/mockData';
import StatusBadge, { BadgeVariant } from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { Search, Filter, Edit2, Eye, UserX, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { toast } from 'sonner';

function driverStatusVariant(status: Driver['status']): BadgeVariant {
  switch (status) {
    case 'Active': return 'active';
    case 'On Break': return 'warning';
    case 'Off Duty': return 'offduty';
    case 'Suspended': return 'suspended';
    default: return 'neutral';
  }
}

type SortKey = keyof Pick<Driver, 'name' | 'kpiScore' | 'totalDeliveries' | 'complianceIncidents' | 'status'>;

export default function DriverTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('kpiScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return drivers
      .filter((d) => {
        const matchSearch =
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.assignedTruck.toLowerCase().includes(search.toLowerCase()) ||
          d.licenseNo.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || d.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
  }, [search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  }

  const statusOptions = ['All', 'Active', 'On Break', 'Off Duty', 'Suspended'];

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by driver name, truck plate or license..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <div className="flex gap-1.5 flex-wrap">
            {statusOptions.map((s) => (
              <button
                key={`filter-${s}`}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`text-xs font-500 px-3 py-2 rounded-xl border transition-all duration-150 active:scale-95 ${
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => toast.success('Driver roster exported to CSV')}
            className="flex items-center gap-2 text-xs font-500 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl px-3 py-2 transition-all duration-150 hover:shadow-card active:scale-95 ml-2"
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-border bg-slate-50/60">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Driver <SortIcon col="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">ADR Class</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">License No.</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Truck</th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('status')}
                    className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Status <SortIcon col="status" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('kpiScore')}
                    className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    KPI Score <SortIcon col="kpiScore" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('totalDeliveries')}
                    className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Deliveries <SortIcon col="totalDeliveries" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('complianceIncidents')}
                    className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Incidents <SortIcon col="complianceIncidents" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">ATEX Cert.</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Last Active</th>
                <th className="px-4 py-3 text-right text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((driver, i) => (
                <tr
                  key={driver.id}
                  className={`border-b border-border hover:bg-muted/40 transition-colors duration-100 group ${
                    i % 2 !== 0 ? 'bg-slate-50/40' : ''
                  } ${driver.status === 'Suspended' ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          driver.status === 'Suspended' ? 'bg-red-100' : 'bg-primary/10'
                        }`}
                      >
                        <span className={`text-[11px] font-700 ${driver.status === 'Suspended' ? 'text-red-600' : 'text-primary'}`}>
                          {driver.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-600 text-foreground text-sm">{driver.name}</p>
                        <p className="text-[11px] text-muted-foreground">{driver.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-500 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      {driver.adrClass}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-500 tabular-nums">{driver.licenseNo}</td>
                  <td className="px-4 py-3 text-sm font-600 text-foreground tabular-nums">{driver.assignedTruck}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={driverStatusVariant(driver.status)} label={driver.status} dot />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            driver.kpiScore >= 90
                              ? 'bg-green-500'
                              : driver.kpiScore >= 75
                              ? 'bg-primary' :'bg-amber-500'
                          }`}
                          style={{ width: `${driver.kpiScore}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-700 tabular-nums ${
                          driver.kpiScore >= 90
                            ? 'text-green-700'
                            : driver.kpiScore >= 75
                            ? 'text-primary' :'text-amber-700'
                        }`}
                      >
                        {driver.kpiScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums font-500 text-foreground">{driver.totalDeliveries.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-700 tabular-nums ${
                        driver.complianceIncidents === 0
                          ? 'text-green-600'
                          : driver.complianceIncidents <= 3
                          ? 'text-amber-600' :'text-red-600'
                      }`}
                    >
                      {driver.complianceIncidents}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {driver.atexCertified ? (
                      <div>
                        <span className="text-[11px] font-600 text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Certified</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Exp: {driver.atexExpiry}</p>
                      </div>
                    ) : (
                      <span className="text-[11px] font-600 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Expired</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{driver.lastActive}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <div className="relative group/btn">
                        <button
                          onClick={() => setSelectedDriver(driver)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-muted-foreground transition-colors duration-150"
                          aria-label={`View ${driver.name} profile`}
                        >
                          <Eye size={14} />
                        </button>
                        <div className="absolute bottom-full right-0 mb-1 bg-foreground text-primary-foreground text-[10px] font-500 px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                          View profile
                        </div>
                      </div>
                      <div className="relative group/btn">
                        <button
                          onClick={() => toast.success(`Editing ${driver.name}`)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors duration-150"
                          aria-label={`Edit ${driver.name}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <div className="absolute bottom-full right-0 mb-1 bg-foreground text-primary-foreground text-[10px] font-500 px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                          Edit driver
                        </div>
                      </div>
                      <div className="relative group/btn">
                        <button
                          onClick={() => toast.error(`${driver.name} flagged for review`)}
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-muted-foreground transition-colors duration-150"
                          aria-label={`Suspend ${driver.name}`}
                        >
                          <UserX size={14} />
                        </button>
                        <div className="absolute bottom-full right-0 mb-1 bg-foreground text-primary-foreground text-[10px] font-500 px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                          Flag for review
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/40">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} drivers
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-500 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 text-xs font-600 rounded-lg transition-all duration-150 ${
                  page === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-500 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Driver Detail Modal */}
      <Modal
        open={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title={selectedDriver ? `Driver Profile — ${selectedDriver.name}` : ''}
        size="lg"
      >
        {selectedDriver && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-700 text-primary">
                  {selectedDriver.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-700 text-foreground">{selectedDriver.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedDriver.adrClass} — {selectedDriver.licenseNo}</p>
                <StatusBadge variant={driverStatusVariant(selectedDriver.status)} label={selectedDriver.status} dot />
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-700 tabular-nums text-primary">{selectedDriver.kpiScore}%</p>
                <p className="text-xs text-muted-foreground">KPI Score</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Assigned Truck', value: selectedDriver.assignedTruck },
                { label: 'Phone', value: selectedDriver.phone },
                { label: 'Join Date', value: selectedDriver.joinDate },
                { label: 'Total Deliveries', value: selectedDriver.totalDeliveries.toLocaleString() },
                { label: 'Compliance Incidents', value: selectedDriver.complianceIncidents },
                { label: 'ATEX Certified', value: selectedDriver.atexCertified ? `Yes — expires ${selectedDriver.atexExpiry}` : 'Expired' },
                { label: 'Last Active', value: selectedDriver.lastActive },
              ].map((field) => (
                <div key={`field-${field.label}`}>
                  <p className="text-[11px] font-600 uppercase tracking-wider text-muted-foreground mb-1">{field.label}</p>
                  <p className="font-500 text-foreground">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}