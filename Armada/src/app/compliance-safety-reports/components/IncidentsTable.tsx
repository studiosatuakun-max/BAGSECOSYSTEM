'use client';

import React, { useState, useMemo } from 'react';
import { complianceIncidents, ComplianceIncident, Severity } from '@/data/mockData';
import StatusBadge, { BadgeVariant } from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { Search, Filter, Eye, ChevronUp, ChevronDown, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

function severityVariant(severity: Severity): BadgeVariant {
  switch (severity) {
    case 'Critical': return 'violation';
    case 'High': return 'violation';
    case 'Medium': return 'warning';
    case 'Low': return 'info';
    default: return 'neutral';
  }
}

function resolutionVariant(status: ComplianceIncident['resolutionStatus']): BadgeVariant {
  switch (status) {
    case 'Resolved': return 'safe';
    case 'Under Review': return 'warning';
    case 'Escalated': return 'violation';
    case 'Open': return 'info';
    default: return 'neutral';
  }
}

const severityOrder: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function IncidentsTable() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [resolutionFilter, setResolutionFilter] = useState('All');
  const [sortKey, setSortKey] = useState<keyof ComplianceIncident>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedIncident, setSelectedIncident] = useState<ComplianceIncident | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const resolutionOptions = ['All', 'Open', 'Under Review', 'Escalated', 'Resolved'];

  const filtered = useMemo(() => {
    return complianceIncidents
      .filter((inc) => {
        const matchSearch =
          inc.driverName.toLowerCase().includes(search.toLowerCase()) ||
          inc.violationType.toLowerCase().includes(search.toLowerCase()) ||
          inc.location.toLowerCase().includes(search.toLowerCase()) ||
          inc.id.toLowerCase().includes(search.toLowerCase());
        const matchSeverity = severityFilter === 'All' || inc.severity === severityFilter;
        const matchResolution = resolutionFilter === 'All' || inc.resolutionStatus === resolutionFilter;
        return matchSearch && matchSeverity && matchResolution;
      })
      .sort((a, b) => {
        if (sortKey === 'severity') {
          const diff = severityOrder[a.severity as Severity] - severityOrder[b.severity as Severity];
          return sortDir === 'asc' ? diff : -diff;
        }
        const av = a[sortKey];
        const bv = b[sortKey];
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
  }, [search, severityFilter, resolutionFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: keyof ComplianceIncident) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ col }: { col: keyof ComplianceIncident }) {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by driver, violation type, location or incident ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {severityOptions.map((s) => (
              <button
                key={`sev-${s}`}
                onClick={() => { setSeverityFilter(s); setPage(1); }}
                className={`text-xs font-500 px-2.5 py-1.5 rounded-xl border transition-all duration-150 active:scale-95 ${
                  severityFilter === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex gap-1 flex-wrap">
            {resolutionOptions.map((r) => (
              <button
                key={`res-${r}`}
                onClick={() => { setResolutionFilter(r); setPage(1); }}
                className={`text-xs font-500 px-2.5 py-1.5 rounded-xl border transition-all duration-150 active:scale-95 ${
                  resolutionFilter === r
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => toast.success('Incidents report exported to CSV')}
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
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-slate-50/60">
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort('id')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    ID <SortIcon col="id" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort('driverName')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Driver <SortIcon col="driverName" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Truck</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort('violationType')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Violation Type <SortIcon col="violationType" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">ATEX Zone</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Date/Time <SortIcon col="date" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Severity <SortIcon col="severity" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Resolution</th>
                <th className="px-4 py-3 text-right text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-muted-foreground text-sm">
                    No incidents match your current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((inc, i) => (
                  <tr
                    key={inc.id}
                    className={`border-b border-border hover:bg-muted/40 transition-colors duration-100 group ${
                      i % 2 !== 0 ? 'bg-slate-50/40' : ''
                    } ${inc.severity === 'Critical' ? 'bg-red-50/40 hover:bg-red-50/60' : ''} ${inc.resolutionStatus === 'Escalated' ? 'bg-red-50/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-600 tabular-nums text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                        {inc.id.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-700 text-primary">
                            {inc.driverName.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-500 text-foreground text-sm">{inc.driverName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-600 tabular-nums text-foreground text-sm">{inc.truckPlate}</td>
                    <td className="px-4 py-3 text-sm text-foreground max-w-[160px] truncate">{inc.violationType}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{inc.location}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${
                        inc.atexZone.includes('Zone 1') ? 'bg-red-50 text-red-700 border border-red-200' :
                        inc.atexZone.includes('Zone 2') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {inc.atexZone}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                      <div>
                        <span className="font-500 text-foreground">{inc.date}</span>
                        <span className="ml-1">{inc.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {(inc.severity === 'Critical' || inc.severity === 'High') && (
                          <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
                        )}
                        <StatusBadge variant={severityVariant(inc.severity)} label={inc.severity} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={resolutionVariant(inc.resolutionStatus)} label={inc.resolutionStatus} dot />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <div className="relative group/btn">
                          <button
                            onClick={() => setSelectedIncident(inc)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-muted-foreground transition-colors duration-150"
                            aria-label={`View incident ${inc.id}`}
                          >
                            <Eye size={14} />
                          </button>
                          <div className="absolute bottom-full right-0 mb-1 bg-foreground text-primary-foreground text-[10px] font-500 px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                            View incident
                          </div>
                        </div>
                      </div>
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
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} incidents
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
                key={`ipage-${i + 1}`}
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

      {/* Incident Detail Modal */}
      <Modal
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident ? `Incident Report — ${selectedIncident.id.toUpperCase()}` : ''}
        size="lg"
      >
        {selectedIncident && (
          <div className="space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground font-500 mb-1">{selectedIncident.date} at {selectedIncident.time}</p>
                <h3 className="text-base font-700 text-foreground">{selectedIncident.violationType}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selectedIncident.location}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge variant={severityVariant(selectedIncident.severity)} label={selectedIncident.severity} size="md" />
                <StatusBadge variant={resolutionVariant(selectedIncident.resolutionStatus)} label={selectedIncident.resolutionStatus} dot size="md" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Driver', value: selectedIncident.driverName },
                { label: 'Truck Plate', value: selectedIncident.truckPlate },
                { label: 'ATEX Zone', value: selectedIncident.atexZone },
                { label: 'Violation Type', value: selectedIncident.violationType },
              ].map((field) => (
                <div key={`incfield-${field.label}`}>
                  <p className="text-[11px] font-600 uppercase tracking-wider text-muted-foreground mb-1">{field.label}</p>
                  <p className="font-500 text-foreground">{field.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-600 uppercase tracking-wider text-muted-foreground mb-2">Incident Notes</p>
              <p className="text-sm text-foreground bg-muted/50 rounded-xl p-3 leading-relaxed">{selectedIncident.notes}</p>
            </div>
            <div className="flex gap-3 pt-2 border-t border-border">
              <button
                onClick={() => { toast.success(`Incident ${selectedIncident.id.toUpperCase()} marked as resolved`); setSelectedIncident(null); }}
                className="flex-1 bg-green-600 text-white text-sm font-600 py-2.5 rounded-xl hover:bg-green-700 transition-all duration-150 active:scale-95"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => { toast.warning(`Incident ${selectedIncident.id.toUpperCase()} escalated`); setSelectedIncident(null); }}
                className="flex-1 bg-red-50 text-red-700 border border-red-200 text-sm font-600 py-2.5 rounded-xl hover:bg-red-100 transition-all duration-150 active:scale-95"
              >
                Escalate
              </button>
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-6 bg-muted text-foreground text-sm font-500 py-2.5 rounded-xl hover:bg-muted/80 transition-all duration-150 active:scale-95"
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