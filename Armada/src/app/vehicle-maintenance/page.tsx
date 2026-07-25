import React from 'react';
import AppLayout from '@/components/AppLayout';
import MaintenanceTable from './components/MaintenanceTable';
import MetricCard from '@/components/ui/MetricCard';
import { trucks } from '@/data/mockData';
import { Wrench, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

// Backend integration: replace with /api/fleet/maintenance
const overdueCount = trucks?.filter((t) => t?.maintenanceStatus === 'Overdue')?.length;
const dueSoonCount = trucks?.filter((t) => t?.maintenanceStatus === 'Due Soon')?.length;
const operationalCount = trucks?.filter((t) => t?.maintenanceStatus === 'OK')?.length;
const atexExpiring = trucks?.filter((t) => {
  const exp = new Date(t.atexInspectionExpiry);
  const diff = (exp?.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff < 60 && diff > 0;
})?.length;

export default function VehicleMaintenancePage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-700 text-foreground tracking-tight">Vehicle Maintenance</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {trucks?.length} vehicles in fleet — mileage-based service schedule
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-600 px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95 shadow-sm">
            <Wrench size={15} />
            Log Service
          </button>
        </div>

        {/* KPI Cards — 4 cards, 4-col grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Overdue Service"
            value={overdueCount}
            subtext="Trucks past their service mileage threshold"
            variant="alert"
            icon={<AlertTriangle size={16} />}
          />
          <MetricCard
            label="Due Soon"
            value={dueSoonCount}
            subtext="Within 2,000 km of service interval"
            variant="warning"
            icon={<Wrench size={16} />}
          />
          <MetricCard
            label="Operational"
            value={operationalCount}
            subtext="Trucks within safe mileage range"
            variant="positive"
            icon={<CheckCircle size={16} />}
          />
          <MetricCard
            label="ATEX Cert Expiring"
            value={atexExpiring}
            subtext="ATEX inspections expiring within 60 days"
            variant={atexExpiring > 0 ? 'warning' : 'default'}
            icon={<Calendar size={16} />}
          />
        </div>

        <MaintenanceTable />
      </div>
    </AppLayout>
  );
}