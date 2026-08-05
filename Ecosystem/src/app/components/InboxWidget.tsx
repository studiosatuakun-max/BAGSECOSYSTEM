'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import InboxDrawer from './InboxDrawer';

export default function InboxWidget({ variant = 'header' }: { variant?: 'header' | 'floating' } = {}) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1); // Default 1 unread urgent memo from mock

  // Fetch initial unread count
  useEffect(() => {
    async function checkUnread() {
      try {
        const res = await fetch('/api/inbox/dispatches?view=inbox&division=Finance & Accounting');
        if (res.ok) {
          const data = await res.json();
          const count = data.filter((d: any) => d.status === 'Unread').length;
          setUnreadCount(count);
        }
      } catch (err) {
        console.error('Failed to check unread count');
      }
    }
    checkUnread();
  }, []);

  const isHeader = variant === 'header';

  return (
    <>
      {isHeader ? (
        /* Sleek Enterprise Top Header Notification Button */
        <button
          onClick={() => setShowDrawer(true)}
          className="relative bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] group shrink-0"
          aria-label="Open Inter-Division Inbox"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-600 transition-colors">
              <Icon name="InboxIcon" size={14} className="text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-white dark:border-slate-800 animate-pulse shadow-sm">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="font-extrabold text-xs tracking-tight hidden md:inline">
            Dispatch Memo
          </span>
        </button>
      ) : (
        /* Original Floating Pill Style */
        <button
          onClick={() => setShowDrawer(true)}
          className="fixed bottom-6 right-6 bg-slate-900/90 hover:bg-indigo-950/95 dark:bg-slate-900/90 text-white font-extrabold px-5 py-3.5 rounded-2xl border border-white/20 shadow-[0_15px_40px_-10px_rgba(79,46,229,0.5)] backdrop-blur-xl z-40 transition-all duration-300 hover:scale-105 hover:border-indigo-400 flex items-center gap-3 group"
          aria-label="Open Inter-Division Inbox"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-110 transition-transform">
              <Icon name="InboxIcon" size={18} className="text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-slate-900 animate-bounce shadow-md">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="text-left hidden sm:block">
            <span className="block text-[10px] text-indigo-300 font-bold uppercase tracking-widest leading-none">Enterprise ERP</span>
            <span className="block text-sm text-white font-extrabold tracking-tight mt-0.5 group-hover:text-indigo-200 transition-colors">
              Dispatch Memo
            </span>
          </div>
        </button>
      )}

      {/* Inbox Modal Drawer */}
      {showDrawer && (
        <InboxDrawer
          onClose={() => setShowDrawer(false)}
          onUnreadChange={(count) => setUnreadCount(count)}
        />
      )}
    </>
  );
}
