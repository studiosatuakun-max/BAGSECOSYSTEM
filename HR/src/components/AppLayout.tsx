import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function AppLayout({ children, pageTitle, pageSubtitle }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
        <main className="flex-1 px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}