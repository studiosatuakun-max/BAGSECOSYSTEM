import React from 'react';
import Image from 'next/image';
import AutoPrint from '../../../keuangan/print/[type]/[id]/AutoPrint';
import { createSupabaseServerClient } from '@/lib/supabaseSSR';

export default async function QuotationPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: lead } = await supabase
    .from('sales_leads')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!lead) {
    return <div className="p-8 text-center font-bold text-slate-800">Data Lead tidak ditemukan.</div>;
  }

  // Calculate prices based on segment
  const isIndustri = lead.segment === 'Industri';
  const pricePerUnit = isIndustri ? 150000 : 200000;
  const unitLabel = isIndustri ? 'MMBTU' : 'Tabung CNG';
  
  // Volume: for Industri we use estimated_volume_mmbtu. For Horeca, we assume the same column holds the number of Tabung.
  const volume = Number(lead.estimated_volume_mmbtu || 0);
  const totalPrice = volume * pricePerUnit;

  const currentDate = new Date().toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white flex justify-center py-8 print:py-0">
      <AutoPrint />
      
      {/* Kertas A4 */}
      <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl print:shadow-none p-12 print:p-0">
        
        {/* Header / Kop Surat */}
        <div className="flex items-center justify-between border-b-[3px] border-slate-800 pb-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <Image src="/assets/images/logo.png" alt="BaGS Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">PT. BASKARA ASRI GHAS (BaGS)</h1>
              <p className="text-sm text-slate-600 font-medium">Head Office: Gd. Baskara Lt. 4, Jakarta Selatan</p>
              <p className="text-sm text-slate-600 font-medium">Divisi Pemasaran & Commercial Growth</p>
            </div>
          </div>
        </div>

        {/* Nomor Surat & Tujuan */}
        <div className="flex justify-between mb-10 text-sm">
          <div>
            <table className="text-slate-800">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 font-semibold">Nomor</td>
                  <td>: 0{Math.floor(Math.random() * 99) + 10}/MKT-BGS/{new Date().getFullYear()}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-semibold">Lampiran</td>
                  <td>: 1 (Satu) Berkas</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-semibold">Perihal</td>
                  <td className="font-bold">: Penawaran Harga Pengadaan {isIndustri ? 'Gas Bumi (CNG)' : 'Tabung CNG (12kg/50kg)'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-right">
            <p>Jakarta, {currentDate}</p>
          </div>
        </div>

        <div className="mb-8 text-sm text-slate-800 leading-relaxed">
          <p className="mb-4">Kepada Yth.,</p>
          <p className="font-bold text-lg">{lead.contact_person}</p>
          <p className="font-semibold">{lead.company_name}</p>
          {lead.cluster_location && <p>Area: {lead.cluster_location}</p>}
          <p>Di Tempat</p>
        </div>

        <div className="mb-8 text-sm text-slate-800 leading-relaxed">
          <p className="mb-3">Dengan hormat,</p>
          <p className="mb-4 text-justify">
            Berdasarkan hasil diskusi dan kunjungan lapangan yang telah kami lakukan, kami dari PT. Baskara Asri Ghas (BaGS) bermaksud untuk mengajukan surat penawaran harga terkait pengadaan kebutuhan {isIndustri ? 'Gas Bumi (Compressed Natural Gas - CNG)' : 'Tabung CNG'} untuk fasilitas produksi/operasional Bapak/Ibu.
          </p>
          <p className="mb-4">Berikut adalah rincian estimasi harga dan volume yang kami tawarkan:</p>
        </div>

        {/* Tabel Harga */}
        <div className="mb-10">
          <table className="w-full text-left text-sm border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-3 border-r border-slate-300 w-12 text-center">No</th>
                <th className="p-3 border-r border-slate-300">Deskripsi Barang / Jasa</th>
                <th className="p-3 border-r border-slate-300 text-center">Estimasi Volume</th>
                <th className="p-3 border-r border-slate-300 text-right">Harga Satuan (Rp)</th>
                <th className="p-3 text-right">Total (Rp)</th>
              </tr>
            </thead>
            <tbody className="text-slate-800">
              <tr>
                <td className="p-3 border-r border-slate-300 text-center">1</td>
                <td className="p-3 border-r border-slate-300 font-medium">Pengadaan {isIndustri ? 'Compressed Natural Gas (CNG)' : 'Tabung CNG'}</td>
                <td className="p-3 border-r border-slate-300 text-center">{volume.toLocaleString()} {unitLabel}</td>
                <td className="p-3 border-r border-slate-300 text-right">{pricePerUnit.toLocaleString('id-ID')}</td>
                <td className="p-3 text-right font-bold">{totalPrice.toLocaleString('id-ID')}</td>
              </tr>
              {/* Dummy row for equipment/delivery */}
              <tr className="bg-slate-50">
                <td className="p-3 border-r border-slate-300 text-center border-t">2</td>
                <td className="p-3 border-r border-slate-300 font-medium border-t">Biaya Logistik & Pengiriman (Area {lead.cluster_location || 'Coverage'})</td>
                <td className="p-3 border-r border-slate-300 text-center border-t">1 Paket</td>
                <td className="p-3 border-r border-slate-300 text-right border-t">Included</td>
                <td className="p-3 text-right font-bold border-t">-</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-800 text-white font-bold">
                <td colSpan={4} className="p-3 text-right border-r border-slate-700">ESTIMASI TOTAL NILAI KONTRAK / BULAN</td>
                <td className="p-3 text-right">Rp {totalPrice.toLocaleString('id-ID')}</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-xs text-slate-500 mt-2 italic">* Harga belum termasuk PPN 11% dan dapat berubah sesuai negosiasi final.</p>
        </div>

        {/* Syarat & Penutup */}
        <div className="mb-16 text-sm text-slate-800 leading-relaxed">
          <p className="font-bold mb-2">Syarat & Ketentuan Umum:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Sistem pembayaran menggunakan term <strong>Net 30 Days</strong> setelah invoice diterima.</li>
            <li>Infrastruktur pipa dan instalasi standar ({isIndustri ? 'PRS/Skid' : 'Manifold Tabung'}) disediakan oleh pihak PT BaGS.</li>
            <li>Penawaran ini berlaku selama 14 (empat belas) hari kalender sejak diterbitkan.</li>
          </ul>
          <p className="text-justify mb-8">
            Demikian surat penawaran ini kami sampaikan. Kami sangat berharap dapat menjalin kerja sama yang baik dan mendukung penuh operasional bisnis {lead.company_name}. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.
          </p>
        </div>

        {/* Tanda Tangan */}
        <div className="flex justify-end text-sm text-slate-800">
          <div className="text-center">
            <p className="mb-16">Hormat kami,<br /><strong>PT. Baskara Asri Ghas (BaGS)</strong></p>
            <p className="font-bold underline uppercase">{lead.sales_rep_name || 'Marketing Executive'}</p>
            <p>Divisi Pemasaran B2B</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
