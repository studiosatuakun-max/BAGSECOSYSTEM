import { InvoiceIndustri, InvoiceHoreca } from '../_integration/types';

export const MOCK_INVOICES_INDUSTRI: InvoiceIndustri[] = [
  {
    id: 'inv-ind-001',
    invoice_no: 'INV/CNG/2026/08/001',
    customer_id: 'cust-001', // PT Unilever
    invoice_date: '2026-08-05',
    due_date: '2026-08-20',
    billing_period_start: '2026-07-01',
    billing_period_end: '2026-07-31',
    total_volume_mmbtu: 14500.5,
    subtotal_usd: 166755.75, // $11.50 per MMBTU
    tax_rate_percent: 11,
    tax_amount_usd: 18343.13,
    total_amount_usd: 185098.88,
    exchange_rate_idr: 16250, // Kurs Tengah BI
    total_amount_idr: 3007856800,
    payment_term: 'Tempo',
    status: 'Issued',
    items: [
      {
        id: 'item-001',
        invoice_id: 'inv-ind-001',
        description: 'Pemakaian Gas Periode: 01/07/2026 s/d 31/07/2026',
        volume_mmbtu: 14500.5,
        unit_price_usd: 11.50,
        subtotal_usd: 166755.75
      }
    ]
  },
  {
    id: 'inv-ind-002',
    invoice_no: 'INV/CNG/2026/08/002',
    customer_id: 'cust-002', // PT Indofood
    invoice_date: '2026-08-06',
    due_date: '2026-08-21',
    billing_period_start: '2026-07-01',
    billing_period_end: '2026-07-31',
    total_volume_mmbtu: 8200.0,
    subtotal_usd: 94300.00,
    tax_rate_percent: 11,
    tax_amount_usd: 10373.00,
    total_amount_usd: 104673.00,
    payment_term: 'Cash_Deposit',
    status: 'Paid',
    items: [
      {
        id: 'item-002',
        invoice_id: 'inv-ind-002',
        description: 'Pemakaian Gas Periode: 01/07/2026 s/d 31/07/2026',
        volume_mmbtu: 8200.0,
        unit_price_usd: 11.50,
        subtotal_usd: 94300.00
      }
    ]
  }
];

export const MOCK_INVOICES_HORECA: InvoiceHoreca[] = [
  {
    id: 'inv-hor-001',
    invoice_no: 'INV/HOR/2026/08/001',
    customer_id: 'cust-101', // Hotel Aston
    invoice_date: '2026-08-05',
    due_date: '2026-08-05',
    total_tabung: 20,
    price_per_tabung_idr: 150000,
    subtotal_idr: 3000000,
    tax_amount_idr: 330000,
    total_amount_idr: 3330000,
    payment_term: 'COD',
    status: 'Paid'
  },
  {
    id: 'inv-hor-002',
    invoice_no: 'INV/HOR/2026/08/002',
    customer_id: 'cust-102', // Restoran Sederhana
    invoice_date: '2026-08-05',
    due_date: '2026-08-12',
    total_tabung: 50,
    price_per_tabung_idr: 145000, // Harga grosir/cluster
    subtotal_idr: 7250000,
    tax_amount_idr: 797500,
    total_amount_idr: 8047500,
    payment_term: 'Termin',
    status: 'Issued'
  }
];
