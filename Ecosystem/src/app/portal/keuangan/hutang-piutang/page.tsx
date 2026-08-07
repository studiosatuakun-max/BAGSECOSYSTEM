'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import { DocumentTextIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface APAR {
  id: number;
  tanggal: string;
  noBukti: string;
  keterangan: string;
  tipe: 'Hutang' | 'Piutang';
  jumlah: number;
}

export default function WorksheetHutangPiutang() {
  const [records, setRecords] = useState<APAR[]>([
    { id: 1, tanggal: '01-08-2026', noBukti: 'INV-2001', keterangan: 'Tagihan PT Krakatau Baja', tipe: 'Piutang', jumlah: 50000000 },
    { id: 2, tanggal: '03-08-2026', noBukti: 'PO-3012', keterangan: 'Pembelian Gas Feed PLN', tipe: 'Hutang', jumlah: 20000000 },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({ keterangan: '', tipe: 'Piutang', jumlah: '' });

  const formatRp = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = records.length + 1;
    setRecords([...records, {
      id,
      tanggal: new Date().toLocaleDateString('id-ID'),
      noBukti: newRecord.tipe === 'Piutang' ? `INV-200${id+1}` : `PO-301${id+1}`,
      keterangan: newRecord.keterangan,
      tipe: newRecord.tipe as 'Hutang'|'Piutang',
      jumlah: Number(newRecord.jumlah),
    }]);
    setIsModalOpen(false);
    setNewRecord({ keterangan: '', tipe: 'Piutang', jumlah: '' });
  };

  const handleDelete = (id: number) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between relative">
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl min-h-[50vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Buku Pembantu Hutang & Piutang</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pencatatan rincian tagihan pihak ketiga.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
              >
                <PlusIcon className="w-5 h-5" /> Catat Hutang/Piutang Baru
              </button>
            </div>
            
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Tanggal</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">No. Bukti</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Tipe</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Keterangan</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right">Jumlah</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-slate-900/50">
                  {records.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada data.</td></tr>
                  ) : records.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 text-slate-500">{r.tanggal}</td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{r.noBukti}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${r.tipe === 'Piutang' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                          {r.tipe}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{r.keterangan}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">{formatRp(r.jumlah)}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(r.id)} className="text-rose-500 hover:text-rose-600 text-xs font-bold underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusIcon className="w-6 h-6 text-indigo-500" />
                Tambah Catatan
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tipe</label>
                <select value={newRecord.tipe} onChange={e => setNewRecord({...newRecord, tipe: e.target.value as 'Hutang'|'Piutang'})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Piutang</option>
                  <option>Hutang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Keterangan</label>
                <input required type="text" value={newRecord.keterangan} onChange={e => setNewRecord({...newRecord, keterangan: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Tagihan Vendor..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah (Rp)</label>
                <input required type="number" value={newRecord.jumlah} onChange={e => setNewRecord({...newRecord, jumlah: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="10000000" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-colors">Simpan Catatan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
