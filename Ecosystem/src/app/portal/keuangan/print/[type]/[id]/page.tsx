import React from 'react';
import { getInvoiceIndustriById, getInvoiceHorecaById } from '../../../_integration/actions';
import AutoPrint from './AutoPrint';

export default async function PrintInvoicePage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const resolvedParams = await params;
  const { type, id } = resolvedParams;

  let invoice: any = null;

  if (type === 'industri') {
    const res = await getInvoiceIndustriById(id);
    invoice = res.data;
  } else if (type === 'horeca') {
    const res = await getInvoiceHorecaById(id);
    invoice = res.data;
  }

  if (!invoice) {
    return <div className="p-10 text-center text-red-500">Invoice tidak ditemukan</div>;
  }

  const isIndustri = type === 'industri';

  return (
    <div className="bg-white text-black min-h-screen p-8 print:p-0">
      <AutoPrint />
      
      {/* Kertas A4 styling */}
      <div className="max-w-[210mm] mx-auto bg-white print:w-full print:max-w-none print:m-0 print:shadow-none shadow-xl border border-slate-200 min-h-[297mm] p-10 relative">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-amber-600 tracking-tighter">PT BaGS</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Baskara Global Synergy</p>
            <p className="text-xs text-slate-500 max-w-xs mt-2">
              Kawasan Industri Krakatau, Cilegon, Banten<br/>
              Phone: (0254) 123456 | Email: finance@baskara.id
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-slate-200 tracking-wider">INVOICE</h2>
            <p className="font-semibold text-slate-800 mt-2">{invoice.invoice_no}</p>
            <p className="text-xs text-slate-500">Date: {invoice.invoice_date}</p>
            <p className="text-xs text-slate-500">Due: {invoice.due_date}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Bill To:</p>
          <p className="font-bold text-slate-800 text-lg">{invoice.customer_name || 'Customer'}</p>
          <p className="text-sm text-slate-600">ID: {invoice.customer_id}</p>
        </div>

        {/* Items */}
        <table className="w-full text-left mb-8 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-y border-slate-300">
              <th className="p-3 text-xs font-bold text-slate-700 uppercase">Description</th>
              <th className="p-3 text-xs font-bold text-slate-700 uppercase text-right">
                {isIndustri ? 'Volume (MMBTU)' : 'Qty (Tabung)'}
              </th>
              <th className="p-3 text-xs font-bold text-slate-700 uppercase text-right">Unit Price</th>
              <th className="p-3 text-xs font-bold text-slate-700 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isIndustri && invoice.invoice_items_industri ? (
              invoice.invoice_items_industri.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="p-3 text-sm text-slate-800">{item.description}</td>
                  <td className="p-3 text-sm text-slate-800 text-right">{item.volume_mmbtu}</td>
                  <td className="p-3 text-sm text-slate-800 text-right">${item.unit_price_usd.toLocaleString()}</td>
                  <td className="p-3 text-sm text-slate-800 text-right font-semibold">${item.subtotal_usd.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-sm text-slate-800">Pembelian Gas CNG Horeca 12kg</td>
                <td className="p-3 text-sm text-slate-800 text-right">{invoice.total_tabung}</td>
                <td className="p-3 text-sm text-slate-800 text-right">Rp {invoice.price_per_tabung_idr?.toLocaleString()}</td>
                <td className="p-3 text-sm text-slate-800 text-right font-semibold">Rp {invoice.subtotal_idr?.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{isIndustri ? `$${invoice.subtotal_usd?.toLocaleString()}` : `Rp ${invoice.subtotal_idr?.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between py-2 text-sm text-slate-600">
              <span>PPN (11%)</span>
              <span>{isIndustri ? `$${invoice.tax_amount_usd?.toLocaleString()}` : `Rp ${invoice.tax_amount_idr?.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-slate-900 font-bold text-lg text-slate-800 mt-2">
              <span>Total Amount</span>
              <span>{isIndustri ? `$${invoice.total_amount_usd?.toLocaleString()}` : `Rp ${invoice.total_amount_idr?.toLocaleString()}`}</span>
            </div>
            {isIndustri && invoice.total_amount_idr && (
              <div className="flex justify-between py-1 text-xs font-semibold text-amber-600">
                <span>Equivalent (IDR)</span>
                <span>Rp {invoice.total_amount_idr.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bank Details & Signature */}
        <div className="flex justify-between items-end mt-20 pt-10 border-t border-slate-200">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Payment Instructions</p>
            <p className="text-sm text-slate-700 font-semibold">Bank Mandiri</p>
            <p className="text-sm text-slate-600">A/N: PT Baskara Global Synergy</p>
            <p className="text-sm text-slate-600">A/C: 163-00-1234567-8</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-20 mb-2"></div>
            <p className="text-sm font-bold text-slate-800 border-b border-slate-800 inline-block px-4 pb-1">Finance Director</p>
            <p className="text-xs text-slate-500 mt-1">PT BaGS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
