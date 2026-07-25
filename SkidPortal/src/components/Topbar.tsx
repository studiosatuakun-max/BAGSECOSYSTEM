'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Bell, ChevronDown, LogOut, Settings, User, Menu, X, LayoutDashboard, LogIn } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Sign In', href: '/sign-up-login-screen', icon: LogIn },
];

export default function Topbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 h-16 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <AppLogo size={36} />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-semibold text-sm text-primary tracking-tight">SkidPortal</span>
              <span className="text-[11px] text-muted-foreground font-medium">Industrial Tank Monitoring</span>
            </div>
          </div>
          <div className="hidden md:block h-6 w-px bg-border mx-1" />
          <span className="hidden md:block text-sm font-semibold text-foreground truncate max-w-[260px]">
            PT Baskara Asri Ghas — Client Portal
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems?.map((item) => (
            <Link
              key={`nav-${item?.href}`}
              href={item?.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150"
            >
              <item.icon size={16} />
              {item?.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-card" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-card-lg z-50 fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <span className="text-xs bg-danger/10 text-danger font-medium px-2 py-0.5 rounded-full">2 new</span>
                </div>
                {[
                  { id: 'notif-001', icon: '⚠️', title: 'Pressure approaching threshold', desc: 'Tank SKD-JKT-04 at 23 Bar — monitor closely', time: '10 min ago', urgent: true },
                  { id: 'notif-002', icon: '📄', title: 'Invoice INV-2026-0718 due', desc: 'Rp 14,750,000 payment due in 3 days', time: '2 hrs ago', urgent: false },
                ]?.map((n) => (
                  <div key={n?.id} className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors duration-150 ${n?.urgent ? 'bg-warning-bg/40' : ''}`}>
                    <div className="flex gap-3 items-start">
                      <span className="text-lg mt-0.5">{n?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{n?.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n?.desc}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{n?.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/5 transition-all duration-150"
            >
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm select-none">
                BA
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-sm font-semibold text-foreground">Budi Ariyanto</span>
                <span className="text-[11px] text-muted-foreground">Operations Engineer</span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-card-lg z-50 fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Budi Ariyanto</p>
                  <p className="text-xs text-muted-foreground">budi@baskaraghas.co.id</p>
                </div>
                {[
                  { label: 'My Profile', icon: User, href: '#' },
                  { label: 'Portal Settings', icon: Settings, href: '#' },
                ]?.map((item) => (
                  <Link
                    key={`profile-${item?.label}`}
                    href={item?.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150"
                  >
                    <item.icon size={15} />
                    {item?.label}
                  </Link>
                ))}
                <div className="border-t border-border">
                  <Link
                    href="/sign-up-login-screen"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-bg transition-all duration-150"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150"
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 fade-in">
          <div className="mb-3 pb-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Navigation</p>
            {navItems?.map((item) => (
              <Link
                key={`mobile-nav-${item?.href}`}
                href={item?.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150"
              >
                <item.icon size={16} />
                {item?.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">BA</div>
            <div>
              <p className="text-sm font-semibold text-foreground">Budi Ariyanto</p>
              <p className="text-xs text-muted-foreground">Operations Engineer</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}