'use client';

import React, { useState } from 'react';
import { Scan, CheckCircle2, AlertCircle, Clock, Package, ChevronRight, Tag, Wifi } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface CylinderScan {
  id: string;
  cylinderSerial: string;
  rfidEpc: string;
  weightKg: number;
  scanTime: string;
  operator: string;
  hydrotestExpiry: string;
  hydrotestStatus: 'valid' | 'expiring-soon' | 'expired';
  fillStatus: 'ready' | 'filled' | 'rejected';
}

const MOCK_SCANS: CylinderScan[] = [
  { id: 'cyl-rfid-001', cylinderSerial: 'CYL-26-CNG-0847', rfidEpc: 'EPC:ALIEN:H3:A3B7C209', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2029-03-15', hydrotestStatus: 'valid', fillStatus: 'ready' },
  { id: 'cyl-rfid-002', cylinderSerial: 'CYL-25-CNG-1203', rfidEpc: 'EPC:ALIEN:H3:F1448D2A', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2026-09-08', hydrotestStatus: 'expiring-soon', fillStatus: 'ready' },
  { id: 'cyl-rfid-003', cylinderSerial: 'CYL-23-CNG-0551', rfidEpc: 'EPC:ALIEN:H3:7EC031B5', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2025-12-20', hydrotestStatus: 'expired', fillStatus: 'rejected' },
  { id: 'cyl-rfid-004', cylinderSerial: 'CYL-26-CNG-0912', rfidEpc: 'EPC:ALIEN:H3:8B114A99', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2029-01-10', hydrotestStatus: 'valid', fillStatus: 'ready' },
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
  return <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0 align-middle">Ready to Fill</span>;
}

export default function UHFCylinderRfidLogCard() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scans, setScans] = useState<CylinderScan[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const filteredScans = scans.filter(
    (c) =>
      c.cylinderSerial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rfidEpc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validCount = scans.filter((c) => c.hydrotestStatus === 'valid').length;
  const rejectedCount = scans.filter((c) => c.fillStatus === 'rejected').length;

  const simulateBatchScan = () => {
    setIsScanning(true);
    // Simulate Cardteck i607 reading 27 tags at once (we'll just load the mock 4 for demo)
    setTimeout(() => {
      setScans(MOCK_SCANS);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col justify-between gap-5 p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-emerald-500/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 relative overflow-hidden">
            <Wifi size={20} className="text-indigo-600 dark:text-indigo-400 z-10" />
            {isScanning && <div className="absolute inset-0 bg-indigo-400/30 animate-ping rounded-2xl" />}
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">UHF RFID HORECA 12Kg Scanner</h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 flex items-center gap-1">
              <span>Cardteck CT-i607 / Alien H3 Tags</span>
              {isScanning && <span className="animate-pulse">· Scanning...</span>}
            </p>
          </div>
        </div>
        <button
          onClick={simulateBatchScan}
          disabled={isScanning}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          <Scan size={14} className={isScanning ? 'animate-spin' : ''} />
          {isScanning ? 'Reading EPC Gen2...' : 'Simulate Batch Scan'}
        </button>
      </div>

      {/* Search Bar & Summary Row */}
      <div className="space-y-3">
        <div className="relative">
          <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search CNG serial, EPC tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{scans.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Detected</div>
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
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-indigo-300 dark:border-indigo-700 shadow-md scale-[1.01]'
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
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold font-mono truncate">{scan.rfidEpc}</span>
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
                  <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">{scan.weightKg}Kg</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="tabular-nums text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">{scan.scanTime}</span>
                  {hoveredRow === scan.id && <ChevronRight size={14} className="text-indigo-500 animate-pulse" />}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-center text-xs font-bold text-slate-400 italic">
            <Wifi size={24} className="text-slate-300 dark:text-slate-700 mb-1" />
            <p>Waiting for Cardteck i607 scan event...</p>
            <p className="text-[10px] text-slate-500">Ensure Tubeskid Gurita is within 7m range.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Reader: <strong className="text-slate-700 dark:text-slate-300 font-mono">CT-i607 [TCP/IP]</strong></span>
        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Antenna Active (868-928Mhz)</span>
        </span>
      </div>
    </div>
  );
}