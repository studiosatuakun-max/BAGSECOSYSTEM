import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Linear Single-Row Pattern */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-3">
            <Image
              src="/assets/images/icon.png"
              alt="BaGS Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-muted-foreground font-medium" style={{ fontSize: '13px' }}>
              © 2026 PT Baskara Asri Ghas
            </span>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-status-green status-pulse" />
            <span>SECURE ENVIRONMENT</span>
            <span className="text-border">•</span>
            <span className="w-1.5 h-1.5 rounded-full bg-status-green status-pulse" />
            <span>REAL-TIME TELEMETRY</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              style={{ fontSize: '13px' }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              style={{ fontSize: '13px' }}
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              style={{ fontSize: '13px' }}
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}