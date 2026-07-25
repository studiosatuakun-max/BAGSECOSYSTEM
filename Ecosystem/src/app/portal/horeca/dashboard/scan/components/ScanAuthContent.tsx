'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wifi, QrCode, RefreshCw, Info } from 'lucide-react';
import ScanArea from './ScanArea';
import AuthResultDetail from './AuthResultDetail';
import TamperedResultDetail from './TamperedResultDetail';
import Icon from '@/app/portal/horeca/components/ui/AppIcon';


type ScanState = 'idle' | 'scanning' | 'success' | 'tampered';

export default function ScanAuthContent() {
  const router = useRouter();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [selectedMode, setSelectedMode] = useState<'nfc' | 'qr'>('nfc');

  const handleStartScan = useCallback(() => {
    setScanState('scanning');
    // Backend: POST /api/cylinders/verify { nfcPayload | qrCode }
    setTimeout(() => {
      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.15;
      setScanState(isSuccess ? 'success' : 'tampered');
    }, 2800);
  }, []);

  const handleReset = useCallback(() => {
    setScanState('idle');
  }, []);

  return (
    <div className="max-w-md mx-auto px-4">
      {/* Page Header */}
      <div className="flex items-center gap-3 pt-6 pb-4">
        <button
          onClick={() => router.push('/portal/horeca/dashboard')}
          className="w-10 h-10 rounded-2xl bg-card border border-border card-shadow flex items-center justify-center hover:bg-muted transition-all duration-150 active:scale-95"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft size={20} strokeWidth={2} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Cylinder Verification
          </h1>
          <p className="text-xs text-muted-foreground">
            12 Kg LPG Safety Check
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      {(scanState === 'idle' || scanState === 'scanning') && (
        <div className="flex gap-2 mb-5 bg-muted p-1 rounded-2xl">
          {[
            { id: 'mode-nfc', mode: 'nfc' as const, icon: Wifi, label: 'NFC Tap' },
            { id: 'mode-qr', mode: 'qr' as const, icon: QrCode, label: 'QR Scan' },
          ].map(({ id, mode, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setSelectedMode(mode)}
              disabled={scanState === 'scanning'}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                selectedMode === mode
                  ? 'bg-card text-primary card-shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Scan Area */}
      {(scanState === 'idle' || scanState === 'scanning') && (
        <ScanArea
          scanState={scanState}
          mode={selectedMode}
          onStartScan={handleStartScan}
        />
      )}

      {/* Info Box — idle */}
      {scanState === 'idle' && (
        <div className="mt-4 flex gap-3 bg-info-bg border border-blue-200 rounded-2xl px-4 py-3 fade-in-up">
          <Info size={16} className="text-info flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold text-info">
              How to verify
            </p>
            <p className="text-xs text-info/70 mt-0.5 leading-relaxed">
              {selectedMode === 'nfc' ?'Hold your phone near the NFC sticker on the cylinder valve. Keep steady for 2–3 seconds.' :'Point your camera at the QR code printed on the cylinder label. Ensure good lighting.'}
            </p>
          </div>
        </div>
      )}

      {/* Warning — scanning */}
      {scanState === 'scanning' && (
        <div className="mt-4 flex gap-3 bg-warning-bg border border-amber-200 rounded-2xl px-4 py-3 fade-in-up">
          <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-warning">
            Reading cylinder chip... Do not move your phone
          </p>
        </div>
      )}

      {/* Success Result */}
      {scanState === 'success' && (
        <div className="fade-in-up">
          <AuthResultDetail />
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 mt-4 py-4 rounded-2xl border-2 border-border bg-card font-bold text-sm text-foreground hover:bg-muted transition-all duration-150 active:scale-[0.98]"
          >
            <RefreshCw size={16} strokeWidth={2.5} />
            Scan Another Cylinder
          </button>
        </div>
      )}

      {/* Tampered Result */}
      {scanState === 'tampered' && (
        <div className="fade-in-up">
          <TamperedResultDetail />
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 mt-4 py-4 rounded-2xl bg-error text-white font-bold text-sm hover:brightness-105 transition-all duration-150 active:scale-[0.98]"
          >
            <RefreshCw size={16} strokeWidth={2.5} />
            Try Again
          </button>
          <button
            onClick={() => router.push('/portal/horeca/dashboard')}
            className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 rounded-2xl border-2 border-border bg-card font-semibold text-sm text-foreground hover:bg-muted transition-all duration-150 active:scale-[0.98]"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}