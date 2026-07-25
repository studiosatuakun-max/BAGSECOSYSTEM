import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import ScanCTACard from '../components/ScanCTACard';
import AuthResultCard from '../components/AuthResultCard';
import ReorderCard from '../components/ReorderCard';
import ActiveDeliveryCard from '../components/ActiveDeliveryCard';

export default function CustomerDashboardPage() {
  return (
    <div className="max-w-md mx-auto px-4 pb-4">
      <DashboardHeader />
      <div className="flex flex-col gap-4 mt-2">
        <ScanCTACard />
        <AuthResultCard />
        <ReorderCard />
        <ActiveDeliveryCard />
      </div>
    </div>
  );
}