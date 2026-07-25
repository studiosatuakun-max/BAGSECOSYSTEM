import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GasDrive — Driver & Customer",
  description: "Premium LPG cylinder delivery platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div id="app-shell" className="relative h-screen w-full max-w-[420px] mx-auto flex flex-col overflow-hidden bg-[var(--bg-canvas)] sm:border-x sm:border-[var(--border)] sm:shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
