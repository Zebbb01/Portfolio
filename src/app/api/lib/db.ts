// src/app/api/lib/db.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// Created on first use, not at import: `next build` imports every route while
// collecting page data, and a build without Supabase env vars must still pass.
export function getSupabase(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    client = createClient(supabaseUrl, supabaseServiceKey);
  }
  return client;
}
