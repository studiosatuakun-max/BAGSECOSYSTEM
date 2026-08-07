import React from 'react';
import CashFlowChartCard from './CashFlowChartCard';
import TaxComplianceCard from './TaxComplianceCard';
import MetricCard from './MetricCard';

interface BentoGridProps {
  summary: {
    totalRevenueIdr: number;
    totalArOutstanding: number;
    avgDaysOutstanding: number;
    totalOpex: number;
  };
}

export default function BentoGrid({ summary }: BentoGridProps) {
  // Format to Miliar
  const formatMiliar = (val: number) => {
    if (val === 0) return "Rp 0";
    return `Rp ${(val / 1000000000).toFixed(2).replace('.', ',')} M`;
  };
  const revenueM = formatMiliar(summary.totalRevenueIdr);
  const opexM = formatMiliar(summary.totalOpex);
  const netSurplus = summary.totalRevenueIdr - summary.totalOpex;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Row 1: Executive KPI Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <MetricCard
          id="metric-revenue"
          label="Total Revenue CNG (YTD)"
          value={revenueM}
          rawValue={summary.totalRevenueIdr.toString()}
          trend="+18,4%"
          trendDir="up"
          subLabel="vs kuartal lalu"
          accentColor="positive"
          icon="TrendingUp"
          detail="Dari Kontrak B2B Industrial & Horeca"
        />
        <MetricCard
          id="metric-expense"
          label="Biaya Ops Mother Station"
          value={opexM}
          rawValue={summary.totalOpex.toString()}
          trend="+2,1%"
          trendDir="up-bad"
          subLabel="efisiensi kompresi"
          accentColor="warning"
          icon="TrendingDown"
          detail="Listrik 3-stage, gas bakar & maintenance"
        />
        <MetricCard
          id="metric-ar"
          label="AR Aging Piutang B2B"
          value={`${summary.avgDaysOutstanding} Hari`}
          rawValue={summary.avgDaysOutstanding.toString()}
          trend="-4 hari"
          trendDir="down-good"
          subLabel="rata-rata jatuh tempo"
          accentColor="primary"
          icon="Clock"
          detail="96% Lunas tepat waktu (DGT Online)"
          isAlert={false}
        />
      </div>

      {/* Row 2: Cash Flow Chart (3 cols) + MIGAS Tax Compliance (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <CashFlowChartCard 
            totalRevenueIdr={summary.totalRevenueIdr}
            totalOpex={summary.totalOpex}
            netSurplus={netSurplus}
          />
        </div>
        <div className="lg:col-span-1">
          <TaxComplianceCard />
        </div>
      </div>

      {/* Row 3: reserved for InvoiceTableCard (moved to page.tsx for Supabase data flow) */}
    </div>
  );
}