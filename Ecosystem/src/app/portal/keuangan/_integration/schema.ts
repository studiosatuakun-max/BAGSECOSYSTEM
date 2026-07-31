import { z } from 'zod';

export const InvoiceItemSchema = z.object({
  description: z.string().min(1),
  volume_mmbtu: z.number().positive(),
  unit_price_usd: z.number().positive(),
  subtotal_usd: z.number().positive()
});

export const InvoiceIndustriSchema = z.object({
  invoice_no: z.string().min(3),
  customer_id: z.string().uuid(),
  
  invoice_date: z.string().date(),
  due_date: z.string().date(),
  billing_period_start: z.string().date(),
  billing_period_end: z.string().date(),
  
  total_volume_mmbtu: z.number().positive(),
  subtotal_usd: z.number().positive(),
  tax_rate_percent: z.number().min(0).max(100).default(11),
  tax_amount_usd: z.number().min(0),
  total_amount_usd: z.number().positive(),
  
  exchange_rate_idr: z.number().positive().optional(),
  
  payment_term: z.enum(['Cash_Deposit', 'Tempo']),
  status: z.enum(['Draft', 'Issued', 'Paid', 'Overdue', 'Cancelled']),
  efaktur_url: z.string().url().optional(),
  
  items: z.array(InvoiceItemSchema).min(1, 'Invoice must have at least one item')
}).refine(data => {
  // Validate subtotal matches sum of items
  if (data.items) {
    const calculatedSubtotal = data.items.reduce((sum, item) => sum + item.subtotal_usd, 0);
    // Allowing small floating point differences
    return Math.abs(calculatedSubtotal - data.subtotal_usd) < 0.01;
  }
  return true;
}, {
  message: "Subtotal does not match the sum of invoice items",
  path: ["subtotal_usd"]
});

export const InvoiceHorecaSchema = z.object({
  invoice_no: z.string().min(3),
  customer_id: z.string().uuid(),
  
  invoice_date: z.string().date(),
  due_date: z.string().date(),
  
  total_tabung: z.number().int().positive(),
  price_per_tabung_idr: z.number().positive(),
  subtotal_idr: z.number().positive(),
  tax_amount_idr: z.number().min(0),
  total_amount_idr: z.number().positive(),
  
  payment_term: z.enum(['Cash_Deposit', 'COD', 'Termin']),
  status: z.enum(['Draft', 'Issued', 'Paid', 'Overdue', 'Cancelled']),
  efaktur_url: z.string().url().optional()
});

export const OperatingExpenseSchema = z.object({
  date: z.string().date(),
  category: z.string().min(1),
  description: z.string().min(1),
  amount_idr: z.number().positive(),
  created_by: z.string().uuid().optional()
});
