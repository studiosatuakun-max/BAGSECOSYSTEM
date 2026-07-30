'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Invoice Industri (B2B / USD / MMBTU) ────────────────────────────────────

export async function getInvoicesIndustri(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
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
  const supabase = await createSupabaseServerClient();
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
  items: { description: string; volume_mmbtu: number; unit_price_usd: number; subtotal_usd: number }[];
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();

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
      unit_price_usd: payload.unit_price_usd,
      subtotal_usd: payload.subtotal_usd,
      tax_rate_percent: payload.tax_rate_percent,
      tax_amount_usd: payload.tax_amount_usd,
      total_amount_usd: payload.total_amount_usd,
      exchange_rate_idr: payload.exchange_rate_idr,
      total_amount_idr: payload.total_amount_idr,
      payment_term: payload.payment_term,
      status: payload.status,
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
  const supabase = await createSupabaseServerClient();
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
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('invoices_industri').delete().eq('id', id);
  if (!error) revalidatePath('/portal/keuangan');
  return { error: error?.message ?? null };
}

// ─── Invoice Horeca (Retail / IDR / Tabung) ────────────────────────────────────

export async function getInvoicesHoreca(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
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
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('invoices_horeca')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/keuangan');
  return { data, error: error?.message ?? null };
}

export async function updateInvoiceHorecaStatus(
  id: string,
  status: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled'
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
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

// ─── Summary Stats ─────────────────────────────────────────────────────────────

export async function getKeuanganSummary(): Promise<{
  totalRevenueIdr: number;
  totalArOutstanding: number;
  avgDaysOutstanding: number;
  issuedCount: number;
  paidCount: number;
  overdueCount: number;
}> {
  const supabase = await createSupabaseServerClient();

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

  return {
    totalRevenueIdr,
    totalArOutstanding: outstanding,
    avgDaysOutstanding: 18,
    issuedCount: all.filter((i) => i.status === 'Issued').length,
    paidCount: all.filter((i) => i.status === 'Paid').length,
    overdueCount: all.filter((i) => i.status === 'Overdue').length,
  };
}
