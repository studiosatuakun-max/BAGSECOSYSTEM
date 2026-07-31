import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const payload = {
    invoice_no: `INV-HOR-${Date.now()}`,
    customer_id: '11111111-1111-1111-1111-111111111111',
    customer_name: 'PT Krakatau Baja',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    total_tabung: 5000,
    price_per_tabung_idr: 12.5,
    subtotal_idr: 62500,
    tax_amount_idr: 6875,
    total_amount_idr: 69375,
    payment_term: 'COD',
    status: 'Issued',
  };

  console.log("Inserting Horeca...");
  const { data, error } = await supabase.from('invoices_horeca').insert(payload).select().single();
  console.log("Horeca Result:", { data, error });
}

run();
