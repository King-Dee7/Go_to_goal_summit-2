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

const wrapEmail = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .email-container {
        border-left: none !important;
        border-right: none !important;
        border-radius: 0 !important;
        width: 100% !important;
      }
      .content-padding {
        padding: 30px 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <div style="background-color: #ffffff; padding: 20px 0;">
    <div class="email-container" style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 4px solid #000000; box-sizing: border-box; text-align: left;">
      <!-- Colorful top bar -->
      <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td width="25%" height="12" style="background-color: #F6C10E; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #0B56A0; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #2F8E49; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #DE0510; font-size: 1px; line-height: 1px;">&nbsp;</td>
        </tr>
      </table>
      
      <!-- Main Content -->
      <div class="content-padding" style="padding: 40px;">
        <div style="margin-bottom: 30px;">
          <img src="https://reinventaf.com/reinvent-logo.png" alt="Reinvent Africa Network" style="width: 200px; height: auto;" />
        </div>
        <div style="color: #333; line-height: 1.6; font-size: 16px; min-height: 350px;">
          ${content}
        </div>
        <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: left;">
          © 2026 Reinvent Africa Network. All rights reserved.<br />
          6th March, Ave,<br />
          Tantra, Accra, Ghana.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

const innerContent = `
  <p>Dear {First Name},</p>
  
  <p>We are still catching our breath from the incredible energy at the From Go to Goal Summit, and we couldn't wait to write to you.</p>
  
  <p>Having you join us in person meant the world to us. Your presence, your energy, and the spark in your eyes as we shared those transformative moments really brought the summit to life in a way we could only dream of. Thank you for showing up, not just for us, but for yourself and your own goals.</p>
  
  <p>The connections we made and the stories we shared are just the beginning of this journey together. To keep the momentum going, stay connected with our community, and be the first to hear about our future events and exclusive updates, we'd love for you to join our WhatsApp channel!</p>
  
  <p>👉 <a href="https://whatsapp.com/channel/0029Vb7y3NrFSAtApZiobY1J" style="color: #0066cc; font-weight: bold;">Join our WhatsApp Channel here</a></p>
  
  <p>Thank you once again for your warmth, your passion, and for being a part of the Reinvent Africa family. We are so excited to see where your goals take you next!</p>
  
  <p>With so much gratitude,</p>
  <p><strong>The Reinvent Africa Team</strong></p>
`;

async function sendRemainingEmails() {
  console.log('Fetching sent emails from DB...');
  const { data, error } = await supabase
    .from('applications')
    .select('email, first_name, last_name')
    .eq('status', 'Accepted');

  if (error) {
    console.error('Error fetching applications:', error);
    return;
  }

  const sentEmails = data
    .filter(person => {
      const fullName = (person.first_name + " " + person.last_name).toLowerCase();
      return !fullName.includes('victory oyeleke');
    })
    .map(p => p.email.toLowerCase().trim());
    
  console.log('Reading CSV...');
  const csvText = fs.readFileSync('AICC Event Guest List Template_From Go to Goal Summit -  Guest List.csv', 'utf8');
  const rows = csvText.split('\n');
  
  const csvGuests = [];
  // deduplicate logic tracking seen emails
  const seenEmails = new Set();
  
  for (let i = 6; i < rows.length; i++) {
    const row = rows[i];
    if (!row.trim()) continue;
    
    const cols = row.split(',');
    if (cols.length >= 5) {
      const email = cols[4] ? cols[4].trim().toLowerCase() : '';
      const firstName = cols[1] ? cols[1].trim() : '';
      const lastName = cols[2] ? cols[2].trim() : '';
      
      if (email && email !== '' && email.includes('@')) {
        if (!seenEmails.has(email) && !sentEmails.includes(email)) {
          csvGuests.push({
            email: email,
            name: firstName + ' ' + lastName,
            firstName: firstName || 'there'
          });
          seenEmails.add(email);
        }
      }
    }
  }

  console.log("Found " + csvGuests.length + " remaining unsent unique guests.");

  let successCount = 0;
  let failCount = 0;

  for (const person of csvGuests) {
    // Generate the branded email
    const personalizedInnerContent = innerContent.replace(/{First Name}/g, person.firstName);
    const htmlContent = wrapEmail(personalizedInnerContent);
    
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

  console.log("Finished sending branded emails. Success: " + successCount + ", Failed: " + failCount);
}

sendRemainingEmails();
