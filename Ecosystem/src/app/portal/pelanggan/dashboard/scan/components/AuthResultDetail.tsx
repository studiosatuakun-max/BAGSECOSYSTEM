import React from 'react';
import {
  CheckCircle2,
  Hash,
  Calendar,
  Building2,
  Clock,
  Gauge,
  Weight,
  ShieldCheck,
  Thermometer,
  FileCheck,
} from 'lucide-react';
import Icon from '@/app/portal/pelanggan/components/ui/AppIcon';


const verifiedCylinder = {
  serialNumber: 'HG-12K-2024-087341',
  fillDate: '17 Jul 2026',
  fillLocation: 'SPBE Cimahi — Station 04',
  manufacturer: 'PT. Pertamina Gas',
  certExpiry: '17 Jan 2027',
  weight: '12.0 Kg',
  pressure: '8.2 bar',
  temperature: '25°C',
  batchCode: 'BDG-JUL-2026-B3',
  inspectorId: 'INS-2024-0087',
  nfcChipId: 'NFC:A3F2:8B91:CC04',
  lastInspection: '15 Jul 2026',
};

export default function AuthResultDetail() {
  return (
    <div className="bg-card rounded-3xl border border-green-200 overflow-hidden card-shadow-md">
      {/* Success Header */}
      <div className="bg-success-bg px-5 py-5 flex flex-col items-center text-center border-b border-green-100">
        <div className="success-pop w-16 h-16 bg-success rounded-3xl flex items-center justify-center mb-3 card-shadow-md">
          <CheckCircle2 size={34} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-extrabold text-success-foreground">
          Cylinder Authenticated
        </h2>
        <p className="text-sm text-success/70 mt-1">
          This cylinder is genuine and safe to use
        </p>
        <div className="flex items-center gap-2 mt-3 bg-success text-white px-4 py-1.5 rounded-full">
          <ShieldCheck size={14} strokeWidth={2.5} />
          <span className="text-xs font-bold uppercase tracking-wide">Safety Certified</span>
        </div>
      </div>
      {/* Primary Details */}
      <div className="px-5 py-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Cylinder Details
        </p>
        <div className="space-y-2.5">
          {[
            { id: 'auth-serial', icon: Hash, label: 'Serial Number', value: verifiedCylinder?.serialNumber, mono: true },
            { id: 'auth-fill', icon: Calendar, label: 'Fill Date', value: verifiedCylinder?.fillDate, mono: false },
            { id: 'auth-location', icon: Building2, label: 'Fill Station', value: verifiedCylinder?.fillLocation, mono: false },
            { id: 'auth-mfg', icon: Building2, label: 'Manufacturer', value: verifiedCylinder?.manufacturer, mono: false },
            { id: 'auth-expiry', icon: Clock, label: 'Cert. Valid Until', value: verifiedCylinder?.certExpiry, mono: false },
          ]?.map((item) => {
            const Icon = item?.icon;
            return (
              <div key={item?.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="w-7 h-7 bg-muted rounded-xl flex items-center justify-center">
                    <Icon size={13} className="text-muted-foreground" strokeWidth={2} />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{item?.label}</span>
                </div>
                <span className={`text-sm font-bold text-foreground text-right leading-snug ${item?.mono ? 'font-mono text-xs tracking-tight' : ''}`}>
                  {item?.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Technical Specs Grid */}
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-5 mb-3">
          Technical Specs
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: 'spec-weight', icon: Weight, label: 'Weight', value: verifiedCylinder?.weight },
            { id: 'spec-pressure', icon: Gauge, label: 'Pressure', value: verifiedCylinder?.pressure },
            { id: 'spec-temp', icon: Thermometer, label: 'Temp.', value: verifiedCylinder?.temperature },
          ]?.map((spec) => {
            const Icon = spec?.icon;
            return (
              <div key={spec?.id} className="bg-muted rounded-2xl p-3 text-center">
                <Icon size={16} className="text-primary mx-auto mb-1" strokeWidth={2} />
                <p className="text-xs font-bold text-foreground tabular-nums">{spec?.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{spec?.label}</p>
              </div>
            );
          })}
        </div>

        {/* Verification IDs */}
        <div className="bg-success-bg border border-green-100 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck size={14} className="text-success-foreground" strokeWidth={2} />
            <p className="text-xs font-bold text-success-foreground uppercase tracking-wide">
              Verification Records
            </p>
          </div>
          {[
            { id: 'rec-batch', label: 'Batch Code', value: verifiedCylinder?.batchCode },
            { id: 'rec-inspector', label: 'Inspector ID', value: verifiedCylinder?.inspectorId },
            { id: 'rec-nfc', label: 'NFC Chip ID', value: verifiedCylinder?.nfcChipId },
            { id: 'rec-inspect', label: 'Last Inspection', value: verifiedCylinder?.lastInspection },
          ]?.map((rec) => (
            <div key={rec?.id} className="flex items-center justify-between">
              <span className="text-xs text-success/70 font-medium">{rec?.label}</span>
              <span className="text-xs font-bold text-success-foreground font-mono">{rec?.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}