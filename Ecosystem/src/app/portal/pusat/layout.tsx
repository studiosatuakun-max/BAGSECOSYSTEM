'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard Overview', href: '/portal/pusat', icon: 'HomeIcon' },
  { name: 'Pelanggan & Klien', href: '/portal/pusat/pelanggan', icon: 'UserGroupIcon' },
  { name: 'Master Harga Gas', href: '/portal/pusat/harga', icon: 'BanknotesIcon' },
  { name: 'User & Role', href: '/portal/pusat/users', icon: 'UsersIcon' },
];

export default function PusatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-secondary">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/assets/images/icon.png" alt="BaGS Logo" width={28} height={28} className="object-contain" />
            <span className="font-extrabold text-foreground group-hover:text-primary transition-colors text-sm tracking-tight">
              Modul Pusat
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-indigo text-primary-foreground shadow-md shadow-indigo/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                style={isActive ? { backgroundColor: 'var(--indigo)' } : {}}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  variant={isActive ? 'solid' : 'outline'}
                  className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-xs">
              SA
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-foreground leading-tight">Super Admin</span>
              <span className="text-[10px] text-muted-foreground font-medium">Baskara System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        {/* Top Header */}
        <div className="h-16 flex-shrink-0 border-b border-border bg-card flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-2 bg-indigo-light border border-indigo/20 text-indigo rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo status-pulse" />
            <span className="font-bold uppercase tracking-wider" style={{ fontSize: '10px' }}>Single Source of Truth Active</span>
          </div>

          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-muted">
            <Icon name="ArrowLeftOnRectangleIcon" size={16} variant="outline" />
            Exit Portal
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-secondary">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
