'use client';
import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  MoreHorizontal,
  Star,
  Building2,
  Filter,
  Download,
} from 'lucide-react';

// Backend integration point: GET /api/clients/top?limit=12&sort=revenue
const clientsData = [
  {
    id: 'client-001',
    name: 'PT Sinar Mas Agro',
    industry: 'Agribusiness',
    revenue: 4850000000,
    revenueShare: 18.4,
    keyContact: 'Budi Hartono',
    contactTitle: 'Procurement Director',
    channel: 'Direct Sales',
    status: 'Active',
    tier: 'Platinum',
    lastActivity: '2026-07-18',
    campaigns: 3,
    trend: 'up',
  },
  {
    id: 'client-002',
    name: 'CV Hijau Subur Nusantara',
    industry: 'Landscaping',
    revenue: 3620000000,
    revenueShare: 13.7,
    keyContact: 'Dewi Rahayu',
    contactTitle: 'Operations Manager',
    channel: 'Referral',
    status: 'Active',
    tier: 'Gold',
    lastActivity: '2026-07-15',
    campaigns: 2,
    trend: 'up',
  },
  {
    id: 'client-003',
    name: 'PT Mitra Taman Indah',
    industry: 'Property Developer',
    revenue: 2980000000,
    revenueShare: 11.3,
    keyContact: 'Hendra Susanto',
    contactTitle: 'Estate Manager',
    channel: 'Email Campaign',
    status: 'Active',
    tier: 'Gold',
    lastActivity: '2026-07-10',
    campaigns: 1,
    trend: 'stable',
  },
  {
    id: 'client-004',
    name: 'Pemkot Surabaya - Dinas PU',
    industry: 'Government',
    revenue: 2540000000,
    revenueShare: 9.6,
    keyContact: 'Ir. Agus Wibowo',
    contactTitle: 'Kepala Seksi',
    channel: 'Tender',
    status: 'Active',
    tier: 'Gold',
    lastActivity: '2026-06-28',
    campaigns: 0,
    trend: 'stable',
  },
  {
    id: 'client-005',
    name: 'PT Astra Honda Motor',
    industry: 'Automotive',
    revenue: 1980000000,
    revenueShare: 7.5,
    keyContact: 'Siti Nurhaliza',
    contactTitle: 'Facility Manager',
    channel: 'Social Ads',
    status: 'At Risk',
    tier: 'Silver',
    lastActivity: '2026-06-12',
    campaigns: 1,
    trend: 'down',
  },
  {
    id: 'client-006',
    name: 'Perumahan Grand Wisata',
    industry: 'Real Estate',
    revenue: 1750000000,
    revenueShare: 6.6,
    keyContact: 'Reza Firmansyah',
    contactTitle: 'Project Manager',
    channel: 'Direct Sales',
    status: 'Active',
    tier: 'Silver',
    lastActivity: '2026-07-19',
    campaigns: 2,
    trend: 'up',
  },
  {
    id: 'client-007',
    name: 'PT Duta Pertiwi Tbk',
    industry: 'Property Developer',
    revenue: 1420000000,
    revenueShare: 5.4,
    keyContact: 'Yunita Prawira',
    contactTitle: 'Head of Procurement',
    channel: 'Referral',
    status: 'Active',
    tier: 'Silver',
    lastActivity: '2026-07-08',
    campaigns: 1,
    trend: 'stable',
  },
  {
    id: 'client-008',
    name: 'RS Pondok Indah Group',
    industry: 'Healthcare',
    revenue: 1180000000,
    revenueShare: 4.5,
    keyContact: 'Dr. Anton Wijaya',
    contactTitle: 'Facility Director',
    channel: 'Email Campaign',
    status: 'Inactive',
    tier: 'Bronze',
    lastActivity: '2026-05-22',
    campaigns: 0,
    trend: 'down',
  },
  {
    id: 'client-009',
    name: 'PT Telkom Indonesia',
    industry: 'Telecommunications',
    revenue: 980000000,
    revenueShare: 3.7,
    keyContact: 'Bayu Nugroho',
    contactTitle: 'Procurement Lead',
    channel: 'Social Ads',
    status: 'Active',
    tier: 'Bronze',
    lastActivity: '2026-07-14',
    campaigns: 1,
    trend: 'up',
  },
  {
    id: 'client-010',
    name: 'CV Taman Sejahtera',
    industry: 'Landscaping',
    revenue: 760000000,
    revenueShare: 2.9,
    keyContact: 'Nurul Hidayah',
    contactTitle: 'Owner',
    channel: 'Referral',
    status: 'Active',
    tier: 'Bronze',
    lastActivity: '2026-07-17',
    campaigns: 1,
    trend: 'stable',
  },
];

