import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('applications')
    .select('email')
    .eq('status', 'Accepted');
    
  if (error) {
    console.error(error);
    return;
  }
  
  if (data) {
    console.log('Total found:', data.length);
    console.log(data.map(d => d.email).join(', '));
  }
}
run();
