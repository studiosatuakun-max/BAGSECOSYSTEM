'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HomeIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

const ShieldIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ScanIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 7V2h5M17 2h5v5M22 17v5h-5M7 22H2v-5"/><rect x="7" y="7" width="10" height="10" rx="2"/>
  </svg>
);

const MapPinIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const navItems = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { id: 'nav-safety', label: 'Safety', href: '/dashboard/safety', icon: ShieldIcon },
  { id: 'nav-scan', label: 'Scan', href: '/dashboard/scan', icon: ScanIcon },
  { id: 'nav-stops', label: 'Stops', href: '/dashboard/stops', icon: MapPinIcon },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getActiveRoute = () => {
    if (pathname === '/dashboard') return '/dashboard';
    if (pathname?.includes('/safety')) return '/dashboard/safety';
    if (pathname?.includes('/scan')) return '/dashboard/scan';
    if (pathname?.includes('/stops') || pathname?.includes('/route')) return '/dashboard/stops';
    return '/dashboard';
  };

  const activeRoute = getActiveRoute();

  return (
    <div className="relative flex flex-col h-full bg-[#FAFAFA]">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-[90px] w-full">
        {children}
      </div>

      {/* Fixed Bottom Nav - HorecaGas Style */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--border)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isActive
                    ? 'text-[var(--sky-600)]' :'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-[var(--sky-50)]' : ''
                }`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-all duration-200"
                  />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--sky-500)] rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-[var(--sky-600)]' : 'text-[var(--text-tertiary)]'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
