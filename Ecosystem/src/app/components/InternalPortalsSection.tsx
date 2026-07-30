'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface DivisionCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  features: string[];
  accentColor: string;
  bgLight: string;
  borderColor: string;
  ctaLabel: string;
}

const divisions: DivisionCard[] = [
  {
    id: 'stasiun',
    title: 'Stasiun',
    subtitle: 'Operations · Mother Station',
    iconName: 'CpuChipIcon',
    description: 'Real-time station operations dashboard for inventory control, ATEX zone monitoring, and CNG production telemetry.',
    features: ['ATEX Monitoring', 'Inventory Control', 'Production Telemetry', 'Safety Alerts'],
    accentColor: 'var(--green-ops)',
    bgLight: 'var(--green-ops-light)',
    borderColor: 'rgba(22,163,74,0.2)',
    ctaLabel: 'Station Dashboard',
  },
  {
    id: 'armada',
    title: 'Armada',
    subtitle: 'Fleet Manager · Dispatch',
    iconName: 'TruckIcon',
    description: 'Fleet dispatch and route optimization for Tubeskid and 12Kg delivery vehicles with real-time driver tracking.',
    features: ['Route Optimization', 'Driver Management', 'GPS Tracking', 'Delivery Scheduling'],
    accentColor: 'var(--fleet-blue)',
    bgLight: 'var(--fleet-blue-light)',
    borderColor: 'rgba(37,99,235,0.2)',
    ctaLabel: 'Fleet Console',
  },
  {
    id: 'pelanggan',
    title: 'Customer App',
    subtitle: 'Horeca B2C · Web App',
    iconName: 'BuildingStorefrontIcon',
    description: 'B2C Web App for restaurant owners to order 12Kg cylinders, track deliveries, use loyalty points, and scan NFC tags for safety verification.',
    features: ['Order Gas', 'Delivery Tracking', 'NFC Safety Scan', 'Loyalty Points'],
    accentColor: 'var(--amber)',
    bgLight: 'var(--amber-light)',
    borderColor: 'rgba(245,158,11,0.2)',
    ctaLabel: 'Customer App',
  },
  {
    id: 'keuangan',
    title: 'Keuangan',
    subtitle: 'Finance Manager · Accounting',
    iconName: 'BanknotesIcon',
    description: 'Comprehensive financial control covering cash flow, revenue analytics, invoicing, and regulatory financial reporting.',
    features: ['Cash Flow', 'Revenue Analytics', 'Invoicing', 'Financial Reports'],
    accentColor: 'var(--finance-green)',
    bgLight: 'var(--finance-green-light)',
    borderColor: 'rgba(5,150,105,0.2)',
    ctaLabel: 'Finance Dashboard',
  },
  {
    id: 'pemasaran',
    title: 'Pemasaran',
    subtitle: 'Marketing Manager · Growth',
    iconName: 'MegaphoneIcon',
    description: 'Lead management, campaign tracking, and market analytics for both B2B industrial and B2C Horeca segments.',
    features: ['Lead Management', 'Campaign Tracking', 'Market Analytics', 'Segment Reports'],
    accentColor: 'var(--amber-dark)',
    bgLight: 'var(--amber-light)',
    borderColor: 'rgba(217,119,6,0.2)',
    ctaLabel: 'Marketing Hub',
  },
  {
    id: 'hr',
    title: 'HRD',
    subtitle: 'Human Resources · HC',
    iconName: 'UsersIcon',
    description: 'Manage employee data, payroll, performance reviews, and recruitment for all BaGS personnel.',
    features: ['Payroll', 'Performance', 'Recruitment', 'Employee DB'],
    accentColor: 'var(--cyan)',
    bgLight: 'var(--cyan-light)',
    borderColor: 'rgba(6,182,212,0.2)',
    ctaLabel: 'HR Dashboard',
  },
  {
    id: 'pwa',
    title: 'GasDrive',
    subtitle: 'Mobile App · PWA',
    iconName: 'DevicePhoneMobileIcon',
    description: 'Driver application for real-time delivery tracking, proof of delivery, and vehicle inspections.',
    features: ['Delivery Tracking', 'POD', 'Inspections', 'Navigation'],
    accentColor: 'var(--blue)',
    bgLight: 'var(--blue-light)',
    borderColor: 'rgba(59,130,246,0.2)',
    ctaLabel: 'Driver App',
  },
  {
    id: 'skid',
    title: 'SkidPortal (B2B)',
    subtitle: 'Industrial Client App',
    iconName: 'BuildingOfficeIcon',
    description: 'B2B portal for enterprise factory clients to view telemetry data, track deliveries, and sign custody transfer documents.',
    features: ['Telemetry IoT', 'Custody Transfer', 'Delivery Tracking', 'Contract DB'],
    accentColor: 'var(--industrial)',
    bgLight: 'var(--industrial-light)',
    borderColor: 'rgba(30,58,95,0.2)',
    ctaLabel: 'B2B Portal',
  },
  {
    id: 'legal',
    title: 'Legal & Compliance',
    subtitle: 'Hukum & Kepatuhan',
    iconName: 'ScaleIcon',
    description: 'Manage corporate legal documents, B2B custody transfer contracts, and regulatory safety compliance (HSE).',
    features: ['Contract DB', 'HSE Compliance', 'Permits & Licenses', 'Audit Readiness'],
    accentColor: 'var(--indigo)',
    bgLight: 'var(--indigo-light)',
    borderColor: 'rgba(99,102,241,0.2)',
    ctaLabel: 'Legal Portal',
  },
];

