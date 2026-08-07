'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import { BuildingOffice2Icon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Asset {
  id: number;
  kode: string;
  nama: string;
  kelompok: string;
  nilai: number;
  penyusutan: number;
}

export default function WorksheetAsset() {
  const [assets, setAssets] = useState<Asset[]>([
    { id: 1, kode: 'AST-1001', nama: 'Kompresor CNG 3-Stage', kelompok: 'Mesin & Peralatan', nilai: 1500000000, penyusutan: 300000000 },
    { id: 2, kode: 'AST-1002', nama: 'Prime Mover Hino 500', kelompok: 'Kendaraan', nilai: 800000000, penyusutan: 160000000 },
    { id: 3, kode: 'AST-1003', nama: 'Skid Trailer 20ft', kelompok: 'Kendaraan', nilai: 450000000, penyusutan: 90000000 },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ nama: '', kelompok: 'Mesin & Peralatan', nilai: '' });

  const formatRp = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = assets.length + 1;
    setAssets([...assets, {
      id,
      kode: `AST-100${id + 3}`,
      nama: newAsset.nama,
      kelompok: newAsset.kelompok,
      nilai: Number(newAsset.nilai),
      penyusutan: 0,
    }]);
    setIsModalOpen(false);
    setNewAsset({ nama: '', kelompok: 'Mesin & Peralatan', nilai: '' });
  };

  const handleDelete = (id: number) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between relative">
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl min-h-[50vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <BuildingOffice2Icon className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Buku Aset Tetap</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pencatatan aset operasional perusahaan.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
              >
                <PlusIcon className="w-5 h-5" /> Tambah Aset Baru
              </button>
            </div>
            
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Kode Aset</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Nama Aset</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Kelompok</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right">Nilai Perolehan</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right">Akum. Penyusutan</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right">Nilai Buku</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-slate-900/50">
                  {assets.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-500">Belum ada data aset.</td></tr>
                  ) : assets.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{a.kode}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{a.nama}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-semibold">{a.kelompok}</span></td>
                      <td className="p-4 text-right font-mono text-slate-700 dark:text-slate-300">{formatRp(a.nilai)}</td>
                      <td className="p-4 text-right font-mono text-rose-600 dark:text-rose-400">-{formatRp(a.penyusutan)}</td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatRp(a.nilai - a.penyusutan)}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(a.id)} className="text-rose-500 hover:text-rose-600 text-xs font-bold underline">Hapus</button>
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
                <PlusIcon className="w-6 h-6 text-emerald-500" />
                Registrasi Aset Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Aset</label>
                <input required type="text" value={newAsset.nama} onChange={e => setNewAsset({...newAsset, nama: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Genset 100KVA" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kelompok Aset</label>
                <select value={newAsset.kelompok} onChange={e => setNewAsset({...newAsset, kelompok: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Mesin & Peralatan</option>
                  <option>Kendaraan</option>
                  <option>Bangunan</option>
                  <option>Inventaris Kantor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nilai Perolehan (Rp)</label>
                <input required type="number" value={newAsset.nilai} onChange={e => setNewAsset({...newAsset, nilai: e.target.value})} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="10000000" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-colors">Simpan Aset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
