"use client";

import React, { useState, useEffect } from 'react';
import { 
  CpuChipIcon, 
  TruckIcon, 
  BanknotesIcon, 
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import PortalHeader from '@/components/PortalHeader';

const GM_METRICS = [
  { id: 1, title: 'Mother Station OEE', value: '94.2%', icon: CpuChipIcon, color: 'text-emerald-400', status: 'Optimal' },
  { id: 2, title: 'Fleet Readiness', value: '18 / 20', subtitle: 'Trucks Active', icon: TruckIcon, color: 'text-blue-400', status: '2 in Maintenance' },
  { id: 3, title: 'AR Overdue > 30 Days', value: 'Rp 450M', icon: BanknotesIcon, color: 'text-rose-400', status: 'Requires Action' },
  { id: 4, title: 'HSE Zero Accident', value: '142 Days', icon: ShieldExclamationIcon, color: 'text-amber-400', status: 'Safe' },
];

const CROSS_DIVISION_BOTTLENECKS = [
  { 
    id: 'BTN-001', 
    division: 'Armada', 
    issue: 'Truk B-9012-XYZ Turun Mesin (Engine Overhaul).', 
    impact: 'Kapasitas pengiriman turun 5% minggu ini.', 
    severity: 'High', 
    action: 'Approve Rental Truk Pengganti' 
  },
  { 
    id: 'BTN-002', 
    division: 'Keuangan', 
    issue: 'Tagihan PT Indofood Nunggak 45 Hari.', 
    impact: 'Cash flow terhambat Rp 250 Juta.', 
    severity: 'Medium', 
    action: 'Follow Up ke Finance Director Klien' 
  },
  { 
    id: 'BTN-003', 
    division: 'Legal', 
    issue: 'Kontrak SLA PT Unilever Expire dalam 18 Hari.', 
    impact: 'Risiko kehilangan volume 5000 MMBTU/bulan.', 
    severity: 'Critical', 
    action: 'Push Tim Sales (AE) untuk Closing' 
  },
  { 
    id: 'BTN-004', 
    division: 'Stasiun', 
    issue: 'Filter Kompresor B Waktunya Penggantian Rutin.', 
    impact: 'OEE bisa turun ke 85% jika ditunda.', 
    severity: 'Low', 
    action: 'Jadwalkan Maintenance Shift Malam' 
  },
];

export default function AdminCommandCenter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden font-sans text-slate-200 flex flex-col">
      
      <PortalHeader
        title="General Manager"
        subtitle="OPERATIONAL COMMAND CENTER - LINTAS DIVISI"
        roleBadge="GM Access"
        roleColor="indigo"
        backUrl="/"
        backText="Exit Portal"
        showInbox={true}
      />

      {/* Background Glowing Orbs (PT BaGS Logo Colors) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 w-full">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Operational Command Center
            </h1>
            <p className="text-white/70 mt-1 font-medium text-sm">Pusat kendali operasional harian, identifikasi bottleneck, dan resolusi masalah lintas divisi.</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-full px-4 py-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-emerald-400 tracking-wide">All Systems Operational</span>
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GM_METRICS.map((metric, idx) => (
            <div 
              key={metric.id} 
              className={`bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-6`}
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{metric.title}</p>
                  {metric.subtitle && <p className="text-white/50 text-[10px] mt-0.5">{metric.subtitle}</p>}
                </div>
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors ${metric.color}`}>
                  <metric.icon className="w-5 h-5" />
                </div>
              </div>
              <h2 className={`text-3xl font-black mt-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transform origin-left transition-transform duration-300 ${metric.color}`}>
                {metric.value}
              </h2>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">{metric.status}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Area (Bento Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          
          {/* Cross-Division Bottlenecks (2/3 width) */}
          <section className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 flex flex-col hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                  Cross-Division Bottlenecks
                </h3>
                <p className="text-sm text-white/50 mt-1">Issues requiring GM approval or intervention today.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto w-full flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-[11px] uppercase tracking-wider">
                    <th className="pb-3 px-3 font-bold">Divisi & Issue</th>
                    <th className="pb-3 px-3 font-bold">Business Impact</th>
                    <th className="pb-3 px-3 font-bold text-center">Severity</th>
                    <th className="pb-3 px-3 font-bold text-right">GM Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {CROSS_DIVISION_BOTTLENECKS.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-3">
                        <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 mb-1.5">
                          {item.division}
                        </div>
                        <p className="text-sm font-bold text-white leading-tight">{item.issue}</p>
                      </td>
                      <td className="py-4 px-3">
                        <p className="text-xs text-white/70 font-medium leading-relaxed">{item.impact}</p>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          item.severity === 'Critical' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]' :
                          item.severity === 'High' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                          'bg-blue-500/20 border-blue-500/30 text-blue-400'
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-indigo-500/25 active:scale-95 whitespace-nowrap">
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Approvals & Reports (1/3 width) */}
          <section className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 flex flex-col hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
            <h3 className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-2 mb-6">
              <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 p-4 rounded-2xl transition-all group text-left">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                  <DocumentTextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Approve PO BBM Armada</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">2 pending requests</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 p-4 rounded-2xl transition-all group text-left">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                  <BanknotesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sign Off Petty Cash</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Operasional Stasiun Induk</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 p-4 rounded-2xl transition-all group text-left">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Maintenance Log</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Review jadwal servis kompresor</p>
                </div>
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
