const BRAND_COLOR = '#c8a44e';
const DARK_COLOR = '#050505';
const GRAY_COLOR = '#f8f9fa';

const header = `
  <div style="background-color: ${DARK_COLOR}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <img src="https://reinventaf.com/reinvent-logo-white.png" alt="Reinvent Africa" style="width: 120px; height: auto; opacity: 0.8;" />
  </div>
`;

const footer = `
  <div style="background-color: ${DARK_COLOR}; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; margin-top: 40px;">
    <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">
      © 2026 Reinvent Africa Network. All rights reserved.<br />
      Google AI Office, Accra, Ghana
    </p>
  </div>
`;

export const getApplicationReceivedEmail = (firstName: string) => `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
    ${header}
    <div style="padding: 40px; background-color: white; border: 1px solid #eee; border-top: none;">
      <h1 style="font-size: 24px; color: ${DARK_COLOR}; margin-bottom: 20px;">We've received your application!</h1>
      <p>Hi ${firstName},</p>
      <p>Thank you for applying to the <strong>From Go To Goal Summit</strong>. We've received your information and our curation team is currently reviewing your application.</p>
      <p>Our goal is to ensure a high-caliber networking environment, so we take time with every review. You can expect to hear back from us within <strong>3 business days</strong>.</p>
      <div style="background-color: ${GRAY_COLOR}; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="margin-top: 0; font-size: 16px;">Summit Details:</h3>
        <p style="margin: 5px 0;">📅 <strong>Date:</strong> July 17, 2026</p>
        <p style="margin: 5px 0;">📍 <strong>Venue:</strong> Google AI Office, Accra</p>
      </div>
      <p>If you have any questions in the meantime, feel free to reply to this email.</p>
      <p>Best regards,<br />The Reinvent Africa Team</p>
    </div>
    ${footer}
  </div>
`;

export const getApprovedEmail = (firstName: string) => `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
    ${header}
    <div style="padding: 40px; background-color: white; border: 1px solid #eee; border-top: none;">
      <h1 style="font-size: 28px; color: ${BRAND_COLOR}; margin-bottom: 20px; text-align: center;">You're Officially Invited!</h1>
      <p>Hi ${firstName},</p>
      <p>Congratulations! We are thrilled to confirm your place at the <strong>From Go To Goal Summit</strong>.</p>
      <p>You have been selected to join a curated group of founders, innovators, and leaders at the Google AI Office in Accra. This is more than a summit; it's a movement towards collective excellence.</p>
      
      <div style="background-color: ${DARK_COLOR}; color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
        <h2 style="margin-top: 0; font-size: 20px; color: ${BRAND_COLOR};">EVENT CONFIRMATION</h2>
        <div style="margin: 20px 0;">
          <p style="margin: 5px 0; font-size: 18px;">📅 July 17, 2026</p>
          <p style="margin: 5px 0; font-size: 16px;">📍 Google AI Office, Accra, Ghana</p>
        </div>
        <p style="font-size: 14px; opacity: 0.7;">Your name has been added to our automatic check-in system at the venue.</p>
      </div>

      <p>We look forward to seeing you there!</p>
      <p>Best regards,<br />The Reinvent Africa Team</p>
    </div>
    ${footer}
  </div>
`;

export const getDeclinedEmail = (firstName: string) => `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
    ${header}
    <div style="padding: 40px; background-color: white; border: 1px solid #eee; border-top: none;">
      <h1 style="font-size: 24px; color: ${DARK_COLOR}; margin-bottom: 20px;">Regarding your application</h1>
      <p>Hi ${firstName},</p>
      <p>Thank you for your interest in the <strong>From Go To Goal Summit</strong>. We truly appreciate the time you took to share your journey and goals with us.</p>
      <p>After a careful review of all applications, we are unable to offer you a spot for this specific session. Due to the intimate nature of the venue, we have to make very difficult decisions to ensure the right mix of profiles.</p>
      <p>However, we were very impressed by your background and would love to keep your details on file for future Reinvent Africa events and initiatives. We hope to see you at one of our upcoming gatherings soon.</p>
      <p>Wishing you the very best in your current endeavors.</p>
      <p>Warm regards,<br />The Reinvent Africa Team</p>
    </div>
    ${footer}
  </div>
`;
