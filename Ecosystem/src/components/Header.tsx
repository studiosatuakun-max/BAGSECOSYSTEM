import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/assets/images/icon.png"
            alt="BaGS - PT Baskara Asri Ghas logo"
            width={44}
            height={44}
            className="flex-shrink-0 object-contain"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
              BaGS Ecosystem
            </span>
            <span className="text-muted-foreground hidden sm:block" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}>
              Integrated ERP &amp; Gas Logistics
            </span>
          </div>
        </Link>

        {/* Status Badges & Auth */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-ops-light border border-green-ops/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-green status-pulse flex-shrink-0" />
              <span className="text-green-ops font-bold" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                ATEX ZONES: ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-industrial-light border border-industrial/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-green status-pulse flex-shrink-0" />
              <span className="text-industrial font-bold" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                SYSTEM ONLINE
              </span>
            </div>
          </div>
          
          <div className="h-5 w-px bg-slate-200 hidden lg:block" />

          <Link 
            href="/"
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </header>
  );
}