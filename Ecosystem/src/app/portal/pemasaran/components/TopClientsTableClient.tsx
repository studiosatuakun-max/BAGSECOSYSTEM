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
    name: 'PT Krakatau Baja Smelter',
    industry: 'Smelter & Heavy Metallurgy',
    revenue: 4850000000,
    revenueShare: 18.4,
    keyContact: 'Budi Hartono',
    contactTitle: 'Energy Procurement Director',
    channel: 'Direct AE Prospecting',
    status: 'Active',
    tier: 'Platinum',
    lastActivity: '2026-07-25',
    campaigns: 3,
    trend: 'up',
  },
  {
    id: 'client-002',
    name: 'PT Unilever Foods & Beverages',
    industry: 'F&B Manufacturing',
    revenue: 3620000000,
    revenueShare: 13.7,
    keyContact: 'Dewi Rahayu',
    contactTitle: 'Plant Operations Manager',
    channel: 'Industrial Tender',
    status: 'Active',
    tier: 'Gold',
    lastActivity: '2026-07-24',
    campaigns: 2,
    trend: 'up',
  },
  {
    id: 'client-003',
    name: 'PT Indocement Tunggal Prakarsa',
    industry: 'Cement & Building Minerals',
    revenue: 2980000000,
    revenueShare: 11.3,
    keyContact: 'Hendra Susanto',
    contactTitle: 'VP Utility & Gas Supply',
    channel: 'B2B Summit 2026',
    status: 'Active',
    tier: 'Gold',
    lastActivity: '2026-07-22',
    campaigns: 1,
    trend: 'stable',
  },
  {
    id: 'client-004',
    name: 'Grand Hyatt Hotel Jakarta',
    industry: 'Horeca & Commercial VGL',
    revenue: 2540000000,
    revenueShare: 9.6,
    keyContact: 'Ir. Agus Wibowo',
    contactTitle: 'Chief Engineering',
    channel: 'Horeca Promo Merdeka',
    status: 'Active',
    tier: 'Gold',
    lastActivity: '2026-07-21',
    campaigns: 2,
    trend: 'up',
  },
  {
    id: 'client-005',
    name: 'PT Toyota Motor Manufacturing',
    industry: 'Automotive Paint Shop',
    revenue: 1980000000,
    revenueShare: 7.5,
    keyContact: 'Siti Nurhaliza',
    contactTitle: 'Facility Energy Lead',
    channel: 'Direct Sales',
    status: 'At Risk',
    tier: 'Silver',
    lastActivity: '2026-07-15',
    campaigns: 1,
    trend: 'down',
  },
  {
    id: 'client-006',
    name: 'PT Pabrik Kertas Tjiwi Kimia',
    industry: 'Paper & Pulp Processing',
    revenue: 1750000000,
    revenueShare: 6.6,
    keyContact: 'Reza Firmansyah',
    contactTitle: 'Technical Utility Manager',
    channel: 'Referral',
    status: 'Active',
    tier: 'Silver',
    lastActivity: '2026-07-19',
    campaigns: 2,
    trend: 'up',
  },
  {
    id: 'client-007',
    name: 'PT Duta Pertiwi Tbk',
    industry: 'Commercial Estate Power',
    revenue: 1420000000,
    revenueShare: 5.4,
    keyContact: 'Yunita Prawira',
    contactTitle: 'Head of Procurement',
    channel: 'Email Retargeting',
    status: 'Active',
    tier: 'Silver',
    lastActivity: '2026-07-18',
    campaigns: 1,
    trend: 'stable',
  },
  {
    id: 'client-008',
    name: 'RS Pondok Indah Group',
    industry: 'Medical Boiler & Laundry',
    revenue: 1180000000,
    revenueShare: 4.5,
    keyContact: 'Dr. Anton Wijaya',
    contactTitle: 'Facility Director',
    channel: 'Email Campaign',
    status: 'Inactive',
    tier: 'Bronze',
    lastActivity: '2026-06-22',
    campaigns: 0,
    trend: 'down',
  },
  {
    id: 'client-009',
    name: 'Pemkot Surabaya - Dinas Perhubungan',
    industry: 'Public Transport CNG Fleet',
    revenue: 980000000,
    revenueShare: 3.7,
    keyContact: 'Bayu Nugroho',
    contactTitle: 'Kepala Seksi Logistik',
    channel: 'Government Tender',
    status: 'Active',
    tier: 'Bronze',
    lastActivity: '2026-07-20',
    campaigns: 1,
    trend: 'up',
  },
  {
    id: 'client-010',
    name: 'PT Sinar Mas Agrobusiness',
    industry: 'Agri-Processing Boiler',
    revenue: 760000000,
    revenueShare: 2.9,
    keyContact: 'Nurul Hidayah',
    contactTitle: 'Plant Director',
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

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Active: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', label: 'Active SLA' },
  'At Risk': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', label: 'SLA Review' },
  Inactive: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', label: 'Expired' },
};

