import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import '../styles/tailwind.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'HorecaGas — Safe LPG Delivery for Your Business',
  description:
    'Verify cylinder authenticity, reorder 12Kg LPG cylinders, and track deliveries in real time — built for Horeca businesses.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <div id="app-shell" className="relative h-screen w-full flex flex-col overflow-hidden bg-background">
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-plus-jakarta-sans)',
                borderRadius: '0.875rem',
                fontSize: '0.875rem',
                fontWeight: '500',
              },
            }}
          />
        </div>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fhorecagas1922back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.19" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}