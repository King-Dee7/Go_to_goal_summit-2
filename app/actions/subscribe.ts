'use server';

import { addToMailerLite } from '@/lib/mailerlite';
import { sendEmail } from '@/lib/email';

type SubscribeInput = {
  email: string;
  firstName: string;
  lastName: string;
};

export async function subscribeToUpdates(formData: SubscribeInput) {
  try {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      throw new Error('Please fill in all fields.');
    }

    // 1. Add to MailerLite
    await addToMailerLite({
      email: formData.email.trim(),
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      fields: {
        last_name: formData.lastName.trim(),
      },
    });

    // 2. Send notification email to Reinvent Africa's admin email
    await sendEmail({
      to: 'info@reinventaf.com',
      subject: `[Summit Sign-up] New Subscriber: ${formData.firstName} ${formData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #0b56a0; border-bottom: 2px solid #0b56a0; padding-bottom: 10px; margin-top: 0;">New Newsletter Subscription</h2>
          <p>A new user has subscribed for updates on the From Go To Goal Summit website:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">First Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.firstName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Last Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${formData.email}">${formData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Date:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC</td>
            </tr>
          </table>
          <p style="font-size: 13px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            This subscriber has also been automatically added to your MailerLite subscriber list.
          </p>
        </div>
      `,
    });

    // 3. Send a confirmation email to the subscriber
    await sendEmail({
      to: formData.email.trim(),
      subject: 'Welcome to Reinvent Africa Network - From Go To Goal Summit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; border: 1px solid #eee; padding: 25px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://reinventaf.com/reinvent-logo.png" alt="Reinvent Africa Network" style="max-width: 200px; height: auto;" />
          </div>
          <h2 style="color: #0c0e0d; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">Thanks for signing up!</h2>
          <p>Hi ${formData.firstName},</p>
          <p>Thank you for subscribing to updates for the <strong>From Go To Goal Summit 2026</strong>. We're excited to have you in the loop!</p>
          <p>We will keep you updated with the latest news, including:</p>
          <ul>
            <li>✨ Speaker and contributor announcements</li>
            <li>📅 Dynamic agenda and program releases</li>
            <li>🎟️ Application status and ticket availability</li>
          </ul>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #509e71; text-align: center;">
            <p style="margin-top: 0; font-weight: bold; color: #333;">Want to join us in person?</p>
            <p style="margin-bottom: 15px; font-size: 14px; color: #555;">Attendance is free, but space is limited and strictly by curation/application.</p>
            <a href="https://reinventaf.com/apply" style="display: inline-block; background-color: #509e71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Apply to Attend Here</a>
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Best regards,<br />
            <strong>The Reinvent Africa Team</strong>
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Subscription Action Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to subscribe. Please try again.',
    };
  }
}
