'use client';

import InboxWidget from '@/app/components/InboxWidget';
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
    <div className="flex flex-col min-h-screen w-full bg-secondary font-sans relative overflow-x-hidden">
      {/* Sleek Enterprise Top Navbar */}
      <header className="h-16 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-30 shadow-sm px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <Image src="/assets/images/icon.png" alt="BaGS Logo" width={32} height={32} className="object-contain group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-foreground leading-none group-hover:text-indigo transition-colors tracking-tight">
                Modul Pusat
              </span>
              <span className="text-[10px] font-bold text-indigo tracking-wider uppercase mt-0.5">
                Super Admin Console
              </span>
            </div>
          </Link>
          <div className="h-6 w-px bg-border hidden md:block shrink-0" />

          {/* Center/Left: Horizontal Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo text-primary-foreground shadow-md shadow-indigo/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  style={isActive ? { backgroundColor: 'var(--indigo)' } : {}}
                >
                  <Icon
                    name={item.icon}
                    size={15}
                    variant={isActive ? 'solid' : 'outline'}
                    className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Inbox & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Top Header Dispatch Inbox Widget */}
          <InboxWidget variant="header" />

          <div className="h-5 w-px bg-border hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-primary status-pulse" />
            <span className="text-xs font-bold text-foreground">Root Access</span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border"
            title="Back to Main Dashboard"
          >
            <Icon name="ArrowLeftOnRectangleIcon" size={16} variant="outline" />
            <span className="hidden sm:inline">Exit Portal</span>
          </Link>
        </div>
      </header>

      {/* Mobile / Tablet Navigation Bar (for screens smaller than lg) */}
      <div className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-card border-b border-border overflow-x-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap ${
                isActive ? 'bg-indigo text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
              style={isActive ? { backgroundColor: 'var(--indigo)' } : {}}
            >
              <Icon name={item.icon} size={14} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
