'use client';

import React, { useState } from 'react';
import { 
  Squares2X2Icon, 
  BanknotesIcon, 
  CreditCardIcon, 
  ArchiveBoxIcon, 
  DocumentChartBarIcon 
} from '@heroicons/react/24/outline';

interface ZahirModuleSwitcherProps {
  dashboardComponent: React.ReactNode;
  salesComponent: React.ReactNode;
  cashBankComponent: React.ReactNode;
  dataMasterComponent: React.ReactNode;
  reportComponent: React.ReactNode;
}

export default function ZahirModuleSwitcher({
  dashboardComponent,
  salesComponent,
  cashBankComponent,
  dataMasterComponent,
  reportComponent,
}: ZahirModuleSwitcherProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { id: 'sales', label: 'Penjualan & Piutang', icon: BanknotesIcon },
    { id: 'cashbank', label: 'Kas & Bank', icon: CreditCardIcon },
    { id: 'datamaster', label: 'Data & Arsip', icon: ArchiveBoxIcon },
    { id: 'reports', label: 'Laporan', icon: DocumentChartBarIcon },
  ];

  return (
    <div className="flex flex-col space-y-6 w-full animate-in fade-in duration-500">
      {/* Top Tab Bar (Pills) */}
      <div className="bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-2 rounded-2xl flex overflow-x-auto hide-scrollbar shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Module Content Area */}
      <div className="w-full relative transition-all duration-500 min-h-[60vh]">
        {activeTab === 'dashboard' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{dashboardComponent}</div>}
        {activeTab === 'sales' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{salesComponent}</div>}
        {activeTab === 'cashbank' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{cashBankComponent}</div>}
        {activeTab === 'datamaster' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{dataMasterComponent}</div>}
        {activeTab === 'reports' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{reportComponent}</div>}
      </div>
    </div>
  );
}
