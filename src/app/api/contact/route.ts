import { NextResponse } from 'next/server';
import supabase from '../../api/lib/db'; // Import the shared Supabase client
import { sendContactEmail } from '../../api/lib/mail'; // Import the email sending function

export async function POST(request: Request) {
  console.log('--- API Call Start ---');
  console.log('Received request to /api/contact');

  // Environment variable checks for debugging (keep during development)
  console.log('YOUR_GMAIL_ADDRESS:', process.env.YOUR_GMAIL_ADDRESS ? 'Loaded' : 'NOT LOADED');
  console.log('RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL ? 'Loaded' : 'NOT LOADED');
  console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'Loaded (masked)' : 'NOT LOADED');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'NOT LOADED');

  if (request.method !== 'POST') {
    console.error('Method Not Allowed:', request.method);
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { name, email, message } = await request.json();
    console.log('Parsed request body:', { name, email, message });

    if (!name || !email || !message) {
      console.error('Missing required fields:', { name, email, message });
      return NextResponse.json({ message: 'Name, email, and message are required.' }, { status: 400 });
    }

    let dbSaveSuccessful = false;
    // 1. Save to Database (Supabase) with Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log('Attempting to save to database...');
      // Note: If using supabase-js v2, standard .insert doesn't take signal in the method call
      // But we can check for timeout in the catch block if the promise hangs
      const { error: dbError } = await Promise.race([
        supabase.from('contact_messages').insert([{ name, email, message }]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      ]) as any;
      
      if (dbError) throw dbError;
      
      console.log('Contact message saved to database successfully.');
      dbSaveSuccessful = true;
    } catch (dbError) {
      console.error('Failed to save message to database:', dbError instanceof Error ? dbError.message : dbError);
    } finally {
      clearTimeout(timeoutId);
    }


    // 2. Send Email (Nodemailer)
    try {
      console.log('Attempting to send email...');
      await sendContactEmail({ name, email, message });
      console.log('Email sent successfully.');

      // Respond based on both operations
      if (dbSaveSuccessful) {
        return NextResponse.json({ message: 'Message sent successfully (saved to DB and email sent)!' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Message sent successfully (email sent, but DB save failed)!' }, { status: 200 });
      }

    } catch (emailError) {
      console.error('Failed to send email:', emailError instanceof Error ? emailError.message : emailError);
      // If email fails, and DB also failed or was skipped
      if (!dbSaveSuccessful) {
         return NextResponse.json({ message: 'Failed to send message (both email and DB failed). Please try again later.' }, { status: 500 });
      }
      // If email fails, but DB was successful
      return NextResponse.json({ message: 'Failed to send email, but message was saved to database. Please check server logs.' }, { status: 500 });
    }

  } catch (error) {
    console.error('API Route execution caught an unexpected error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log('--- API Call End (finally block) ---');
  }
}