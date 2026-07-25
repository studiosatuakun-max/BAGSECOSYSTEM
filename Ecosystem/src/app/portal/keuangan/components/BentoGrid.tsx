import React from 'react';
import CashFlowChartCard from './CashFlowChartCard';
import TaxComplianceCard from './TaxComplianceCard';
import MetricCard from './MetricCard';
import GenerateReportCard from './GenerateReportCard';
import InvoiceTableCard from './InvoiceTableCard';

export default function BentoGrid() {
  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Row 1: Cash Flow Chart (3 cols) + Tax Compliance (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5">
        <div className="lg:col-span-3">
          <CashFlowChartCard />
        </div>
        <div className="lg:col-span-1">
          <TaxComplianceCard />
        </div>
      </div>

      {/* Row 2: 3 KPI Cards + 1 Action Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        <MetricCard
          id="metric-revenue"
          label="Total Pendapatan"
          value="Rp 1,2 M"
          rawValue="1.247.500.000"
          trend="+12,4%"
          trendDir="up"
          subLabel="vs. bulan lalu"
          accentColor="positive"
          icon="TrendingUp"
          detail="Dari 38 transaksi aktif"
        />
        <MetricCard
          id="metric-expense"
          label="Total Pengeluaran"
          value="Rp 450 Jt"
          rawValue="450.250.000"
          trend="+3,1%"
          trendDir="up-bad"
          subLabel="vs. bulan lalu"
          accentColor="warning"
          icon="TrendingDown"
          detail="Operasional & overhead"
        />
        <MetricCard
          id="metric-ar"
          label="Piutang Usaha"
          value="30 Hari"
          rawValue="30"
          trend="+5 hari"
          trendDir="up-bad"
          subLabel="rata-rata jatuh tempo"
          accentColor="negative"
          icon="Clock"
          detail="Rp 312.750.000 outstanding"
          isAlert
        />
        <GenerateReportCard />
      </div>

      {/* Row 3: Invoice Table full width */}
      <div className="grid grid-cols-1">
        <InvoiceTableCard />
      </div>
    </div>
  );
}