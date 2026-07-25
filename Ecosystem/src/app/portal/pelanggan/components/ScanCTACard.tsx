'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ScanLine, ShieldCheck, Zap } from 'lucide-react';

export default function ScanCTACard() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden bg-primary rounded-3xl p-5 card-shadow-md">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -right-2 w-24 h-24 bg-white/5 rounded-full" />
      <div className="absolute top-4 right-8 w-10 h-10 bg-white/10 rounded-full" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-white/80" strokeWidth={2} />
              <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">
                Safety Check
              </span>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight">
              Scan Cylinder NFC
            </h2>
            <p className="text-white/70 text-sm mt-1 leading-snug">
              Verify your 12Kg cylinder is authentic and safe to use
            </p>
          </div>
        </div>

        <button
          onClick={() => router?.push('/cylinder-scan-authentication')}
          className="w-full flex items-center justify-center gap-3 bg-white text-primary font-bold text-base py-4 rounded-2xl transition-all duration-150 active:scale-[0.98] hover:bg-sky-50 brand-glow"
          aria-label="Scan cylinder NFC or QR code"
        >
          <div className="relative">
            <ScanLine size={22} strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full scan-ring-pulse" />
          </div>
          <span>Scan NFC / QR Code</span>
          <Zap size={16} strokeWidth={2.5} className="text-accent-foreground" />
        </button>

        <div className="flex items-center justify-center gap-4 mt-3">
          {[
            { id: 'feat-nfc', label: 'NFC Tap' },
            { id: 'feat-qr', label: 'QR Scan' },
            { id: 'feat-instant', label: 'Instant Result' },
          ]?.map((feat) => (
            <div key={feat?.id} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
              <span className="text-white/70 text-xs font-medium">{feat?.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}