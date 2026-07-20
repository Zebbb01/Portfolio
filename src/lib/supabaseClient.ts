import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Safe fallback to prevent building compilation errors, but will log in development
  console.warn('Missing Supabase public environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default supabase;
