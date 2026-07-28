export interface InvoiceItem {
  id?: string;
  invoice_id: string;
  description: string;
  volume_mmbtu: number;
  unit_price_usd: number;
  subtotal_usd: number;
}

export interface InvoiceIndustri {
  id?: string;
  invoice_no: string;
  customer_id: string;
  
  // Dates
  invoice_date: string;
  due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  
  // Amounts (USD)
  total_volume_mmbtu: number;
  subtotal_usd: number;
  tax_rate_percent: number; // e.g., 11%
  tax_amount_usd: number;
  total_amount_usd: number;
  
  // Conversion
  exchange_rate_idr?: number; // Kurs BI
  total_amount_idr?: number;
  
  // Payment Info
  payment_term: 'Cash_Deposit' | 'Tempo';
  status: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';
  
  items?: InvoiceItem[];
  
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceHoreca {
  id?: string;
  invoice_no: string;
  customer_id: string;
  
  invoice_date: string;
  due_date: string;
  
  total_tabung: number;
  price_per_tabung_idr: number;
  subtotal_idr: number;
  tax_amount_idr: number;
  total_amount_idr: number;
  
  payment_term: 'Cash_Deposit' | 'COD' | 'Termin';
  status: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';
  
  created_at?: string;
}
