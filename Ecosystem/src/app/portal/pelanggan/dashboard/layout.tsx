import React from 'react';
import MobileLayout from '@/app/portal/pelanggan/components/MobileLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <MobileLayout>{children}</MobileLayout>;
}
