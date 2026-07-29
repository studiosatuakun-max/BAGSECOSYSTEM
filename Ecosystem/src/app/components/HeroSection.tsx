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
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {stats.map((stat) =>
                <div key={stat.label} className="flex flex-col">
                  <span className="text-white font-extrabold" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>
                    {stat.value}
                  </span>
                  <span className="text-white font-medium" style={{ fontSize: '11px', opacity: 0.6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Floating status card */}
          <div className="lg:col-span-5 xl:col-span-4 flex lg:justify-end">
            <div className="glass-card rounded-2xl p-6 w-full max-w-xs shadow-portal">
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-foreground" style={{ fontSize: '13px' }}>System Status</span>
                <span className="text-muted-foreground" style={{ fontSize: '11px' }}>Live · {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'ATEX Zone A', status: 'Nominal', color: 'text-green-ops' },
                  { label: 'ATEX Zone B', status: 'Nominal', color: 'text-green-ops' },
                  { label: 'Telemetry Feed', status: 'Active', color: 'text-green-ops' },
                  { label: 'CNG Pressure', status: '218 bar', color: 'text-fleet-blue' },
                  { label: 'Active Deliveries', status: '14 routes', color: 'text-fleet-blue' }].
                  map((row) =>
                    <div key={row.label} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground font-medium" style={{ fontSize: '12px' }}>{row.label}</span>
                      <span className={`font-bold ${row.color}`} style={{ fontSize: '12px' }}>{row.status}</span>
                    </div>
                  )}
              </div>

              <div className="mt-5 flex items-center gap-2 bg-green-ops-light rounded-xl px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-status-green status-pulse flex-shrink-0" />
                <span className="text-green-ops font-bold" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
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