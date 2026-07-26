'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle2, Calendar, Hash, ShieldCheck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const invoice = {
  id: 'inv-cng-2026-0724',
  invoiceNumber: 'INV/CNG/2026/VII/0892',
  amount: 85400000,
  status: 'unpaid' as const,
  dueDate: '31 Jul 2026',
  issuedDate: '24 Jul 2026',
  period: 'Siklus Mingguan #3 (Jul 2026)',
  description: 'Custody Transfer CNG Supply — 12,450 Sm³ (444 MMBTU)',
  client: 'PT Krakatau Baja Smelter',
  efaktur: '010.000-26.09881234',
};

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function LatestInvoiceCard() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      toast.success('E-Faktur & Invoice Downloaded', {
        description: `${invoice.invoiceNumber} — Tersimpan dalam format PDF (Berhasil divalidasi MIGAS & DJP).`,
      });
      setTimeout(() => setDownloaded(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-indigo-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Custody Transfer Billing
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Latest E-Faktur Invoice
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase tracking-wider">
            Payment Due
          </span>
        </div>

        {/* Invoice details */}
        <div className="space-y-3.5">
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{formatIDR(invoice.amount)}</p>
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                PPN 11% Inc.
              </span>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">{invoice.description}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{invoice.client} · {invoice.period}</p>
          </div>

          <div className="space-y-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 text-xs">
            {[
              { icon: Hash, label: 'No. Faktur / INV', value: invoice.invoiceNumber },
              { icon: ShieldCheck, label: 'E-Faktur DJP', value: invoice.efaktur },
              { icon: Calendar, label: 'Jatuh Tempo', value: invoice.dueDate },
              { icon: CreditCard, label: 'Rekening Mandiri', value: '122-00-9888123-0 (PT Baskara)' },
            ].map((row) => (
              <div key={`inv-row-${row.label}`} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold">
                  <row.icon size={13} className="text-indigo-500 dark:text-indigo-400" />
                  <span>{row.label}</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-right truncate max-w-[170px]" title={row.value}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {invoice.status === 'unpaid' && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="font-extrabold text-amber-800 dark:text-amber-200">Batas Waktu Pembayaran</span>
              <span className="font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-lg">
                7 Hari Kerja
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 disabled:opacity-70"
      >
        {downloading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Validating Digital Signature...</span>
          </>
        ) : downloaded ? (
          <>
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>PDF E-Faktur Unduh Sukses!</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>Download E-Faktur &amp; Invoice PDF</span>
          </>
        )}
      </button>
    </div>
  );
}