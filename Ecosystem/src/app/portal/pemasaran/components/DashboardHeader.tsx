import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { BarChart2, Bell, Calendar, ChevronDown } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header
      className="sticky top-0 z-30 w-full border-b"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Division Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <AppLogo size={36} />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-base font-700 tracking-tight"
                  style={{ color: 'var(--foreground)', fontWeight: 700 }}
                >
                  Baskara Asri Ghas
                </span>
                <span
                  className="text-xs font-600 tracking-widest uppercase"
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  Marketing
                </span>
              </div>
            </div>

            {/* Divider */}
            <div
              className="hidden sm:block w-px h-8 mx-2"
              style={{ backgroundColor: 'var(--border)' }}
            />

            {/* Module Badge */}
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-600"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                  fontWeight: 600,
                }}
              >
                <BarChart2 size={13} />
                Campaign & Acquisition
              </div>
            </div>
          </div>

          {/* Right: Date + Notifications + User */}
          <div className="flex items-center gap-3">
            {/* Date Range */}
            <button
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-500 transition-colors hover:bg-muted"
              style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
            >
              <Calendar size={15} />
              <span>Jul 2026</span>
              <ChevronDown size={13} />
            </button>

            {/* Notification Bell */}
            <button
              className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-muted"
              style={{ color: 'var(--muted-foreground)' }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-700"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                }}
              >
                BA
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span
                  className="text-sm"
                  style={{ color: 'var(--foreground)', fontWeight: 600, fontSize: '0.8125rem' }}
                >
                  Rina Santoso
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)', fontSize: '0.6875rem' }}
                >
                  Marketing Manager
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}