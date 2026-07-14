import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../lib/email';
import { getUpdateTimeEmail } from '../lib/email-templates';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log("Fetching applicants...");
  
  const { data: applicants, error } = await supabase
    .from('applications')
    .select('first_name, email, status')
    .in('status', ['Accepted', 'Virtual']);

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (!applicants || applicants.length === 0) {
    console.log("No accepted or virtual applicants found.");
    return;
  }

  console.log(`Sending emails to ${applicants.length} applicants...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const applicant of applicants) {
    console.log(`Sending to ${applicant.first_name} <${applicant.email}>...`);
    const emailHtml = getUpdateTimeEmail(applicant.first_name);
    
    const result = await sendEmail({
      to: applicant.email,
      subject: "Event Time Update: From Go To Goal Summit",
      html: emailHtml,
    });

    if (result.success) {
      console.log(`✅ Successfully sent to ${applicant.email}`);
      successCount++;
    } else {
      console.error(`❌ Failed to send to ${applicant.email}:`, result.error);
      errorCount++;
    }
    
    // Slight delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\nDone!");
  console.log(`Successfully sent: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
}

run();
