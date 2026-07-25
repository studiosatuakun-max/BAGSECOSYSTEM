'use client';

import React, { useState, useMemo } from 'react';
import { trucks, Truck, MaintenanceStatus } from '@/data/mockData';
import StatusBadge, { BadgeVariant } from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { Search, Filter, Wrench, AlertTriangle, CheckCircle, ChevronUp, ChevronDown, Calendar, Edit2, Download } from 'lucide-react';
import { toast } from 'sonner';

function maintenanceVariant(status: MaintenanceStatus): BadgeVariant {
  switch (status) {
    case 'Overdue': return 'overdue';
    case 'Due Soon': return 'due-soon';
    case 'OK': return 'operational';
    default: return 'neutral';
  }
}

function truckStatusVariant(status: Truck['truckStatus']): BadgeVariant {
  switch (status) {
    case 'Operational': return 'operational';
    case 'Maintenance Due': return 'warning';
    case 'In Service': return 'info';
    case 'Decommissioned': return 'suspended';
    default: return 'neutral';
  }
}

function getKmUsed(truck: Truck): number {
  return truck.currentMileage - truck.lastServiceMileage;
}

function getPct(truck: Truck): number {
  return Math.min(Math.round((getKmUsed(truck) / truck.serviceIntervalKm) * 100), 100);
}

function getKmLeft(truck: Truck): number {
  return truck.serviceIntervalKm - getKmUsed(truck);
}

type SortKey = 'plate' | 'currentMileage' | 'maintenanceStatus' | 'atexInspectionExpiry';

