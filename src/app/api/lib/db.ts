// src/app/api/lib/db.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// A paused or unreachable project must fail fast, not hold a visitor for half a minute.
const TIMEOUT_MS = 8000;
const fetchWithTimeout: typeof fetch = (input, init) => {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  return fetch(input, { ...init, signal: init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout });
};

// Created on first use, not at import: `next build` imports every route while
// collecting page data, and a build without Supabase env vars must still pass.
export function getSupabase(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    client = createClient(supabaseUrl, supabaseServiceKey, { global: { fetch: fetchWithTimeout } });
  }
  return client;
}
