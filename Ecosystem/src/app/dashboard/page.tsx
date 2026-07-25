import React, { useState } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '../components/HeroSection';
import PrimaryPortalsSection from '../components/PrimaryPortalsSection';
import InternalPortalsSection from '../components/InternalPortalsSection';
import SystemIntegrityStrip from '../components/SystemIntegrityStrip';

export const metadata: Metadata = {
  title: 'BaGS Ecosystem — Integrated ERP & Gas Logistics',
  description: 'Unified access dashboard for PT Baskara Asri Ghas — manage ERP, fleet, finance, and gas logistics operations from one secure platform in East Java, Indonesia.',
  openGraph: {
    title: 'BaGS Ecosystem',
    description: 'Integrated ERP & Gas Logistics Monitoring System for PT Baskara Asri Ghas.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Ambient background glows for glassmorphism depth */}
      <div className="ambient-glow-1 top-[750px] -left-32 z-0 opacity-50" />
      <div className="ambient-glow-2 top-[1200px] -right-32 z-0 opacity-40" />
      <div className="ambient-glow-1 bottom-40 left-1/3 z-0 opacity-35" />

      {/* Navigation */}
      {/* Chat toggle button */}
      <button onClick={() => setShowChat(true)} className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-40">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
        </svg>
      </button>
      <Header />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero */}
        <HeroSection />

        {/* Primary External Portals */}
        <PrimaryPortalsSection />

        {/* Section divider */}
        <div className="section-divider mx-6 my-0" aria-hidden="true" />

        {/* Internal Management Portals */}
        <InternalPortalsSection />

        {/* System Integrity Strip */}
        <SystemIntegrityStrip />
      </main>

      {/* Footer */}
      <Footer />
    </div>
      {/* Chat Panel */}
      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
  );
}