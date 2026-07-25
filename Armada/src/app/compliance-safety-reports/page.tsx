'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import MetricCard from '@/components/ui/MetricCard';
import IncidentsTable from './components/IncidentsTable';
import dynamic from 'next/dynamic';
import { complianceIncidents, drivers } from '@/data/mockData';
import { ShieldCheck, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';

const ViolationTrendChart = dynamic(() => import('./components/ViolationTrendChart'), { ssr: false });
const SafetyScoreChart = dynamic(() => import('./components/SafetyScoreChart'), { ssr: false });

// Backend integration: replace with /api/fleet/compliance
const openIncidents = complianceIncidents?.filter(
  (i) => i?.resolutionStatus === 'Open' || i?.resolutionStatus === 'Under Review'
)?.length;
const escalatedIncidents = complianceIncidents?.filter((i) => i?.resolutionStatus === 'Escalated')?.length;
const criticalCount = complianceIncidents?.filter((i) => i?.severity === 'Critical' || i?.severity === 'High')?.length;
const avgKpi = Math.round(drivers?.reduce((s, d) => s + d?.kpiScore, 0) / drivers?.length);
const resolvedRate = Math.round(
  (complianceIncidents?.filter((i) => i?.resolutionStatus === 'Resolved')?.length / complianceIncidents?.length) * 100
);

export default function ComplianceSafetyReportsPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-700 text-foreground tracking-tight">Compliance &amp; Safety Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">
              ATEX violation tracking, driver safety scores, and incident resolution status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-500 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl px-4 py-2.5 transition-all duration-150 hover:shadow-card active:scale-95">
              <TrendingDown size={14} />
              Export Report
            </button>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-600 px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-150 active:scale-95 shadow-sm">
              <ShieldCheck size={15} />
              Log Incident
            </button>
          </div>
        </div>

        {/* KPI Cards — 4 cards, 4-col grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Open Incidents"
            value={openIncidents}
            subtext="Unresolved or under active review"
            variant={openIncidents > 0 ? 'alert' : 'default'}
            icon={<AlertTriangle size={16} />}
          />
          <MetricCard
            label="Escalated Cases"
            value={escalatedIncidents}
            subtext="Requiring management intervention"
            variant={escalatedIncidents > 0 ? 'alert' : 'default'}
            icon={<AlertTriangle size={16} />}
          />
          <MetricCard
            label="Fleet Safety Score"
            value={`${avgKpi}%`}
            subtext="Average KPI across all 12 drivers"
            trend="down"
            trendValue="-3pts vs last month"
            variant="warning"
            icon={<ShieldCheck size={16} />}
          />
          <MetricCard
            label="Resolution Rate"
            value={`${resolvedRate}%`}
            subtext={`${complianceIncidents?.filter((i) => i?.resolutionStatus === 'Resolved')?.length} of ${complianceIncidents?.length} incidents closed`}
            variant="positive"
            icon={<CheckCircle size={16} />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Violation Trend */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-600 text-foreground">Violation Frequency — 8 Weeks</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Stacked by violation type per week</p>
              </div>
              <span className="text-[11px] font-600 text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                {criticalCount} Critical/High
              </span>
            </div>
            <ViolationTrendChart />
          </div>

          {/* Safety Score Trend */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-600 text-foreground">Fleet Safety Score — 8 Weeks</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Weekly average vs 90% compliance target</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[11px] font-500 text-muted-foreground">90% target line</span>
              </div>
            </div>
            <SafetyScoreChart />
          </div>
        </div>

        {/* Incidents Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-600 text-foreground">Incident Log</h2>
            <p className="text-xs text-muted-foreground">{complianceIncidents?.length} total incidents on record</p>
          </div>
          <IncidentsTable />
        </div>
      </div>
    </AppLayout>
  );
}