import React from 'react';
import AppLayout from '@/components/AppLayout';
import DeliveryTable from './components/DeliveryTable';
import MetricCard from '@/components/ui/MetricCard';
import { allDeliveries } from '@/data/mockData';
import { PackageCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Backend integration: replace with /api/fleet/deliveries
const activeDeliveriesCount = allDeliveries?.filter((d) =>
  ['En Route', 'Unloading', 'Dispatched']?.includes(d?.status)
)?.length;
const completedToday = allDeliveries?.filter(
  (d) => d?.status === 'Completed' && d?.date === '2026-07-20'
)?.length;
const incidentCount = allDeliveries?.filter((d) => d?.status === 'Incident')?.length;
const awaitingAtex = allDeliveries?.filter(
  (d) => d?.atexStatus === 'Awaiting SOP Sign-off' || d?.atexStatus === 'Pre-delivery Check Pending'
)?.length;

export default function DeliveryManagementPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-700 text-foreground tracking-tight">Delivery Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Full delivery log — active routes, completed runs, and incident records
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-600 px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95 shadow-sm">
            <PackageCheck size={15} />
            Dispatch Delivery
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Active Routes"
            value={activeDeliveriesCount}
            subtext="En route, unloading, or dispatched"
            variant="default"
            icon={<Clock size={16} />}
          />
          <MetricCard
            label="Completed Today"
            value={completedToday}
            subtext="Deliveries signed off today"
            variant="positive"
            icon={<CheckCircle size={16} />}
          />
          <MetricCard
            label="ATEX Pending"
            value={awaitingAtex}
            subtext="Awaiting SOP sign-off or pre-check"
            variant={awaitingAtex > 0 ? 'warning' : 'default'}
            icon={<AlertTriangle size={16} />}
          />
          <MetricCard
            label="Incidents"
            value={incidentCount}
            subtext="Deliveries flagged as incidents"
            variant={incidentCount > 0 ? 'alert' : 'default'}
            icon={<AlertTriangle size={16} />}
          />
        </div>

        <DeliveryTable />
      </div>
    </AppLayout>
  );
}