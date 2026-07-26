'use client';

import React, { useState } from 'react';
import { Truck, AlertTriangle, CheckCircle2, PhoneCall, Radio, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

const initialEmergencies = [
  {
    id: 'SOS-901',
    driver: 'Ahmad Fauzi (B 9120 VGL)',
    location: 'Tol Japek KM 42 (Arah Cikampek)',
    issue: 'Ban Belakang Bocor · Muatan 2,500 Sm³ CNG',
    severity: 'High',
    time: '4m ago',
    status: 'Pending Dispatch',
  },
  {
    id: 'SOS-902',
    driver: 'PT Krakatau Smelter (Manifold #1)',
    location: 'PRMS Client Station Cilegon',
    issue: 'Tekanan Header Turun ke 3.2 Bar (Threshold 3.5 Bar)',
    severity: 'Urgent',
    time: '12m ago',
    status: 'In Assistance',
  },
  {
    id: 'SOS-903',
    driver: 'Dian Prasetyo (B 9200 VGL)',
    location: 'Gerbang Tol Pasteur Bandung',
    issue: 'Kendala E-Toll & Dokumen Surat Jalan MIGAS',
    severity: 'Normal',
    time: '25m ago',
    status: 'Pending Dispatch',
  },
];

export default function EmergencyDispatchFeed() {
  const [feed, setFeed] = useState(initialEmergencies);

  const handleDispatchBackup = (id: string, driver: string) => {
    setFeed(feed.filter((item) => item.id !== id));
    toast.success(`Unit bantuan darurat & mekanik diberangkatkan ke lokasi ${driver}`);
  };

  const handleResolveSOS = (id: string, driver: string) => {
    setFeed(feed.filter((item) => item.id !== id));
    toast.info(`Insiden ${driver} berhasil diselesaikan melalui bantuan remote CS`);
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between h-full transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400 font-bold">
              <Radio size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Live Emergency Dispatch &amp; Highway SOS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-bold text-rose-600 dark:text-rose-400">{feed.length} sinyal darurat</span> armada Skid Tank &amp; alarm PRMS klien
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Opening Full GPS Telemetry & Milk-Run Route Radar...')}
            className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors shrink-0"
          >
            <span>Live GPS Radar</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {feed.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium text-xs">
              Semua rute armada dan tekanan manifold PRMS klien dalam kondisi aman! 🚚💨
            </div>
          ) : (
            feed.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.severity === 'Urgent' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' :
                    item.severity === 'High' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                    'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                  }`}>
                    {item.severity === 'Urgent' ? <AlertTriangle size={18} /> : <Truck size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {item.driver}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border whitespace-nowrap shrink-0 align-middle ${
                        item.severity === 'Urgent' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' :
                        'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                      {item.issue}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      📍 {item.location} · <span className="font-semibold text-slate-600 dark:text-slate-300">{item.time}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDispatchBackup(item.id, item.driver)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs transition-all active:scale-95 shadow-md shadow-rose-950/30"
                    title="Dispatch Emergency Mechanic & Backup"
                  >
                    <PhoneCall size={13} />
                    <span>Dispatch Backup</span>
                  </button>
                  <button
                    onClick={() => handleResolveSOS(item.id, item.driver)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs transition-all active:scale-95"
                    title="Mark SOS as Resolved"
                  >
                    <CheckCircle2 size={14} />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
        <span>SLA tanggap darurat jalan tol maksimal 15 menit</span>
        <span className="text-rose-600 dark:text-rose-400 font-bold">24/7 Hotline Aktif</span>
      </div>
    </div>
  );
}
