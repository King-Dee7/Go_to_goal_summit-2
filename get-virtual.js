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

async function checkVirtual() {
  const { data, error } = await supabase.from('applications').select('email, first_name, last_name, status, rsvp_status');
  if (error) {
    console.error(error);
    return;
  }
  
  const statuses = {};
  const rsvps = {};
  data.forEach(d => {
    statuses[d.status] = (statuses[d.status] || 0) + 1;
    rsvps[d.rsvp_status] = (rsvps[d.rsvp_status] || 0) + 1;
  });
  
  console.log('Statuses:', statuses);
  console.log('RSVPs:', rsvps);
}

checkVirtual();
