'use client';

import React, { useState } from 'react';
import { Scan, CheckCircle2, AlertCircle, Clock, Package, ChevronRight, Tag } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface CylinderScan {
  id: string;
  cylinderSerial: string;
  nfcTagId: string;
  weightKg: number;
  scanTime: string;
  operator: string;
  hydrotestExpiry: string;
  hydrotestStatus: 'valid' | 'expiring-soon' | 'expired';
  fillStatus: 'filled' | 'empty' | 'rejected';
  bay: string;
}

const CYLINDER_SCANS: CylinderScan[] = [
  {
    id: 'cyl-nfc-001',
    cylinderSerial: 'CYL-2026-CNG-0847',
    nfcTagId: 'NFC:A3:B7:C2:09',
    weightKg: 12,
    scanTime: '06:22:58',
    operator: 'Dian Prasetyo',
    hydrotestExpiry: '2029-03-15',
    hydrotestStatus: 'valid',
    fillStatus: 'filled',
    bay: 'Bay 1 Filling Shed',
  },
  {
    id: 'cyl-nfc-002',
    cylinderSerial: 'CYL-2025-CNG-1203',
    nfcTagId: 'NFC:F1:44:8D:2A',
    weightKg: 12,
    scanTime: '06:21:34',
    operator: 'Dian Prasetyo',
    hydrotestExpiry: '2026-09-08',
    hydrotestStatus: 'expiring-soon',
    fillStatus: 'filled',
    bay: 'Bay 1 Filling Shed',
  },
  {
    id: 'cyl-nfc-003',
    cylinderSerial: 'CYL-2023-CNG-0551',
    nfcTagId: 'NFC:7E:C0:31:B5',
    weightKg: 12,
    scanTime: '06:19:11',
    operator: 'Dian Prasetyo',
    hydrotestExpiry: '2025-12-20',
    hydrotestStatus: 'expired',
    fillStatus: 'rejected',
    bay: 'Bay 1 Filling Shed',
  },
  {
    id: 'cyl-nfc-004',
    cylinderSerial: 'CYL-2026-CNG-0912',
    nfcTagId: 'NFC:8B:11:4A:99',
    weightKg: 12,
    scanTime: '06:15:22',
    operator: 'Dian Prasetyo',
    hydrotestExpiry: '2029-01-10',
    hydrotestStatus: 'valid',
    fillStatus: 'filled',
    bay: 'Bay 2 Filling Shed',
  },
];

function HydrotestBadge({ status }: { status: CylinderScan['hydrotestStatus'] }) {
  if (status === 'valid') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
        <CheckCircle2 size={11} className="text-emerald-500" />
        <span>Hydrotest Valid</span>
      </span>
    );
  }
  if (status === 'expiring-soon') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
        <Clock size={11} className="text-amber-500 animate-pulse" />
        <span>Expiring Soon</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
      <AlertCircle size={11} className="text-rose-500 animate-bounce" />
      <span>Expired</span>
    </span>
  );
}

function FillStatusBadge({ status }: { status: CylinderScan['fillStatus'] }) {
  if (status === 'filled') {
    return <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0 align-middle">Filled OK</span>;
  }
  if (status === 'rejected') {
    return <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800 whitespace-nowrap shrink-0 align-middle">Rejected</span>;
  }
  return <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 align-middle">Empty</span>;
}

export default function CylinderNfcLogCard() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScans = CYLINDER_SCANS.filter(
    (c) =>
      c.cylinderSerial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nfcTagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bay.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validCount = CYLINDER_SCANS.filter((c) => c.hydrotestStatus === 'valid').length;
  const rejectedCount = CYLINDER_SCANS.filter((c) => c.fillStatus === 'rejected').length;

  return (
    <div className="h-full flex flex-col justify-between gap-5 p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-emerald-500/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center shrink-0">
            <Scan size={20} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">CNG Cylinder NFC Log</h2>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">12Kg CNG / Cradle Tube-Skid · Real-time Scans</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 align-middle">
            {validCount} Valid
          </span>
          {rejectedCount > 0 && (
            <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 align-middle">
              {rejectedCount} Rejected
            </span>
          )}
        </div>
      </div>

      {/* Search Bar & Summary Row */}
      <div className="space-y-3">
        <div className="relative">
          <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search CNG serial, NFC tag, bay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{CYLINDER_SCANS.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Scanned</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-3 border border-emerald-200/80 dark:border-emerald-800/80 text-center">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{validCount}</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">Valid</div>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/40 rounded-2xl p-3 border border-rose-200/80 dark:border-rose-800/80 text-center">
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 tabular-nums">{rejectedCount}</div>
            <div className="text-[11px] text-rose-700 dark:text-rose-300 font-bold uppercase tracking-wider">Rejected</div>
          </div>
        </div>
      </div>

      {/* Cylinder list */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[260px] scrollbar-thin pr-1">
        {filteredScans.length > 0 ? (
          filteredScans.map((scan) => (
            <div
              key={scan.id}
              className={`rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer ${
                hoveredRow === scan.id
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-cyan-300 dark:border-cyan-700 shadow-md scale-[1.01]'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              } ${scan.fillStatus === 'rejected' ? 'border-rose-200 dark:border-rose-900/80 bg-rose-50/40 dark:bg-rose-950/20' : ''}`}
              onMouseEnter={() => setHoveredRow(scan.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Row top */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      scan.fillStatus === 'rejected' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Package size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 dark:text-white font-mono truncate">{scan.cylinderSerial}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Tag size={11} className="text-indigo-500 shrink-0" />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold font-mono truncate">{scan.nfcTagId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <FillStatusBadge status={scan.fillStatus} />
                </div>
              </div>

              {/* Row bottom */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <HydrotestBadge status={scan.hydrotestStatus} />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">{scan.weightKg}Kg CNG</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="tabular-nums text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">{scan.scanTime}</span>
                  {hoveredRow === scan.id && <ChevronRight size={14} className="text-cyan-500 animate-pulse" />}
                </div>
              </div>

              {/* Hydrotest expiry if expiring/expired */}
              {(scan.hydrotestStatus === 'expiring-soon' || scan.hydrotestStatus === 'expired') && (
                <div
                  className={`mt-2.5 pt-2 border-t text-[11px] font-bold flex items-center gap-1.5 ${
                    scan.hydrotestStatus === 'expired' ? 'border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400' : 'border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <Clock size={12} />
                  <span>Hydrotest Expiry:</span>
                  <strong className="font-mono underline ml-0.5">{scan.hydrotestExpiry}</strong>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs font-bold text-slate-400 italic">No CNG cylinder scans found matching filter.</div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Operator: <strong className="text-slate-700 dark:text-slate-300">Dian Prasetyo (SIO ATEX)</strong></span>
        <span className="text-cyan-600 dark:text-cyan-400 font-extrabold flex items-center gap-1">
          <span>NFC Reader Active</span>
          <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
}