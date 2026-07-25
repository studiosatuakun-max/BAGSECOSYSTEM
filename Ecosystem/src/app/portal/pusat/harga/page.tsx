'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const tiers = [
  { id: 'T-IND-01', type: 'Industrial (B2B)', unit: 'MMBTU', basePrice: '$12.40', activeDate: '01 Jan 2026', status: 'Active' },
  { id: 'T-IND-02', type: 'Industrial (B2B)', unit: 'MMBTU', basePrice: '$13.10', activeDate: '01 Jul 2026', status: 'Scheduled' },
  { id: 'T-HOR-01', type: 'Horeca (B2C)', unit: '12Kg Cylinder', basePrice: 'Rp 215,000', activeDate: '01 Jan 2026', status: 'Active' },
];

export default function HargaGasPage() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Master Harga Gas</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            System-wide pricing tiers for MMBTU and 12Kg cylinders.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors">
          <Icon name="PlusIcon" size={16} variant="solid" />
          Create New Tier
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Tier ID</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Segment Type</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Base Price</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Active From</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tiers.map((t) => (
                <tr key={t.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="py-4 px-6 text-sm font-semibold text-foreground">{t.id}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{t.type}</span>
                      <span className="text-xs">Per {t.unit}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-extrabold text-foreground">{t.basePrice}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground font-medium">{t.activeDate}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      t.status === 'Active' ? 'bg-green-ops-light text-green-ops' : 'bg-amber-light text-amber-dark'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="PencilSquareIcon" size={16} />
                    </button>
                    {t.status === 'Scheduled' && (
                      <button className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors ml-1">
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
