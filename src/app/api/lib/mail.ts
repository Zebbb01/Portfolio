// src/app/api/lib/mail.ts
import { SendEmailParams } from '@/src/types/mail'; // Using '@/src/types/mail' for absolute path
import nodemailer from 'nodemailer';

// Create a single transporter instance (can be outside the function)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.YOUR_GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendContactEmail({ name, email, message }: SendEmailParams) {
  // IMPORTANT: Check for environment variables before attempting to send
  if (!process.env.YOUR_GMAIL_ADDRESS || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Nodemailer environment variables are NOT SET. Cannot send email.');
    throw new Error('Email service not configured. Please check environment variables.');
  }

  const mailOptions = {
    from: process.env.YOUR_GMAIL_ADDRESS,
    to: process.env.RECIPIENT_EMAIL, // Recipient (your email)
    subject: `Message from Portfolio: ${name}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
          <div style="background-color: #6a0dad; color: #ffffff; padding: 25px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">New Portfolio Message!</h1>
          </div>

          <div style="padding: 30px;">
            <p style="font-size: 16px; margin-bottom: 20px;">You have received a new message from your portfolio contact form.</p>

            <h3 style="font-size: 20px; color: #6a0dad; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Contact Details:</h3>
            <ul style="list-style-type: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 10px; font-size: 16px;">
                <strong>Name:</strong> <span style="color: #555;">${name}</span>
              </li>
              <li style="margin-bottom: 10px; font-size: 16px;">
                <strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
              </li>
            </ul>

            <h3 style="font-size: 20px; color: #6a0dad; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Message:</h3>
            <div style="background-color: #f9f9f9; border: 1px solid #ddd; border-left: 5px solid #6a0dad; padding: 15px; border-radius: 4px; font-size: 16px; color: #444;">
              <p style="margin: 0;">${message}</p>
            </div>

            <p style="font-size: 14px; color: #777; margin-top: 30px;">
              This message was sent via your portfolio's contact form.
            </p>
          </div>

          <div style="background-color: #f0f0f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Gerald Villaceran. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error instanceof Error ? error.message : error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}