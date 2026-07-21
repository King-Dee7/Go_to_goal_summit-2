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

async function fetchInPerson() {
  const { data, error } = await supabase.from('applications').select('first_name, last_name, email, rsvp_status').eq('rsvp_status', 'in-person');
  if (error) {
    console.error('Error fetching applications:', error);
    return;
  }
  
  console.log(`Found ${data.length} in-person attendees.`);
  console.table(data);
}

fetchInPerson();
