'use client';
import React, { useState } from 'react';
import { Scan, CheckCircle2, AlertCircle, Clock, Package, ChevronRight, Tag } from 'lucide-react';

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
    cylinderSerial: 'CYL-2024-BG-0847',
    nfcTagId: 'NFC:A3:B7:C2:09',
    weightKg: 12,
    scanTime: '06:22:58',
    operator: 'Dian Prasetyo',
    hydrotestExpiry: '2027-03-15',
    hydrotestStatus: 'valid',
    fillStatus: 'filled',
    bay: 'Bay 1',
  },
  {
    id: 'cyl-nfc-002',
    cylinderSerial: 'CYL-2023-BG-1203',
    nfcTagId: 'NFC:F1:44:8D:2A',
    weightKg: 12,
    scanTime: '06:21:34',
    operator: 'Dian Prasetyo',
    hydrotestExpiry: '2026-09-08',
    hydrotestStatus: 'expiring-soon',
    fillStatus: 'filled',
    bay: 'Bay 1',
  },
  {
    id: 'cyl-nfc-003',
    cylinderSerial: 'CYL-2022-BG-0551',
    nfcTagId: 'NFC:7E:C0:31:B5',
    weightKg: 12,
    scanTime: '06:19:11',
    operator: 'Dian Prasetyo',
    hydrotestExpiry: '2025-12-20',
    hydrotestStatus: 'expired',
    fillStatus: 'rejected',
    bay: 'Bay 1',
  },
];

function HydrotestBadge({ status }: { status: CylinderScan['hydrotestStatus'] }) {
  if (status === 'valid') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-700 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">
        <CheckCircle2 size={9} />
        Hydrotest Valid
      </span>
    );
  }
  if (status === 'expiring-soon') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-700 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
        <Clock size={9} />
        Expiring Soon
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-700 bg-rose-50 border border-rose-200 text-rose-600 px-2 py-0.5 rounded-full">
      <AlertCircle size={9} />
      Expired
    </span>
  );
}

function FillStatusBadge({ status }: { status: CylinderScan['fillStatus'] }) {
  if (status === 'filled') {
    return <span className="text-xs font-600 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">Filled</span>;
  }
  if (status === 'rejected') {
    return <span className="text-xs font-600 text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100">Rejected</span>;
  }
  return <span className="text-xs font-600 text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-100">Empty</span>;
}

export default function CylinderNfcLogCard() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const validCount = CYLINDER_SCANS.filter(c => c.hydrotestStatus === 'valid').length;
  const rejectedCount = CYLINDER_SCANS.filter(c => c.fillStatus === 'rejected').length;

  return (
    <div className="card-elevated h-full flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Scan size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-700 text-foreground leading-tight">Cylinder NFC Log</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">12Kg LPG · Bay 1 · Recent Scans</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-700 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {validCount} Valid
          </span>
          {rejectedCount > 0 && (
            <span className="text-xs font-700 text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              {rejectedCount} Rejected
            </span>
          )}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
          <div className="text-lg font-800 text-foreground tabular-nums">{CYLINDER_SCANS.length}</div>
          <div className="text-xs text-muted-foreground font-medium">Scanned</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 text-center">
          <div className="text-lg font-800 text-emerald-700 tabular-nums">{validCount}</div>
          <div className="text-xs text-emerald-600 font-medium">Valid</div>
        </div>
        <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-100 text-center">
          <div className="text-lg font-800 text-rose-600 tabular-nums">{rejectedCount}</div>
          <div className="text-xs text-rose-500 font-medium">Rejected</div>
        </div>
      </div>

      {/* Cylinder list */}
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin">
        {CYLINDER_SCANS.map((scan, idx) => (
          <div
            key={scan.id}
            className={`rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
              hoveredRow === scan.id
                ? 'bg-slate-50 border-slate-200 shadow-sm'
                : 'bg-white border-border hover:border-slate-200'
            } ${scan.fillStatus === 'rejected' ? 'border-rose-100 bg-rose-50/30' : ''}`}
            onMouseEnter={() => setHoveredRow(scan.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {/* Row top */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  scan.fillStatus === 'rejected' ? 'bg-rose-100' : 'bg-slate-100'
                }`}>
                  <Package size={13} className={scan.fillStatus === 'rejected' ? 'text-rose-500' : 'text-slate-500'} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-700 text-foreground font-mono truncate">{scan.cylinderSerial}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Tag size={9} className="text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground font-medium font-mono truncate">{scan.nfcTagId}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <FillStatusBadge status={scan.fillStatus} />
              </div>
            </div>

            {/* Row bottom */}
            <div className="flex items-center justify-between gap-2">
              <HydrotestBadge status={scan.hydrotestStatus} />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">{scan.weightKg}Kg</span>
                <span className="text-xs text-muted-foreground font-medium">·</span>
                <span className="tabular-nums text-xs text-muted-foreground font-mono">{scan.scanTime}</span>
                {hoveredRow === scan.id && (
                  <ChevronRight size={12} className="text-muted-foreground animate-slide-in" />
                )}
              </div>
            </div>

            {/* Hydrotest expiry if expiring/expired */}
            {(scan.hydrotestStatus === 'expiring-soon' || scan.hydrotestStatus === 'expired') && (
              <div className={`mt-2 pt-2 border-t text-xs font-medium flex items-center gap-1 ${
                scan.hydrotestStatus === 'expired' ?'border-rose-100 text-rose-500' :'border-amber-100 text-amber-600'
              }`}>
                <Clock size={10} />
                Hydrotest Expiry: <span className="font-700 font-mono ml-1">{scan.hydrotestExpiry}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Operator: Dian Prasetyo</span>
        <button className="flex items-center gap-0.5 text-xs text-blue-500 font-600 hover:text-blue-600 transition-colors">
          Full Log <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}