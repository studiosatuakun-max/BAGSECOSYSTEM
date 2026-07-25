'use client';

import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';

const navigation = [
  { name: 'Dashboard Overview', href: '/portal/pusat', icon: 'HomeIcon' },
  { name: 'Pelanggan & Klien', href: '/portal/pusat/pelanggan', icon: 'UserGroupIcon' },
  { name: 'Master Harga Gas', href: '/portal/pusat/harga', icon: 'BanknotesIcon' },
  { name: 'User & Role', href: '/portal/pusat/users', icon: 'UsersIcon' },
];

export default function PusatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 font-sans relative">
      <PortalHeader
        title="Modul Pusat"
        subtitle="Super Admin Console"
        roleBadge="Root Access"
        roleColor="indigo"
        navItems={navigation}
        showInbox={true}
      />

      {/* Main Page Content */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Global Telemetry Footer */}
      <Footer />
    </div>
  );
}

