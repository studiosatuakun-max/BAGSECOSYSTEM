'use client';
import React, { useState } from 'react';
import { FileText, Download, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

type InvoiceStatus = 'Unpaid' | 'Paid' | 'Overdue';

interface Invoice {
  id: string;
  period: string;
  amount: string;
  dueDate: string;
  status: InvoiceStatus;
  items: string;
}

const invoice: Invoice = {
  id: 'INV-2026-0089',
  period: 'June 2026',
  amount: 'Rp 18.500.000',
  dueDate: '25 Jul 2026',
  status: 'Unpaid',
  items: '3.200 kg LPG · Delivery + Handling',
};

const statusConfig: Record<InvoiceStatus, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  Unpaid: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: <Clock size={12} />,
  },
  Paid: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: <CheckCircle2 size={12} />,
  },
  Overdue: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: <AlertCircle size={12} />,
  },
};

export default function LatestInvoiceCard() {
  const [downloading, setDownloading] = useState(false);
  const cfg = statusConfig[invoice.status];

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1800);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50">
          <FileText size={17} className="text-blue-800" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Latest Invoice</h3>
          <p className="text-xs text-slate-500 mt-0.5">Billing period · {invoice.period}</p>
        </div>
      </div>

      {/* Invoice detail block */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-slate-500 font-medium">Invoice Number</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{invoice.id}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            {cfg.icon}
            {invoice.status}
          </div>
        </div>

        <div className="w-full h-px bg-slate-200" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Amount Due</p>
            <p className="text-base font-extrabold text-blue-900 mt-0.5 tabular-nums">{invoice.amount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Due Date</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{invoice.dueDate}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">{invoice.items}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 disabled:opacity-60 text-white text-xs font-semibold rounded-xl px-4 py-2.5 transition-colors"
        >
          <Download size={13} className={downloading ? 'animate-bounce' : ''} />
          {downloading ? 'Preparing PDF…' : 'Download PDF'}
        </button>
        {invoice.status === 'Unpaid' && (
          <button className="flex items-center justify-center gap-2 border border-blue-200 hover:bg-blue-50 text-blue-800 text-xs font-semibold rounded-xl px-4 py-2.5 transition-colors">
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
}
