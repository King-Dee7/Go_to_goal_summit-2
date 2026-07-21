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

async function checkStatus() {
  const { data, error } = await supabase.from('applications').select('rsvp_status');
  if (error) {
    console.error(error);
    return;
  }
  
  const statuses = {};
  data.forEach(d => {
    statuses[d.rsvp_status] = (statuses[d.rsvp_status] || 0) + 1;
  });
  console.log('RSVP Statuses:', statuses);
}

checkStatus();
