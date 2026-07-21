import { Resend } from 'resend';
import { getInPersonReminderEmail } from '../lib/email-templates';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resendApiKey = process.env.RESEND_API_KEY!;
const resend = new Resend(resendApiKey);

async function main() {
  const content = fs.readFileSync('AICC Event Guest List Template_From Go to Goal Summit -  Guest List.csv', 'utf8');
  const lines = content.split('\n');
  const validGuests = [];

  for (let i = 6; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' && line[j+1] === '"') {
        current += '"';
        j++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    let firstName = parts[1];
    if (!firstName || firstName.trim() === '') {
      firstName = 'Innovator';
    }

    const email = parts[4];
    const status = parts[7];
    
    if (email && email.includes('@') && status === 'Confirmed') {
      validGuests.push({ firstName, email });
    }
  }

  console.log(`Found ${validGuests.length} confirmed attendees from the CSV.`);
  console.log('Starting to send emails...');

  let successCount = 0;
  let errorCount = 0;

  for (const guest of validGuests) {
    try {
      console.log(`Sending to ${guest.firstName} (${guest.email})...`);
      const { error: emailError } = await resend.emails.send({
        from: 'Reinvent Africa <hello@reinventaf.com>',
        to: guest.email,
        subject: 'Important Update: Arrival Time for Tomorrow!',
        html: getInPersonReminderEmail(guest.firstName),
      });

      if (emailError) {
        console.error(`Failed to send to ${guest.email}:`, emailError);
        errorCount++;
      } else {
        successCount++;
      }

      // Small delay to respect Resend rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) {
      console.error(`Unexpected error for ${guest.email}:`, e);
      errorCount++;
    }
  }

  console.log(`\nFinished sending emails!`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
}

main();
