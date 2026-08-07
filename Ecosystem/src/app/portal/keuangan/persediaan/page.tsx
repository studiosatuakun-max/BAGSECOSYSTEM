'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import { ArchiveBoxIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Inventory {
  id: number;
  kode: string;
  nama: string;
  satuan: string;
  stokAwal: number;
  mutasi: number;
}

export default function WorksheetPersediaan() {
  const [items, setItems] = useState<Inventory[]>([
    { id: 1, kode: 'ITM-4001', nama: 'Tabung CNG 12Kg', satuan: 'Pcs', stokAwal: 100, mutasi: -10 },
    { id: 2, kode: 'ITM-4002', nama: 'Volume Gas Terkompresi (CNG)', satuan: 'MMBTU', stokAwal: 5000, mutasi: 200 },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ nama: '', satuan: 'Pcs', mutasi: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = items.length + 1;
    setItems([...items, {
      id,
      kode: `ITM-400${id+2}`,
      nama: newItem.nama,
      satuan: newItem.satuan,
      stokAwal: 0,
      mutasi: Number(newItem.mutasi),
    }]);
    setIsModalOpen(false);
    setNewItem({ nama: '', satuan: 'Pcs', mutasi: '' });
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between relative">
      <div>
        <PortalHeader
          title="Modul Persediaan"
          subtitle="Worksheet: Inventory, Stok Gas & Suku Cadang"
          roleBadge="CFO Access"
          roleColor="purple"
          backUrl="/portal/keuangan"
          backText="Kembali ke Menu Keuangan"
        />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl min-h-[50vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <ArchiveBoxIcon className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kartu Stok Gudang</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pemantauan volume gas, tabung, dan suku cadang.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5"
              >
                <PlusIcon className="w-5 h-5" /> Catat Barang Masuk
              </button>
            </div>
            
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Kode Barang</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Nama Barang</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Satuan</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Stok Awal</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Mutasi</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Stok Akhir</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-slate-900/50">
                  {items.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-500">Belum ada barang.</td></tr>
                  ) : items.map(i => (
                    <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{i.kode}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{i.nama}</td>
                      <td className="p-4 text-center"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-semibold">{i.satuan}</span></td>
                      <td className="p-4 text-center text-slate-500">{i.stokAwal}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${i.mutasi > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {i.mutasi > 0 ? '+' : ''}{i.mutasi}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-800 dark:text-white">{i.stokAwal + i.mutasi}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(i.id)} className="text-rose-500 hover:text-rose-600 text-xs font-bold underline">Hapus</button>
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
                <PlusIcon className="w-6 h-6 text-purple-500" />
                Catat Barang Masuk/Keluar
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Barang</label>
                <input required type="text" value={newItem.nama} onChange={e => setNewItem({...newItem, nama: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Contoh: Suku Cadang A" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Satuan</label>
                <select value={newItem.satuan} onChange={e => setNewItem({...newItem, satuan: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Pcs</option>
                  <option>MMBTU</option>
                  <option>LSP</option>
                  <option>Kg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Mutasi (Gunakan (-) untuk barang keluar)</label>
                <input required type="number" value={newItem.mutasi} onChange={e => setNewItem({...newItem, mutasi: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="-10 atau 50" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition-colors">Simpan Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
