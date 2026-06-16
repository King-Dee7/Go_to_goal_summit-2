/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getSupabaseAdmin, verifyAdminSession } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { getApprovedEmail, getDeclinedEmail, getVirtualConfirmedEmail } from '@/lib/email-templates';

export async function approveApplication(id: string) {
  try {
    await verifyAdminSession();
    console.log('Server Action: Approving application ID:', id);
    const supabase = getSupabaseAdmin();

    // 1. Get application details first
    const { data: apps, error: getError } = await supabase
      .from('applications')
      .select('first_name, email')
      .eq('id', id);

    if (getError) throw new Error(`Database query error: ${getError.message}`);
    
    const application = apps && apps.length > 0 ? apps[0] : null;
    console.log('Server Action: Found application data:', application);
    
    if (!application) {
      console.error('No application found for ID:', id);
      throw new Error(`Application with ID ${id} not found in database (Found ${apps?.length || 0} records).`);
    }

    // 2. Update status in Supabase
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: 'Accepted' })
      .eq('id', id);

    if (updateError) throw new Error(`Update error: ${updateError.message}`);

    // 3. Send approval email
    const emailHtml = getApprovedEmail(application.first_name);
    const emailResult = await sendEmail({
      to: application.email,
      subject: "You're Officially Invited to the From Go To Goal Summit",
      html: emailHtml,
    });

    if (!emailResult.success) {
      const errorMsg = `Application accepted, but invitation email failed to send: ${JSON.stringify(emailResult.error)}`;
      console.error(errorMsg);
      
      // Log error to Supabase so it shows up in the dashboard
      await supabase
        .from('applications')
        .update({ sync_errors: errorMsg })
        .eq('id', id);

      return { 
        success: false, 
        error: errorMsg 
      };
    }

    // Clear any previous sync errors on success
    await supabase
      .from('applications')
      .update({ sync_errors: null })
      .eq('id', id);

    return { success: true };
  } catch (error: any) {
    console.error('Error approving application:', error);
    const errorMsg = error.message || 'Failed to approve application';
    
    // Attempt to log error to Supabase
    try {
      const supabase = getSupabaseAdmin();
      await supabase
        .from('applications')
        .update({ sync_errors: `Approval Error: ${errorMsg}` })
        .eq('id', id);
    } catch (dbLogErr) {
      console.error('Failed to log error to DB:', dbLogErr);
    }

    return { 
      success: false, 
      error: errorMsg 
    };
  }
}

export async function declineApplication(id: string) {
  try {
    await verifyAdminSession();
    const supabase = getSupabaseAdmin();

    // 1. Get application details
    const { data: application, error: getError } = await supabase
      .from('applications')
      .select('first_name, email')
      .eq('id', id)
      .single();

    if (getError) throw new Error(`Database error: ${getError.message}`);
    if (!application) throw new Error('Application not found');

    // 2. Update status in Supabase
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: 'Rejected' })
      .eq('id', id);

    if (updateError) throw new Error(`Update error: ${updateError.message}`);

    // 3. Send decline email
    const emailHtml = getDeclinedEmail(application.first_name);
    const emailResult = await sendEmail({
      to: application.email,
      subject: "Regarding your application to the From Go To Goal Summit",
      html: emailHtml,
    });

    if (!emailResult.success) {
      console.error('Email failed but application was updated:', emailResult.error);
      return { 
        success: false, 
        error: `Application declined, but notification email failed to send: ${JSON.stringify(emailResult.error)}` 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error declining application:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to decline application' 
    };
  }
}

export async function markAsVirtual(id: string) {
  try {
    await verifyAdminSession();
    const supabase = getSupabaseAdmin();

    // 1. Get application details
    const { data: application, error: getError } = await supabase
      .from('applications')
      .select('first_name, email')
      .eq('id', id)
      .single();

    if (getError) throw new Error(`Database error: ${getError.message}`);
    if (!application) throw new Error('Application not found');

    // 2. Update status in Supabase
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: 'Virtual' })
      .eq('id', id);

    if (updateError) throw new Error(`Update error: ${updateError.message}`);

    // 3. Send virtual confirmation email
    const emailHtml = getVirtualConfirmedEmail(application.first_name);
    const emailResult = await sendEmail({
      to: application.email,
      subject: "Your Virtual Spot is Confirmed: From Go To Goal Summit",
      html: emailHtml,
    });

    if (!emailResult.success) {
      console.error('Email failed but application was updated:', emailResult.error);
      return { 
        success: false, 
        error: `Application marked as virtual, but confirmation email failed to send: ${JSON.stringify(emailResult.error)}` 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error marking application as virtual:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to mark application as virtual' 
    };
  }
}

export async function fetchApplications() {
  await verifyAdminSession();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchInviteCodes() {
  await verifyAdminSession();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('invite_codes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function generateInviteCode(category: string = 'VIP') {
  try {
    await verifyAdminSession();
    const supabase = getSupabaseAdmin();
    // Generate a random 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    const { error } = await supabase
      .from('invite_codes')
      .insert([
        { code, category, status: 'Active' }
      ]);

    if (error) throw error;
    return { success: true, code };
  } catch (error) {
    console.error('Error generating invite code:', error);
    return { success: false, error: 'Failed to generate code' };
  }
}

export async function toggleInviteCodeStatus(id: string, currentStatus: string) {
  try {
    await verifyAdminSession();
    const supabase = getSupabaseAdmin();
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    const { error } = await supabase
      .from('invite_codes')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;
    return { success: true, newStatus };
  } catch (error) {
    console.error('Error toggling invite code:', error);
    return { success: false, error: 'Failed to toggle status' };
  }
}

export async function deleteApplication(id: string) {
  try {
    await verifyAdminSession();
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Database error: ${error.message}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting application:', error);
    return { success: false, error: error.message || 'Failed to delete application' };
  }
}

export async function deleteInviteCode(id: string) {
  try {
    await verifyAdminSession();
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('invite_codes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Database error: ${error.message}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting invite code:', error);
    return { success: false, error: error.message || 'Failed to delete invite code' };
  }
}
