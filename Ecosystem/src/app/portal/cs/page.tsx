'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ticketData = [
  { name: 'Open', value: 45 },
  { name: 'In Progress', value: 20 },
  { name: 'Resolved', value: 135 },
];
const COLORS = ['#f59e0b', '#3b82f6', '#10b981']; // Amber, Blue, Emerald

const initialTickets = [
  { id: 'T-8491', sub: 'Gas Delivery Delayed', pri: 'High', stat: 'Open' },
  { id: 'T-8492', sub: 'Invoice Discrepancy', pri: 'Medium', stat: 'In Progress' },
  { id: 'T-8493', sub: 'App Login Issue', pri: 'Low', stat: 'Resolved' },
  { id: 'T-8494', sub: 'Milk-run route query', pri: 'Medium', stat: 'Open' },
];

export default function CustomerServiceDashboardPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', sub: '', pri: 'Medium', stat: 'Open' });

  const handleOpenModal = (mode: 'create' | 'edit', ticket: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && ticket) {
      setFormData(ticket);
    } else {
      setFormData({ id: `T-${Math.floor(1000 + Math.random() * 9000)}`, sub: '', pri: 'Medium', stat: 'Open' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!formData.sub) return alert('Subject is required');
    if (modalMode === 'create') {
      setTickets([formData, ...tickets]);
    } else {
      setTickets(tickets.map(t => t.id === formData.id ? formData : t));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Icon name="ArrowLeftIcon" size={18} variant="outline" />
            <span className="font-semibold text-sm">Back</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-slate-900 leading-tight">Customer Service</span>
            <span className="text-[10px] text-slate-500 font-medium">Ticketing & Support</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            CS Agent
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-900">09:03:16</span>
            <span className="text-[10px] text-slate-500 font-medium">Live Queue</span>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="TicketIcon" size={16} /> Open Tickets
            </span>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">45</div>
            <span className="text-xs text-amber-700 font-semibold mt-2">Requires immediate action</span>
          </div>

          <div className="col-span-1 bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ExclamationCircleIcon" size={16} /> High Priority
            </span>
            <div className="mt-4 text-4xl font-extrabold text-rose-900">12</div>
            <span className="text-xs text-rose-700 font-semibold mt-2">SLA &lt; 2 hours</span>
          </div>

          <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="CheckBadgeIcon" size={16} /> Resolved Today
            </span>
            <div className="mt-4 text-4xl font-extrabold text-emerald-900">135</div>
            <span className="text-xs text-emerald-700 font-semibold mt-2">Avg resolution time: 45m</span>
          </div>

          <div className="col-span-1 bg-sky-50 p-6 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ChatBubbleLeftRightIcon" size={16} /> Avg Response
            </span>
            <div className="mt-4 text-4xl font-extrabold text-sky-900">4m</div>
            <span className="text-xs text-sky-700 font-semibold mt-2">First reply time</span>
          </div>

          {/* Ticket Status Donut */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Ticket Status Breakdown</h2>
            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={ticketData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {ticketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900">200</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Total</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {ticketData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-slate-600 font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tickets Table (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Tickets</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Live Feed</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Ticket
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">Ticket ID</th>
                    <th className="py-2 font-bold">Subject</th>
                    <th className="py-2 font-bold">Priority</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tickets.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.id}</td>
                      <td className="py-2 text-slate-600 font-medium truncate max-w-[150px]">{row.sub}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.pri === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          row.pri === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-200 text-slate-700 border-slate-300'
                        }`}>
                          {row.pri}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.stat === 'Open' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          row.stat === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {row.stat}
                        </span>
                      </td>
                      <td className="py-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal('edit', row)} className="text-slate-500 hover:text-blue-600 transition-colors">
                          <Icon name="PencilSquareIcon" size={16} variant="outline" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="text-slate-500 hover:text-rose-600 transition-colors">
                          <Icon name="TrashIcon" size={16} variant="outline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer attribution */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium tracking-wide">CS Helpdesk System v2.4.1</span>
          <span>Ticketing & Support Interface · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Create New Ticket' : 'Edit Ticket'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Ticket ID</label>
                <input 
                  type="text" 
                  value={formData.id} 
                  disabled 
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Subject</label>
                <input 
                  type="text" 
                  value={formData.sub}
                  onChange={(e) => setFormData({...formData, sub: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                  placeholder="e.g. Missing delivery"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Priority</label>
                  <select 
                    value={formData.pri}
                    onChange={(e) => setFormData({...formData, pri: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={formData.stat}
                    onChange={(e) => setFormData({...formData, stat: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Create Ticket' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
