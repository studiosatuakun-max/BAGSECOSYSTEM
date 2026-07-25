'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';


const stats = [
  { value: '5.5 MMSCFD', label: 'Station Capacity' },
  { value: '140,000 m³', label: 'CNG / Day' },
  { value: 'Since 2010', label: 'Operational' }];


export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const bgEl = hero.querySelector('.hero-parallax') as HTMLElement;
        if (bgEl) {
          bgEl.style.transform = `scale(1.06) translate(${(x - 0.5) * -12}px, ${(y - 0.5) * -8}px)`;
        }
      });
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'clamp(480px, 60vh, 680px)' }}
      aria-label="BaGS Ecosystem Hero">

      {/* Background Image */}
      <div className="absolute inset-0 hero-parallax" style={{ transition: 'transform 0.15s ease-out', willChange: 'transform' }}>
        <AppImage
          src="/assets/images/background.png"
          alt="BaGS CNG facility"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw" />

      </div>

      {/* Scrim overlay — white text needs dark scrim */}
      <div className="absolute inset-0 hero-scrim" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-12 pt-16"
        style={{ minHeight: 'clamp(480px, 60vh, 680px)' }}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* Left: Headline */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Logo */}
            <div className="mb-6">
              <AppImage
                src="/assets/images/logo.png"
                alt="BaGS Logo"
                width={200}
                height={80}
                className="object-contain object-left"
                unoptimized
              />
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent font-bold tracking-widest uppercase" style={{ fontSize: '11px' }}>
                PT Baskara Asri Ghas · Est. 2008
              </span>
            </div>

            {/* Headline with text-highlight technique */}
            <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              <span className="text-highlight-dark">BaGS Ecosystem</span>
              <br />
              <span className="text-white font-light" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', opacity: 0.9 }}>
                Integrated ERP &amp; Gas Logistics<br />Monitoring System
              </span>
            </h1>

            <p className="text-white font-normal mb-8 max-w-xl leading-relaxed" style={{ fontSize: '15px', opacity: 0.78 }}>
              Unified operational command for CNG distribution, fleet management,
              customer service, and financial control across all BaGS divisions.
            </p>

            {/* Stats row (Frosted Glass Pills) */}
            <div className="flex flex-wrap gap-4">
              {stats.map((stat) =>
                <div key={stat.label} className="flex flex-col bg-white/15 dark:bg-slate-900/40 backdrop-blur-md border border-white/25 px-5 py-3.5 rounded-2xl shadow-lg hover:bg-white/25 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="text-white font-extrabold" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>
                    {stat.value}
                  </span>
                  <span className="text-indigo-200 font-bold" style={{ fontSize: '11px', opacity: 0.9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Floating status card (Frosted Glass Panel) */}
          <div className="lg:col-span-5 xl:col-span-4 flex lg:justify-end">
            <div className="glass-panel rounded-[2.2rem] p-7 w-full max-w-xs shadow-2xl relative group hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)] transition-all duration-500 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-green-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-5 relative z-10">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ fontSize: '14px' }}>System Status</span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/60" style={{ fontSize: '10px' }}>Live · {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>

              <div className="space-y-3 relative z-10">
                {[
                  { label: 'ATEX Zone A', status: 'Nominal', color: 'text-emerald-600 dark:text-emerald-400 font-bold' },
                  { label: 'ATEX Zone B', status: 'Nominal', color: 'text-emerald-600 dark:text-emerald-400 font-bold' },
                  { label: 'Telemetry Feed', status: 'Active', color: 'text-emerald-600 dark:text-emerald-400 font-bold' },
                  { label: 'CNG Pressure', status: '218 bar', color: 'text-indigo-600 dark:text-indigo-400 font-bold' },
                  { label: 'Active Deliveries', status: '14 routes', color: 'text-indigo-600 dark:text-indigo-400 font-bold' }].
                  map((row) =>
                    <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60 last:border-0">
                      <span className="text-slate-700 dark:text-slate-200 font-medium" style={{ fontSize: '12px' }}>{row.label}</span>
                      <span className={row.color} style={{ fontSize: '12px' }}>{row.status}</span>
                    </div>
                  )}
              </div>

              <div className="mt-6 flex items-center gap-2.5 bg-emerald-500/15 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-2xl px-3.5 py-2.5 relative z-10 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 status-pulse flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-emerald-700 dark:text-emerald-300 font-extrabold" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.85))' }} />
    </section>);

}