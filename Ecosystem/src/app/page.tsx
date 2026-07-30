import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import PrimaryPortalsSection from './components/PrimaryPortalsSection';
import InternalPortalsSection from './components/InternalPortalsSection';
import SystemIntegrityStrip from './components/SystemIntegrityStrip';
import LoginModalContainer from '@/components/LoginModalContainer';
import { createSupabaseServerClient } from '@/lib/supabaseSSR';

export const metadata: Metadata = {
  title: 'BaGS Ecosystem — Integrated ERP & Gas Logistics',
  description: 'Unified access dashboard for PT Baskara Asri Ghas — manage ERP, fleet, finance, and gas logistics operations from one secure platform in East Java, Indonesia.',
  openGraph: {
    title: 'BaGS Ecosystem',
    description: 'Integrated ERP & Gas Logistics Monitoring System for PT Baskara Asri Ghas.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Login Modal Overlay (Client Component with Suspense) */}
      <Suspense fallback={null}>
        <LoginModalContainer />
      </Suspense>

      {/* Background decorations wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="grain-overlay" aria-hidden="true" />
        <div className="ambient-glow-1 top-[750px] -left-32 opacity-50" />
        <div className="ambient-glow-2 top-[1200px] -right-32 opacity-40" />
        <div className="ambient-glow-1 bottom-40 left-1/3 opacity-35" />
      </div>

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero */}
        <HeroSection />

        {/* Primary External Portals */}
        <PrimaryPortalsSection isAuthenticated={isAuthenticated} />

        {/* Section divider */}
        <div className="section-divider mx-6 my-0" aria-hidden="true" />

        {/* Internal Management Portals */}
        <InternalPortalsSection isAuthenticated={isAuthenticated} />

        {/* System Integrity Strip */}
        <SystemIntegrityStrip />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
