const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => { 
  const [k, ...v] = line.split('='); 
  if(k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^['"]|['"]$/g, ''); 
  return acc; 
}, {}); 
Object.assign(process.env, env);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  const res = await fetch(`${supabaseUrl}/rest/v1/applications?select=email,status`, {
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
  });
  const data = await res.json();
  const virtual = data.filter(d => d.status === 'Virtual').map(d => d.email);
  const inPerson = data.filter(d => d.status === 'Accepted').map(d => d.email);
  
  console.log('--- VIRTUAL EMAILS ---');
  console.log(virtual.join(', '));
  console.log('\n--- IN-PERSON EMAILS ---');
  console.log(inPerson.join(', '));
}
run();
