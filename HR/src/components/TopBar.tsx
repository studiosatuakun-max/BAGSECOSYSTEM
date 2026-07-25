'use client';

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Building2 } from 'lucide-react';

interface TopBarProps {
  pageTitle: string;
  pageSubtitle?: string;
}

export default function TopBar({ pageTitle, pageSubtitle }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-card border-b border-border px-6 lg:px-8 xl:px-10 h-16 flex items-center gap-4">
      {/* Page Identity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground font-500">Baskara Asri Ghas</span>
          <span className="text-xs text-muted-foreground">—</span>
          <span className="text-xs font-600 text-primary uppercase tracking-wide">Human Resources</span>
        </div>
        <h1 className="text-base font-600 text-foreground truncate leading-tight mt-0.5">{pageTitle}</h1>
      </div>

      {/* Search */}
      <div className={`hidden md:flex items-center gap-2 bg-muted rounded-xl px-3 py-2 transition-all duration-200 ${searchFocused ? 'ring-2 ring-primary/30 bg-card' : ''}`}>
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search employees, requests..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-52"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="text-[10px] text-muted-foreground bg-border rounded px-1 py-0.5 font-mono">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-all duration-150">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-700 text-primary">SR</span>
          </div>
          <span className="hidden lg:block text-sm font-500 text-foreground">Sari Rahayu</span>
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}