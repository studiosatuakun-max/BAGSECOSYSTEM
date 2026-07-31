'use client';

import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet, Receipt, Briefcase } from 'lucide-react';

interface CashbookCardProps {
  transactions: {
    id: string;
    date: string;
    description: string;
    type: 'Kredit' | 'Debit';
    amount: number;
  }[];
}

export default function CashbookCard({ transactions }: CashbookCardProps) {
  const totalKredit = transactions.filter(t => t.type === 'Kredit').reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'Debit').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl w-full h-full flex flex-col group transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Wallet size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Buku Kas (General Ledger)
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Mutasi Pemasukan & Pengeluaran Mother Station
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cash In (Kredit)</span>
            <span className="text-sm font-black text-emerald-500">Rp {totalKredit.toLocaleString('id-ID')}</span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cash Out (Debit)</span>
            <span className="text-sm font-black text-rose-500">Rp {totalDebit.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[350px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
            <Briefcase size={32} className="mb-2 opacity-50" />
            <p>Belum ada riwayat mutasi kas</p>
          </div>
        ) : (
          transactions.map((trx) => (
            <div key={trx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  trx.type === 'Kredit' 
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' 
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'
                }`}>
                  {trx.type === 'Kredit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {trx.description}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {trx.date}
                  </p>
                </div>
              </div>
              
              <div className="text-right shrink-0 ml-4">
                <span className={`text-sm font-black ${
                  trx.type === 'Kredit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {trx.type === 'Kredit' ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
