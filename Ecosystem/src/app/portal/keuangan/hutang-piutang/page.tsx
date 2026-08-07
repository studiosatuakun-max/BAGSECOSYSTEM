import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function WorksheetHutangPiutang() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <div>
        <PortalHeader
          title="Modul Hutang Piutang"
          subtitle="Worksheet: Accounts Receivable, Payable & Aging Schedule"
          roleBadge="CFO Access"
          roleColor="indigo"
          backUrl="/portal/keuangan"
          backText="Kembali ke Menu Keuangan"
        />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          <div className="bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center text-center min-h-[50vh]">
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
              <DocumentTextIcon className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Worksheet Hutang Piutang</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mb-8">
              Buku pembantu hutang dan piutang terperinci. Halaman ini disiapkan untuk integrasi data ERP Zahir pada fase pengembangan berikutnya.
            </p>
            <div className="w-full max-w-4xl overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 opacity-50 pointer-events-none">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Tanggal</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">No. Bukti</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Keterangan</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Saldo Awal</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Mutasi</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-slate-900">
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td className="p-4 text-slate-500">01-08-2026</td>
                      <td className="p-4 text-slate-500">INV-{2000 + i}</td>
                      <td className="p-4 text-slate-500">Data Dummy Hutang/Piutang</td>
                      <td className="p-4 text-slate-500">Rp 0</td>
                      <td className="p-4 text-slate-500">Rp 5.000.000</td>
                      <td className="p-4 text-slate-500">Rp 5.000.000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
