'use client';
import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, Bell, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';

export default function ClientPortalHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) setDropdownOpen(false);
      if (!target.closest('[data-notif]')) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Brand + Portal Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo mark */}
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-900 shrink-0">
              <span className="text-white text-xs font-bold tracking-tight">BAG</span>
            </div>

            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-sm font-bold text-blue-900 tracking-tight">
                PT Baskara Asri Ghas
              </span>
              <span className="text-xs text-slate-500 font-medium">Client Portal</span>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

            {/* Client Company */}
            <div className="hidden md:flex items-center gap-2">
              <Building2 size={14} className="text-blue-700 shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold text-slate-800">PT Maju Bersama Industri</span>
                <span className="text-xs text-slate-500">Client ID: MBI-2024-0047</span>
              </div>
            </div>
          </div>

          {/* Right: Nav links + Notifications + Profile */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Back to Ops link */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
            >
              ← Ops Dashboard
            </Link>

            {/* Notification bell */}
            <div className="relative" data-notif>
              <button
                onClick={() => setNotifOpen(p => !p)}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={16} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-elevated overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-800">Notifications</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold text-blue-700">Invoice #INV-2026-0089 Due</p>
                      <p className="text-xs text-slate-500 mt-0.5">Payment due in 3 days · Rp 18.500.000</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold text-slate-700">Pressure nominal — all tanks</p>
                      <p className="text-xs text-slate-500 mt-0.5">Last checked 2 minutes ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-900 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">AW</span>
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-xs font-semibold text-slate-800">Andi Wijaya</span>
                  <span className="text-xs text-slate-500">Procurement Manager</span>
                </div>
                <ChevronDown size={12} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-elevated overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">Andi Wijaya</p>
                    <p className="text-xs text-slate-500">andi@majubersama.co.id</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                      <User size={13} className="text-slate-400" /> My Profile
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings size={13} className="text-slate-400" /> Account Settings
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={13} className="text-red-400" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
