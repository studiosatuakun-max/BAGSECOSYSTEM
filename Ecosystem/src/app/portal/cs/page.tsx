'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import TicketCategoryChart from './components/TicketCategoryChart';
import EmergencyDispatchFeed from './components/EmergencyDispatchFeed';

const initialTickets = [
  { id: 'T-2026-001', client: 'PT Krakatau Baja Smelter (Manifold #1)', sub: 'Tekanan PRMS turun tiba-tiba di bawah threshold 3.5 bar', pri: 'Urgent', stat: 'In Progress', agent: 'Rina Wulandari (CS Lead)', time: '10m ago' },
  { id: 'T-2026-002', client: 'Skid Driver B 9120 VGL (Ahmad Fauzi)', sub: 'Kendala macet parah di Tol Cikampek rute pengiriman PT Unilever', pri: 'High', stat: 'In Progress', agent: 'Hendra Dispatcher', time: '18m ago' },
  { id: 'T-2026-003', client: 'PT Mayora Indah Boiler Plant', sub: 'Konfirmasi selisih pencatatan custody transfer meter E-Faktur #089', pri: 'Medium', stat: 'Open', agent: 'Siti Finance CS', time: '42m ago' },
  { id: 'T-2026-004', client: 'Grand Hyatt Hotel Jakarta (Horeca)', sub: 'Jadwal penggantian tabung VGL gas manifold dapur utama shift malam', pri: 'Normal', stat: 'Resolved', agent: 'Budi Sales AE', time: '2h ago' },
  { id: 'T-2026-005', client: 'PT Indocement Tunggal Prakarsa', sub: 'Request penambahan suplai ekstra 5,000 MMBTU untuk maintenance kiln', pri: 'High', stat: 'Open', agent: 'Rina Wulandari (CS Lead)', time: '3h ago' },
];