export default function MaintenanceTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('maintenanceStatus');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const statusOptions = ['All', 'Overdue', 'Due Soon', 'OK'];

  const filtered = useMemo(() => {
    return trucks
      .filter((t) => {
        const matchSearch =
          t.plate.toLowerCase().includes(search.toLowerCase()) ||
          t.model.toLowerCase().includes(search.toLowerCase()) ||
          t.assignedDriver.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || t.maintenanceStatus === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (sortKey === 'maintenanceStatus') {
          const order: Record<MaintenanceStatus, number> = { Overdue: 0, 'Due Soon': 1, OK: 2 };
          const diff = order[a.maintenanceStatus] - order[b.maintenanceStatus];
          return sortDir === 'asc' ? diff : -diff;
        }
        if (sortKey === 'currentMileage') {
          return sortDir === 'asc'
            ? a.currentMileage - b.currentMileage
            : b.currentMileage - a.currentMileage;
        }
        return sortDir === 'asc'
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
  }, [search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
  }

  function isAtexExpiringSoon(expiry: string): boolean {
    const exp = new Date(expiry);
    const diff = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff < 60;
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by plate, model or assigned driver..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-muted-foreground" />
          {statusOptions.map((s) => (
            <button
              key={`maint-filter-${s}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`text-xs font-500 px-3 py-2 rounded-xl border transition-all duration-150 active:scale-95 ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40'
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => toast.success('Maintenance schedule exported to CSV')}
            className="flex items-center gap-2 text-xs font-500 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl px-3 py-2 transition-all duration-150 hover:shadow-card active:scale-95"
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
                  <button onClick={() => toggleSort('plate')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Truck <SortIcon col="plate" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Model</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Assigned Driver</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('currentMileage')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Current km <SortIcon col="currentMileage" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Mileage to Service</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Last Service</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Next Service Type</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('maintenanceStatus')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Maint. Status <SortIcon col="maintenanceStatus" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('atexInspectionExpiry')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    ATEX Inspection <SortIcon col="atexInspectionExpiry" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Truck Status</th>
                <th className="px-4 py-3 text-right text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((truck, i) => {
                const pct = getPct(truck);
                const kmLeft = getKmLeft(truck);
                const isOverdue = truck.maintenanceStatus === 'Overdue';
                const isDueSoon = truck.maintenanceStatus === 'Due Soon';
                const atexExpiring = isAtexExpiringSoon(truck.atexInspectionExpiry);

                return (
                  <tr
                    key={truck.id}
                    className={`border-b border-border hover:bg-muted/40 transition-colors duration-100 group ${
                      i % 2 !== 0 ? 'bg-slate-50/40' : ''
                    } ${isOverdue ? 'bg-red-50/30 hover:bg-red-50/50' : ''} ${isDueSoon && !isOverdue ? 'bg-amber-50/20' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isOverdue ? (
                          <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                        ) : isDueSoon ? (
                          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        )}
                        <span className="font-700 text-foreground tabular-nums">{truck.plate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{truck.model}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[9px] font-700 text-primary">
                            {truck.assignedDriver.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-foreground">{truck.assignedDriver}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums font-600 text-foreground text-sm">
                      {truck.currentMileage.toLocaleString()} km
                    </td>
                    <td className="px-4 py-3 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-600 tabular-nums whitespace-nowrap ${
                          pct >= 100 ? 'text-red-700' : pct >= 80 ? 'text-amber-700' : 'text-green-700'
                        }`}>
                          {kmLeft > 0 ? `${kmLeft.toLocaleString()} km` : `+${Math.abs(kmLeft).toLocaleString()} over`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">{truck.lastServiceDate}</td>
                    <td className="px-4 py-3 text-xs text-foreground max-w-[160px]">
                      <div className="flex items-center gap-1.5">
                        <Wrench size={11} className="text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{truck.nextServiceType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={maintenanceVariant(truck.maintenanceStatus)} label={truck.maintenanceStatus} dot />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className={atexExpiring ? 'text-amber-500' : 'text-muted-foreground'} />
                          <span className={`text-xs font-500 tabular-nums ${atexExpiring ? 'text-amber-700 font-600' : 'text-muted-foreground'}`}>
                            {truck.atexInspectionExpiry}
                          </span>
                        </div>
                        {atexExpiring && (
                          <span className="text-[10px] text-amber-600 font-600">Expiring soon</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={truckStatusVariant(truck.truckStatus)} label={truck.truckStatus} dot />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <div className="relative group/btn">
                          <button
                            onClick={() => setSelectedTruck(truck)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-muted-foreground transition-colors duration-150"
                            aria-label={`View ${truck.plate} details`}
                          >
                            <Wrench size={14} />
                          </button>
                          <div className="absolute bottom-full right-0 mb-1 bg-foreground text-primary-foreground text-[10px] font-500 px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                            View details
                          </div>
                        </div>
                        <div className="relative group/btn">
                          <button
                            onClick={() => toast.success(`Service scheduled for ${truck.plate}`)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors duration-150"
                            aria-label={`Schedule service for ${truck.plate}`}
                          >
                            <Edit2 size={14} />
                          </button>
                          <div className="absolute bottom-full right-0 mb-1 bg-foreground text-primary-foreground text-[10px] font-500 px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                            Schedule service
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/40">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} vehicles
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
                key={`mpage-${i + 1}`}
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

      {/* Truck Detail Modal */}
      <Modal
        open={!!selectedTruck}
        onClose={() => setSelectedTruck(null)}
        title={selectedTruck ? `Vehicle Record — ${selectedTruck.plate}` : ''}
        size="lg"
      >
        {selectedTruck && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Wrench size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-700 text-foreground">{selectedTruck.plate}</h3>
                <p className="text-sm text-muted-foreground">{selectedTruck.model} — {selectedTruck.year}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge variant={maintenanceVariant(selectedTruck.maintenanceStatus)} label={selectedTruck.maintenanceStatus} dot size="md" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Assigned Driver', value: selectedTruck.assignedDriver },
                { label: 'Current Mileage', value: `${selectedTruck.currentMileage.toLocaleString()} km` },
                { label: 'Last Service Mileage', value: `${selectedTruck.lastServiceMileage.toLocaleString()} km` },
                { label: 'Service Interval', value: `Every ${selectedTruck.serviceIntervalKm.toLocaleString()} km` },
                { label: 'Last Service Date', value: selectedTruck.lastServiceDate },
                { label: 'Next Service Type', value: selectedTruck.nextServiceType },
                { label: 'ATEX Inspection Expiry', value: selectedTruck.atexInspectionExpiry },
                { label: 'Truck Status', value: selectedTruck.truckStatus },
              ].map((field) => (
                <div key={`tfield-${field.label}`}>
                  <p className="text-[11px] font-600 uppercase tracking-wider text-muted-foreground mb-1">{field.label}</p>
                  <p className="font-500 text-foreground">{field.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-600 uppercase tracking-wider text-muted-foreground mb-2">Mileage Progress to Next Service</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      getPct(selectedTruck) >= 100 ? 'bg-red-500' : getPct(selectedTruck) >= 80 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${getPct(selectedTruck)}%` }}
                  />
                </div>
                <span className="text-sm font-700 tabular-nums text-foreground w-12 text-right">
                  {getPct(selectedTruck)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {getKmUsed(selectedTruck).toLocaleString()} km used of {selectedTruck.serviceIntervalKm.toLocaleString()} km interval
              </p>
            </div>
            <div className="flex gap-3 pt-2 border-t border-border">
              <button
                onClick={() => { toast.success(`Service booked for ${selectedTruck.plate}`); setSelectedTruck(null); }}
                className="flex-1 bg-primary text-primary-foreground text-sm font-600 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95"
              >
                Schedule Service
              </button>
              <button
                onClick={() => setSelectedTruck(null)}
                className="flex-1 bg-muted text-foreground text-sm font-500 py-2.5 rounded-xl hover:bg-muted/80 transition-all duration-150 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}