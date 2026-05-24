const DARK_COLOR = '#050505';
const GRAY_COLOR = '#f8f9fa';

const wrapEmail = (content: string) => `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 4px solid #000000; box-sizing: border-box;">
    <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; min-height: 600px;">
      <tr>
        <td width="40" height="23%" style="width: 40px; height: 23%; padding: 0; background-color: #F6C10E; border-radius: 0 16px 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td>
        <td rowspan="7" valign="top" style="padding: 40px 40px 40px 40px; background-color: #ffffff;">
          <div style="margin-bottom: 40px;">
            <img src="https://reinventaf.com/reinvent-logo.png" alt="Reinvent Africa Network" style="width: 220px; height: auto;" />
          </div>
          <div style="color: #333; line-height: 1.6; font-size: 16px; min-height: 350px;">
            ${content}
          </div>
          <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: left;">
            © 2026 Reinvent Africa Network. All rights reserved.<br />
            6th March, Ave,<br />
            Tantra, Accra, Ghana.
          </div>
        </td>
      </tr>
      <tr><td style="height: 12px; background-color: #ffffff; font-size: 0; line-height: 0;">&nbsp;</td></tr>
      <tr><td width="40" height="23%" style="width: 40px; height: 23%; padding: 0; background-color: #0B56A0; border-radius: 0 16px 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
      <tr><td style="height: 12px; background-color: #ffffff; font-size: 0; line-height: 0;">&nbsp;</td></tr>
      <tr><td width="40" height="23%" style="width: 40px; height: 23%; padding: 0; background-color: #2F8E49; border-radius: 0 16px 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
      <tr><td style="height: 12px; background-color: #ffffff; font-size: 0; line-height: 0;">&nbsp;</td></tr>
      <tr><td width="40" height="23%" style="width: 40px; height: 23%; padding: 0; background-color: #DE0510; border-radius: 0 16px 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
    </table>
  </div>
`;

export const getApplicationReceivedEmail = (firstName: string) => wrapEmail(`
  <h1 style="font-size: 24px; color: ${DARK_COLOR}; margin-bottom: 20px; font-weight: 700;">We've received your application!</h1>
  <p>Hi ${firstName},</p>
  <p>Thank you for applying to the <strong>From Go To Goal Summit</strong>. We've received your information and our curation team is currently reviewing your application.</p>
  <p>Our goal is to ensure a high-caliber networking environment, so we take time with every review. You can expect to hear back from us within <strong>3 business days</strong>.</p>
  <div style="background-color: ${GRAY_COLOR}; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #0B56A0;">
    <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; color: ${DARK_COLOR};">Summit Details:</h3>
    <p style="margin: 8px 0;">📅 <strong>Date:</strong> July 17, 2026</p>
    <p style="margin: 8px 0;">📍 <strong>Venue:</strong> Google AI Office, Accra</p>
  </div>
  <p>If you have any questions in the meantime, feel free to reply to this email.</p>
  <p style="margin-top: 30px;">Best regards,<br /><strong>The Reinvent Africa Team</strong></p>
`);

export const getApprovedEmail = (firstName: string) => wrapEmail(`
  <h1 style="font-size: 28px; color: #509e71; margin-bottom: 20px; font-weight: 700;">You're Officially Invited!</h1>
  <p>Hi ${firstName},</p>
  <p>Congratulations! We are thrilled to confirm your place at the <strong>From Go To Goal Summit</strong>.</p>
  <p>You have been selected to join a curated group of founders, innovators, and leaders at the Google AI Office in Accra. This is more than a summit; it's a movement towards collective excellence.</p>
  
  <div style="background-color: ${DARK_COLOR}; color: white; padding: 35px; border-radius: 16px; margin: 35px 0; text-align: center;">
    <h2 style="margin-top: 0; font-size: 18px; color: #F6C10E; letter-spacing: 1px; text-transform: uppercase;">Event Confirmation</h2>
    <div style="margin: 25px 0;">
      <p style="margin: 10px 0; font-size: 20px; font-weight: 600;">📅 July 17, 2026</p>
      <p style="margin: 10px 0; font-size: 18px;">📍 Google AI Office, Accra, Ghana</p>
    </div>
    <div style="width: 50px; height: 2px; background-color: rgba(255,255,255,0.2); margin: 0 auto 20px auto;"></div>
    <p style="font-size: 14px; opacity: 0.8; margin-bottom: 0;">Your name has been added to our automatic check-in system at the venue.</p>
  </div>

  <p>We look forward to seeing you there!</p>
  <p style="margin-top: 30px;">Best regards,<br /><strong>The Reinvent Africa Team</strong></p>
`);

export const getDeclinedEmail = (firstName: string) => wrapEmail(`
  <h1 style="font-size: 24px; color: ${DARK_COLOR}; margin-bottom: 20px; font-weight: 700;">Regarding your application</h1>
  <p>Hi ${firstName},</p>
  <p>Thank you for your interest in the <strong>From Go To Goal Summit</strong>. We truly appreciate the time you took to share your journey and goals with us.</p>
  <p>After a careful review of all applications, we are unable to offer you a spot for this specific session. Due to the intimate nature of the venue, we have to make very difficult decisions to ensure the right mix of profiles.</p>
  <p>However, we were very impressed by your background and would love to keep your details on file for future Reinvent Africa events and initiatives. We hope to see you at one of our upcoming gatherings soon.</p>
  <p>Wishing you the very best in your current endeavors.</p>
  <p style="margin-top: 30px;">Warm regards,<br /><strong>The Reinvent Africa Team</strong></p>
`);
