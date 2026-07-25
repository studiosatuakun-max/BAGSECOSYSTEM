'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle2, Calendar, Hash } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

const invoice = {
  id: 'inv-2026-0718',
  invoiceNumber: 'INV-2026-0718',
  amount: 14750000,
  status: 'unpaid' as const,
  dueDate: '23 Jul 2026',
  issuedDate: '18 Jul 2026',
  period: 'June 2026',
  description: 'Gas Supply — Industrial LPG, 350 m³',
  client: 'PT Baskara Asri Ghas',
};

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function LatestInvoiceCard() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Backend integration: POST /api/invoices/{id}/download → returns signed PDF URL
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      toast.success('Invoice downloaded', {
        description: `${invoice.invoiceNumber} — PDF saved to your downloads folder`,
      });
      setTimeout(() => setDownloaded(false), 3000);
    }, 1800);
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card p-5 card-hover fade-in h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Latest Invoice</p>
          </div>
        </div>
        <StatusBadge variant={invoice.status} />
      </div>

      {/* Invoice details */}
      <div className="flex-1 space-y-3">
        <div className="bg-muted/50 rounded-xl p-3.5">
          <p className="text-2xl font-bold text-foreground font-tabular">{formatIDR(invoice.amount)}</p>
          <p className="text-xs text-muted-foreground mt-1">{invoice.description}</p>
        </div>

        <div className="space-y-2">
          {[
            { icon: Hash, label: 'Invoice No.', value: invoice.invoiceNumber },
            { icon: Calendar, label: 'Due Date', value: invoice.dueDate },
            { icon: Calendar, label: 'Issued', value: invoice.issuedDate },
          ].map((row) => (
            <div key={`inv-row-${row.label}`} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <row.icon size={13} />
                <span className="text-xs font-medium">{row.label}</span>
              </div>
              <span className="text-xs font-semibold text-foreground font-tabular">{row.value}</span>
            </div>
          ))}
        </div>

        {invoice.status === 'unpaid' && (
          <div className="bg-warning-bg border border-warning/20 rounded-xl px-3 py-2.5">
            <p className="text-xs font-semibold text-warning-foreground">Payment due in 3 days</p>
            <p className="text-[11px] text-warning-foreground/70 mt-0.5">Please complete payment to avoid service interruption</p>
          </div>
        )}
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed btn-primary-active"
        style={{ minWidth: '120px' }}
      >
        {downloading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Preparing PDF...
          </>
        ) : downloaded ? (
          <>
            <CheckCircle2 size={15} />
            Downloaded
          </>
        ) : (
          <>
            <Download size={15} />
            Download PDF
          </>
        )}
      </button>
    </div>
  );
}