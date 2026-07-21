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

async function countVirtual() {
  const { data, error } = await supabase.from('applications').select('email, first_name, last_name, status');
  if (error) {
    console.error(error);
    return;
  }
  
  const acceptedDB = data.filter(d => d.status === 'Accepted');
  const virtualDB = data.filter(d => d.status === 'Virtual');
  
  const sentEmailsFromDB = acceptedDB
    .filter(person => !((person.first_name + " " + person.last_name).toLowerCase().includes('victory oyeleke')))
    .map(p => p.email.toLowerCase().trim());

  const csvText = fs.readFileSync('AICC Event Guest List Template_From Go to Goal Summit -  Guest List.csv', 'utf8');
  const rows = csvText.split('\n');
  
  const csvGuests = [];
  const seenEmails = new Set();
  
  for (let i = 6; i < rows.length; i++) {
    const row = rows[i];
    if (!row.trim()) continue;
    
    const cols = row.split(',');
    if (cols.length >= 5) {
      const email = cols[4] ? cols[4].trim().toLowerCase() : '';
      if (email && email !== '' && email.includes('@')) {
        if (!seenEmails.has(email) && !sentEmailsFromDB.includes(email)) {
          csvGuests.push(email);
          seenEmails.add(email);
        }
      }
    }
  }

  const allSentInPersonEmails = new Set([...sentEmailsFromDB, ...csvGuests]);
  
  let trueVirtualCount = 0;
  let virtualThatCameInPerson = [];
  
  for (const v of virtualDB) {
    const email = v.email.toLowerCase().trim();
    if (allSentInPersonEmails.has(email)) {
      virtualThatCameInPerson.push(v);
    } else {
      trueVirtualCount++;
    }
  }
  
  console.log("Total Virtual attendees in DB: " + virtualDB.length);
  console.log("Virtual attendees who actually came in person (and were sent the email): " + virtualThatCameInPerson.length);
  console.log("Actual Virtual attendees (remaining): " + trueVirtualCount);
  
  if (virtualThatCameInPerson.length > 0) {
    console.log("\\nVirtual attendees who came in person:");
    virtualThatCameInPerson.forEach(v => {
      console.log("- " + v.first_name + " " + v.last_name + " (" + v.email + ")");
    });
  }
}

countVirtual();
