'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Sales Leads ──────────────────────────────────────────────────────────────

export async function getSalesLeads(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('sales_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createSalesLead(payload: {
  company_name: string;
  contact_person: string;
  phone_number: string;
  email?: string;
  segment: 'Industri' | 'Horeca';
  pipeline_stage?: string;
  estimated_volume_mmbtu?: number;
  cluster_location?: string;
  current_vendor?: string;
  competitor_contract_end_date?: string;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('sales_leads')
    .insert({ 
      ...payload, 
      pipeline_stage: payload.pipeline_stage ?? 'Perkenalan_Awal',
      sales_rep_id: user?.id 
    })
    .select()
    .single();

  if (error) console.error('[createSalesLead] Error:', error);
  if (!error) revalidatePath('/portal/pemasaran');
  return { data, error: error?.message ?? null };
}

export async function updateLeadStage(
  id: string,
  pipeline_stage: string,
  company_name?: string
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('sales_leads')
    .update({ pipeline_stage, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) {
    if (pipeline_stage === 'Dealing_Closed_Won') {
      await triggerLegalContract(id, company_name || 'Unknown Company');
    }
    await syncRevenueProjection();
    revalidatePath('/portal/pemasaran');
  }
  return { error: error?.message ?? null };
}

export async function deleteSalesLead(id: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('sales_leads').delete().eq('id', id);
  if (!error) revalidatePath('/portal/pemasaran');
  return { error: error?.message ?? null };
}

// ─── Cross-Module Automation Triggers ─────────────────────────────────────────

async function triggerLegalContract(leadId: string, companyName: string) {
  console.log(`[TRIGGER] Initiating Legal Contract workflow for Lead ${leadId} (${companyName})`);
  // Future integration: insert into a `dispatches` or `legal_contracts` table
}

async function syncRevenueProjection() {
  console.log(`[TRIGGER] Syncing revenue projection for Modul Keuangan`);
  // Future integration: aggregate Deal values and dispatch to Finance
}

// ─── KPI Aggregations ─────────────────────────────────────────────────────────

export async function getPemasaranKPIs(): Promise<{
  totalLeads: number;
  winRate: number;
  cacEfficiency: number;
}> {
  const supabase = await createSupabaseServerClient();
  
  // Get all leads count and won leads count
  const { data: leadsData } = await supabase.from('sales_leads').select('pipeline_stage');
  const leads = leadsData ?? [];
  const totalLeads = leads.length;
  
  const wonLeads = leads.filter(l => l.pipeline_stage === 'Dealing_Closed_Won').length;
  const winRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
  
  // Get all campaign budgets
  const { data: campaignData } = await supabase.from('marketing_campaigns').select('budget_idr');
  const campaigns = campaignData ?? [];
  const totalBudget = campaigns.reduce((acc, curr) => acc + Number(curr.budget_idr || 0), 0);
  
  const cacEfficiency = wonLeads > 0 ? totalBudget / wonLeads : 0;

  return {
    totalLeads,
    winRate,
    cacEfficiency
  };
}

// ─── Marketing Campaigns ──────────────────────────────────────────────────────

export async function getMarketingCampaigns(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('marketing_campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return { data, error: error?.message ?? null };
}

export async function createMarketingCampaign(payload: {
  campaign_name: string;
  campaign_type: string;
  segment_target: string;
  start_date: string;
  end_date?: string;
  budget_idr: number;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('marketing_campaigns')
    .insert({ ...payload, created_by: user?.id })
    .select()
    .single();

  if (error) console.error('[createMarketingCampaign] Error:', error);
  if (!error) revalidatePath('/portal/pemasaran');
  return { data, error: error?.message ?? null };
}

export async function updateCampaign(
  id: string,
  payload: {
    campaign_name: string;
    campaign_type: string;
    budget_idr: number;
    leads_generated: number;
  }
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('marketing_campaigns')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) revalidatePath('/portal/pemasaran');
  return { error: error?.message ?? null };
}

export async function updateCampaignStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('marketing_campaigns')
    .update({ status })
    .eq('id', id);

  if (!error) revalidatePath('/portal/pemasaran');
  return { error: error?.message ?? null };
}
