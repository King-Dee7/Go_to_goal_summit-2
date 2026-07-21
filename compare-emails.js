const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function compareEmails() {
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
    
  const csvText = fs.readFileSync('AICC Event Guest List Template_From Go to Goal Summit -  Guest List.csv', 'utf8');
  const rows = csvText.split('\n');
  
  const csvGuests = [];
  for (let i = 6; i < rows.length; i++) {
    const row = rows[i];
    if (!row.trim()) continue;
    
    // Simple CSV parse considering there are no escaped commas in emails usually, 
    // but names might have quotes. We just split by comma and hope it's aligned.
    // Actually, splitting by comma is fragile if names have commas, but it's enough for emails if email is col 4.
    const cols = row.split(',');
    if (cols.length >= 5) {
      const email = cols[4] ? cols[4].trim().toLowerCase() : '';
      const firstName = cols[1] ? cols[1].trim() : '';
      const lastName = cols[2] ? cols[2].trim() : '';
      
      if (email && email !== '' && email.includes('@')) {
        csvGuests.push({
          email: email,
          name: firstName + ' ' + lastName,
          rowNum: i + 1
        });
      }
    }
  }

  const unsentGuests = csvGuests.filter(guest => !sentEmails.includes(guest.email));

  console.log("Total guests in CSV: " + csvGuests.length);
  console.log("Total emails sent (from DB): " + sentEmails.length);
  console.log("Guests in CSV not sent an email: " + unsentGuests.length);
  
  if (unsentGuests.length > 0) {
    console.log('\\n--- Guests not emailed ---');
    unsentGuests.forEach(g => {
      console.log("- " + g.name + " (" + g.email + ")");
    });
  }
}

compareEmails();
