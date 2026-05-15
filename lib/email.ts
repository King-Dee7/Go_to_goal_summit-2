import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export const sendEmail = async ({ to, subject, html, replyTo = 'info@reinventaf.com' }: SendEmailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Reinvent Africa <info@reinventaf.com>',
      to,
      subject,
      html,
      replyTo: replyTo,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
