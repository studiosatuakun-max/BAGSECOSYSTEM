import { createClient } from '@supabase/supabase-js';

// Fallback to dummy values to prevent Vercel build crashes during prerendering
// if the environment variables haven't been configured in the Vercel Dashboard yet.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
