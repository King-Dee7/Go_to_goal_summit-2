const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(envVars.RESEND_API_KEY);

const emailHtmlTemplate = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Dear {First Name},</p>
  
  <p>We are still catching our breath from the incredible energy at the From Go to Goal Summit, and we couldn't wait to write to you.</p>
  
  <p>Having you join us in person meant the world to us. Your presence, your energy, and the spark in your eyes as we shared those transformative moments really brought the summit to life in a way we could only dream of. Thank you for showing up, not just for us, but for yourself and your own goals.</p>
  
  <p>The connections we made and the stories we shared are just the beginning of this journey together. To keep the momentum going, stay connected with our community, and be the first to hear about our future events and exclusive updates, we'd love for you to join our WhatsApp channel!</p>
  
  <p>👉 <a href="https://whatsapp.com/channel/0029Vb7y3NrFSAtApZiobY1J" style="color: #0066cc; font-weight: bold;">Join our WhatsApp Channel here</a></p>
  
  <p>Thank you once again for your warmth, your passion, and for being a part of the Reinvent Africa family. We are so excited to see where your goals take you next!</p>
  
  <p>With so much gratitude,</p>
  <p><strong>The Reinvent Africa Team</strong></p>
</div>
`;

async function sendEmails() {
  console.log('Fetching accepted applicants...');
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('status', 'Accepted');

  if (error) {
    console.error('Error fetching applications:', error);
    return;
  }

  const recipients = data.filter(person => {
    const fullName = person.first_name + " " + person.last_name;
    return !fullName.toLowerCase().includes('victory oyeleke');
  });

  console.log("Found " + data.length + " accepted applicants. Sending to " + recipients.length + " recipients (excluding Victory Oyeleke).");

  let successCount = 0;
  let failCount = 0;

  for (const person of recipients) {
    const htmlContent = emailHtmlTemplate.replace(/{First Name}/g, person.first_name);
    
    try {
      const result = await resend.emails.send({
        from: 'Reinvent Africa <info@reinventaf.com>',
        to: person.email,
        subject: 'Thank you for making the From Go to Goal Summit unforgettable ❤️',
        html: htmlContent,
      });

      if (result.error) {
        console.error("Failed to send to " + person.email + ": ", result.error);
        failCount++;
      } else {
        console.log("Sent successfully to " + person.email);
        successCount++;
      }
    } catch (e) {
      console.error("Exception sending to " + person.email + ":", e);
      failCount++;
    }

    // Add a small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log("Finished sending emails. Success: " + successCount + ", Failed: " + failCount);
}

sendEmails();
