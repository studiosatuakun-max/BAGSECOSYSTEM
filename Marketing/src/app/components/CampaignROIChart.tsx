'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const CampaignROIChartInner = dynamic(
  () => import('./CampaignROIChartInner'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', minHeight: 340 }}>
      <div className="skeleton-pulse rounded-lg h-5 w-48 mb-2" />
      <div className="skeleton-pulse rounded-lg h-3 w-64 mb-6" />
      <div className="skeleton-pulse rounded-xl w-full h-56" />
    </div>
  );
}

export default function CampaignROIChart() {
  return <CampaignROIChartInner />;
}