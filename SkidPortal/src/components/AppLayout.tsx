import React from 'react';
import Topbar from './Topbar';
import { Toaster } from 'sonner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Topbar />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 py-6 lg:py-8">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-plus-jakarta-sans)',
            borderRadius: '0.75rem',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
          },
        }}
      />
    </div>
  );
}