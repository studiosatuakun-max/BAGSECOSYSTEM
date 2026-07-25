'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Edit3,
  Send,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type InvoiceStatus = 'Lunas' | 'Jatuh Tempo' | 'Menunggu' | 'Sengketa' | 'Sebagian';

interface Invoice {
  id: string;
  invoiceNo: string;
  client: string;
  clientType: string;
  amount: number;
  paidAmount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  daysOverdue: number;
  category: string;
  pic: string;
}

const invoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNo: 'INV-2026-0051',
    client: 'PT Trimitra Konstruksi',
    clientType: 'Konstruksi',
    amount: 342000000,
    paidAmount: 342000000,
    issueDate: '01/07/2026',
    dueDate: '15/07/2026',
    status: 'Lunas',
    daysOverdue: 0,
    category: 'Jasa Konsultasi',
    pic: 'Agus S.',
  },
  {
    id: 'inv-002',
    invoiceNo: 'INV-2026-0050',
    client: 'CV Maju Bersama Perkasa',
    clientType: 'Perdagangan',
    amount: 87500000,
    paidAmount: 0,
    issueDate: '10/06/2026',
    dueDate: '10/07/2026',
    status: 'Jatuh Tempo',
    daysOverdue: 10,
    category: 'Pengadaan Barang',
    pic: 'Dewi R.',
  },
  {
    id: 'inv-003',
    invoiceNo: 'INV-2026-0049',
    client: 'PT Surya Agung Mandiri',
    clientType: 'Manufaktur',
    amount: 215000000,
    paidAmount: 100000000,
    issueDate: '05/07/2026',
    dueDate: '20/07/2026',
    status: 'Sebagian',
    daysOverdue: 0,
    category: 'Jasa Teknik',
    pic: 'Budi H.',
  },
  {
    id: 'inv-004',
    invoiceNo: 'INV-2026-0048',
    client: 'PT Global Nusantara Raya',
    clientType: 'Logistik',
    amount: 156750000,
    paidAmount: 0,
    issueDate: '01/06/2026',
    dueDate: '01/07/2026',
    status: 'Jatuh Tempo',
    daysOverdue: 19,
    category: 'Pengiriman & Distribusi',
    pic: 'Siti M.',
  },
  {
    id: 'inv-005',
    invoiceNo: 'INV-2026-0047',
    client: 'PT Bintang Terang Abadi',
    clientType: 'Teknologi',
    amount: 480000000,
    paidAmount: 480000000,
    issueDate: '20/06/2026',
    dueDate: '05/07/2026',
    status: 'Lunas',
    daysOverdue: 0,
    category: 'Lisensi Perangkat Lunak',
    pic: 'Rina W.',
  },
  {
    id: 'inv-006',
    invoiceNo: 'INV-2026-0046',
    client: 'Koperasi Karya Mandiri',
    clientType: 'Koperasi',
    amount: 63200000,
    paidAmount: 0,
    issueDate: '15/07/2026',
    dueDate: '30/07/2026',
    status: 'Menunggu',
    daysOverdue: 0,
    category: 'Pelatihan & SDM',
    pic: 'Agus S.',
  },
  {
    id: 'inv-007',
    invoiceNo: 'INV-2026-0045',
    client: 'PT Artha Graha Sentosa',
    clientType: 'Properti',
    amount: 920000000,
    paidAmount: 0,
    issueDate: '01/05/2026',
    dueDate: '15/06/2026',
    status: 'Sengketa',
    daysOverdue: 35,
    category: 'Jasa Arsitektur',
    pic: 'Dewi R.',
  },
  {
    id: 'inv-008',
    invoiceNo: 'INV-2026-0044',
    client: 'PT Indah Jaya Tekstil',
    clientType: 'Tekstil',
    amount: 128500000,
    paidAmount: 128500000,
    issueDate: '10/07/2026',
    dueDate: '25/07/2026',
    status: 'Lunas',
    daysOverdue: 0,
    category: 'Pengadaan Material',
    pic: 'Budi H.',
  },
  {
    id: 'inv-009',
    invoiceNo: 'INV-2026-0043',
    client: 'PT Nusantara Digital Prima',
    clientType: 'Teknologi',
    amount: 275000000,
    paidAmount: 0,
    issueDate: '12/07/2026',
    dueDate: '27/07/2026',
    status: 'Menunggu',
    daysOverdue: 0,
    category: 'Pengembangan Sistem',
    pic: 'Siti M.',
  },
  {
    id: 'inv-010',
    invoiceNo: 'INV-2026-0042',
    client: 'CV Cahaya Abadi Sentosa',
    clientType: 'Perdagangan',
    amount: 44750000,
    paidAmount: 44750000,
    issueDate: '05/07/2026',
    dueDate: '19/07/2026',
    status: 'Lunas',
    daysOverdue: 0,
    category: 'Jasa Pemasaran',
    pic: 'Rina W.',
  },
  {
    id: 'inv-011',
    invoiceNo: 'INV-2026-0041',
    client: 'PT Sumber Daya Unggul',
    clientType: 'Energi',
    amount: 650000000,
    paidAmount: 325000000,
    issueDate: '15/06/2026',
    dueDate: '30/06/2026',
    status: 'Sebagian',
    daysOverdue: 20,
    category: 'Instalasi Infrastruktur',
    pic: 'Agus S.',
  },
  {
    id: 'inv-012',
    invoiceNo: 'INV-2026-0040',
    client: 'PT Harapan Bangsa Mulia',
    clientType: 'Pendidikan',
    amount: 97000000,
    paidAmount: 0,
    issueDate: '18/07/2026',
    dueDate: '02/08/2026',
    status: 'Menunggu',
    daysOverdue: 0,
    category: 'Jasa Konsultasi',
    pic: 'Budi H.',
  },
];

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  Lunas: { label: 'Lunas', className: 'badge-paid', icon: CheckCircle2 },
  'Jatuh Tempo': { label: 'Jatuh Tempo', className: 'badge-overdue', icon: AlertTriangle },
  Menunggu: { label: 'Menunggu', className: 'badge-pending', icon: Clock },
  Sengketa: { label: 'Sengketa', className: 'badge-disputed', icon: XCircle },
  Sebagian: { label: 'Sebagian', className: 'badge-partial', icon: RefreshCw },
};

