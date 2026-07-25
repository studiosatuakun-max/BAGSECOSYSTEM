'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, ShoppingBag, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'nav-home', label: 'Home', href: '/dashboard', icon: Home },
  { id: 'nav-scan', label: 'Scan', href: '/dashboard/scan', icon: Scan },
  { id: 'nav-orders', label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { id: 'nav-profile', label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          
          // Special case for dashboard home
          const isHomeActive = pathname === '/dashboard';

          const active = item.href === '/dashboard' ? isHomeActive : isActive;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                active
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                active ? 'bg-secondary' : ''
              }`}>
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}