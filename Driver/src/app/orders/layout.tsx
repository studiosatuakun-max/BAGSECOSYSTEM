'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { id: 'home', label: 'Home', href: '/orders',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10"/>
      </svg>
    ) },
  { id: 'scan', label: 'Scan', href: '/dashboard/scan',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7V2h5M17 2h5v5M22 17v5h-5M7 22H2v-5"/><rect x="7" y="7" width="10" height="10" rx="2"/>
      </svg>
    ) },
  { id: 'orders', label: 'Orders', href: '/orders/budi-1',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ) },
  { id: 'profile', label: 'Profile', href: '/orders/budi-1',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>
      </svg>
    ) },
];

export default function OrdersLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname?.startsWith('/orders')) return pathname === '/orders' ? 'home' : 'orders';
    if (pathname?.includes('/scan')) return 'scan';
    return 'orders';
  };

  const activeTab = getActiveTab();

  return (
    <div className="relative flex flex-col h-full bg-[var(--bg-canvas)]">
      <div className="flex-1 overflow-hidden">{children}</div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[360px] z-50">
        <nav className="nav-pill h-[64px] rounded-[20px] flex items-center justify-between px-1.5">
          {tabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <Link key={tab.id} href={tab.href}
                className={`relative flex flex-col items-center justify-center flex-1 h-[52px] mx-0.5 rounded-[14px] transition-all duration-200 ${
                  active
                    ? 'nav-pill-active'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <div className="transition-transform duration-200">
                  {tab.icon(active)}
                </div>
                <span className={`text-[10px] font-bold tracking-tight mt-1 transition-colors ${
                  active ? 'text-[var(--accent-solid)]' : ''
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
