import React from 'react';
import AppLayout from '@/components/AppLayout';
import DriverTable from './components/DriverTable';
import MetricCard from '@/components/ui/MetricCard';
import { drivers } from '@/data/mockData';
import { Users, ShieldCheck, AlertTriangle, UserCheck } from 'lucide-react';

// Backend integration: replace with /api/fleet/drivers
const activeCount = drivers?.filter((d) => d?.status === 'Active')?.length;
const suspendedCount = drivers?.filter((d) => d?.status === 'Suspended')?.length;
const avgKpi = Math.round(drivers?.reduce((s, d) => s + d?.kpiScore, 0) / drivers?.length);
const atexExpiring = drivers?.filter((d) => {
  const exp = new Date(d.atexExpiry);
  const diff = (exp?.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff < 60 && diff > 0;
})?.length;

export default function DriverManagementPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-700 text-foreground tracking-tight">Driver Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {drivers?.length} drivers registered — ADR certified fleet roster
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-600 px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95 shadow-sm">
            <Users size={15} />
            Add Driver
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Active Drivers"
            value={activeCount}
            subtext="Currently on duty or on route"
            variant="positive"
            icon={<UserCheck size={16} />}
          />
          <MetricCard
            label="Avg KPI Score"
            value={`${avgKpi}%`}
            subtext="Fleet-wide safety compliance"
            trend="down"
            trendValue="-3pts vs last month"
            variant="default"
            icon={<ShieldCheck size={16} />}
          />
          <MetricCard
            label="ATEX Cert Expiring"
            value={atexExpiring}
            subtext="Certificates expiring within 60 days"
            variant={atexExpiring > 0 ? 'warning' : 'default'}
            icon={<AlertTriangle size={16} />}
          />
          <MetricCard
            label="Suspended Drivers"
            value={suspendedCount}
            subtext="Under review or disciplinary hold"
            variant={suspendedCount > 0 ? 'alert' : 'default'}
            icon={<Users size={16} />}
          />
        </div>

        <DriverTable />
      </div>
    </AppLayout>
  );
}