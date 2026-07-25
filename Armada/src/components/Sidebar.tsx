'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Users, PackageCheck, Wrench, ShieldCheck, ChevronLeft, ChevronRight, Bell, Settings, LogOut,  } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  {
    label: 'Fleet Dashboard',
    href: '/',
    icon: <LayoutDashboard size={18} />,
    group: 'Operations',
  },
  {
    label: 'Driver Management',
    href: '/driver-management',
    icon: <Users size={18} />,
    group: 'Operations',
  },
  {
    label: 'Delivery Management',
    href: '/delivery-management',
    icon: <PackageCheck size={18} />,
    badge: 3,
    group: 'Operations',
  },
  {
    label: 'Vehicle Maintenance',
    href: '/vehicle-maintenance',
    icon: <Wrench size={18} />,
    badge: 2,
    group: 'Fleet',
  },
  {
    label: 'Compliance & Safety',
    href: '/compliance-safety-reports',
    icon: <ShieldCheck size={18} />,
    badge: 1,
    group: 'Fleet',
  },
];

const groups = ['Operations', 'Fleet'];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col bg-card border-r border-border shadow-sidebar sidebar-transition flex-shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-border h-16 px-3 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-bold text-base text-foreground tracking-tight truncate">
              FleetTrack
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors duration-150"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <div className="flex justify-center pt-2 pb-1">
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors duration-150"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {groups.map((group) => (
          <div key={`group-${group}`} className="mb-4">
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-600 uppercase tracking-widest text-muted-foreground">
                {group}
              </p>
            )}
            {navItems
              .filter((item) => item.group === group)
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={`nav-${item.href}`} className="relative group px-2 mb-0.5">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                        isActive
                          ? 'bg-primary/10 text-primary font-600' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <span className="text-sm font-500 truncate flex-1">{item.label}</span>
                      )}
                      {!collapsed && item.badge && item.badge > 0 && (
                        <span className="ml-auto flex-shrink-0 bg-red-100 text-red-600 text-[10px] font-700 px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Collapsed tooltip */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
                        <div className="bg-foreground text-primary-foreground text-xs font-500 px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-2">
                          {item.label}
                          {item.badge && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-[9px] font-700 px-1 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Collapsed badge dot */}
                    {collapsed && item.badge && item.badge > 0 && (
                      <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border p-2 space-y-0.5">
        {[
          { icon: <Bell size={16} />, label: 'Notifications', badge: 4 },
          { icon: <Settings size={16} />, label: 'Settings' },
        ].map((item) => (
          <div key={`bottom-${item.label}`} className="relative group">
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm font-500">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-700 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
            {collapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
                <div className="bg-foreground text-primary-foreground text-xs font-500 px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  {item.label}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* User profile */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted cursor-pointer transition-all duration-150 mt-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-700 text-primary">MR</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-foreground truncate">Marcus Reid</p>
              <p className="text-[10px] text-muted-foreground truncate">Fleet Manager</p>
            </div>
          )}
          {!collapsed && (
            <LogOut size={14} className="text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </div>
    </aside>
  );
}