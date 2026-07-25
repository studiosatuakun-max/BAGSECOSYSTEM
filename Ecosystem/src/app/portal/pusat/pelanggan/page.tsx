'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const clients = [
  { id: 'C001', name: 'PT Indofood Sukses Makmur', type: 'Industrial (B2B)', location: 'Cikarang', status: 'Active' },
  { id: 'C002', name: 'Hotel Mulia Senayan', type: 'Horeca (B2C)', location: 'Jakarta', status: 'Active' },
  { id: 'C003', name: 'PT Astra Honda Motor', type: 'Industrial (B2B)', location: 'Karawang', status: 'Inactive' },
  { id: 'C004', name: 'KFC Kemang', type: 'Horeca (B2C)', location: 'Jakarta', status: 'Active' },
];

export default function PelangganPage() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Pelanggan & Klien</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Master database of all B2B Industrial and B2C Horeca clients.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors">
          <Icon name="PlusIcon" size={16} variant="solid" />
          Add Client
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground">
            <Icon name="FunnelIcon" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">ID</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Client Name</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Type</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Location</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="py-4 px-6 text-sm font-semibold text-foreground">{c.id}</td>
                  <td className="py-4 px-6 text-sm font-bold text-foreground">{c.name}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      c.type.includes('B2B') ? 'bg-industrial-light text-industrial' : 'bg-amber-light text-amber-dark'
                    }`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground font-medium">{c.location}</td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                      c.status === 'Active' ? 'text-green-ops' : 'text-muted-foreground'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-green-ops' : 'bg-muted-foreground'}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="PencilSquareIcon" size={16} />
                    </button>
                    <button className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors ml-1">
                      <Icon name="TrashIcon" size={16} />
                    </button>
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
