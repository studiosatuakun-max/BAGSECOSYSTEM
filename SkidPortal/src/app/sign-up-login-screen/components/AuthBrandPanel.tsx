import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { Gauge, FileText, Zap, Shield, BarChart3 } from 'lucide-react';

const features = [
  { id: 'feat-pressure', icon: Gauge, title: 'Real-time Pressure Monitoring', desc: 'Live gauge readings with automatic threshold alerts' },
  { id: 'feat-consumption', icon: BarChart3, title: 'Consumption Analytics', desc: '7-day trend analysis and daily usage reporting' },
  { id: 'feat-invoice', icon: FileText, title: 'Invoice Management', desc: 'View, download, and track payment status instantly' },
  { id: 'feat-refill', icon: Zap, title: 'Emergency Refill Requests', desc: 'One-tap dispatch with 2–6 hour SLA guarantee' },
  { id: 'feat-secure', icon: Shield, title: 'Secure Client Portal', desc: 'Enterprise-grade authentication for industrial clients' },
];

export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full gradient-brand p-10 xl:p-12 rounded-none lg:rounded-l-3xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
      {/* Top: Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <AppLogo size={44} />
          <div>
            <span className="text-xl font-bold text-white tracking-tight block">SkidPortal</span>
            <span className="text-xs text-white/60 font-medium">Industrial Tank Monitoring</span>
          </div>
        </div>
      </div>
      {/* Middle: Headline */}
      <div className="relative z-10 my-8">
        <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
          Monitor your skid tanks
          <br />
          <span className="text-blue-300">from anywhere, anytime.</span>
        </h2>
        <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-sm">
          Real-time pressure data, consumption analytics, and instant refill dispatch — all in one secure client portal built for Indonesian industrial operators.
        </p>
      </div>
      {/* Features */}
      <div className="relative z-10 space-y-3.5">
        {features?.map((feat) => (
          <div key={feat?.id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <feat.icon size={15} className="text-blue-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{feat?.title}</p>
              <p className="text-xs text-white/55 mt-0.5">{feat?.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom: Trust signal */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-white/40 font-medium">
          Trusted by 40+ industrial clients across Java, Sumatra & Kalimantan
        </p>
      </div>
    </div>
  );
}