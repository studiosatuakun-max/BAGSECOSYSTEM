import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseSSR';

// To protect this cron route from unauthorized access.
// Example: GET /api/cron/reminders?token=YOUR_SECRET_TOKEN
const CRON_SECRET = process.env.CRON_SECRET || 'baskara-cron-secret-2026';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const authHeader = request.headers.get('authorization');

  // Authorize via query param OR Bearer token
  if (token !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current date strings for comparison
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const next30Days = new Date(today);
    next30Days.setDate(today.getDate() + 30);
    const next30DaysStr = next30Days.toISOString().split('T')[0];

    console.log(`[CRON] Running reminders check at ${todayStr}`);

    // 1. Follow-Ups Scheduled for Today (All Segments)
    const { data: followUps, error: err1 } = await supabase
      .from('sales_leads')
      .select('id, company_name, sales_rep_id, contact_person')
      .eq('next_follow_up_date', todayStr);

    if (err1) throw err1;

    // 2. Horeca Competitor Contracts Ending within 30 days
    // Using simple logic: segment = 'Horeca' AND contract_end_date <= next30DaysStr AND > todayStr
    const { data: expiringContracts, error: err2 } = await supabase
      .from('sales_leads')
      .select('id, company_name, sales_rep_id, current_vendor, competitor_contract_end_date')
      .eq('segment', 'Horeca')
      .lte('competitor_contract_end_date', next30DaysStr)
      .gt('competitor_contract_end_date', todayStr);

    if (err2) throw err2;

    // Action: In a real scenario, this is where we send emails or trigger WhatsApp API.
    // For now, we will log them as system activities or stdout.
    
    const remindersSent = [];

    if (followUps && followUps.length > 0) {
      console.log(`[CRON] Found ${followUps.length} follow-ups for today.`);
      for (const lead of followUps) {
        const msg = `Reminder: Follow up with ${lead.contact_person} at ${lead.company_name} today.`;
        console.log(msg);
        remindersSent.push(msg);
      }
    }

    if (expiringContracts && expiringContracts.length > 0) {
      console.log(`[CRON] Found ${expiringContracts.length} Horeca contracts expiring soon.`);
      for (const lead of expiringContracts) {
        const msg = `Alert: Horeca target ${lead.company_name} contract with ${lead.current_vendor} ends on ${lead.competitor_contract_end_date}.`;
        console.log(msg);
        remindersSent.push(msg);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cron executed successfully. Found ${followUps.length} follow-ups and ${expiringContracts.length} expiring contracts.`,
      reminders: remindersSent
    });

  } catch (error: any) {
    console.error('[CRON Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
