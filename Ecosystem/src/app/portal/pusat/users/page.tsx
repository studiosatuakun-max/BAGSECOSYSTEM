'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  division: string;
  status: string;
  pin: string | null;
};

const initialUsers: UserData[] = [
  { id: 'U001', name: 'Bagus Supriyanto', email: 'bagus@baskaraghas.com', role: 'Super Admin', division: 'Pusat', status: 'Active', pin: '839210' },
  { id: 'U002', name: 'Rini Andini', email: 'rini@baskaraghas.com', role: 'Finance Manager', division: 'Keuangan', status: 'Active', pin: '442190' },
  { id: 'U003', name: 'Budi Santoso', email: 'budi@baskaraghas.com', role: 'Station Operator', division: 'Stasiun', status: 'Active', pin: null },
  { id: 'U004', name: 'Agus P.', email: 'agus@baskaraghas.com', role: 'Dispatcher', division: 'Armada', status: 'Suspended', pin: null },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);

  const generatePin = (id: string) => {
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setUsers(users.map(u => u.id === id ? { ...u, pin: newPin } : u));
  };
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">User & Role Management</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Centralized SSO credentials and RBAC assignments across all divisions.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors">
          <Icon name="PlusIcon" size={16} variant="solid" />
          Add User
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">User</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Role</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Division</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Access PIN</th>
                <th className="py-3 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{u.name}</span>
                        <span className="text-xs text-muted-foreground font-medium">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-foreground">{u.role}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground font-medium">{u.division}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      u.status === 'Active' ? 'bg-green-ops-light text-green-ops' : 'bg-red-50 text-red-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {u.pin ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold tracking-widest text-foreground bg-secondary px-2 py-1 rounded-md border border-border">
                          {u.pin}
                        </span>
                        <button onClick={() => generatePin(u.id)} className="p-1 text-muted-foreground hover:text-primary transition-colors" title="Regenerate PIN">
                          <Icon name="ArrowPathIcon" size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => generatePin(u.id)}
                        className="text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Icon name="KeyIcon" size={12} variant="solid" />
                        Generate PIN
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Edit Role">
                      <Icon name="ShieldExclamationIcon" size={16} />
                    </button>
                    <button className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors ml-1" title="Revoke Access">
                      <Icon name="NoSymbolIcon" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
