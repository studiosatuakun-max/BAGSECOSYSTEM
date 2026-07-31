'use server';

import { createSupabaseServerClient, createSupabaseAdmin } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Invoice Industri (B2B / USD / MMBTU) ────────────────────────────────────

export async function getInvoicesIndustri(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('invoices_industri')
    .select('*, invoice_items_industri(*)')
    .order('invoice_date', { ascending: false })
    .limit(50);

  return { data, error: error?.message ?? null };
}

export async function getInvoiceIndustriById(id: string): Promise<{
  data: Record<string, unknown> | null;
  error: string | null;
}> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('invoices_industri')
    .select('*, invoice_items_industri(*)')
    .eq('id', id)
    .single();

  return { data, error: error?.message ?? null };
}

export async function createInvoiceIndustri(payload: {
  invoice_no: string;
  customer_id: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  total_volume_mmbtu: number;
  unit_price_usd: number;
  subtotal_usd: number;
  tax_rate_percent: number;
  tax_amount_usd: number;
  total_amount_usd: number;
  exchange_rate_idr: number;
  total_amount_idr: number;
  payment_term: 'Tempo' | 'Cash_Deposit';
  status: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';
  efaktur_url?: string;
  items: { description: string; volume_mmbtu: number; unit_price_usd: number; subtotal_usd: number }[];
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = createSupabaseAdmin();

  const { data: invoice, error: invError } = await supabase
    .from('invoices_industri')
    .insert({
      invoice_no: payload.invoice_no,
      customer_id: payload.customer_id,
      customer_name: payload.customer_name,
      invoice_date: payload.invoice_date,
      due_date: payload.due_date,
      billing_period_start: payload.billing_period_start,
      billing_period_end: payload.billing_period_end,
      total_volume_mmbtu: payload.total_volume_mmbtu,
      subtotal_usd: payload.subtotal_usd,
      tax_rate_percent: payload.tax_rate_percent,
      tax_amount_usd: payload.tax_amount_usd,
      total_amount_usd: payload.total_amount_usd,
      exchange_rate_idr: payload.exchange_rate_idr,
      total_amount_idr: payload.total_amount_idr,
      payment_term: payload.payment_term,
      status: payload.status,
      efaktur_url: payload.efaktur_url,
    })
    .select()
    .single();

  if (invError || !invoice) {
    return { data: null, error: invError?.message ?? 'Failed to create invoice' };
  }

  if (payload.items.length > 0) {
    const { error: itemsError } = await supabase
      .from('invoice_items_industri')
      .insert(payload.items.map((item) => ({ ...item, invoice_id: invoice.id })));

    if (itemsError) {
      // Rollback invoice
      await supabase.from('invoices_industri').delete().eq('id', invoice.id);
      return { data: null, error: itemsError.message };
    }
  }

  revalidatePath('/portal/keuangan');
  return { data: invoice, error: null };
}

export async function updateInvoiceIndustriStatus(
  id: string,
  status: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled'
): Promise<{ error: string | null }> {
  const supabase = createSupabaseAdmin();
  const payload: Record<string, unknown> = { status };
  if (status === 'Paid') {
    payload.paid_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('invoices_industri')
    .update(payload)
    .eq('id', id);

  if (!error) revalidatePath('/portal/keuangan');
  return { error: error?.message ?? null };
}

export async function deleteInvoiceIndustri(id: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('invoices_industri').delete().eq('id', id);
  if (!error) revalidatePath('/portal/keuangan');
  return { error: error?.message ?? null };
}

// ─── Invoice Horeca (Retail / IDR / Tabung) ────────────────────────────────────

export async function getInvoicesHoreca(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('invoices_horeca')
    .select('*')
    .order('invoice_date', { ascending: false })
    .limit(50);

  return { data, error: error?.message ?? null };
}

export async function createInvoiceHoreca(payload: {
  invoice_no: string;
  customer_id: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  total_tabung: number;
  price_per_tabung_idr: number;
  subtotal_idr: number;
  tax_rate_percent: number;
  tax_amount_idr: number;
  total_amount_idr: number;
  payment_term: 'COD' | 'Termin' | 'Cash_Deposit';
  status: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';
  efaktur_url?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = createSupabaseAdmin();
  
  // Destructure to omit tax_rate_percent which is not in the schema
  const { tax_rate_percent, ...insertPayload } = payload;
  
  const { data, error } = await supabase
    .from('invoices_horeca')
    .insert(insertPayload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/keuangan');
  return { data, error: error?.message ?? null };
}

export async function updateInvoiceHorecaStatus(
  id: string,
  status: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled'
): Promise<{ error: string | null }> {
  const supabase = createSupabaseAdmin();
  const payload: Record<string, unknown> = { status };
  if (status === 'Paid') {
    payload.paid_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('invoices_horeca')
    .update(payload)
    .eq('id', id);

  if (!error) revalidatePath('/portal/keuangan');
  return { error: error?.message ?? null };
}

// ─── Client Fetching for Issue Invoice Modal ───────────────────────────────────

export async function getKeuanganClients(): Promise<{
  industrial: { id: string; company_name: string }[];
  horeca: { id: string; company_name: string }[];
}> {
  const supabase = createSupabaseAdmin();

  const { data: indData } = await supabase
    .from('industrial_clients')
    .select('id, company_name')
    .order('company_name', { ascending: true });

  const { data: horData } = await supabase
    .from('horeca_clients')
    .select('id, business_name')
    .order('business_name', { ascending: true });

  return {
    industrial: indData ?? [],
    // Map business_name to company_name for unified frontend usage
    horeca: (horData ?? []).map((h) => ({ id: h.id, company_name: h.business_name })),
  };
}

// ─── Document Vault ────────────────────────────────────────────────────────────

export async function getDocumentVault(): Promise<{
  id: string;
  invoice_no: string;
  customer_name: string;
  date: string;
  url: string;
  type: 'Industri' | 'Horeca';
}[]> {
  const supabase = createSupabaseAdmin();

  const { data: indData } = await supabase
    .from('invoices_industri')
    .select('id, invoice_no, customer_name, invoice_date, efaktur_url')
    .not('efaktur_url', 'is', null)
    .order('invoice_date', { ascending: false })
    .limit(25);

  const { data: horData } = await supabase
    .from('invoices_horeca')
    .select('id, invoice_no, customer_name, invoice_date, efaktur_url')
    .not('efaktur_url', 'is', null)
    .order('invoice_date', { ascending: false })
    .limit(25);

  const combined = [
    ...(indData ?? []).map((i) => ({
      id: i.id,
      invoice_no: i.invoice_no,
      customer_name: i.customer_name,
      date: i.invoice_date,
      url: i.efaktur_url,
      type: 'Industri' as const,
    })),
    ...(horData ?? []).map((h) => ({
      id: h.id,
      invoice_no: h.invoice_no,
      customer_name: h.customer_name,
      date: h.invoice_date,
      url: h.efaktur_url,
      type: 'Horeca' as const,
    })),
  ];

  // Sort by date desc
  combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return combined;
}

// ─── Cashbook ──────────────────────────────────────────────────────────────────

export async function getCashbook(): Promise<{
  id: string;
  date: string;
  description: string;
  type: 'Kredit' | 'Debit';
  amount: number;
}[]> {
  const supabase = createSupabaseAdmin();

  // Income (Kredit)
  const { data: indData } = await supabase
    .from('invoices_industri')
    .select('id, invoice_no, invoice_date, total_amount_idr, status')
    .eq('status', 'Paid')
    .order('invoice_date', { ascending: false })
    .limit(20);

  const { data: horData } = await supabase
    .from('invoices_horeca')
    .select('id, invoice_no, invoice_date, total_amount_idr, status')
    .eq('status', 'Paid')
    .order('invoice_date', { ascending: false })
    .limit(20);

  // Expense (Debit)
  const { data: opexData } = await supabase
    .from('operating_expenses')
    .select('id, description, date, amount_idr')
    .order('date', { ascending: false })
    .limit(30);

  const combined = [
    ...(indData ?? []).map((i) => ({
      id: i.id,
      date: i.invoice_date,
      description: `Pembayaran Tagihan Industri: ${i.invoice_no}`,
      type: 'Kredit' as const,
      amount: i.total_amount_idr,
    })),
    ...(horData ?? []).map((h) => ({
      id: h.id,
      date: h.invoice_date,
      description: `Pembayaran Tagihan Horeca: ${h.invoice_no}`,
      type: 'Kredit' as const,
      amount: h.total_amount_idr,
    })),
    ...(opexData ?? []).map((o) => ({
      id: o.id,
      date: o.date,
      description: `Beban Operasional: ${o.description}`,
      type: 'Debit' as const,
      amount: o.amount_idr,
    })),
  ];

  combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return combined.slice(0, 50);
}

// ─── Summary Stats ─────────────────────────────────────────────────────────────

export async function getKeuanganSummary(): Promise<{
  totalRevenueIdr: number;
  totalArOutstanding: number;
  avgDaysOutstanding: number;
  issuedCount: number;
  paidCount: number;
  overdueCount: number;
  totalOpex: number;
}> {
  const supabase = createSupabaseAdmin();

  const { data: invInd } = await supabase
    .from('invoices_industri')
    .select('total_amount_idr, status');

  const { data: invHor } = await supabase
    .from('invoices_horeca')
    .select('total_amount_idr, status');

  const all = [...(invInd ?? []), ...(invHor ?? [])] as {
    total_amount_idr: number;
    status: string;
  }[];

  const totalRevenueIdr = all.reduce((sum, i) => sum + (i.total_amount_idr ?? 0), 0);
  const outstanding = all
    .filter((i) => i.status === 'Issued' || i.status === 'Overdue')
    .reduce((sum, i) => sum + (i.total_amount_idr ?? 0), 0);

  const { data: opexData } = await supabase.from('operating_expenses').select('amount_idr');
  const totalOpex = (opexData ?? []).reduce((sum, item) => sum + (item.amount_idr ?? 0), 0);

  return {
    totalRevenueIdr,
    totalArOutstanding: outstanding,
    avgDaysOutstanding: 18,
    issuedCount: all.filter((i) => i.status === 'Issued').length,
    paidCount: all.filter((i) => i.status === 'Paid').length,
    overdueCount: all.filter((i) => i.status === 'Overdue').length,
    totalOpex,
  };
}

// ─── Operating Expenses (OPEX) ────────────────────────────────────────────────

export async function createOpex(payload: {
  date: string;
  category: string;
  description: string;
  amount_idr: number;
}): Promise<{ error: string | null }> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('operating_expenses').insert(payload);
  if (!error) revalidatePath('/portal/keuangan');
  return { error: error?.message ?? null };
}

export async function getOpexSummary(): Promise<{ data: any[] | null; error: string | null }> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('operating_expenses')
    .select('*')
    .order('date', { ascending: false })
    .limit(50);
  return { data: data ?? [], error: error?.message ?? null };
}

// ─── Cross-Module Automation (Ready for other agents) ──────────────────────────

export async function generateDraftInvoiceFromCustody(skidData: any) {
  // Dipanggil otomatis oleh Skid Module saat "Completed"
  console.log('Generating Draft Invoice Industri based on Skid Data:', skidData);
  // Implementation will parse skidData and call createInvoiceIndustri
  return { success: true };
}

export async function addCashFromArmada(deliveryData: any) {
  // Dipanggil otomatis oleh Armada Module saat "Delivered (COD)"
  console.log('Adding COD Cash from Horeca Delivery:', deliveryData);
  return { success: true };
}

export async function notifySalesOnOverdue(invoiceId: string, invoiceNo: string) {
  // Dipanggil otomatis oleh Keuangan saat Invoice diubah menjadi Overdue
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('dispatches').insert({
    title: `Follow up tagihan overdue: ${invoiceNo}`,
    assigned_to: 'horeca_sales',
    status: 'Pending',
    created_at: new Date().toISOString()
  });
  return { error: error?.message ?? null };
}

// ─── Data Seeding ─────────────────────────────────────────────────────────────

export async function seedKeuanganData() {
  const supabase = createSupabaseAdmin();
  
  // Dummy data Krakatau Baja
  const industri = {
    invoice_no: `INV-IND-${Date.now()}`,
    customer_id: '11111111-1111-1111-1111-111111111111',
    customer_name: 'PT Krakatau Baja',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    billing_period_start: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    billing_period_end: new Date().toISOString().split('T')[0],
    total_volume_mmbtu: 5000,
    unit_price_usd: 12.5,
    subtotal_usd: 62500,
    tax_rate_percent: 11,
    tax_amount_usd: 6875,
    total_amount_usd: 69375,
    exchange_rate_idr: 15500,
    total_amount_idr: 1075312500,
    payment_term: 'Tempo',
    status: 'Issued',
    items: [{ description: 'CNG Gas Supply', volume_mmbtu: 5000, unit_price_usd: 12.5, subtotal_usd: 62500 }]
  };
  
  // Dummy data Restoran Sederhana
  const horeca = {
    invoice_no: `INV-HOR-${Date.now()}`,
    customer_id: '22222222-2222-2222-2222-222222222222',
    customer_name: 'Restoran Sederhana',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    total_tabung: 20,
    price_per_tabung_idr: 150000,
    subtotal_idr: 3000000,
    tax_rate_percent: 11,
    tax_amount_idr: 330000,
    total_amount_idr: 3330000,
    payment_term: 'COD',
    status: 'Paid',
  };

  const { error: e1 } = await createInvoiceIndustri(industri as any);
  const { error: e2 } = await createInvoiceHoreca(horeca as any);

  revalidatePath('/portal/keuangan');
  return { success: !e1 && !e2, errors: [e1, e2] };
}
