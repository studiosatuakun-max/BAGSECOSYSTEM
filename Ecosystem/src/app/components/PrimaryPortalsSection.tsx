'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function PrimaryPortalsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section) return;
    const cards = section?.querySelectorAll('.reveal-up-hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards?.forEach((card) => observer?.observe(card));
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-6 bg-background" id="portals">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="mb-10 reveal-up-hidden stagger-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-accent" />
            <span className="text-muted-foreground font-semibold uppercase tracking-widest" style={{ fontSize: '11px' }}>
              External Access
            </span>
          </div>
          <h2 className="font-extrabold text-foreground tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Executive Dashboard Access
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg" style={{ fontSize: '14px', lineHeight: 1.7 }}>
            Director-level oversight and high-level business analytics for primary operational divisions.
          </p>
        </div>

        {/* Two Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Industrial Portal — B2B */}
          <div className="reveal-up-hidden stagger-2 portal-card rounded-2xl overflow-hidden bg-card border border-border shadow-card group cursor-pointer">
            {/* Image Header */}
            <div className="relative h-52 overflow-hidden">
              <AppImage
                src="https://images.unsplash.com/photo-1578459245460-a43770ff661f"
                alt="Heavy industrial steel tubeskid gas compression equipment in factory, deep blue steel tones, pipes and pressure vessels, bright workshop lighting"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw" />
              
              {/* Scrim for dark overlay — white text */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(30,58,95,0.3) 0%, rgba(30,58,95,0.7) 100%)' }} />
              {/* Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-industrial text-primary-foreground rounded-full px-3 py-1.5">
                <Icon name="Building2Icon" size={13} variant="solid" />
                <span className="font-bold" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>B2B · ENTERPRISE</span>
              </div>
              {/* Accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 accent-bar-blue" />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-foreground" style={{ fontSize: '1.2rem' }}>
                    Industrial Portal
                  </h3>
                  <p className="text-muted-foreground font-semibold" style={{ fontSize: '12px' }}>
                    B2B Skid Tank · Tubeskid Management
                  </p>
                </div>
                <div className="icon-container bg-industrial-light flex-shrink-0">
                  <Icon name="FactoryIcon" size={22} className="text-industrial" variant="outline" />
                </div>
              </div>

              <p className="text-muted-foreground mb-5 leading-relaxed" style={{ fontSize: '13px' }}>
                Enterprise-grade Tubeskid management covering custody transfer contracts,
                large-scale CNG delivery scheduling, and B2B billing reconciliation.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Custody Transfer', 'Contract Mgmt', 'Large-Scale Delivery', 'B2B Billing']?.map((tag) =>
                <span key={tag} className="bg-industrial-light text-industrial border border-industrial/15 rounded-full px-3 py-1 font-semibold" style={{ fontSize: '11px' }}>
                    {tag}
                  </span>
                )}
              </div>

              <Link href="/portal/direksi-b2b" className="magnetic-btn w-full flex items-center justify-center gap-2 bg-industrial text-primary-foreground rounded-xl py-3 font-bold hover:bg-primary/90 transition-colors" style={{ fontSize: '14px' }}>
                <Icon name="LogInIcon" size={16} variant="outline" className="text-primary-foreground" />
                Access Industrial Portal
                <Icon name="ArrowRightIcon" size={15} variant="outline" className="text-primary-foreground" />
              </Link>
            </div>
          </div>

          {/* Horeca Portal — B2C */}
          <div className="reveal-up-hidden stagger-3 portal-card rounded-2xl overflow-hidden bg-card border border-border shadow-card group cursor-pointer">
            {/* Image Header */}
            <div className="relative h-52 overflow-hidden">
              <AppImage
                src="https://images.unsplash.com/photo-1704409037558-a2e85a0a3482"
                alt="Warm and lively restaurant kitchen with chefs working, amber and orange warm lighting, bustling food service environment"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw" />
              
              {/* Scrim — white text */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(180,83,9,0.25) 0%, rgba(120,53,15,0.65) 100%)' }} />
              {/* Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full px-3 py-1.5" style={{ backgroundColor: 'var(--amber-dark)', color: '#fff' }}>
                <Icon name="ShoppingBagIcon" size={13} variant="solid" />
                <span className="font-bold" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>B2C · RETAIL</span>
              </div>
              {/* Accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 accent-bar-amber" />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-foreground" style={{ fontSize: '1.2rem' }}>
                    Horeca Portal
                  </h3>
                  <p className="text-muted-foreground font-semibold" style={{ fontSize: '12px' }}>
                    B2C Retail · 12Kg Cylinder Distribution
                  </p>
                </div>
                <div className="icon-container bg-amber-light flex-shrink-0">
                  <Icon name="UtensilsIcon" size={22} className="text-amber-dark" variant="outline" />
                </div>
              </div>

              <p className="text-muted-foreground mb-5 leading-relaxed" style={{ fontSize: '13px' }}>
                Retail-focused milk-run logistics for 12Kg cylinder distribution, cylinder
                deposit tracking, mobile app integration, and Horeca customer management.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Milk-Run Logistics', 'Cylinder Deposits', 'Mobile App', 'Retail Orders']?.map((tag) =>
                <span key={tag} className="bg-amber-light border rounded-full px-3 py-1 font-semibold" style={{ fontSize: '11px', color: 'var(--amber-dark)', borderColor: 'rgba(245,158,11,0.2)' }}>
                    {tag}
                  </span>
                )}
              </div>

              <Link href="/portal/direksi-b2c" className="magnetic-btn w-full flex items-center justify-center gap-2 text-white rounded-xl py-3 font-bold transition-colors" style={{ fontSize: '14px', backgroundColor: 'var(--amber-dark)' }}>
                <Icon name="LogInIcon" size={16} variant="outline" className="text-white" />
                Access Horeca Portal
                <Icon name="ArrowRightIcon" size={15} variant="outline" className="text-white" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>);

}