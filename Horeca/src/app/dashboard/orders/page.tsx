import React from 'react';

const mockOrders = [
  {
    id: 'ORD-88392',
    date: 'Today, 10:30 AM',
    items: '4x 12Kg LPG Cylinders',
    total: 'Rp 840.000',
    status: 'In Transit',
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'ORD-88350',
    date: 'Yesterday, 14:15 PM',
    items: '2x 12Kg LPG Cylinders',
    total: 'Rp 420.000',
    status: 'Delivered',
    color: 'bg-success-bg text-success-foreground',
  },
  {
    id: 'ORD-88211',
    date: '18 Jul 2026, 09:00 AM',
    items: '5x 12Kg LPG Cylinders',
    total: 'Rp 1.050.000',
    status: 'Delivered',
    color: 'bg-success-bg text-success-foreground',
  },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-col h-full bg-background px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage your cylinder deliveries.</p>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-card p-4 rounded-2xl border border-border card-shadow flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-foreground tracking-tight">{order.id}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{order.date}</div>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${order.color}`}>
                {order.status}
              </div>
            </div>
            
            <div className="h-px w-full bg-border" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <span className="text-sm font-medium text-foreground">{order.items}</span>
              </div>
              <span className="text-sm font-bold text-foreground">{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
