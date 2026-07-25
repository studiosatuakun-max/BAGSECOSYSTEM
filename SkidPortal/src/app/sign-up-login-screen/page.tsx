import React from 'react';
import { Toaster } from 'sonner';
import AuthBrandPanel from './components/AuthBrandPanel';
import LoginForm from './components/LoginForm';

export default function SignUpLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-0">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-plus-jakarta-sans)',
            borderRadius: '0.75rem',
            border: '1px solid var(--border)',
          },
        }}
      />
      <div className="w-full max-w-screen-lg mx-auto lg:h-screen lg:max-h-[800px] flex rounded-3xl overflow-hidden shadow-card-lg border border-border">
        {/* Left: Brand Panel */}
        <div className="hidden lg:block w-[52%] flex-shrink-0">
          <AuthBrandPanel />
        </div>

        {/* Right: Login Form */}
        <div className="flex-1 bg-card flex flex-col justify-center px-6 py-10 sm:px-10 xl:px-14 overflow-y-auto">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <AppLogoMobile />
          </div>

          <LoginForm />

          <p className="text-[11px] text-muted-foreground/60 text-center mt-8">
            © 2026 SkidPortal by PT Solusi Industri Digital. All rights reserved.
            <br />
            <a href="#" className="hover:text-muted-foreground transition-colors duration-150">Privacy Policy</a>
            {' · '}
            <a href="#" className="hover:text-muted-foreground transition-colors duration-150">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Mobile-only inline logo component (server component, no 'use client' needed)
function AppLogoMobile() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
        <span className="text-white font-bold text-sm">SP</span>
      </div>
      <div>
        <span className="text-base font-bold text-primary tracking-tight block">SkidPortal</span>
        <span className="text-[10px] text-muted-foreground font-medium">Industrial Tank Monitoring</span>
      </div>
    </div>
  );
}