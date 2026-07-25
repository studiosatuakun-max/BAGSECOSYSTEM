import React from 'react';
import Icon from '@/components/ui/AppIcon';

const metrics = [
  { icon: 'ShieldCheckIcon', label: 'ISO 9001 Certified', color: 'text-green-ops' },
  { icon: 'ZapIcon', label: 'INGTA Member', color: 'text-fleet-blue' },
  { icon: 'ActivityIcon', label: 'Real-Time Telemetry', color: 'text-indigo' },
  { icon: 'LockIcon', label: 'Encrypted Data', color: 'text-finance-green' },
  { icon: 'MapPinIcon', label: 'Gebang, Sidoarjo — East Java', color: 'text-muted-foreground' },
];

export default function SystemIntegrityStrip() {
  return (
    <section className="system-strip py-10 px-6" aria-label="System integrity">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: tagline */}
          <div className="text-center md:text-left">
            <p className="text-primary-foreground font-extrabold tracking-tight" style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}>
              Secure · Reliable · Real-Time
            </p>
            <p className="text-white font-normal mt-1" style={{ fontSize: '13px', opacity: 0.65 }}>
              BaGS Ecosystem operates on enterprise-grade infrastructure with end-to-end encryption.
            </p>
          </div>

          {/* Right: metric chips */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-2"
              >
                <Icon
                  name={m.icon as Parameters<typeof Icon>[0]['name']}
                  size={13}
                  variant="outline"
                  className="text-white"
                />
                <span className="text-white font-semibold" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}