'use client';

import React, { useState, useTransition } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createOpex } from '../_integration/actions';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
}

export default function AddExpenseModal({ onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Logistik & Transportasi');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const amountIdr = parseFloat(amount);
      if (isNaN(amountIdr) || amountIdr <= 0) {
        toast.error('Jumlah pengeluaran tidak valid');
        return;
      }

      const res = await createOpex({
        date,
        category,
        description,
        amount_idr: amountIdr,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Pengeluaran operasional berhasil dicatat');
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">Catat Pengeluaran (OPEX)</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <form id="opex-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tanggal</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none" />
            </div>
            
            <div>
              <label className="block text-xs text-slate-400 mb-1">Kategori</label>
              <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none">
                <option value="Logistik & Transportasi">Logistik & Transportasi</option>
                <option value="Maintenance Mother Station">Maintenance Mother Station</option>
                <option value="Biaya Listrik Kompresi">Biaya Listrik Kompresi</option>
                <option value="Operasional Kantor">Operasional Kantor</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Deskripsi / Keterangan</label>
              <input required type="text" placeholder="Contoh: Perbaikan valve skid A" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none" />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Jumlah (IDR)</label>
              <input required type="number" min="0" step="1000" placeholder="500000" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-amber-500/50 outline-none" />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3 bg-slate-900/50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            Batal
          </button>
          <button 
            type="submit" 
            form="opex-form"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}
