'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

// --- MOCK MIGAS REGULATORY INDEX DATA ---
const initialFormulas = [
  { id: 'IDX-MIGAS-2026-A', name: 'National HBA Industrial Base Price', segment: 'Industrial (B2B)', basis: 'Brent Crude Index ($/MMBTU)', currentValue: '$12.40', effectiveDate: '01 Jan 2026', status: 'SK MIGAS LOCKED', statusColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800' },
  { id: 'IDX-MIGAS-2026-B', name: 'Commercial Horeca Cylinder Ceiling', segment: 'Horeca (B2C)', basis: '12Kg Compressed Cylinder (IDR)', currentValue: 'Rp 215,000', effectiveDate: '01 Jan 2026', status: 'SK MIGAS LOCKED', statusColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800' },
  { id: 'IDX-MACRO-USD-IDR', name: 'Billing Engine FX Exchange Lock', segment: 'System-Wide Billing', basis: 'Bank Indonesia Middle Rate', currentValue: 'Rp 16,350 / USD', effectiveDate: '25 Jul 2026', status: 'CURRENCY LOCKED', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
  { id: 'IDX-QUOTA-NAT-01', name: 'Mother Station National Allocation Limit', segment: 'Mother Station Custody', basis: 'Subsidized Sm³ Monthly Threshold', currentValue: '1,250,000 Sm³', effectiveDate: '01 Jul 2026', status: 'QUOTA ACTIVE', statusColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800' },
  { id: 'IDX-MIGAS-2026-Q4', name: 'Proposed Q4 Industrial Index Revision', segment: 'Industrial (B2B)', basis: 'Brent Crude Forecast ($/MMBTU)', currentValue: '$12.85', effectiveDate: '01 Oct 2026', status: 'PENDING REVISION', statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-800' },
];

export default function MigasIndexEnginePage() {
  const [formulas, setFormulas] = useState(initialFormulas);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    segment: 'Industrial (B2B)',
    basis: 'Brent Crude Index ($/MMBTU)',
    currentValue: '$12.50',
    effectiveDate: '01 Aug 2026',
    status: 'SK MIGAS LOCKED',
    statusColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
  });

  const filteredFormulas = useMemo(() => {
    return formulas.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.basis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSegment = selectedSegmentFilter === 'ALL' || f.segment.includes(selectedSegmentFilter);
      return matchSearch && matchSegment;
    });
  }, [formulas, searchQuery, selectedSegmentFilter]);

  const handleOpenModal = (mode: 'create' | 'edit', item: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && item) {
      setFormData(item);
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        id: `IDX-MIGAS-2026-${randomNum}`,
        name: '',
        segment: 'Industrial (B2B)',
        basis: 'Brent Crude Index ($/MMBTU)',
        currentValue: '$12.50',
        effectiveDate: '01 Aug 2026',
        status: 'SK MIGAS LOCKED',
        statusColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!formData.name.trim()) {
      alert('Regulation formula name is required');
      return;
    }
    if (modalMode === 'create') {
      setFormulas([formData, ...formulas]);
    } else {
      setFormulas(formulas.map((f) => (f.id === formData.id ? formData : f)));
    }
    setIsModalOpen(false);
  };

  const handleSimulateImpact = (id: string, name: string) => {
    alert(`Super Admin Simulation: Adjusting regulatory formula "${name}" across all 142 active B2B & B2C billing invoices would result in a 0% error propagation. Billing engine sync ready!`);
  };

  const handleSyncBilling = () => {
    alert('Super Admin Action: Successfully pushed MIGAS Base Index and USD/IDR exchange rate locks to Modul Keuangan (/portal/keuangan) and Modul Pemasaran (/portal/pemasaran) pricing engines!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER BANNER WITH EXECUTIVE BREATHING ROOM */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 whitespace-nowrap shrink-0 align-middle">
            <Icon name="ScaleIcon" size={14} className="text-amber-400" />
            <span>MIGAS National Regulatory Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            MIGAS Index & Base Price Engine
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium">
            System-wide macroeconomic reference formulas, MIGAS subsidized vs commercial quotas, Brent Crude ($/MMBTU) indexation, and USD/IDR exchange rate locks driving Modul Keuangan and Pemasaran.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleSyncBilling}
            className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Icon name="ArrowPathIcon" size={16} />
            <span>Sync Billing Engine</span>
          </button>
          <button
            onClick={() => handleOpenModal('create')}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap"
          >
            <Icon name="AdjustmentsHorizontalIcon" size={18} />
            <span>Adjust Macro Index</span>
          </button>
        </div>
      </div>

      {/* REGULATORY KPI METRICS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">National HBA Index</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">$12.40 <span className="text-xs font-semibold text-indigo-500">/ MMBTU</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Icon name="BanknotesIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horeca Cylinder Ceiling</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">Rp 215k <span className="text-xs font-semibold text-slate-400">/ 12Kg</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Icon name="FireIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">USD/IDR FX Rate Lock</span>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">16,350 <span className="text-xs font-semibold text-slate-400">IDR/USD</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Icon name="CurrencyDollarIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">National Quota Ceiling</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">1.25M <span className="text-xs font-semibold text-slate-400">Sm³/Mo</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Icon name="ScaleIcon" size={24} />
          </div>
        </div>
      </div>

      {/* REGULATORY REFERENCE TABLE SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Table Header Controls */}
        <div className="p-6 sm:p-7 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Icon name="DocumentTextIcon" size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>MIGAS Macroeconomic & Pricing Index Formulas</span>
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Central regulatory parameters binding all commercial quotations and billing engine computations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Segment Filter */}
            <select
              value={selectedSegmentFilter}
              onChange={(e) => setSelectedSegmentFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Regulatory Segments</option>
              <option value="Industrial">Industrial (B2B MMBTU)</option>
              <option value="Horeca">Horeca (B2C Cylinders)</option>
              <option value="System">System-Wide FX & Quotas</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search formula name, basis, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">FORMULA ID & REGULATION NAME</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">TARGET SEGMENT</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">INDEX BASIS & UNIT</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">CURRENT BASE VALUE</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">STATUS & EFFECTIVE DATE</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap shrink-0 align-middle">ROOT ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {filteredFormulas.length > 0 ? (
                filteredFormulas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    
                    {/* ID & Name */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{item.name}</span>
                        <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{item.id}</span>
                      </div>
                    </td>

                    {/* Target Segment */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                        item.segment.includes('Industrial') 
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          : item.segment.includes('Horeca')
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      } whitespace-nowrap shrink-0 align-middle`}>
                        <Icon name={item.segment.includes('Industrial') ? 'BuildingOfficeIcon' : item.segment.includes('Horeca') ? 'FireIcon' : 'GlobeAltIcon'} size={14} />
                        <span>{item.segment}</span>
                      </span>
                    </td>

                    {/* Basis */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle font-bold text-slate-800 dark:text-slate-200">
                      {item.basis}
                    </td>

                    {/* Value */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <span className="text-base font-black text-slate-900 dark:text-white px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {item.currentValue}
                      </span>
                    </td>

                    {/* Slim 1-Line Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${item.statusColor} whitespace-nowrap shrink-0 align-middle shadow-2xs w-fit`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          <span>{item.status}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold ml-1">Eff: {item.effectiveDate}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap shrink-0 align-middle">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSimulateImpact(item.id, item.name)}
                          title="Simulate Billing Impact"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          <Icon name="CalculatorIcon" size={13} />
                          <span>Simulate</span>
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', item)}
                          title="Edit Regulatory Formula"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all"
                        >
                          <Icon name="PencilSquareIcon" size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    No MIGAS index formulas found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
          <div>
            Showing <span className="font-extrabold text-slate-900 dark:text-white">{filteredFormulas.length}</span> of <span className="font-extrabold">{formulas.length}</span> macroeconomic index rules.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> SK MIGAS Locked</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Currency FX Locked</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Revision Pending</span>
          </div>
        </div>

      </div>

      {/* --- ADVANCED LUXURY MIGAS INDEX MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
                  <Icon name={modalMode === 'create' ? 'AdjustmentsHorizontalIcon' : 'PencilSquareIcon'} size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    {modalMode === 'create' ? 'Register New MIGAS Regulatory Index' : 'Modify Macroeconomic Index Formula'}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Changes will automatically propagate to all invoice calculations.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Regulation Formula Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Q4 Industrial Brent Indexation Rule..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Segment
                  </label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Industrial (B2B)">Industrial (B2B MMBTU)</option>
                    <option value="Horeca (B2C)">Horeca (B2C Cylinders)</option>
                    <option value="System-Wide Billing">System-Wide FX & Quotas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Regulatory Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      let color = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
                      if (val === 'CURRENCY LOCKED') color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
                      if (val === 'PENDING REVISION') color = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-800';
                      if (val === 'QUOTA ACTIVE') color = 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800';
                      setFormData({ ...formData, status: val, statusColor: color });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SK MIGAS LOCKED">SK MIGAS LOCKED</option>
                    <option value="CURRENCY LOCKED">CURRENCY LOCKED</option>
                    <option value="QUOTA ACTIVE">QUOTA ACTIVE</option>
                    <option value="PENDING REVISION">PENDING REVISION</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Index Basis & Unit
                  </label>
                  <input
                    type="text"
                    value={formData.basis}
                    onChange={(e) => setFormData({ ...formData, basis: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Current Base Value
                  </label>
                  <input
                    type="text"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Effective Regulatory Date
                </label>
                <input
                  type="text"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>{modalMode === 'create' ? 'Deploy Index Rule' : 'Save Formula'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
