'use client';

import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';

const navigation = [
  { name: 'System Telemetry', href: '/portal/pusat', icon: 'HomeIcon' },
  { name: 'Tenant & SSO Registry', href: '/portal/pusat/pelanggan', icon: 'ShieldCheckIcon' },
  { name: 'MIGAS Index Engine', href: '/portal/pusat/harga', icon: 'AdjustmentsHorizontalIcon' },
  { name: 'RBAC & PIN Matrix', href: '/portal/pusat/users', icon: 'KeyIcon' },
];

export default function PusatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden">
      <PortalHeader
        title="Modul Pusat"
        subtitle="Super Admin Root Console"
        roleBadge="Global Root Authority"
        roleColor="indigo"
        navItems={navigation}
        showInbox={true}
      />

      {/* Main Page Content Area with Gold Benchmark Spacing */}
      <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8">
        {children}
      </div>

      {/* Global Standardized Footer */}
      <Footer />
    </div>
  );
}
