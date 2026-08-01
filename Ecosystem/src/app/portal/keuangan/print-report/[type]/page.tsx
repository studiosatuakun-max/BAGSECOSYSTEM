import React from 'react';
import { generateLaporanKas, generateRekapPajak, generateAuditSkid, generateProyeksiRevenue } from '../../_integration/actions';
import AutoPrint from '../../print/[type]/[id]/AutoPrint';

export default async function PrintReportPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const { type } = resolvedParams;

  let data: any[] = [];
  let title = '';
  let description = '';

  if (type === 'monthly') {
    data = await generateLaporanKas();
    title = 'LAPORAN KAS MOTHER STATION';
    description = 'Ringkasan Mutasi Kas (MMBTU vs IDR)';
  } else if (type === 'quarterly') {
    data = await generateAuditSkid();
    title = 'AUDIT REKONSILIASI TAGIHAN Q2';
    description = 'Revenue Assurance (Fisik MMBTU vs Invoiced)';
  } else if (type === 'annual') {
    data = await generateProyeksiRevenue();
    title = 'PROYEKSI REVENUE HBA INDEX';
    description = 'Analisa keekonomian FY 2026';
  } else if (type === 'tax') {
    data = await generateRekapPajak();
    title = 'REKAP E-FAKTUR PPN 11% & PPH';
    description = 'Kewajiban pajak MIGAS DGT';
  } else {
    return <div className="p-10 text-center text-red-500">Tipe laporan tidak valid</div>;
  }

  // Format currency helpers
  const formatIdr = (num: number) => `Rp ${Number(num || 0).toLocaleString('id-ID')}`;
  const formatVol = (num: number) => Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-slate-200 text-black min-h-screen py-8 print:py-0">
      <AutoPrint />
      
      {/* Kertas A4 styling */}
      <div className="max-w-[210mm] mx-auto bg-white print:w-full print:max-w-none print:m-0 print:shadow-none shadow-2xl min-h-[297mm] p-12 relative text-sm">
        {/* Header Kop Surat */}
        <div className="flex justify-between items-start border-b-4 border-amber-600 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-amber-600 tracking-tighter">PT BaGS</h1>
            <p className="text-sm font-bold text-slate-800 mt-1 uppercase tracking-widest">PT Baskara Asri Ghas (BaGS)</p>
            <p className="text-xs text-slate-500 mt-2">
              Kawasan Industri Krakatau, Cilegon, Banten<br/>
              Phone: (0254) 123456 | Email: finance@baskara.id
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-800 uppercase max-w-[250px] leading-tight">{title}</h2>
            <p className="text-xs font-semibold text-slate-500 mt-2">{description}</p>
            <p className="text-xs text-slate-500 mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        {/* Tabel Data */}
        {data.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 font-semibold">
            Tidak ada data / Menunggu input operasional
          </div>
        ) : (
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-xs uppercase tracking-wider border-b-2 border-slate-300 text-slate-700">
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="p-3 border-r border-slate-300 last:border-r-0">
                    {key.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  {Object.entries(row).map(([key, val], cellIdx) => {
                    let displayVal: React.ReactNode = String(val ?? '-');
                    
                    if (key.includes('amount_idr') || key.includes('value_idr') || key.includes('subtotal_idr') || key.includes('tax_amount_idr')) {
                      displayVal = <span className="font-semibold text-slate-800">{formatIdr(val as number)}</span>;
                    } else if (key.includes('volume') || key.includes('mmbtu')) {
                      displayVal = <span className="font-semibold text-amber-700">{formatVol(val as number)}</span>;
                    } else if (key === 'status') {
                      displayVal = <span className="font-bold">{String(val)}</span>;
                    }

                    return (
                      <td key={cellIdx} className="p-3 border-r border-slate-200 last:border-r-0 break-words max-w-[150px]">
                        {displayVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-700 mb-8">Disiapkan oleh,</p>
            <p className="font-bold text-slate-800 uppercase">Treasury / Finance Dept.</p>
            <p>PT Baskara Asri Ghas (BaGS)</p>
          </div>
          <div>
            <p className="font-bold text-slate-700 mb-8">Disetujui oleh,</p>
            <p className="font-bold text-slate-800 uppercase">Chief Financial Officer (CFO)</p>
            <p>PT Baskara Asri Ghas (BaGS)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
