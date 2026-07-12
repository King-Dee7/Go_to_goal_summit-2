'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { appendToSheet } from '@/lib/google-sheets';
import { addToMailerLite } from '@/lib/mailerlite';
import { sendEmail } from '@/lib/email';
import { getApplicationReceivedEmail, getVirtualRegistrationEmail } from '@/lib/email-templates';

type ApplicationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  socialPlatform: string;
  socialHandle: string;
  category: string;
  role: string;
  company: string;
  university: string;
  fieldOfStudy: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  isVirtual?: boolean;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }
  return 'Unknown error occurred';
}

export async function submitApplication(formData: ApplicationFormData) {
  const syncErrors: string[] = [];

  try {
    const supabase = getSupabaseAdmin();

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
          status: formData.isVirtual ? 'Virtual' : 'Under Review',
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
        formData.isVirtual ? 'Virtual' : 'Under Review',
      ];
      await appendToSheet(sheetRow);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Sheets Sync Error:', message);
      syncErrors.push(`Google Sheets: ${message}`);
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
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('MailerLite Sync Error:', message);
      syncErrors.push(`MailerLite: ${message}`);
    }

    try {
      const emailHtml = formData.isVirtual 
        ? getVirtualRegistrationEmail(formData.firstName)
        : getApplicationReceivedEmail(formData.firstName);
        
      const emailSubject = formData.isVirtual
        ? "You're Registered for Virtual Access - From Go To Goal Summit"
        : "We've received your application - From Go To Goal Summit";

      const emailResult = await sendEmail({
        to: formData.email,
        subject: emailSubject,
        html: emailHtml,
      });
      
      if (!emailResult.success) {
        syncErrors.push(`Email: ${getErrorMessage(emailResult.error)}`);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Receipt Email Error:', message);
      syncErrors.push(`Email Exception: ${message}`);
    }

    // 5. If there were any sync errors, update the Supabase record with the log
    if (syncErrors.length > 0) {
      await supabase
        .from('applications')
        .update({ sync_errors: syncErrors.join(' | ') })
        .eq('id', application.id);
    }

    return { success: true };
  } catch (error) {
    console.error('Critical Submission Error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}
