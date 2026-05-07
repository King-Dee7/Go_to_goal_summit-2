'use server';

import { getSupabase } from '@/lib/supabase';
import { appendToSheet } from '@/lib/google-sheets';
import { addToMailerLite } from '@/lib/mailerlite';

type InviteClaimUserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  company?: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function claimInviteCode(code: string, userData: InviteClaimUserData) {
  try {
    const supabase = getSupabase();

    // 1. Verify and claim the code in Supabase
    const { data: invite, error: inviteError } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'Active')
      .single();

    if (inviteError || !invite) {
      return { success: false, error: 'Invalid or already claimed invite code.' };
    }

    // 2. Update the code as Claimed
    const { error: updateError } = await supabase
      .from('invite_codes')
      .update({ 
        status: 'Claimed', 
        claimed_by_email: userData.email,
        claimed_at: new Date().toISOString() 
      })
      .eq('id', invite.id);

    if (updateError) throw updateError;

    // 3. Create a record in applications table
    const { error: appError } = await supabase
      .from('applications')
      .insert([
        {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone_number: userData.phone,
          current_role: userData.role,
          company: userData.company,
          category: 'Invited Guest',
          status: 'Accepted', // Auto-accepted since they had a code
          invite_code_issued: code.toUpperCase()
        }
      ])
      .select()
      .single();

    if (appError) throw appError;

    // 4. Push to Google Sheets
    const sheetRow = [
      new Date().toISOString(),
      userData.firstName,
      userData.lastName,
      userData.email,
      '', // No phone
      '', // No social platform
      '', // No social handle
      'Invited Guest',
      '', // No role
      '', // No company
      '', // No university
      '', // No field of study
      'CLAIMED VIA INVITE CODE',
      '', '', '', '',
      'Accepted'
    ];
    
    try {
      await appendToSheet(sheetRow);
    } catch (err) {
      console.error('Sheets sync error:', err);
    }

    // 5. Push to MailerLite
    try {
      await addToMailerLite({
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        fields: {
          last_name: userData.lastName,
          role: 'Invited Guest'
        }
      });
    } catch (err) {
      console.error('MailerLite sync error:', err);
    }

    return { success: true };
  } catch (error) {
    console.error('Invite claim error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function verifyInviteCode(code: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('invite_codes')
    .select('code, status')
    .eq('code', code.toUpperCase())
    .eq('status', 'Active')
    .single();

  if (error || !data) return { valid: false };
  return { valid: true };
}
