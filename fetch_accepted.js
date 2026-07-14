require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('applications').select('*').eq('status', 'Accepted');
  if (error) {
    console.error(error);
  } else {
    const result = data.map(a => {
      const role = a.category === 'Student' ? `${a.field_of_study} at ${a.university}` : `${a.current_role} at ${a.company}`;
      return `| ${a.first_name} ${a.last_name} | ${a.phone_number} | ${role} | ${a.status} |`;
    });
    console.log('| Name | Mobile Number | Work / School | Status |');
    console.log('|---|---|---|---|');
    console.log(result.join('\n'));
  }
}
run();
