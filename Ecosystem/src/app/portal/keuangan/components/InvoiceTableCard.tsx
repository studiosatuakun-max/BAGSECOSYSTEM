'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Send,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  Check,
} from 'lucide-react';

type InvoiceStatus = 'Lunas DGT' | 'Jatuh Tempo' | 'Menunggu' | 'Sebagian' | 'Sengketa Metering';

interface Invoice {
  id: string;
  invoiceNo: string;
  client: string;
  clientType: 'CNG Industrial' | 'CNG Horeca' | 'CNG Mother Station';
  mmbtu: number;
  hbaRate: string;
  amount: number;
  paidAmount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  ppnStatus: 'E-Faktur DGT Ready' | 'PPN 11% Paid' | 'Pending Verification';
}

const initialInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNo: 'INV-CNG-2026-0081',
    client: 'PT Toyota Motor Mfg (CNG Industrial Boiler)',
    clientType: 'CNG Industrial',
    mmbtu: 14500,
    hbaRate: '$11.50 / MMBTU',
    amount: 342000000,
    paidAmount: 342000000,
    issueDate: '01/07/2026',
    dueDate: '15/07/2026',
    status: 'Lunas DGT',
    ppnStatus: 'PPN 11% Paid',
  },
  {
    id: 'inv-002',
    invoiceNo: 'INV-CNG-2026-0080',
    client: 'PT Mayora Indah Tbk (Manifold Header Plant 2)',
    clientType: 'CNG Industrial',
    mmbtu: 22400,
    hbaRate: '$11.50 / MMBTU',
    amount: 528000000,
    paidAmount: 0,
    issueDate: '10/06/2026',
    dueDate: '10/07/2026',
    status: 'Jatuh Tempo',
    ppnStatus: 'E-Faktur DGT Ready',
  },
  {
    id: 'inv-003',
    invoiceNo: 'INV-CNG-2026-0079',
    client: 'PT Kopi Kenangan Nusantara (Horeca Swapping)',
    clientType: 'CNG Horeca',
    mmbtu: 3850,
    hbaRate: '$12.10 / MMBTU',
    amount: 91250000,
    paidAmount: 91250000,
    issueDate: '05/07/2026',
    dueDate: '20/07/2026',
    status: 'Lunas DGT',
    ppnStatus: 'PPN 11% Paid',
  },
  {
    id: 'inv-004',
    invoiceNo: 'INV-CNG-2026-0078',
    client: 'PT Indofood CBP Sukses Makmur (Oven Line 3)',
    clientType: 'CNG Industrial',
    mmbtu: 31200,
    hbaRate: '$11.50 / MMBTU',
    amount: 748000000,
    paidAmount: 350000000,
    issueDate: '01/07/2026',
    dueDate: '25/07/2026',
    status: 'Sebagian',
    ppnStatus: 'E-Faktur DGT Ready',
  },
  {
    id: 'inv-005',
    invoiceNo: 'INV-CNG-2026-0077',
    client: 'PT Sederhana Minang Abadi (Kitchen Header)',
    clientType: 'CNG Horeca',
    mmbtu: 1800,
    hbaRate: '$12.10 / MMBTU',
    amount: 42500000,
    paidAmount: 0,
    issueDate: '12/07/2026',
    dueDate: '27/07/2026',
    status: 'Menunggu',
    ppnStatus: 'Pending Verification',
  },
  {
    id: 'inv-006',
    invoiceNo: 'INV-CNG-2026-0076',
    client: 'PT Ajinomoto Indonesia (Cogeneration Unit)',
    clientType: 'CNG Industrial',
    mmbtu: 18900,
    hbaRate: '$11.50 / MMBTU',
    amount: 445000000,
    paidAmount: 445000000,
    issueDate: '01/07/2026',
    dueDate: '15/07/2026',
    status: 'Lunas DGT',
    ppnStatus: 'PPN 11% Paid',
  },
  {
    id: 'inv-007',
    invoiceNo: 'INV-CNG-2026-0075',
    client: 'PT Unilever Indonesia Tbk (Steam Boiler Turbine)',
    clientType: 'CNG Industrial',
    mmbtu: 42000,
    hbaRate: '$11.50 / MMBTU',
    amount: 988000000,
    paidAmount: 0,
    issueDate: '15/07/2026',
    dueDate: '30/07/2026',
    status: 'Menunggu',
    ppnStatus: 'E-Faktur DGT Ready',
  },
  {
    id: 'inv-008',
    invoiceNo: 'INV-CNG-2026-0074',
    client: 'PT Bogasari Flour Mills (Dryer Furnace Bay 4)',
    clientType: 'CNG Industrial',
    mmbtu: 28500,
    hbaRate: '$11.50 / MMBTU',
    amount: 672000000,
    paidAmount: 0,
    issueDate: '01/06/2026',
    dueDate: '15/06/2026',
    status: 'Sengketa Metering',
    ppnStatus: 'Pending Verification',
  },
];

