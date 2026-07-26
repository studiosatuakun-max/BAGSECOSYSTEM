'use client';

import React, { useState } from 'react';
import { WrenchScrewdriverIcon, ShoppingCartIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface Part {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  status: 'Critical' | 'Warning' | 'Healthy';
}

const initialParts: Part[] = [
  { id: 'PRT-CNG-01', name: 'CNG Compressor Piston Seal Kit', category: 'Mother Station', stock: 2, minStock: 5, status: 'Critical' },
  { id: 'PRT-CNG-02', name: 'PRMS High-Pressure Regulator Diaphragm', category: 'Skid Manifold', stock: 4, minStock: 4, status: 'Warning' },
  { id: 'PRT-CNG-03', name: 'Coalescing Filter Element (0.01 Micron)', category: 'Gas Filtration', stock: 12, minStock: 8, status: 'Healthy' },
];

export default function CriticalSparePartsCard() {
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const handleReorder = (part: Part) => {
    setReorderingId(part.id);
    setTimeout(() => {
      setParts((prev) =>
        prev.map((p) => (p.id === part.id ? { ...p, stock: p.stock + 10, status: 'Healthy' } : p))
      );
      setReorderingId(null);
      toast.success('Instant PO Dispatched to Vendor', {
        description: `PO Darurat 10 unit "${part.name}" telah dikirim otomatis ke sistem ERP supplier.`,
      });
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-amber-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
              <WrenchScrewdriverIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                ATEX Inventory Telemetry
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Critical Mother Station &amp; Skid Spare Parts
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase tracking-wider animate-pulse">
            1 Critical Item
          </span>
        </div>

        <div className="space-y-2.5 my-2">
          {parts.map((part) => (
            <div
              key={part.id}
              className={`p-3 rounded-2xl border text-xs transition-all flex items-center justify-between gap-3 ${
                part.status === 'Critical'
                  ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80'
                  : part.status === 'Warning'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white truncate" title={part.name}>{part.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span>{part.category}</span>
                  <span>·</span>
                  <span className={part.stock <= part.minStock ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-emerald-600 dark:text-emerald-400 font-black'}>
                    Stok: {part.stock} (Min: {part.minStock})
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleReorder(part)}
                disabled={reorderingId === part.id || part.status === 'Healthy'}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shrink-0 ${
                  part.status === 'Healthy'
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white shadow-sm active:scale-95 cursor-pointer'
                }`}
              >
                {reorderingId === part.id ? (
                  <span>PO Sending...</span>
                ) : part.status === 'Healthy' ? (
                  <>
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Stock Safe</span>
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="w-3.5 h-3.5" />
                    <span>Instant PO</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <ExclamationTriangleIcon className="w-4 h-4" />
          <span>Auto-Reorder Level Active</span>
        </span>
        <span className="text-[11px]">24/7 Vendor SLA Link</span>
      </div>
    </div>
  );
}