const tierConfig: Record<string, { bg: string; text: string; border: string }> = {
  Platinum: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  Gold: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  Silver: { bg: 'bg-slate-100 dark:bg-slate-800/60', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
  Bronze: { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
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
    if (sortKey !== col) return <ArrowUpDown size={13} className="opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp size={13} className="text-pink-600 dark:text-pink-400" /> : <ArrowDown size={13} className="text-pink-600 dark:text-pink-400" />;
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all duration-300">
      {/* Table Header / Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top B2B &amp; Commercial CNG Clients
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
              {filtered.length} Enterprise Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Peringkat klien Mother Station berdasarkan utilisasi kuota MMBTU, nilai kontrak SLA mingguan, dan riwayat pengiriman CNG.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer"
            >
              <option value="All">All Status (10)</option>
              <option value="Active">Active SLA</option>
              <option value="At Risk">SLA Review</option>
              <option value="Inactive">Expired</option>
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or contact..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          {/* Export button */}
          <button
            onClick={() => alert('Exporting CNG Client Dossier as Excel...')}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Download size={14} />
            <span className="hidden md:inline">Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-extrabold uppercase tracking-wider"
                >
                  <span>Company / Industry</span>
                  <SortIcon col="name" />
                </button>
              </th>
              <th className="py-3 px-4">Key Contact &amp; Channel</th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => handleSort('revenue')}
                  className="inline-flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-extrabold uppercase tracking-wider ml-auto"
                >
                  <span>Contract Value</span>
                  <SortIcon col="revenue" />
                </button>
              </th>
              <th className="py-3 px-4 text-center">SLA Status</th>
              <th className="py-3 px-4 text-center">Tier</th>
              <th className="py-3 px-4 text-center">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="inline-flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-extrabold uppercase tracking-wider mx-auto"
                >
                  <span>Last Activity</span>
                  <SortIcon col="lastActivity" />
                </button>
              </th>
              <th className="py-3 px-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                  No CNG client records found matching your filter.
                </td>
              </tr>
            ) : (
              paginated.map((client) => {
                const st = statusConfig[client.status] || statusConfig['Active'];
                const tr = tierConfig[client.tier] || tierConfig['Silver'];
                const isHovered = hoveredRow === client.id;

                return (
                  <tr
                    key={client.id}
                    onMouseEnter={() => setHoveredRow(client.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="hover:bg-pink-50/30 dark:hover:bg-pink-950/20 transition-colors group"
                  >
                    {/* Col 1: Company & Industry */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 flex items-center justify-center shrink-0 text-pink-600 dark:text-pink-400 font-bold text-sm">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                            {client.name}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            {client.industry}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Key Contact */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {client.keyContact}
                      </p>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {client.contactTitle} · <span className="text-pink-600 dark:text-pink-400 font-medium">{client.channel}</span>
                      </span>
                    </td>

                    {/* Col 3: Contract Value & Share */}
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {formatRevenue(client.revenue)}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          client.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 
                          client.trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 
                          'text-slate-400'
                        }`}>
                          {client.trend === 'up' ? '↑' : client.trend === 'down' ? '↓' : '→'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {client.revenueShare}% MMBTU Share
                      </span>
                    </td>

                    {/* Col 4: SLA Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${st.bg} ${st.text} ${st.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500 animate-pulse' : client.status === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span>{st.label}</span>
                      </span>
                    </td>

                    {/* Col 5: Tier */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${tr.bg} ${tr.text} ${tr.border}`}>
                        <Star size={10} className="fill-current" />
                        <span>{client.tier}</span>
                      </span>
                    </td>

                    {/* Col 6: Last Activity */}
                    <td className="py-3.5 px-4 text-center text-[11px] text-slate-600 dark:text-slate-400 tabular-nums">
                      {formatDate(client.lastActivity)}
                    </td>

                    {/* Col 7: Action */}
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => alert(`Viewing full CNG SLA dossier for ${client.name}...`)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          isHovered 
                            ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>Dossier</span>
                        <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{(page - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-900 dark:text-white">{Math.min(page * pageSize, filtered.length)}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> clients
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Prev
            </button>
            <span className="px-2 font-bold text-slate-900 dark:text-white">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}