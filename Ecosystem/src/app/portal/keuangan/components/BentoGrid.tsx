'use client';

import React from 'react';
import CashFlowChartCard from './CashFlowChartCard';
import TaxComplianceCard from './TaxComplianceCard';
import MetricCard from './MetricCard';
import GenerateReportCard from './GenerateReportCard';
import InvoiceTableCard from './InvoiceTableCard';

export default function BentoGrid() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Row 1: Executive KPI Hero Cards + Treasury AI Generator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          id="metric-revenue"
          label="Total Revenue CNG (YTD)"
          value="Rp 12,45 M"
          rawValue="12.450.000.000"
          trend="+18,4%"
          trendDir="up"
          subLabel="vs kuartal lalu"
          accentColor="positive"
          icon="TrendingUp"
          detail="Dari 48 Kontrak B2B Industrial & Horeca"
        />
        <MetricCard
          id="metric-expense"
          label="Biaya Ops Mother Station"
          value="Rp 4,45 M"
          rawValue="4.455.000.000"
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
          value="18 Hari"
          rawValue="18"
          trend="-4 hari"
          trendDir="down-good"
          subLabel="rata-rata jatuh tempo"
          accentColor="primary"
          icon="Clock"
          detail="96% Lunas tepat waktu (DGT Online)"
          isAlert={false}
        />
        <GenerateReportCard />
      </div>

      {/* Row 2: Cash Flow Chart (3 cols) + MIGAS Tax Compliance (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <CashFlowChartCard />
        </div>
        <div className="lg:col-span-1">
          <TaxComplianceCard />
        </div>
      </div>

      {/* Row 3: CNG Custody Transfer Invoice Engine full width */}
      <div className="grid grid-cols-1">
        <InvoiceTableCard />
      </div>
    </div>
  );
}