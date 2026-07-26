'use client';

import React from 'react';
import { MapPin, Droplets, RefreshCw, Clock, Tag, Zap, ShieldCheck } from 'lucide-react';

const tankData = {
  id: 'tank-skd-jkt-04',
  tankId: 'SKD-JKT-04 (B 9120 VGL)',
  location: 'PT Krakatau Baja Smelter (Manifold PRMS #1)',
  gasType: 'CNG Tube Skid Storage (CH4 · 250 Bar)',
  capacity: '5,000 Sm³ (180 MMBTU)',
  fillLevel: 85,
  lastRefillDate: '24 Jul 2026',
  lastRefillVolume: '4,250 Sm³',
  nextScheduledRefill: '28 Jul 2026 (Milk-run)',
  installDate: '12 Mar 2025',
  status: 'nominal' as const,
  technician: 'Rina Wulandari (QHSE & Metering)',
};

export default function TankInfoCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-indigo-500/50">
      <div>
        <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400 font-bold">
              <Droplets size={18} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Custody Transfer Storage
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                {tankData.tankId}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
            Nominal 245 Bar
          </span>
        </div>

        {/* Tank ID + Fill Level */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Tag size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">{tankData.gasType}</span>
            </div>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{tankData.fillLevel}% Full</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${tankData.fillLevel}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1.5">
            <span>0 Sm³</span>
            <span>Capacity: {tankData.capacity}</span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase mb-0.5">
              <MapPin size={12} />
              <span>Client Station</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white truncate" title={tankData.location}>
              {tankData.location}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase mb-0.5">
              <RefreshCw size={12} />
              <span>Last Custody Transfer</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white tabular-nums">
              {tankData.lastRefillDate} ({tankData.lastRefillVolume})
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase mb-0.5">
              <Clock size={12} />
              <span>Next Schedule</span>
            </div>
            <p className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {tankData.nextScheduledRefill}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase mb-0.5">
              <ShieldCheck size={12} />
              <span>Verified Officer</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {tankData.technician}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span>ISO 11120 Tube Skid Certification</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">MIGAS Inspected</span>
      </div>
    </div>
  );
}