function formatIDR(amount: number): string {
  if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(2)} M`;
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

type SortKey = keyof Invoice;
type SortDir = 'asc' | 'desc' | null;

const statusFilterOptions: (InvoiceStatus | 'Semua')[] = [
  'Semua',
  'Lunas',
  'Menunggu',
  'Sebagian',
  'Jatuh Tempo',
  'Sengketa',
];

export default function InvoiceTableCard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'Semua'>('Semua');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function toggleRow(id: string) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(visible: Invoice[]) {
    const allSelected = visible.every((inv) => selectedRows.has(inv.id));
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(visible.map((inv) => inv.id)));
    }
  }

  const filtered = useMemo(() => {
    let result = invoices.filter((inv) => {
      const matchSearch =
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        inv.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'Semua' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (sortKey && sortDir) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortDir === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const overdueTotal = invoices
    .filter((inv) => inv.status === 'Jatuh Tempo' || inv.status === 'Sengketa')
    .reduce((sum, inv) => sum + inv.amount, 0);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col || sortDir === null) return <ChevronsUpDown size={12} className="opacity-40" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText size={15} className="text-primary" />
              </div>
              <h2 className="text-[15px] font-700 text-foreground">Invoice Terbaru (Klien B2B)</h2>
              <span className="text-xs font-600 text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {filtered.length} invoice
              </span>
            </div>
            <p className="text-xs text-muted-foreground ml-9">
              Piutang jatuh tempo:{' '}
              <span className="text-negative font-700">{formatIDR(overdueTotal)}</span> perlu tindakan segera
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari invoice atau klien..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-2 bg-secondary border border-border rounded-xl text-sm font-500 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 w-48 transition-all duration-150"
              />
            </div>

            {/* Download */}
            <button className="flex items-center gap-1.5 bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-600 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-150 active:scale-95">
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <Filter size={13} className="text-muted-foreground flex-shrink-0" />
          {statusFilterOptions.map((s) => {
            const isActive = statusFilter === s;
            return (
              <button
                key={`filter-chip-${s}`}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-600 transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
              >
                {s}
                {s !== 'Semua' && (
                  <span className="ml-1 opacity-70">
                    {invoices.filter((inv) => inv.status === s).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedRows.size > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 bg-primary/5 border-b border-primary/20 animate-in slide-in-from-top-2 duration-200">
          <span className="text-sm font-600 text-primary">{selectedRows.size} dipilih</span>
          <div className="flex items-center gap-2 ml-2">
            <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-600 px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all duration-150 active:scale-95">
              <Send size={12} />
              Kirim Pengingat
            </button>
            <button className="flex items-center gap-1.5 bg-secondary text-foreground text-xs font-600 px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-all duration-150 active:scale-95">
              <Download size={12} />
              Unduh PDF
            </button>
          </div>
          <button
            onClick={() => setSelectedRows(new Set())}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Batal pilih
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-muted/60 border-b border-border">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={paginated.length > 0 && paginated.every((inv) => selectedRows.has(inv.id))}
                  onChange={() => toggleAll(paginated)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </th>
              {(
                [
                  { key: 'invoiceNo', label: 'No. Invoice' },
                  { key: 'client', label: 'Klien' },
                  { key: 'amount', label: 'Jumlah' },
                  { key: 'paidAmount', label: 'Dibayar' },
                  { key: 'dueDate', label: 'Jatuh Tempo' },
                  { key: 'status', label: 'Status' },
                  { key: 'daysOverdue', label: 'Hari Lewat' },
                  { key: 'pic', label: 'PIC' },
                ] as { key: SortKey; label: string }[]
              ).map((col) => (
                <th
                  key={`th-${col.key}`}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-600 text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-600 text-muted-foreground uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                      <FileText size={22} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-600 text-foreground">Tidak ada invoice ditemukan</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Coba ubah kata kunci pencarian atau filter status untuk menemukan invoice yang Anda cari.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((inv) => {
                const statusCfg = statusConfig[inv.status];
                const StatusIcon = statusCfg.icon;
                const isSelected = selectedRows.has(inv.id);
                const isOverdue = inv.status === 'Jatuh Tempo' || inv.status === 'Sengketa';

                return (
                  <tr
                    key={inv.id}
                    className={`group transition-colors duration-100 ${
                      isSelected
                        ? 'bg-primary/5'
                        : isOverdue
                        ? 'hover:bg-negative/3 bg-negative/2' :'hover:bg-muted/50'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(inv.id)}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-700 text-primary tabular-nums">{inv.invoiceNo}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-600 text-foreground whitespace-nowrap">{inv.client}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{inv.clientType} · {inv.category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-700 tabular-nums text-foreground">{formatIDR(inv.amount)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {inv.paidAmount > 0 ? (
                        <div>
                          <span className="text-sm font-700 tabular-nums text-positive">{formatIDR(inv.paidAmount)}</span>
                          {inv.paidAmount < inv.amount && (
                            <div className="mt-1 w-20 bg-secondary rounded-full h-1 overflow-hidden">
                              <div
                                className="h-full bg-positive rounded-full"
                                style={{ width: `${(inv.paidAmount / inv.amount) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground tabular-nums">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-500 tabular-nums ${isOverdue ? 'text-negative font-600' : 'text-foreground'}`}>
                        {inv.dueDate}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.className}`}
                      >
                        <StatusIcon size={11} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {inv.daysOverdue > 0 ? (
                        <span className="text-sm font-700 tabular-nums text-negative">
                          +{inv.daysOverdue} hr
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-muted-foreground font-500">{inv.pic}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150"
                          title="Lihat detail invoice"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150"
                          title="Edit invoice"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150"
                          title="Kirim pengingat pembayaran"
                        >
                          <Send size={14} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === inv.id ? null : inv.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150"
                            title="Opsi lainnya"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {actionMenuId === inv.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl card-shadow-md z-30 overflow-hidden">
                              {[
                                { label: 'Unduh PDF', icon: Download },
                                { label: 'Tandai Lunas', icon: CheckCircle2 },
                                { label: 'Eskalasi Sengketa', icon: AlertTriangle },
                              ].map((action) => (
                                <button
                                  key={`action-${inv.id}-${action.label}`}
                                  onClick={() => setActionMenuId(null)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                >
                                  <action.icon size={13} className="text-muted-foreground" />
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-500">
            Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} dari {filtered.length} invoice
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Per halaman:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs font-600 text-foreground bg-secondary border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              {[5, 8, 10, 20].map((n) => (
                <option key={`perpage-${n}`} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={`page-${p}`}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-600 transition-all duration-150 ${
                page === p
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}