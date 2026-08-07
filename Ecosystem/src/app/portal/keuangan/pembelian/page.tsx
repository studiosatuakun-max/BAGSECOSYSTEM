'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import { ShoppingCartIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PO {
  id: number;
  tanggal: string;
  noPo: string;
  vendor: string;
  item: string;
  total: number;
  status: 'Lunas' | 'Hutang';
}

export default function WorksheetPembelian() {
  const [pos, setPos] = useState<PO[]>([
    { id: 1, tanggal: '01-08-2026', noPo: 'PO-3001', vendor: 'PT Vendor Dummy 1', item: 'Komponen Kompresor', total: 15000000, status: 'Lunas' },
    { id: 2, tanggal: '02-08-2026', noPo: 'PO-3002', vendor: 'PLN Persero', item: 'Token Listrik Mother Station', total: 50000000, status: 'Lunas' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPo, setNewPo] = useState({ vendor: '', item: '', total: '', status: 'Hutang' });

  const formatRp = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = pos.length + 1;
    setPos([...pos, {
      id,
      tanggal: new Date().toLocaleDateString('id-ID'),
      noPo: `PO-300${id+2}`,
      vendor: newPo.vendor,
      item: newPo.item,
      total: Number(newPo.total),
      status: newPo.status as 'Lunas' | 'Hutang',
    }]);
    setIsModalOpen(false);
    setNewPo({ vendor: '', item: '', total: '', status: 'Hutang' });
  };

  const handleDelete = (id: number) => {
    setPos(pos.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between relative">
      <div>
        <PortalHeader
          title="Modul Pembelian"
          subtitle="Worksheet: Purchase Orders, Vendor & Pengadaan"
          roleBadge="CFO Access"
          roleColor="rose"
          backUrl="/portal/keuangan"
          backText="Kembali ke Menu Keuangan"
        />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl min-h-[50vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <ShoppingCartIcon className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Purchase Orders</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pusat pencatatan pembelian persediaan & vendor.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all hover:-translate-y-0.5"
              >
                <PlusIcon className="w-5 h-5" /> Buat PO Baru
              </button>
            </div>
            
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Tanggal</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">No. PO</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Vendor</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Item</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right">Total Biaya</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Status</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-slate-900/50">
                  {pos.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-500">Belum ada PO.</td></tr>
                  ) : pos.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 text-slate-500">{p.tanggal}</td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{p.noPo}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{p.vendor}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{p.item}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">{formatRp(p.total)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${p.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(p.id)} className="text-rose-500 hover:text-rose-600 text-xs font-bold underline">Hapus</button>
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
                <PlusIcon className="w-6 h-6 text-rose-500" />
                Buat PO Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Vendor</label>
                <input required type="text" value={newPo.vendor} onChange={e => setNewPo({...newPo, vendor: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="PT Maju Mundur" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Item yang dibeli</label>
                <input required type="text" value={newPo.item} onChange={e => setNewPo({...newPo, item: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Komponen..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Total Biaya (Rp)</label>
                <input required type="number" value={newPo.total} onChange={e => setNewPo({...newPo, total: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="10000000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status Pembayaran</label>
                <select value={newPo.status} onChange={e => setNewPo({...newPo, status: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option>Lunas</option>
                  <option>Hutang</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/20 transition-colors">Simpan PO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