const statusConfig: Record<
  InvoiceStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  'Lunas DGT': { label: 'Lunas DGT', bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
  'Jatuh Tempo': { label: 'Jatuh Tempo', bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', icon: AlertTriangle },
  Menunggu: { label: 'Menunggu', bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', icon: Clock },
  Sebagian: { label: 'Sebagian', bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', icon: RefreshCw },
  'Sengketa Metering': { label: 'Sengketa Metering', bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', icon: XCircle },
};

function formatIDR(amount: number): string {
  if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(2)} M`;
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function InvoiceTableCard() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [formClient, setFormClient] = useState('');
  const [formType, setFormType] = useState<'CNG Industrial' | 'CNG Horeca'>('CNG Industrial');
  const [formMmbtu, setFormMmbtu] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formStatus, setFormStatus] = useState<InvoiceStatus>('Menunggu');

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditId(null);
    setFormClient('');
    setFormType('CNG Industrial');
    setFormMmbtu('10000');
    setFormAmount('235000000');
    setFormStatus('Menunggu');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv: Invoice) => {
    setModalMode('edit');
    setEditId(inv.id);
    setFormClient(inv.client);
    setFormType(inv.clientType as any);
    setFormMmbtu(inv.mmbtu.toString());
    setFormAmount(inv.amount.toString());
    setFormStatus(inv.status);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClient || !formAmount || !formMmbtu) return alert('Mohon lengkapi semua kolom');

    const numAmt = parseInt(formAmount.replace(/\D/g, ''), 10) || 0;
    const numMmbtu = parseInt(formMmbtu.replace(/\D/g, ''), 10) || 0;

    if (modalMode === 'create') {
      const newInv: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNo: `INV-CNG-2026-00${82 + invoices.length}`,
        client: formClient,
        clientType: formType,
        mmbtu: numMmbtu,
        hbaRate: formType === 'CNG Industrial' ? '$11.50 / MMBTU' : '$12.10 / MMBTU',
        amount: numAmt,
        paidAmount: formStatus === 'Lunas DGT' ? numAmt : 0,
        issueDate: '26/07/2026',
        dueDate: '10/08/2026',
        status: formStatus,
        ppnStatus: formStatus === 'Lunas DGT' ? 'PPN 11% Paid' : 'E-Faktur DGT Ready',
      };
      setInvoices([newInv, ...invoices]);
    } else if (editId) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editId
            ? {
                ...inv,
                client: formClient,
                clientType: formType,
                mmbtu: numMmbtu,
                amount: numAmt,
                status: formStatus,
                paidAmount: formStatus === 'Lunas DGT' ? numAmt : inv.paidAmount,
              }
            : inv
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Hapus invoice transfer custody ini? Log telemetri juga akan diarsipkan.')) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
    }
  };

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNo.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'Semua' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              B2B CNG Custody Transfer Invoice Engine
            </h2>
            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
              <Sparkles size={11} />
              <span>PPN 11% & PPh MIGAS Ready</span>
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Penagihan gas berbasis volume MMBTU/Sm³ terkoreksi temperatur & tekanan Mother Station
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari klien CNG atau nomor invoice..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="Semua">Semua Status</option>
            <option value="Lunas DGT">Lunas DGT</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Jatuh Tempo">Jatuh Tempo</option>
            <option value="Sebagian">Sebagian</option>
            <option value="Sengketa Metering">Sengketa Metering</option>
          </select>

          {/* Add Button */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Buat Invoice CNG</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/60 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="py-3.5 px-4">No. Invoice & Tanggal</th>
              <th className="py-3.5 px-4">Klien & Tipe CNG</th>
              <th className="py-3.5 px-4 text-right">Volume (MMBTU)</th>
              <th className="py-3.5 px-4 text-right">Tarif HBA Index</th>
              <th className="py-3.5 px-4 text-right">Total Tagihan (IDR)</th>
              <th className="py-3.5 px-4 text-center">Status Pajak & Bayar</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                  Tidak ada invoice transfer custody CNG ditemukan.
                </td>
              </tr>
            ) : (
              paginated.map((inv) => {
                const statusCfg = statusConfig[inv.status];
                const StatusIcon = statusCfg.icon;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    {/* Invoice No */}
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900 dark:text-white tracking-tight">{inv.invoiceNo}</p>
                      <p className="text-[10px] font-semibold text-slate-400">Jatuh Tempo: {inv.dueDate}</p>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">{inv.client}</p>
                      <span className="inline-flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-0.5">
                        {inv.clientType}
                      </span>
                    </td>

                    {/* MMBTU */}
                    <td className="py-3.5 px-4 text-right font-black tabular-nums text-slate-700 dark:text-slate-300">
                      {inv.mmbtu.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400">MMBTU</span>
                    </td>

                    {/* HBA Rate */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-500 dark:text-slate-400">
                      {inv.hbaRate}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <p className="font-black tabular-nums text-slate-900 dark:text-white text-sm">{formatIDR(inv.amount)}</p>
                      {inv.paidAmount > 0 && inv.paidAmount < inv.amount && (
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                          Dibayar: {formatIDR(inv.paidAmount)}
                        </p>
                      )}
                    </td>

                    {/* Status Badges */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border whitespace-nowrap shrink-0 align-middle shadow-2xs ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                          <StatusIcon size={11} />
                          <span>{statusCfg.label}</span>
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded whitespace-nowrap shrink-0 align-middle">
                          {inv.ppnStatus}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(inv)}
                          title="Edit & Sync E-Faktur"
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-500 text-slate-500 transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => alert(`Mengunduh E-Faktur PDF untuk ${inv.invoiceNo}...`)}
                          title="Unduh E-Faktur PPN 11% PDF"
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-500 transition-colors"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          title="Arsipkan Tagihan"
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 transition-colors"
                        >
                          <Trash2 size={15} />
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

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 font-semibold">
        <p>
          Menampilkan <span className="font-bold text-slate-900 dark:text-white">{paginated.length}</span> dari{' '}
          <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> invoice CNG aktif
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="px-3 py-1 font-bold bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white">
            Hal {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* MODAL CREATE / EDIT INVOICE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {modalMode === 'create' ? 'Buat Invoice Custody Transfer CNG' : 'Edit Invoice & Sync E-Faktur'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    PPN 11% akan dihitung otomatis sesuai regulasi MIGAS DGT
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Perusahaan Klien CNG</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: PT Toyota Motor Mfg Indonesia"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tipe Kontrak Gas</label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="CNG Industrial">CNG Industrial (Boiler/Turbine)</option>
                    <option value="CNG Horeca">CNG Horeca (Swapping Cylinder)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Volume Gas Terkirim (MMBTU)</label>
                  <input
                    type="number"
                    required
                    placeholder="Misal: 15000"
                    value={formMmbtu}
                    onChange={(e) => setFormMmbtu(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Tagihan + PPN 11% (IDR)</label>
                  <input
                    type="number"
                    required
                    placeholder="Misal: 350000000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Status Pembayaran DGT</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Lunas DGT">Lunas DGT</option>
                    <option value="Jatuh Tempo">Jatuh Tempo</option>
                    <option value="Sebagian">Sebagian</option>
                    <option value="Sengketa Metering">Sengketa Metering</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <Check size={16} />
                  <span>Simpan Invoice & E-Faktur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}