export default function CustomerServiceDashboardPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', client: '', sub: '', pri: 'Medium', stat: 'Open', agent: 'Rina Wulandari (CS Lead)', time: 'Just now' });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priFilter, setPriFilter] = useState('All');

  const handleOpenModal = (mode: 'create' | 'edit', ticket: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && ticket) {
      setFormData(ticket);
    } else {
      setFormData({ id: `T-2026-00${Math.floor(6 + Math.random() * 90)}`, client: '', sub: '', pri: 'High', stat: 'Open', agent: 'Hendra Dispatcher', time: 'Just now' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.client || !formData.sub) return alert('Nama Klien / Armada dan Subjek Kendala wajib diisi!');
    if (modalMode === 'create') {
      setTickets([formData, ...tickets]);
    } else {
      setTickets(tickets.map(t => t.id === formData.id ? formData : t));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string, client: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tiket CS untuk ${client}?`)) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1500);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPri = priFilter === 'All' || t.pri === priFilter;
    return matchesSearch && matchesPri;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* Top Header */}
      <PortalHeader
        title="Baskara CS &amp; Dispatch Helpdesk Console"
        subtitle="Pusat kendali layanan pelanggan 24/7, pemantauan tiket kendala pengiriman CNG Skid Tank, koordinasi rute armada milk-run, dan penanganan darurat kebocoran gas"
        roleBadge="CS &amp; Dispatch Lead Access"
        roleColor="amber"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">09:45:12 WIB</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Live Highway GPS Synced
            </span>
          </div>
        }
      />

      {/* Gold Benchmark Spacing: pt-10 pb-12 space-y-8 */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE HELPDESK HERO BANNER (Standardized with Stasiun) */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>CS Helpdesk &amp; Dispatch Engine v2.4 · SLA Compliance 98.2%</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              B2B Customer Care &amp; Emergency Highway Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Koordinasi langsung antara pengemudi armada Skid Tank di jalan tol, teknisi Mother Station, dan penanggung jawab pabrik klien industri untuk menjamin keandalan pasokan gas CNG 24 jam tanpa henti.
            </p>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing || syncSuccess}
            className={`px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center disabled:cursor-not-allowed ${
              syncSuccess
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950/50'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-500/30'
            }`}
          >
            {isSyncing ? (
              <>
                <Icon name="ArrowPathIcon" size={18} className="animate-spin text-white" />
                <span>Syncing Telemetry &amp; GPS...</span>
              </>
            ) : syncSuccess ? (
              <>
                <Icon name="CheckCircleIcon" size={18} className="text-white" />
                <span>GPS &amp; Tickets Synced</span>
              </>
            ) : (
              <>
                <Icon name="SignalIcon" size={18} />
                <span>Sync Live Dispatch GPS &amp; Tickets</span>
              </>
            )}
          </button>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH FROSTED GLASSMORPHISM & ACCENT GLOWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Open Tickets */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 text-white p-6 rounded-3xl border border-amber-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-amber-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="TicketIcon" size={16} className="text-amber-400 shrink-0" />
                  <span>Active Helpdesk Tickets</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
                  3 Urgent SOS
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                45 <span className="text-sm font-bold text-amber-400 uppercase">Tiket</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>B2B Industrial &amp; Skid Fleet</span>
              <span className="text-amber-400 font-bold">Live Queue Active</span>
            </div>
          </div>

          {/* Card 2: SLA Compliance */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white p-6 rounded-3xl border border-blue-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-blue-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-blue-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CheckBadgeIcon" size={16} className="text-blue-400 shrink-0" />
                  <span>SLA Dispatch Compliance</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                  Target &lt; 15m
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                98.2% <span className="text-sm font-bold text-blue-400 uppercase">Rate</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Avg First Response: 4m</span>
              <span className="text-emerald-400 font-bold">Prime SLA Score</span>
            </div>
          </div>

          {/* Card 3: Emergency Leak / Alarms */}
          <div className="bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white p-6 rounded-3xl border border-rose-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-rose-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '160ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-rose-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ExclamationTriangleIcon" size={16} className="text-rose-400 shrink-0" />
                  <span>Gas Leak / PRMS Alarms</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  All Stations Safe
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                0 <span className="text-sm font-bold text-emerald-400 uppercase">Incidents</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>ATEX &amp; Manifold Pressure OK</span>
              <span className="text-emerald-300 font-bold">100% Green Status</span>
            </div>
          </div>

          {/* Card 4: Resolved Today */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-emerald-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CheckCircleIcon" size={16} className="text-emerald-400 shrink-0" />
                  <span>Resolved Today</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  Avg Res: 28m
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                135 <span className="text-sm font-bold text-emerald-400 uppercase">Tiket</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Driver Highway SOS &amp; Invoice</span>
              <span className="text-emerald-300 font-bold">High Customer Sat</span>
            </div>
          </div>
        </div>

        {/* ROW 2: DISPATCH TELEMETRY & SOS HELP FEED BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <TicketCategoryChart />
          </div>
          <div className="lg:col-span-1">
            <EmergencyDispatchFeed />
          </div>
        </div>

        {/* ROW 3: MASTER CS TICKETING & DISPATCH LOG TABLE (CRUD) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl overflow-hidden transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Master B2B CS Ticketing &amp; Highway Dispatch Directory
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {filteredTickets.length} Active Logs
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Daftar tiket kendala pengiriman gas industri, permintaan verifikasi meter bongkar muat, dan asistensi rute pengemudi Skid Tank.
              </p>
            </div>

            {/* Toolbar Filter & Add Button */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={priFilter}
                onChange={(e) => setPriFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="All">Semua Prioritas ({tickets.length})</option>
                <option value="Urgent">Urgent (SOS / PRMS Drop)</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Normal">Normal Query</option>
              </select>

              <input
                type="text"
                placeholder="Cari klien atau ID tiket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[200px]"
              />

              <button
                onClick={() => handleOpenModal('create')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 shrink-0"
              >
                <Icon name="PlusIcon" size={15} />
                <span>Create Dispatch Ticket</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID &amp; Time</th>
                  <th className="py-3 px-4">Client / Skid Driver Name</th>
                  <th className="py-3 px-4">Issue Description / Subject</th>
                  <th className="py-3 px-4 text-center">Priority Level</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Assigned Agent / Dispatcher</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredTickets.map((row) => (
                  <tr key={row.id} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      <div>
                        <span>{row.id}</span>
                        <p className="text-[10px] text-slate-400 font-sans font-medium">{row.time}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-[220px]">
                      <p className="truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {row.client}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold max-w-[280px]">
                      <p className="truncate" title={row.sub}>
                        {row.sub}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border whitespace-nowrap shrink-0 align-middle ${
                        row.pri === 'Urgent' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' :
                        row.pri === 'High' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                        'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.pri === 'Urgent' ? 'bg-rose-500 animate-ping' : 'bg-amber-500'}`} />
                        <span>{row.pri}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border whitespace-nowrap shrink-0 align-middle ${
                        row.stat === 'Open' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                        row.stat === 'In Progress' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                        'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.stat === 'In Progress' ? 'bg-blue-500 animate-pulse' : row.stat === 'Open' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span>{row.stat}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {row.agent}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal('edit', row)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          title="Edit Ticket Details"
                        >
                          <Icon name="PencilSquareIcon" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id, row.client)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Ticket Record"
                        >
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Tidak ada tiket CS atau log dispatch yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {modalMode === 'create' ? 'Create New Helpdesk Ticket' : 'Edit Dispatch Log'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Catat kendala pasokan gas CNG atau asistensi jalan tol armada.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Client / Skid Tank Driver Name
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-400"
                  placeholder="e.g. PT Mayora Boiler Plant / Skid B 9120 VGL"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Issue Description / Subject
                </label>
                <input
                  type="text"
                  value={formData.sub}
                  onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-400"
                  placeholder="e.g. Tekanan manifold turun ke 3.1 bar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={formData.pri}
                    onChange={(e) => setFormData({ ...formData, pri: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Urgent">Urgent (SOS / PRMS Alarm)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Normal">Normal Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Ticket Status
                  </label>
                  <select
                    value={formData.stat}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Open">Open (Menunggu Dispatch)</option>
                    <option value="In Progress">In Progress (Ditangani Agent)</option>
                    <option value="Resolved">Resolved (Selesai)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Assigned CS Agent / Dispatcher
                </label>
                <select
                  value={formData.agent}
                  onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Rina Wulandari (CS Lead)">Rina Wulandari (CS Lead)</option>
                  <option value="Hendra Dispatcher">Hendra Dispatcher</option>
                  <option value="Siti Finance CS">Siti Finance CS</option>
                  <option value="Budi Sales AE">Budi Sales AE</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
              >
                {modalMode === 'create' ? 'Create Ticket Log' : 'Update Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
