'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import InboxWidget from '@/app/components/InboxWidget';

export interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

export interface PortalHeaderProps {
  title: string;
  subtitle?: string;
  roleBadge?: string;
  roleColor?: 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'indigo' | 'slate' | 'emerald' | 'cyan' | 'pink' | 'orange';
  navItems?: NavItem[];
  backUrl?: string;
  backText?: string;
  showInbox?: boolean;
  rightCustom?: React.ReactNode;
}

export default function PortalHeader({
  title,
  subtitle,
  roleBadge,
  roleColor = 'indigo',
  navItems,
  backUrl = '/',
  backText = 'Exit Portal',
  showInbox = true,
  rightCustom,
}: PortalHeaderProps) {
  const pathname = usePathname();

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'green':
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'blue':
      case 'cyan':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'amber':
      case 'orange':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'red':
      case 'pink':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800';
      case 'slate':
        return 'bg-slate-800 text-slate-100 border-slate-700 dark:bg-slate-800 dark:text-slate-100';
      case 'indigo':
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
    }
  };

  const getPulseStyle = (color: string) => {
    switch (color) {
      case 'green':
      case 'emerald': return 'bg-emerald-500';
      case 'blue':
      case 'cyan': return 'bg-blue-600';
      case 'purple': return 'bg-purple-600';
      case 'amber':
      case 'orange': return 'bg-amber-500';
      case 'red':
      case 'pink': return 'bg-red-500';
      case 'slate': return 'bg-green-400';
      case 'indigo':
      default: return 'bg-indigo-600';
    }
  };

  const isTabActive = (itemHref: string) => {
    if (!pathname) return false;
    if (pathname === itemHref) return true;
    if (itemHref !== backUrl && pathname.startsWith(itemHref) && itemHref !== '/portal/skid') {
      return true;
    }
    return false;
  };

  return (
    <>
      <header className="w-full h-16 border-b border-border/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl sticky top-0 z-40 shadow-sm flex items-center justify-between px-4 sm:px-6 transition-all relative">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4">
          <Link href={backUrl} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-background shadow-sm border border-border flex items-center justify-center p-1 group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/assets/images/icon.png"
                alt="BaGS Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                {title}
              </span>
              {subtitle && (
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {subtitle}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Center: Navigation Pills (Desktop) */}
        {navItems && navItems.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 bg-secondary/80 p-1 rounded-2xl border border-border/60 shadow-inner">
            {navItems.map((item) => {
              const active = isTabActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                  }`}
                >
                  {item.icon && <Icon name={item.icon} size={14} />}
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right: Inbox, Role Badge, Exit Portal */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {showInbox && <InboxWidget variant="header" />}

          {roleBadge && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${getBadgeStyle(roleColor)}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${getPulseStyle(roleColor)}`} />
              <span className="hidden sm:inline">{roleBadge}</span>
            </div>
          )}

          {rightCustom}

          <Link
            href={backUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all border border-transparent hover:border-border"
            title={backText}
          >
            <Icon name="ArrowLeftOnRectangleIcon" size={16} />
            <span className="hidden md:inline">{backText}</span>
          </Link>
        </div>

        {/* Subtle 2px Bottom Accent Gradient Bar (High-End Acrylic Frame Effect) */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-80 ${
          roleColor === 'amber' || roleColor === 'orange' ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400' :
          roleColor === 'green' || roleColor === 'emerald' ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400' :
          roleColor === 'blue' || roleColor === 'cyan' ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-400' :
          roleColor === 'red' || roleColor === 'pink' ? 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-400' :
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500'
        }`} />
      </header>

      {/* Responsive Navigation Bar for Tablet / Mobile (screens smaller than lg) */}
      {navItems && navItems.length > 0 && (
        <div className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-card/90 backdrop-blur-md border-b border-border sticky top-16 z-30 overflow-x-auto no-scrollbar shadow-2xs">
          {navItems.map((item) => {
            const active = isTabActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.icon && <Icon name={item.icon} size={14} />}
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
