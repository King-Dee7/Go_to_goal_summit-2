import { Resend } from 'resend';
import { getInPersonReminderEmail } from '../lib/email-templates';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resendApiKey = process.env.RESEND_API_KEY!;
const resend = new Resend(resendApiKey);

async function main() {
  console.log('Sending test email...');
  const { error: emailError } = await resend.emails.send({
    from: 'Reinvent Africa <hello@reinventaf.com>',
    to: 'dariusasante07@gmail.com', // User's email
    subject: 'PREVIEW: Important Update: Arrival Time for Tomorrow!',
    html: getInPersonReminderEmail('Darius'),
  });

  if (emailError) {
    console.error('Failed to send:', emailError);
  } else {
    console.log('Preview successfully sent!');
  }
}

main();
