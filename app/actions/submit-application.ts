'use server';

import { supabase } from '@/lib/supabase';
import { appendToSheet } from '@/lib/google-sheets';
import { addToMailerLite } from '@/lib/mailerlite';

export async function submitApplication(formData: any) {
  let syncErrors: string[] = [];

  try {
    // 1. Push to Supabase (Initial Insert)
    const { data: application, error: supabaseError } = await supabase
      .from('applications')
      .insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          social_platform: formData.socialPlatform,
          social_handle: formData.socialHandle,
          category: formData.category,
          current_role: formData.role,
          company: formData.company,
          university: formData.university,
          field_of_study: formData.fieldOfStudy,
          q1_passion: formData.q1,
          q2_differently: formData.q2,
          q3_future_goals: formData.q3,
          q4_intentions: formData.q4,
          q5_changed_belief: formData.q5,
          status: 'Under Review',
        },
      ])
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    // 2. Push to Google Sheets (Catch errors individually)
    try {
      const sheetRow = [
        new Date().toISOString(),
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.socialPlatform,
        formData.socialHandle,
        formData.category,
        formData.role || '',
        formData.company || '',
        formData.university || '',
        formData.fieldOfStudy || '',
        formData.q1,
        formData.q2,
        formData.q3,
        formData.q4,
        formData.q5,
        'Under Review',
      ];
      await appendToSheet(sheetRow);
    } catch (err: any) {
      console.error('Sheets Sync Error:', err.message);
      syncErrors.push(`Google Sheets: ${err.message}`);
    }

    // 3. Push to MailerLite (Catch errors individually)
    try {
      await addToMailerLite({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        fields: {
          last_name: formData.lastName,
          phone: formData.phone,
          company: formData.company || formData.university,
          role: formData.role || formData.category,
        },
      });
    } catch (err: any) {
      console.error('MailerLite Sync Error:', err.message);
      syncErrors.push(`MailerLite: ${err.message}`);
    }

    // 4. If there were any sync errors, update the Supabase record with the log
    if (syncErrors.length > 0) {
      await supabase
        .from('applications')
        .update({ sync_errors: syncErrors.join(' | ') })
        .eq('id', application.id);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Critical Submission Error:', error);
    return { success: false, error: error.message };
  }
}
