import React from 'react';
import Image from 'next/image';
import AutoPrint from '../../keuangan/print/[type]/[id]/AutoPrint';
import { getSalesLeads } from '../_integration/actions';

export default async function PrintLeadsPage() {
  const { data: leads } = await getSalesLeads();
  
  if (!leads) {
    return <div className="p-8 text-center">Failed to load data</div>;
  }

  const industriLeads = leads.filter(l => l.segment === 'Industri');
  const horecaLeads = leads.filter(l => l.segment === 'Horeca');

  const STAGE_LABELS: Record<string, string> = {
    Perkenalan_Awal: 'Perkenalan Awal',
    Presentasi: 'Presentasi',
    Penawaran: 'Penawaran',
    Follow_Up: 'Follow Up',
    Negosiasi: 'Negosiasi',
    Penyampaian_Kontrak: 'Penyampaian Kontrak',
    Dealing_Closed_Won: 'Closed Won',
    Dealing_Closed_Lost: 'Closed Lost',
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white flex justify-center py-8 print:py-0">
      <AutoPrint />
      
      {/* Kertas A4 */}
      <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl print:shadow-none p-12 print:p-0">
        
        {/* Header / Kop Surat */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <Image src="/assets/images/logo.png" alt="BaGS Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">PT. BASKARA ASRI GHAS (BaGS)</h1>
              <p className="text-sm text-slate-600 font-medium">Divisi Pemasaran & Commercial Growth</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-slate-800">CRM PIPELINE DOSSIER</h2>
            <p className="text-sm text-slate-500">
              Dicetak: {new Date().toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Content - Industri */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">B2B Industri Pipeline</h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold">
                <th className="p-3 border border-slate-300">Company Name</th>
                <th className="p-3 border border-slate-300">PIC & Contact</th>
                <th className="p-3 border border-slate-300">Volume (MMBTU)</th>
                <th className="p-3 border border-slate-300">Stage</th>
              </tr>
            </thead>
            <tbody>
              {industriLeads.length > 0 ? industriLeads.map((lead: any) => (
                <tr key={lead.id} className="text-slate-800">
                  <td className="p-3 border border-slate-300">
                    <div className="font-bold">{lead.company_name}</div>
                    {lead.notes && <div className="text-xs text-slate-500 italic mt-1">Note: {lead.notes}</div>}
                  </td>
                  <td className="p-3 border border-slate-300">
                    <div>{lead.contact_person}</div>
                    <div className="text-xs text-slate-600">{lead.phone_number}</div>
                  </td>
                  <td className="p-3 border border-slate-300 font-medium">
                    {lead.estimated_volume_mmbtu?.toLocaleString() || '-'} MMBTU
                  </td>
                  <td className="p-3 border border-slate-300 font-bold">
                    {STAGE_LABELS[lead.pipeline_stage] || lead.pipeline_stage}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="p-4 text-center text-slate-500 border border-slate-300">Tidak ada data Pipeline Industri</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Content - Horeca */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">HORECA Sales Strategy</h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold">
                <th className="p-3 border border-slate-300">Horeca Outlet</th>
                <th className="p-3 border border-slate-300">PIC & Contact</th>
                <th className="p-3 border border-slate-300">Vendor / Target Date</th>
                <th className="p-3 border border-slate-300">Stage</th>
              </tr>
            </thead>
            <tbody>
              {horecaLeads.length > 0 ? horecaLeads.map((lead: any) => (
                <tr key={lead.id} className="text-slate-800">
                  <td className="p-3 border border-slate-300">
                    <div className="font-bold">{lead.company_name}</div>
                    <div className="text-xs text-slate-600 mt-1">Area: {lead.cluster_location}</div>
                  </td>
                  <td className="p-3 border border-slate-300">
                    <div>{lead.contact_person}</div>
                    <div className="text-xs text-slate-600">{lead.phone_number}</div>
                  </td>
                  <td className="p-3 border border-slate-300">
                    <div className="font-medium">{lead.current_vendor || '-'}</div>
                    {lead.competitor_contract_end_date && (
                      <div className="text-xs text-rose-600 font-bold mt-1">End: {lead.competitor_contract_end_date}</div>
                    )}
                  </td>
                  <td className="p-3 border border-slate-300 font-bold">
                    {STAGE_LABELS[lead.pipeline_stage] || lead.pipeline_stage}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="p-4 text-center text-slate-500 border border-slate-300">Tidak ada data Strategi Horeca</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-300 text-center text-sm text-slate-500">
          <p className="font-bold mb-1">CONFIDENTIAL & PROPRIETARY</p>
          <p>Dokumen ini ditujukan untuk kebutuhan internal PT. Baskara Asri Ghas (BaGS).</p>
        </div>
        
      </div>
    </div>
  );
}
