import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import InvoiceTableCard from '../components/InvoiceTableCard';
import { getInvoicesIndustri, getInvoicesHoreca } from '../_integration/actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WorksheetPenjualan() {
  let industriInvoices = [];
  let horecaInvoices = [];

  try {
    const [industriResult, horecaResult] = await Promise.all([
      getInvoicesIndustri(),
      getInvoicesHoreca(),
    ]);
    industriInvoices = industriResult.data ?? [];
    horecaInvoices = horecaResult.data ?? [];
  } catch {
    // fallback
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <div>
        <PortalHeader
          title="Modul Penjualan"
          subtitle="Worksheet: Faktur Penjualan & Piutang Klien (AR)"
          roleBadge="CFO Access"
          roleColor="amber"
          backUrl="/portal/keuangan"
          backText="Kembali ke Menu Keuangan"
        />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InvoiceTableCard
            industriInvoices={industriInvoices as any}
            horecaInvoices={horecaInvoices as any}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}
