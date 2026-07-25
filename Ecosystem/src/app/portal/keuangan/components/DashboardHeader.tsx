import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 lg:mb-8">
      <div>
        <h1 className="text-2xl font-700 text-foreground tracking-tight">
          Finance Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ringkasan keuangan · Periode: Juli 2026 · Terakhir diperbarui 20 Jul 2026, 10:49 WIB
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground card-shadow">
          <Calendar size={15} className="text-primary" />
          <span className="font-500">Jan 2026 — Jul 2026</span>
        </div>
        <button className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 active:scale-95 card-shadow">
          <RefreshCw size={14} />
          <span className="hidden sm:inline font-500">Perbarui</span>
        </button>
      </div>
    </div>
  );
}