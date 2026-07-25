'use client';

import React, { useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  Settings,
  LogOut,
  User,
  HelpCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, active: true },
];

export default function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    {
      id: 'notif-001',
      title: 'Invoice INV-2026-0048 Overdue',
      desc: 'PT Maju Bersama — Rp 87.500.000 jatuh tempo 3 hari lalu',
      time: '2 jam lalu',
      unread: true,
      type: 'danger',
    },
    {
      id: 'notif-002',
      title: 'Laporan Bulanan Siap',
      desc: 'Laporan keuangan Juni 2026 telah selesai diproses',
      time: '5 jam lalu',
      unread: true,
      type: 'success',
    },
    {
      id: 'notif-003',
      title: 'PPh 23 Deadline Mendekat',
      desc: 'Batas pelaporan PPh 23 dalam 5 hari',
      time: '1 hari lalu',
      unread: false,
      type: 'warning',
    },
  ];

  const unreadCount = notifications?.filter((n) => n?.unread)?.length;

  return (
    <header className="bg-card border-b border-border card-shadow sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <AppLogo size={36} />
              <div className="hidden sm:flex flex-col">
                <span className="text-[15px] font-700 text-foreground leading-tight tracking-tight">
                  Baskara Asri Ghas
                </span>
                <span className="text-[11px] font-600 text-primary uppercase tracking-widest leading-tight">
                  FINANCE
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-border mx-2" />

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems?.map((item) => (
                <Link
                  key={`nav-${item?.label}`}
                  href={item?.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-500 transition-all duration-150 ${
                    item?.active
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <item.icon size={16} />
                  {item?.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Period Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-primary/8 text-primary px-3 py-1.5 rounded-lg text-xs font-600">
              <TrendingUp size={13} />
              <span>Juli 2026</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 active:scale-95"
                aria-label="Notifikasi"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-negative rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl card-shadow-md z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-600 text-foreground">Notifikasi</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {unreadCount} baru
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {notifications?.map((n) => (
                      <div
                        key={n?.id}
                        className={`px-4 py-3 hover:bg-muted transition-colors cursor-pointer ${n?.unread ? 'bg-primary/3' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                              n?.type === 'danger' ?'bg-negative'
                                : n?.type === 'success' ?'bg-positive' :'bg-warning'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-600 text-foreground truncate">{n?.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n?.desc}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n?.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-border">
                    <button className="text-xs text-primary font-600 hover:underline w-full text-center">
                      Lihat semua notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <button className="hidden sm:flex p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 active:scale-95">
              <HelpCircle size={20} />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-secondary transition-all duration-150 active:scale-95"
              >
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-700">
                  RW
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-600 text-foreground leading-tight">Rizky Wibowo</span>
                  <span className="text-xs text-muted-foreground leading-tight">Finance Manager</span>
                </div>
                <ChevronDown size={14} className="hidden md:block text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl card-shadow-md z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-600 text-foreground">Rizky Wibowo</p>
                    <p className="text-xs text-muted-foreground">rizky.w@baskaraasrighas.co.id</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: User, label: 'Profil Saya' },
                      { icon: FileText, label: 'Laporan Saya' },
                      { icon: Settings, label: 'Pengaturan' },
                    ]?.map((item) => (
                      <button
                        key={`menu-${item?.label}`}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <item.icon size={15} className="text-muted-foreground" />
                        {item?.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-negative hover:bg-negative/5 transition-colors">
                      <LogOut size={15} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-150"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-3">
          {navItems?.map((item) => (
            <Link
              key={`mobile-nav-${item?.label}`}
              href={item?.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all ${
                item?.active
                  ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon size={17} />
              {item?.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}