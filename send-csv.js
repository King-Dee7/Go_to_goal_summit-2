const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => { 
  const [k, ...v] = line.split('='); 
  if(k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^['"]|['"]$/g, ''); 
  return acc; 
}, {}); 
Object.assign(process.env, env);

const resendApiKey = process.env.RESEND_API_KEY;

// The email template logic
const getInPersonReminderEmail = (firstName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <div style="background-color: #ffffff; padding: 20px 0;">
    <div class="email-container" style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 4px solid #000000; box-sizing: border-box; text-align: left;">
      <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td width="25%" height="12" style="background-color: #F6C10E; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #0B56A0; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #2F8E49; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #DE0510; font-size: 1px; line-height: 1px;">&nbsp;</td>
        </tr>
      </table>
      <div class="content-padding" style="padding: 40px;">
        <div style="margin-bottom: 30px;">
          <img src="https://reinventaf.com/reinvent-logo.png" alt="Reinvent Africa Network" style="width: 200px; height: auto;" />
        </div>
        <div style="color: #333; line-height: 1.6; font-size: 16px; min-height: 350px;">
          <h1 style="font-size: 26px; color: #0B56A0; margin-bottom: 20px; font-weight: 700;">Important Update: Arrival Time for Tomorrow!</h1>
          <p>Hi ${firstName},</p>
          <p>We are so excited to see you tomorrow at the <strong>From Go To Goal Summit</strong>!</p>
          <p>We are reaching out with an important update regarding the schedule. Please ensure you arrive at the Google AI Community Center by <strong>4:30 PM prompt</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #F6C10E;">
            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; color: #050505;">Why Arrive Early?</h3>
            <p style="margin: 0; font-size: 15px; line-height: 1.6;">
              Arriving early will give you a fantastic opportunity to settle in, network, and form relationships with our speakers and fellow attendees before the official kickoff. 
              But more importantly, the event starts at <strong>5:00 PM sharp</strong>, and we want to make sure you don't miss a single moment.
            </p>
          </div>

          <p>See you tomorrow at 4:30 PM!</p>
          <p style="margin-top: 30px;">Best regards,<br /><strong>The Reinvent Africa Team</strong></p>
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
      
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Reinvent Africa <hello@reinventaf.com>',
          to: guest.email,
          subject: 'Important Update: Arrival Time for Tomorrow!',
          html: getInPersonReminderEmail(guest.firstName),
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error(`Failed to send to ${guest.email}:`, errData);
        errorCount++;
      } else {
        successCount++;
      }

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
