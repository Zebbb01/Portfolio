import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Safe fallback to prevent building compilation errors, but will log in development
  console.warn('Missing Supabase public environment variables');
}

// createClient throws on an empty URL, which would fail the build's prerender;
// a placeholder lets the page build, and chat calls fail at runtime instead.
export const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseAnonKey || 'missing-anon-key');

export default supabase;
