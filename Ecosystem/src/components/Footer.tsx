import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          
          {/* Left: Copyright */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/images/icon.png"
              alt="BaGS Logo"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              © 2026 PT Baskara Asri Ghas
            </span>
          </div>

          {/* Center: Ecosystem Engine Attribution */}
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              Baskara Ecosystem Engine v2
            </span>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-5 font-bold">
            <Link
              href="#"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="#"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Terms
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="#"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Support
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}