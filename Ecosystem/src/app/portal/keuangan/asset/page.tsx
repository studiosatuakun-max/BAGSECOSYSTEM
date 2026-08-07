import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function WorksheetAsset() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <div>
        <PortalHeader
          title="Modul Asset"
          subtitle="Worksheet: Fixed Assets & Daftar Penyusutan"
          roleBadge="CFO Access"
          roleColor="emerald"
          backUrl="/portal/keuangan"
          backText="Kembali ke Menu Keuangan"
        />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          <div className="bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center text-center min-h-[50vh]">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <BuildingOffice2Icon className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Worksheet Asset & Penyusutan</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mb-8">
              Buku besar pencatatan aset tetap perusahaan (Mother Station, Prime Mover, Skid) dan jadwal penyusutan otomatis.
            </p>
            <div className="w-full max-w-4xl overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 opacity-50 pointer-events-none">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Kode Aset</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Nama Aset</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Kelompok</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Nilai Perolehan</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Akum. Penyusutan</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Nilai Buku</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-slate-900">
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td className="p-4 text-slate-500">AST-{1000 + i}</td>
                      <td className="p-4 text-slate-500">Dummy Asset {i}</td>
                      <td className="p-4 text-slate-500">Mesin & Peralatan</td>
                      <td className="p-4 text-slate-500">Rp 100.000.000</td>
                      <td className="p-4 text-slate-500">Rp 20.000.000</td>
                      <td className="p-4 text-slate-500">Rp 80.000.000</td>
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
