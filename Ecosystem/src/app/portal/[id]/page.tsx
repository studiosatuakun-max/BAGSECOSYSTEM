'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const portalMap: Record<string, { port: number | null; name: string }> = {
  // Primary (Executive)
  'direksi-b2b': { port: null, name: 'Industrial Executive Dashboard' },
  'direksi-b2c': { port: null, name: 'Horeca Executive Dashboard' },
  // External
  skid: { port: 3007, name: 'Industrial Portal (B2B)' },
  horeca: { port: 3006, name: 'Horeca Portal (B2C)' },
  pelanggan: { port: 3006, name: 'Customer App (B2C)' },
  // Internal
  stasiun: { port: 3004, name: 'Stasiun Ops' },
  armada: { port: 3005, name: 'FleetTrack' },
  keuangan: { port: 3001, name: 'Baskara Finance' },
  pemasaran: { port: 3003, name: 'Baskara Marketing' },
  hr: { port: 3002, name: 'Baskara HR' },
  pwa: { port: 3008, name: 'GasDrive PWA' },
  cs: { port: 3009, name: 'Customer Service' },
  purchasing: { port: 3010, name: 'Baskara Purchasing' },
  legal: { port: 3011, name: 'Baskara Legal' },
};

export default function PortalPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const portalId = resolvedParams.id;
  const config = portalMap[portalId];

  if (!config || !config.port) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <Icon name="AlertTriangleIcon" size={48} className="text-red-500 mb-4" variant="outline" />
        <h1 className="text-2xl font-bold mb-2">Portal Not Found</h1>
        <p className="text-muted-foreground mb-6">The portal ID "{portalId}" does not exist.</p>
        <Link href="/" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold">
          Return to Ecosystem
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <div className="h-14 flex-shrink-0 border-b border-border bg-card flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={18} variant="outline" />
            <span className="font-semibold text-sm">Back to Ecosystem</span>
          </Link>
          <div className="h-4 w-px bg-border mx-2" />
          <span className="font-bold text-sm text-foreground">
            {config?.name || 'Portal'}
          </span>
        </div>
        
        {config && (
          <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Connected to port {config.port}
          </div>
        )}
      </div>

      {/* Main Iframe Content */}
      <div className="flex-1 w-full relative bg-secondary">
        <iframe
          src={`http://localhost:${config.port}`}
          className="w-full h-full border-none"
          title={`${config?.name} Preview`}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
