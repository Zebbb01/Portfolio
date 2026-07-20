import { NextResponse } from 'next/server';
import { supabase } from '@/src/app/api/lib/db';
import { sendChatNotificationEmail } from '@/src/app/api/lib/mail';

export async function POST(req: Request) {
  try {
    const { guestName, guestEmail } = await req.json();

    if (!guestName || !guestEmail) {
      return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    // Resolve client IP address
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Rate Limit Check: Limit to 1 room creation per 15 minutes per IP
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: recentRooms, error: checkError } = await supabase
      .from('portfolio_chat_rooms')
      .select('id, created_at')
      .eq('ip_address', ip)
      .gt('created_at', fifteenMinutesAgo)
      .limit(1);

    if (checkError) {
      console.error('Database rate limit check error:', checkError);
    }

    if (recentRooms && recentRooms.length > 0) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before starting a new chat.' },
        { status: 429 }
      );
    }

    // Insert Chat Room
    const { data: roomData, error: roomError } = await supabase
      .from('portfolio_chat_rooms')
      .insert([
        {
          guest_name: guestName.trim(),
          guest_email: guestEmail.trim(),
          ip_address: ip,
        },
      ])
      .select()
      .single();

    if (roomError) {
      console.error('Error creating chat room:', roomError);
      return NextResponse.json({ error: 'Failed to initialize conversation session.' }, { status: 500 });
    }

    // Create Initial System Welcome Message
    const welcomeText = `Hi ${guestName.trim()}! Thanks for reaching out. Gerald has been notified. Feel free to leave your message here!`;
    const { error: msgError } = await supabase
      .from('portfolio_chat_messages')
      .insert([
        {
          room_id: roomData.id,
          sender: 'admin',
          content: welcomeText,
        },
      ]);

    if (msgError) {
      console.error('Error creating initial welcome message:', msgError);
    }

    // Send Gmail notification alert asynchronously so it doesn't block the client UI load
    sendChatNotificationEmail({
      name: guestName.trim(),
      email: guestEmail.trim(),
      roomId: roomData.id,
    }).catch((e) => console.error('Failed to trigger email notification background job:', e));

    return NextResponse.json({ success: true, roomId: roomData.id });
  } catch (err) {
    console.error('Server error in chat/start API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
