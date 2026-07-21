const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => { 
  const [k, ...v] = line.split('='); 
  if(k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^['"]|['"]$/g, ''); 
  return acc; 
}, {}); 

Object.assign(process.env, env);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars.");
  process.exit(1);
}

async function run() {
  const res = await fetch(`${supabaseUrl}/rest/v1/applications?status=eq.Accepted&select=email`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  
  if (!res.ok) {
    console.error(await res.text());
    return;
  }
  
  const data = await res.json();
  const emails = data.map(d => d.email);
  console.log('Total found:', emails.length);
  console.log(emails.join(', '));
}

run();
