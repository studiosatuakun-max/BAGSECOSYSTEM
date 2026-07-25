'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Users, CalendarDays, ClipboardList, ChevronLeft, ChevronRight, Settings, Bell, LogOut,  } from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'HR Dashboard', href: '/', icon: LayoutDashboard, badge: null },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { label: 'Employee Directory', href: '/employee-directory', icon: Users, badge: null },
      { label: 'Leave Management', href: '/leave-management', icon: CalendarDays, badge: 7 },
      { label: 'Onboarding', href: '/onboarding-management', icon: ClipboardList, badge: 3 },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col bg-card border-r border-border sidebar-transition shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center px-0' : ''}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-semibold text-sm text-foreground leading-tight">
            Baskara<span className="text-primary">HR</span>
          </span>
        )}
      </div>
      {/* Nav Groups */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navGroups?.map((group) => (
          <div key={`group-${group?.label}`} className="mb-4">
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-600 uppercase tracking-widest text-muted-foreground">
                {group?.label}
              </p>
            )}
            {group?.items?.map((item) => {
              const isActive = pathname === item?.href;
              return (
                <Link
                  key={`nav-${item?.href}`}
                  href={item?.href}
                  title={collapsed ? item?.label : undefined}
                  className={`group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 ${
                    isActive
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                  } ${collapsed ? 'justify-center px-0 mx-1' : ''}`}
                >
                  <item.icon
                    size={18}
                    className={`shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item?.label}</span>
                  )}
                  {!collapsed && item?.badge !== null && (
                    <span className="text-[10px] font-700 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                      {item?.badge}
                    </span>
                  )}
                  {collapsed && item?.badge !== null && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      {/* Bottom Actions */}
      <div className={`border-t border-border py-3 ${collapsed ? 'px-1' : 'px-2'}`}>
        <button
          title="Notifications"
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 mb-0.5 ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <Bell size={18} className="shrink-0" />
          {!collapsed && <span>Notifications</span>}
        </button>
        <button
          title="Settings"
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 mb-0.5 ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* User */}
        <div className={`flex items-center gap-3 mt-2 px-3 py-2.5 rounded-xl bg-muted/60 ${collapsed ? 'justify-center px-0 mx-1' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-700 text-primary">SR</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-foreground truncate">Sari Rahayu</p>
              <p className="text-[10px] text-muted-foreground truncate">HR Manager</p>
            </div>
          )}
          {!collapsed && (
            <button title="Sign out" className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shadow-card hover:bg-muted transition-all duration-150 z-10"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-muted-foreground" />
        ) : (
          <ChevronLeft size={12} className="text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}