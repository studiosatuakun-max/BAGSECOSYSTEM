'use client';

import React from 'react';
import { Wifi, QrCode, Zap } from 'lucide-react';

interface ScanAreaProps {
  scanState: 'idle' | 'scanning';
  mode: 'nfc' | 'qr';
  onStartScan: () => void;
}

export default function ScanArea({ scanState, mode, onStartScan }: ScanAreaProps) {
  const isScanning = scanState === 'scanning';

  return (
    <div className="flex flex-col items-center">
      {/* Scan Frame */}
      <div className={`relative w-64 h-64 rounded-3xl overflow-hidden flex items-center justify-center transition-all duration-300 ${
        isScanning
          ? 'bg-primary/5 border-2 border-primary' :'bg-muted border-2 border-dashed border-border'
      }`}>
        {/* Corner decorations */}
        {[
          'top-3 left-3 border-t-2 border-l-2',
          'top-3 right-3 border-t-2 border-r-2',
          'bottom-3 left-3 border-b-2 border-l-2',
          'bottom-3 right-3 border-b-2 border-r-2',
        ].map((pos, i) => (
          <div
            key={`corner-${i}`}
            className={`absolute w-6 h-6 rounded-sm ${pos} ${
              isScanning ? 'border-primary' : 'border-muted-foreground/30'
            } transition-colors duration-300`}
          />
        ))}

        {/* NFC Waves */}
        {mode === 'nfc' && (
          <div className="relative flex items-center justify-center w-full h-full">
            {isScanning && (
              <>
                <div className={`absolute w-32 h-32 rounded-full border-2 border-primary/30 nfc-wave`} />
                <div className={`absolute w-24 h-24 rounded-full border-2 border-primary/50 nfc-wave-delay-1`} />
                <div className={`absolute w-16 h-16 rounded-full border-2 border-primary/70 nfc-wave-delay-2`} />
              </>
            )}
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center z-10 transition-all duration-300 ${
              isScanning ? 'bg-primary' : 'bg-muted-foreground/10'
            }`}>
              <Wifi
                size={32}
                strokeWidth={2}
                className={isScanning ? 'text-white' : 'text-muted-foreground/40'}
              />
            </div>
          </div>
        )}

        {/* QR Scan */}
        {mode === 'qr' && (
          <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
            {isScanning && (
              <div className="absolute inset-0 flex flex-col justify-center">
                <div className="w-full h-0.5 bg-primary/70 scan-line-sweep" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center z-10 transition-all duration-300 ${
              isScanning ? 'bg-primary' : 'bg-muted-foreground/10'
            }`}>
              <QrCode
                size={32}
                strokeWidth={2}
                className={isScanning ? 'text-white' : 'text-muted-foreground/40'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center mt-4 mb-5">
        {isScanning ? (
          <>
            <p className="text-sm font-bold text-primary">
              {mode === 'nfc' ? 'Reading NFC chip...' : 'Scanning QR code...'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hold steady — verifying with HorecaGas servers
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-foreground">
              {mode === 'nfc' ?'Tap your phone to the cylinder valve' :'Point camera at the QR code label'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ensure the cylinder is in front of you before scanning
            </p>
          </>
        )}
      </div>

      {/* Action Button */}
      {!isScanning && (
        <button
          onClick={onStartScan}
          className="w-full flex items-center justify-center gap-3 bg-primary text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 active:scale-[0.98] hover:brightness-105 brand-glow"
        >
          {mode === 'nfc' ? (
            <Wifi size={20} strokeWidth={2.5} />
          ) : (
            <QrCode size={20} strokeWidth={2.5} />
          )}
          <span>
            {mode === 'nfc' ? 'Start NFC Scan' : 'Open Camera Scanner'}
          </span>
          <Zap size={16} strokeWidth={2.5} className="text-sky-200" />
        </button>
      )}

      {/* Loading Button */}
      {isScanning && (
        <div className="w-full flex items-center justify-center gap-3 bg-primary/20 text-primary font-bold text-base py-4 rounded-2xl border-2 border-primary/30">
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span>Verifying Cylinder...</span>
        </div>
      )}
    </div>
  );
}