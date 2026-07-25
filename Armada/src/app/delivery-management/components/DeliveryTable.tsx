'use client';

import React, { useState, useMemo } from 'react';
import { allDeliveries, Delivery, ATEXStatus, DeliveryStatus } from '@/data/mockData';
import StatusBadge, { BadgeVariant } from '@/components/ui/StatusBadge';
import { Search, Filter, Download, ChevronUp, ChevronDown, Fuel } from 'lucide-react';
import { toast } from 'sonner';

function atexVariant(status: ATEXStatus): BadgeVariant {
  switch (status) {
    case 'Safe Zone Unloading': return 'safe';
    case 'ATEX Zone Cleared': return 'safe';
    case 'Geofence Violation': return 'violation';
    case 'Awaiting SOP Sign-off': return 'warning';
    case 'Pre-delivery Check Pending': return 'info';
    default: return 'neutral';
  }
}

function deliveryVariant(status: DeliveryStatus): BadgeVariant {
  switch (status) {
    case 'Completed': return 'completed';
    case 'En Route': return 'info';
    case 'Unloading': return 'in-progress';
    case 'Dispatched': return 'neutral';
    case 'Incident': return 'incident';
    default: return 'neutral';
  }
}

const productColors: Record<string, string> = {
  LPG: 'bg-orange-50 text-orange-700 border border-orange-200',
  CNG: 'bg-blue-50 text-blue-700 border border-blue-200',
  Diesel: 'bg-slate-100 text-slate-700 border border-slate-200',
  LNG: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
};

type TabKey = 'All' | 'Active' | 'Completed' | 'Incident';

export default function DeliveryTable() {
  const [tab, setTab] = useState<TabKey>('All');
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('All');
  const [sortKey, setSortKey] = useState<keyof Delivery>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const tabs: TabKey[] = ['All', 'Active', 'Completed', 'Incident'];
  const products = ['All', 'LPG', 'CNG', 'Diesel', 'LNG'];

  const filtered = useMemo(() => {
    return allDeliveries
      .filter((d) => {
        const matchTab =
          tab === 'All' ||
          (tab === 'Active' && ['En Route', 'Unloading', 'Dispatched'].includes(d.status)) ||
          (tab === 'Completed' && d.status === 'Completed') ||
          (tab === 'Incident' && d.status === 'Incident');
        const matchSearch =
          d.driverName.toLowerCase().includes(search.toLowerCase()) ||
          d.truckPlate.toLowerCase().includes(search.toLowerCase()) ||
          d.destination.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toLowerCase().includes(search.toLowerCase());
        const matchProduct = productFilter === 'All' || d.product === productFilter;
        return matchTab && matchSearch && matchProduct;
      })
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return sortDir === 'asc' ? String(av ??'').localeCompare(String(bv ?? ''))
          : String(bv ?? '').localeCompare(String(av ?? ''));
      });
  }, [tab, search, productFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: keyof Delivery) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ col }: { col: keyof Delivery }) {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
  }

  const tabCounts: Record<TabKey, number> = {
    All: allDeliveries.length,
    Active: allDeliveries.filter((d) => ['En Route', 'Unloading', 'Dispatched'].includes(d.status)).length,
    Completed: allDeliveries.filter((d) => d.status === 'Completed').length,
    Incident: allDeliveries.filter((d) => d.status === 'Incident').length,
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-muted p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={`tab-${t}`}
            onClick={() => { setTab(t); setPage(1); }}
            className={`flex items-center gap-2 text-sm font-500 px-4 py-2 rounded-lg transition-all duration-150 ${
              tab === t
                ? 'bg-card text-foreground shadow-card font-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
            <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full ${
              tab === t ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'
            }`}>
              {tabCounts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by driver, truck plate, destination or delivery ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-muted-foreground" />
          {products.map((p) => (
            <button
              key={`prod-${p}`}
              onClick={() => { setProductFilter(p); setPage(1); }}
              className={`text-xs font-500 px-3 py-2 rounded-xl border transition-all duration-150 active:scale-95 ${
                productFilter === p
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => toast.success('Delivery log exported to CSV')}
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
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="border-b border-border bg-slate-50/60">
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('id')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    ID <SortIcon col="id" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('driverName')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Driver <SortIcon col="driverName" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Truck</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Origin</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('destination')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Destination <SortIcon col="destination" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort('volumeLiters')} className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Volume (L) <SortIcon col="volumeLiters" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Sched. ETA</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Actual Arrival</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">ATEX Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-muted-foreground text-sm">
                    No deliveries match your current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((delivery, i) => (
                  <tr
                    key={delivery.id}
                    className={`border-b border-border hover:bg-muted/40 transition-colors duration-100 ${
                      i % 2 !== 0 ? 'bg-slate-50/40' : ''
                    } ${delivery.status === 'Incident' ? 'bg-red-50/30 hover:bg-red-50/50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-600 tabular-nums text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                        {delivery.id.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-700 text-primary">
                            {delivery.driverName.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-500 text-foreground text-sm">{delivery.driverName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-600 text-foreground tabular-nums text-sm">{delivery.truckPlate}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{delivery.origin}</td>
                    <td className="px-4 py-3 text-sm text-foreground max-w-[160px] truncate">{delivery.destination}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full text-[11px] font-600 px-2 py-0.5 ${productColors[delivery.product]}`}>
                        <Fuel size={10} />
                        {delivery.product}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums font-500 text-foreground text-sm">
                      {delivery.volumeLiters.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-sm text-foreground font-500">{delivery.scheduledETA}</td>
                    <td className="px-4 py-3 tabular-nums text-sm">
                      {delivery.actualArrival ? (
                        <span className="text-green-700 font-600">{delivery.actualArrival}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={atexVariant(delivery.atexStatus)} label={delivery.atexStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={deliveryVariant(delivery.status)} label={delivery.status} dot />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/40">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} deliveries
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
                key={`dpage-${i + 1}`}
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
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs font-500 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}