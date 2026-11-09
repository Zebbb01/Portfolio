import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/app/api/lib/db';

export const dynamic = 'force-dynamic';

// Two callers: the chat widget, before it offers the form, and the daily Vercel cron in
// vercel.json, whose query keeps the free Supabase project from pausing for inactivity.
export async function GET() {
  try {
    // No retries: the default backoff holds a failing read for about 30 seconds.
    const { error } = await getSupabase().from('portfolio_chat_rooms').select('id', { head: true }).limit(1).retry(false);
    if (error) throw error;
    return NextResponse.json({ online: true });
  } catch (err) {
    console.error('The chat database is unavailable:', err);
    return NextResponse.json({ online: false }, { status: 503 });
  }
}
