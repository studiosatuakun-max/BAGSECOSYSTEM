import React from 'react';
import BottomNav from './BottomNav';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-24 w-full relative z-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}