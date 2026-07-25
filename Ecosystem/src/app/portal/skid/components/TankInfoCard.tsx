import React from 'react';
import { MapPin, Droplets, RefreshCw, Clock, Tag } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

const tankData = {
  id: 'tank-skd-jkt-04',
  tankId: 'SKD-JKT-04',
  location: 'Kawasan Industri MM2100, Bekasi Barat',
  gasType: 'Industrial LPG (C3H8)',
  capacity: '5,000 L',
  fillLevel: 56,
  lastRefillDate: '28 Jun 2026',
  lastRefillVolume: '3,200 L',
  nextScheduledRefill: '04 Aug 2026',
  installDate: '12 Mar 2024',
  status: 'nominal' as const,
  technician: 'Rudi Santoso',
};

export default function TankInfoCard() {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-card p-5 card-hover fade-in h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Droplets size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tank Information</p>
          </div>
        </div>
        <StatusBadge variant={tankData.status} size="sm" />
      </div>

      {/* Tank ID + Fill Level */}
      <div className="bg-primary/5 rounded-xl p-3.5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Tag size={13} className="text-primary" />
            <span className="text-sm font-bold text-primary">{tankData.tankId}</span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground font-tabular">{tankData.fillLevel}% full</span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${tankData.fillLevel}%`,
              background: tankData.fillLevel > 40 ? 'var(--accent)' : tankData.fillLevel > 20 ? 'var(--warning)' : 'var(--danger)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">0%</span>
          <span className="text-[10px] text-muted-foreground">Min: 25%</span>
          <span className="text-[10px] text-muted-foreground">100%</span>
        </div>
      </div>

      {/* Info rows */}
      <div className="flex-1 space-y-2.5">
        {[
          { icon: MapPin, label: 'Location', value: tankData.location },
          { icon: Droplets, label: 'Gas Type', value: tankData.gasType },
          { icon: RefreshCw, label: 'Last Refill', value: `${tankData.lastRefillDate} · ${tankData.lastRefillVolume}` },
          { icon: Clock, label: 'Next Scheduled', value: tankData.nextScheduledRefill },
          { icon: Tag, label: 'Capacity', value: tankData.capacity },
        ].map((row) => (
          <div key={`tank-row-${row.label}`} className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <row.icon size={11} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground font-medium">{row.label}</p>
              <p className="text-xs font-semibold text-foreground truncate">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[11px] text-muted-foreground">
          Assigned Technician: <span className="font-semibold text-foreground">{tankData.technician}</span>
          <span className="mx-1.5 text-border">·</span>
          Installed {tankData.installDate}
        </p>
      </div>
    </div>
  );
}