const { createClient } = require('@supabase/supabase-js');
const url = 'https://msgparosjbcusahomsbp.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

async function setAdmin() {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return console.error('List error:', listError);
  
  const user = users.users.find(u => u.email === 'dariusasante@reinventaf.com');
  if (!user) return console.log('User not found');

  const { data, error } = await supabase.auth.admin.updateUserById(
    user.id,
    { user_metadata: { ...user.user_metadata, is_admin: true } }
  );
  
  if (error) console.error('Update error:', error);
  else console.log('Successfully updated user to admin:', data.user.email);
}
setAdmin();
