import React from 'react';
import { CheckCircle2, Cylinder, Calendar, Hash, Building2, Clock } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const mockCylinder = {
  serialNumber: 'HG-12K-2024-087341',
  fillDate: '17 Jul 2026',
  manufacturer: 'PT. Pertamina Gas',
  certExpiry: '17 Jan 2027',
  weight: '12 Kg',
  pressure: '8.2 bar',
  batchCode: 'BDG-JUL-2026-B3',
};

export default function AuthResultCard() {
  return (
    <div className="bg-card rounded-3xl border border-border card-shadow overflow-hidden">
      {/* Card Header */}
      <div className="bg-success-bg border-b border-green-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success/10 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={22} className="text-success" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-success-foreground">
              Cylinder Authenticated
            </h3>
            <p className="text-xs text-success/70 font-medium">
              Last scanned 2 days ago
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="bg-success text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            ✓ Safe
          </span>
        </div>
      </div>
      {/* Details Grid */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { id: 'detail-serial', icon: Hash, label: 'Serial Number', value: mockCylinder?.serialNumber, mono: true },
            { id: 'detail-fill', icon: Calendar, label: 'Fill Date', value: mockCylinder?.fillDate, mono: false },
            { id: 'detail-mfg', icon: Building2, label: 'Manufacturer', value: mockCylinder?.manufacturer, mono: false },
            { id: 'detail-expiry', icon: Clock, label: 'Cert. Expiry', value: mockCylinder?.certExpiry, mono: false },
          ]?.map((detail) => {
            const Icon = detail?.icon;
            return (
              <div key={detail?.id} className="bg-muted rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} className="text-muted-foreground" strokeWidth={2} />
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                    {detail?.label}
                  </p>
                </div>
                <p className={`text-xs font-bold text-foreground leading-snug ${detail?.mono ? 'font-mono tracking-tight' : ''}`}>
                  {detail?.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Safety Certified Banner */}
        <div className="flex items-center gap-3 bg-success-bg border border-green-200 rounded-2xl px-4 py-3">
          <div className="w-8 h-8 bg-success rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-success-foreground">
              Safety Certified
            </p>
            <p className="text-xs text-success/70">
              Batch {mockCylinder?.batchCode} · {mockCylinder?.weight} · {mockCylinder?.pressure}
            </p>
          </div>
          <div className="ml-auto">
            <Cylinder size={28} className="text-success/30" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}