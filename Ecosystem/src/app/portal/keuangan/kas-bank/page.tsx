import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import CashbookCard from '../components/CashbookCard';
import DocumentVaultCard from '../components/DocumentVaultCard';
import { getCashbook, getDocumentVault } from '../_integration/actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WorksheetKasBank() {
  let cashbookTransactions = [];
  let vaultDocuments = [];

  try {
    const [cashbookData, vaultData] = await Promise.all([
      getCashbook(),
      getDocumentVault(),
    ]);
    cashbookTransactions = cashbookData ?? [];
    vaultDocuments = vaultData ?? [];
  } catch {
    // fallback
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <div>
        <PortalHeader
          title="Modul Kas & Bank"
          subtitle="Worksheet: Mutasi Rekening, Opex & Arsip Dokumen"
          roleBadge="CFO Access"
          roleColor="blue"
          backUrl="/portal/keuangan"
          backText="Kembali ke Menu Keuangan"
        />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CashbookCard transactions={cashbookTransactions} />
            <DocumentVaultCard documents={vaultDocuments} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