type SortKey = 'name' | 'revenue' | 'revenueShare' | 'lastActivity' | 'campaigns';
type SortDir = 'asc' | 'desc';

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  Active: { bg: '#DCFCE7', color: '#166534', label: 'Active' },
  'At Risk': { bg: '#FEF3C7', color: '#92400E', label: 'At Risk' },
  Inactive: { bg: '#FEE2E2', color: '#991B1B', label: 'Inactive' },
};

const tierConfig: Record<string, { bg: string; color: string }> = {
  Platinum: { bg: '#EDE9FE', color: '#5B21B6' },
  Gold: { bg: '#FEF3C7', color: '#92400E' },
  Silver: { bg: '#F1F5F9', color: '#475569' },
  Bronze: { bg: '#FFF7ED', color: '#9A3412' },
};

const trendConfig: Record<string, { icon: string; color: string }> = {
  up: { icon: '↑', color: '#16A34A' },
  down: { icon: '↓', color: '#DC2626' },
  stable: { icon: '→', color: '#64748B' },
};

function formatRevenue(v: number) {
  if (v >= 1000000000) return `Rp ${(v / 1000000000).toFixed(2)}M`;
  return `Rp ${(v / 1000000).toFixed(0)}Jt`;
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default function TopClientsTableClient() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 7;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let data = [...clientsData];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.keyContact.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') {
      data = data.filter((c) => c.status === statusFilter);
    }
    data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp =
        typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [search, sortKey, sortDir, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ArrowUp size={13} style={{ color: 'var(--primary)' }} /> : <ArrowDown size={13} style={{ color: 'var(--primary)' }} />;
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Table Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <h2
            className="text-base"
            style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '1rem' }}
          >
            Top Clients Overview
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} clients · sorted by {sortKey} ({sortDir})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            {['All', 'Active', 'At Risk', 'Inactive'].map((s) => (
              <button
                key={`status-filter-${s}`}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className="px-2.5 py-1 rounded-lg text-xs transition-all duration-150"
                style={{
                  backgroundColor: statusFilter === s ? 'var(--primary)' : 'var(--muted)',
                  color: statusFilter === s ? '#FFFFFF' : 'var(--muted-foreground)',
                  fontWeight: statusFilter === s ? 600 : 500,
                  transform: statusFilter === s ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
          >
            <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent outline-none text-sm w-36"
              style={{ color: 'var(--foreground)' }}
            />
          </div>

          {/* Export */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-500 hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', fontWeight: 500 }}
            aria-label="Export client data"
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr style={{ backgroundColor: 'var(--muted)' }}>
              {[
                { key: null, label: '#', width: '3%' },
                { key: 'name' as SortKey, label: 'Client', width: '22%' },
                { key: null, label: 'Industry', width: '12%' },
                { key: 'revenue' as SortKey, label: 'Revenue Contribution', width: '16%' },
                { key: null, label: 'Key Contact', width: '16%' },
                { key: null, label: 'Channel', width: '11%' },
                { key: null, label: 'Status', width: '9%' },
                { key: 'lastActivity' as SortKey, label: 'Last Activity', width: '11%' },
              ].map((col) => (
                <th
                  key={`th-${col.label}`}
                  className="px-4 py-3 text-left"
                  style={{ width: col.width }}
                >
                  {col.key ? (
                    <button
                      onClick={() => handleSort(col.key as SortKey)}
                      className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-600 hover:text-foreground transition-colors"
                      style={{ color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.06em' }}
                    >
                      {col.label}
                      <SortIcon col={col.key as SortKey} />
                    </button>
                  ) : (
                    <span
                      className="text-xs uppercase tracking-wider font-600"
                      style={{ color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.06em' }}
                    >
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-right w-[4%]">
                <span className="text-xs uppercase tracking-wider font-600" style={{ color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.06em' }}>
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Building2 size={32} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                    <p style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>
                      No clients found
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Try adjusting your search or filter to find clients.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((client, idx) => {
                const status = statusConfig[client.status] ?? statusConfig['Active'];
                const tier = tierConfig[client.tier] ?? tierConfig['Bronze'];
                const trend = trendConfig[client.trend];
                const isHovered = hoveredRow === client.id;
                const globalIdx = (page - 1) * pageSize + idx + 1;

                return (
                  <tr
                    key={client.id}
                    className="border-b transition-colors duration-100"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: isHovered ? 'var(--muted)' : idx % 2 === 0 ? 'var(--card)' : '#FAFAFA',
                    }}
                    onMouseEnter={() => setHoveredRow(client.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* # */}
                    <td className="px-4 py-3.5 text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                      {globalIdx}
                    </td>

                    {/* Client Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-700 flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                            color: '#FFFFFF',
                            fontWeight: 700,
                          }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p
                              className="text-sm"
                              style={{ fontWeight: 600, color: 'var(--foreground)' }}
                            >
                              {client.name}
                            </p>
                            {client.tier === 'Platinum' && (
                              <Star
                                size={11}
                                style={{ color: '#7C3AED', fill: '#7C3AED' }}
                              />
                            )}
                          </div>
                          <span
                            className="px-1.5 py-0.5 rounded-md text-xs status-badge"
                            style={{
                              backgroundColor: tier.bg,
                              color: tier.color,
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {client.tier}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {client.industry}
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p
                          className="text-sm tabular-nums"
                          style={{ fontWeight: 700, color: 'var(--foreground)' }}
                        >
                          {formatRevenue(client.revenue)}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {/* Mini bar */}
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(client.revenueShare * 3.5, 64)}px`,
                              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                              opacity: 0.7,
                            }}
                          />
                          <span
                            className="text-xs tabular-nums"
                            style={{
                              color: trend.color,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          >
                            {trend.icon} {client.revenueShare}%
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Key Contact */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                        {client.keyContact}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {client.contactTitle}
                      </p>
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3.5">
                      <span
                        className="px-2 py-0.5 rounded-lg text-xs"
                        style={{
                          backgroundColor: 'var(--muted)',
                          color: 'var(--muted-foreground)',
                          fontWeight: 500,
                        }}
                      >
                        {client.channel}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td className="px-4 py-3.5 text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                      {formatDate(client.lastActivity)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s ease' }}
                      >
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          aria-label={`View ${client.name} details`}
                          title={`View ${client.name}`}
                        >
                          <ExternalLink size={13} />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          aria-label={`More options for ${client.name}`}
                          title="More options"
                        >
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
      >
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} clients
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-500 border transition-all duration-150 disabled:opacity-40 hover:bg-card"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)',
              fontWeight: 500,
            }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={`page-btn-${p}`}
              onClick={() => setPage(p)}
              className="w-7 h-7 rounded-lg text-xs font-600 transition-all duration-150"
              style={{
                backgroundColor: page === p ? 'var(--primary)' : 'transparent',
                color: page === p ? '#FFFFFF' : 'var(--muted-foreground)',
                fontWeight: 600,
                transform: page === p ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-500 border transition-all duration-150 disabled:opacity-40 hover:bg-card"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)',
              fontWeight: 500,
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}