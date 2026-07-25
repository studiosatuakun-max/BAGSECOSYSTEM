'use client';

import React from 'react';
import StatusBadge, { BadgeVariant } from '@/components/ui/StatusBadge';
import { ATEXStatus, ActiveDelivery } from '@/data/mockData';
import { Truck, Fuel, Clock, MapPin } from 'lucide-react';

function atexBadgeVariant(status: ATEXStatus): BadgeVariant {
  switch (status) {
    case 'Safe Zone Unloading': return 'safe';
    case 'ATEX Zone Cleared': return 'safe';
    case 'Geofence Violation': return 'violation';
    case 'Awaiting SOP Sign-off': return 'warning';
    case 'Pre-delivery Check Pending': return 'info';
    default: return 'neutral';
  }
}

function deliveryBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'Unloading': return 'in-progress';
    case 'En Route': return 'info';
    case 'Dispatched': return 'neutral';
    case 'Completed': return 'completed';
    case 'Incident': return 'incident';
    default: return 'neutral';
  }
}

const productColors: Record<string, string> = {
  LPG: 'bg-orange-50 text-orange-700 border border-orange-200',
  CNG: 'bg-blue-50 text-blue-700 border border-blue-200',
  Diesel: 'bg-slate-100 text-slate-700 border border-slate-200',
  LNG: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
};

interface ActiveDeliveriesTableProps {
  deliveries: ActiveDelivery[];
}

export default function ActiveDeliveriesTable({ deliveries }: ActiveDeliveriesTableProps) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Driver</th>
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Truck Plate</th>
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Destination</th>
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Product</th>
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Volume (L)</th>
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">ETA</th>
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground">ATEX SOP</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery, i) => (
            <tr
              key={delivery.id}
              className={`border-b border-border hover:bg-muted/40 transition-colors duration-100 ${
                i % 2 === 0 ? '' : 'bg-slate-50/50'
              } ${delivery.atexStatus === 'Geofence Violation' ? 'bg-red-50/40 hover:bg-red-50/60' : ''}`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-700 text-primary">
                      {delivery.driverName.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <span className="font-500 text-foreground">{delivery.driverName}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Truck size={13} className="text-muted-foreground" />
                  <span className="font-600 text-foreground tabular-nums">{delivery.truckPlate}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 max-w-[180px]">
                  <MapPin size={12} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground truncate">{delivery.destination}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 rounded-full text-[11px] font-600 px-2 py-0.5 ${productColors[delivery.product]}`}>
                  <Fuel size={10} />
                  {delivery.product}
                </span>
              </td>
              <td className="px-4 py-3 tabular-nums font-500 text-foreground">
                {delivery.volumeLiters.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="font-600 tabular-nums text-foreground">{delivery.eta}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge variant={deliveryBadgeVariant(delivery.deliveryStatus)} label={delivery.deliveryStatus} dot />
              </td>
              <td className="px-4 py-3">
                <StatusBadge variant={atexBadgeVariant(delivery.atexStatus)} label={delivery.atexStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}