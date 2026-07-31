'use client';

import React from 'react';
import { FileText, Download, ExternalLink, Calendar, Receipt } from 'lucide-react';

interface DocumentVaultCardProps {
  documents: {
    id: string;
    invoice_no: string;
    customer_name: string;
    date: string;
    url: string;
    type: 'Industri' | 'Horeca';
  }[];
}

export default function DocumentVaultCard({ documents }: DocumentVaultCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl w-full h-full flex flex-col group transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <FileText size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Arsip Dokumen Tagihan
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Kumpulan E-Faktur dan Bukti Cetak
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            {documents.length} File Tersedia
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[260px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
            <Receipt size={32} className="mb-2 opacity-50" />
            <p>Belum ada dokumen yang diunggah</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors group/item">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {doc.customer_name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <Receipt size={12} /> {doc.invoice_no}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {doc.date}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${doc.type === 'Industri' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                      {doc.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-600"
                  title="Lihat Dokumen"
                >
                  <ExternalLink size={16} />
                </a>
                <a 
                  href={doc.url} 
                  download
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                  title="Download File"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
