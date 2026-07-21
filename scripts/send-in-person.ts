import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getInPersonReminderEmail } from '../lib/email-templates';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;

if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

async function main() {
  console.log('Fetching accepted in-person applicants...');
  
  const { data: applicants, error } = await supabase
    .from('applications')
    .select('id, first_name, email, status')
    .eq('status', 'Accepted');

  if (error) {
    console.error('Error fetching applicants:', error);
    return;
  }

  if (!applicants || applicants.length === 0) {
    console.log('No accepted applicants found.');
    return;
  }

  console.log(`Found ${applicants.length} accepted applicants.`);

  let successCount = 0;
  let errorCount = 0;

  for (const applicant of applicants) {
    try {
      console.log(`Sending email to ${applicant.email}...`);
      const { error: emailError } = await resend.emails.send({
        from: 'Reinvent Africa <hello@reinventaf.com>',
        to: applicant.email,
        subject: 'Important Update: Arrival Time for Tomorrow!',
        html: getInPersonReminderEmail(applicant.first_name || 'Innovator'),
      });

      if (emailError) {
        console.error(`Failed to send to ${applicant.email}:`, emailError);
        errorCount++;
      } else {
        console.log(`Successfully sent to ${applicant.email}`);
        successCount++;
      }

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) {
      console.error(`Unexpected error for ${applicant.email}:`, e);
      errorCount++;
    }
  }

  console.log(`\nFinished sending emails!`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
}

main();
