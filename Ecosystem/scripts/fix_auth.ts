import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

process.loadEnvFile(resolve(process.cwd(), '.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  console.log('Fetching user pemasaran@baskara.id...');
  
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }
  
  let pemasaranUser = users.find(u => u.email === 'pemasaran@baskara.id');
  
  if (!pemasaranUser) {
    console.log('User pemasaran@baskara.id not found. Creating it now...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'pemasaran@baskara.id',
      password: 'BaGS@2026!',
      email_confirm: true,
      app_metadata: { role: 'marketing_ae', division: 'pemasaran' }
    });
    
    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }
    console.log('Successfully created user!');
    pemasaranUser = newUser.user;
  } else {
    console.log(`Found user ${pemasaranUser.id}. Updating app_metadata...`);
    const { data, error } = await supabase.auth.admin.updateUserById(
      pemasaranUser.id,
      { app_metadata: { role: 'marketing_ae', division: 'pemasaran' } }
    );
    
    if (error) {
      console.error('Error updating user:', error);
    } else {
      console.log('Successfully updated app_metadata!');
    }
  }
}

run();
