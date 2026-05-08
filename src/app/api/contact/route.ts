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
    // 1. Save to Database (Supabase)
    try {
      console.log('Attempting to save to database...');
      const { error: dbError } = await supabase.from('contact_messages').insert([
        {
          name,
          email,
          message,
        },
      ]);
      
      if (dbError) throw dbError;
      
      console.log('Contact message saved to database successfully.');
      dbSaveSuccessful = true;
    } catch (dbError: any) {
      console.error('Failed to save message to database:', dbError.message || dbError);
      // Decide if you want to stop here or proceed with email even if DB fails
      // For now, we'll continue but log the error
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

    } catch (emailError: any) {
      console.error('Failed to send email:', emailError.message || emailError);
      // If email fails, and DB also failed or was skipped
      if (!dbSaveSuccessful) {
         return NextResponse.json({ message: 'Failed to send message (both email and DB failed). Please try again later.' }, { status: 500 });
      }
      // If email fails, but DB was successful
      return NextResponse.json({ message: 'Failed to send email, but message was saved to database. Please check server logs.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Route execution caught an unexpected error:', error.message || error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log('--- API Call End (finally block) ---');
  }
}