export default function InternalPortalsSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll('.reveal-up-hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-6 bg-secondary" id="internal">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="mb-10 reveal-up-hidden stagger-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px" style={{ backgroundColor: 'var(--indigo)' }} />
            <span className="font-semibold uppercase tracking-widest text-muted-foreground" style={{ fontSize: '11px' }}>
              Secure Access
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-foreground tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                Internal Management Portals
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                Role-based secure access for BaGS back-office divisions. Authenticate with your division credentials.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 self-start md:self-auto shadow-card">
              <Icon name="LockIcon" size={13} className="text-muted-foreground" variant="solid" />
              <span className="text-muted-foreground font-semibold" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                AUTHENTICATED ACCESS ONLY
              </span>
            </div>
          </div>
        </div>

        {/* BENTO GRID: 3 cols × 3 rows (Frosted Glass Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {divisions.map((div, idx) => (
            <div
              key={div.id}
              className={`reveal-up-hidden stagger-${idx + 1} glass-bento rounded-[2.2rem] overflow-hidden flex flex-col group relative`}
              style={{ borderColor: div.borderColor }}
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: div.accentColor }} />

              <div className="p-6 md:p-7 flex flex-col flex-1 relative z-10">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="icon-container shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ backgroundColor: div.bgLight }}>
                      <Icon
                        name={div.iconName as Parameters<typeof Icon>[0]['name']}
                        size={22}
                        variant="outline"
                        className="transition-colors"
                        style={{ color: div.accentColor } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-foreground leading-tight group-hover:text-primary transition-colors" style={{ fontSize: '1.05rem' }}>
                        {div.title}
                      </h3>
                      <p className="text-muted-foreground font-semibold leading-tight" style={{ fontSize: '11px' }}>
                        {div.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Secure badge */}
                  <div className="secure-badge bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-muted-foreground flex-shrink-0 border border-white/50 dark:border-slate-700/50 shadow-sm">
                    <Icon name="LockIcon" size={9} variant="solid" />
                    <span>Secure</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-5 flex-1" style={{ fontSize: '13px' }}>
                  {div.description}
                </p>

                {/* Feature tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {div.features.map((feat) => (
                    <span
                      key={feat}
                      className="rounded-full px-2.5 py-0.5 font-semibold bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm"
                      style={{
                        fontSize: '10px',
                        color: div.accentColor,
                        border: `1px solid ${div.borderColor}`,
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={isAuthenticated ? `/portal/${div.id}` : `/?login_modal=true&destination=/portal/${div.id}`}
                  className="magnetic-btn w-full flex items-center justify-center gap-2 rounded-2xl py-3 font-bold border transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{
                    fontSize: '13px',
                    color: div.accentColor,
                    borderColor: div.borderColor,
                    backgroundColor: div.bgLight,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = div.accentColor;
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = div.accentColor;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = div.bgLight;
                    (e.currentTarget as HTMLAnchorElement).style.color = div.accentColor;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = div.borderColor;
                  }}
                >
                  <Icon name="LogInIcon" size={14} variant="outline" />
                  {div.ctaLabel}
                  <Icon name="ArrowRightIcon" size={13} variant="outline" className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}