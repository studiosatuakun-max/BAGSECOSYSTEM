import React from 'react';
import Link from 'next/link';
import { User, Store, CreditCard, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const menuItems = [
    { icon: Store, label: 'Business Details', href: '#' },
    { icon: CreditCard, label: 'Payment Methods', href: '#' },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: Shield, label: 'Security & Privacy', href: '#' },
    { icon: HelpCircle, label: 'Help & Support', href: '#' },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Profile Section */}
      <div className="bg-primary px-6 pt-10 pb-8 rounded-b-[2rem] text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center backdrop-blur-sm">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Warteg Bahari Jaya</h1>
            <p className="text-sm text-primary-foreground/80 mt-0.5">warteg.bahari@horecagas.io</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Verified Partner
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 mb-3">
          Account Settings
        </div>
        
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Link href={item.href} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <span className="flex-1 text-sm font-bold text-foreground">{item.label}</span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
              {index < menuItems.length - 1 && <div className="h-px w-full bg-border" />}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-6">
          <Link href="/portal/horeca" className="flex items-center justify-center gap-2 w-full p-4 text-error font-bold rounded-2xl border border-error-bg bg-error-bg hover:bg-error/10 transition-colors">
            <LogOut size={20} />
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
