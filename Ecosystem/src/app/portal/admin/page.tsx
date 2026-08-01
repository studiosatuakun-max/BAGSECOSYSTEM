"use client";

import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  PresentationChartLineIcon, 
  ServerIcon,
  ShieldCheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const DUMMY_METRICS = [
  { id: 1, title: 'Total Registered Users', value: '1,248', icon: UsersIcon, color: 'text-blue-400' },
  { id: 2, title: 'Global Monthly Revenue', value: '$2.4M', icon: CurrencyDollarIcon, color: 'text-emerald-400' },
  { id: 3, title: 'Active Sales Pipeline', value: '84 Leads', icon: PresentationChartLineIcon, color: 'text-purple-400' },
  { id: 4, title: 'System Health (Uptime)', value: '99.99%', icon: ServerIcon, color: 'text-cyan-400' },
];

const DUMMY_USERS = [
  { id: 'usr_001', name: 'John Doe', email: 'john.doe@baskara.id', role: 'Super Admin', status: 'Active' },
  { id: 'usr_002', name: 'Jane Smith', email: 'jane.smith@baskara.id', role: 'Marketing AE', status: 'Active' },
  { id: 'usr_003', name: 'Robert King', email: 'robert.k@baskara.id', role: 'Finance', status: 'Inactive' },
  { id: 'usr_004', name: 'Sarah Lee', email: 'sarah.lee@baskara.id', role: 'Station Operator', status: 'Active' },
];

const DUMMY_LOGS = [
  '[10:45:00] [WARN] RLS Blocked unauthorized insert at sales_leads by usr_002',
  '[10:42:12] [INFO] Database backup completed successfully',
  '[10:39:55] [INFO] User usr_001 successfully logged in via SSO',
  '[10:30:11] [ERROR] Failed to fetch telemetry data from station ST-04',
  '[10:25:00] [INFO] Marketing Manager updated role permissions',
];

export default function AdminCommandCenter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden font-sans text-slate-200">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 h-full">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Super Admin Command Center
            </h1>
            <p className="text-white/70 mt-1 font-medium">Global oversight & ecosystem management console</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-full px-4 py-2">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-sm font-semibold text-emerald-400 drop-shadow-sm tracking-wide">System Online - RLS Secured</span>
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_METRICS.map((metric) => (
            <div 
              key={metric.id} 
              className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <p className="text-white/70 text-sm font-medium">{metric.title}</p>
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors ${metric.color}`}>
                  <metric.icon className="w-5 h-5" />
                </div>
              </div>
              <h2 className={`text-4xl font-extrabold mt-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transform origin-left transition-transform duration-300 ${metric.color}`}>
                {metric.value}
              </h2>
            </div>
          ))}
        </section>

        {/* Main Content Area (Bento Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* User Access Management (2/3 width on large screens) */}
          <section className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 flex flex-col hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white drop-shadow-sm">User Access Management</h3>
                <p className="text-sm text-white/50 mt-1">Manage global ecosystem roles and permissions</p>
              </div>
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all duration-300">
                + Invite User
              </button>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                    <th className="pb-3 px-2 font-medium">User ID</th>
                    <th className="pb-3 px-2 font-medium">Name & Email</th>
                    <th className="pb-3 px-2 font-medium">Role</th>
                    <th className="pb-3 px-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {DUMMY_USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-2 text-sm text-gray-400 font-mono">{user.id}</td>
                      <td className="py-4 px-2">
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-white/50">{user.email}</p>
                      </td>
                      <td className="py-4 px-2">
                        <div className="inline-flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 min-w-[140px] cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all">
                          <span className="text-xs font-medium text-white/80">{user.role}</span>
                          <ChevronDownIcon className="w-3 h-3 text-white/50" />
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Security & Audit Logs (1/3 width on large screens) */}
          <section className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 flex flex-col hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
            <h3 className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-2">
              <ServerIcon className="w-5 h-5 text-indigo-400" />
              Security & Audit Logs
            </h3>
            <p className="text-sm text-white/50 mt-1 mb-4">Live system event monitoring</p>
            
            <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-[11px] sm:text-xs overflow-y-auto space-y-2 h-[300px] lg:h-auto custom-scrollbar shadow-inner">
              {DUMMY_LOGS.map((log, index) => {
                let colorClass = "text-gray-400";
                if (log.includes('[WARN]')) colorClass = "text-amber-400";
                if (log.includes('[ERROR]')) colorClass = "text-red-400";
                if (log.includes('[INFO]')) colorClass = "text-blue-300";

                return (
                  <div key={index} className={`break-words ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
              <div className="text-emerald-400 animate-pulse mt-2">_</div>
            </div>
          </section>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}} />
    </div>
  );
}
