import React from 'react';
import { trucks, Truck } from '@/data/mockData';
import { AlertTriangle, Clock, Wrench } from 'lucide-react';

function getKmUntilService(truck: Truck): number {
  return truck.serviceIntervalKm - (truck.currentMileage - truck.lastServiceMileage);
}

function getMileagePercent(truck: Truck): number {
  const used = truck.currentMileage - truck.lastServiceMileage;
  return Math.min(Math.round((used / truck.serviceIntervalKm) * 100), 100);
}

export default function MaintenanceAlertList() {
  const alertTrucks = trucks
    .filter((t) => t.maintenanceStatus !== 'OK')
    .sort((a, b) => {
      const order = { Overdue: 0, 'Due Soon': 1, OK: 2 };
      return order[a.maintenanceStatus] - order[b.maintenanceStatus];
    })
    .slice(0, 5);

  return (
    <div className="space-y-3">
      {alertTrucks.map((truck) => {
        const kmLeft = getKmUntilService(truck);
        const pct = getMileagePercent(truck);
        const isOverdue = truck.maintenanceStatus === 'Overdue';

        return (
          <div
            key={truck.id}
            className={`rounded-xl border p-3 ${
              isOverdue
                ? 'bg-red-50 border-red-200' :'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {isOverdue ? (
                  <AlertTriangle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Clock size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-600 text-foreground">{truck.plate}</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">{truck.model}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${
                  isOverdue
                    ? 'bg-red-100 text-red-700' :'bg-amber-100 text-amber-700'
                }`}
              >
                {isOverdue ? 'OVERDUE' : 'DUE SOON'}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <Wrench size={11} className="text-muted-foreground flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground truncate">{truck.nextServiceType}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverdue ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-[10px] font-600 tabular-nums ${isOverdue ? 'text-red-700' : 'text-amber-700'}`}>
                {isOverdue ? `+${Math.abs(kmLeft).toLocaleString()} km over` : `${kmLeft.toLocaleString()} km left`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}