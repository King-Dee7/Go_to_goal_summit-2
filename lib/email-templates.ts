const DARK_COLOR = '#050505';
const GRAY_COLOR = '#f8f9fa';

const wrapEmail = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .email-container {
        border-left: none !important;
        border-right: none !important;
        border-radius: 0 !important;
        width: 100% !important;
      }
      .content-padding {
        padding: 30px 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <div style="background-color: #ffffff; padding: 20px 0;">
    <div class="email-container" style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 4px solid #000000; box-sizing: border-box; text-align: left;">
      <!-- Colorful top bar -->
      <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td width="25%" height="12" style="background-color: #F6C10E; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #0B56A0; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #2F8E49; font-size: 1px; line-height: 1px;">&nbsp;</td>
          <td width="25%" height="12" style="background-color: #DE0510; font-size: 1px; line-height: 1px;">&nbsp;</td>
        </tr>
      </table>
      
      <!-- Main Content -->
      <div class="content-padding" style="padding: 40px;">
        <div style="margin-bottom: 30px;">
          <img src="https://reinventaf.com/reinvent-logo.png" alt="Reinvent Africa Network" style="width: 200px; height: auto;" />
        </div>
        <div style="color: #333; line-height: 1.6; font-size: 16px; min-height: 350px;">
          ${content}
        </div>
        <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: left;">
          © 2026 Reinvent Africa Network. All rights reserved.<br />
          6th March, Ave,<br />
          Tantra, Accra, Ghana.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
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
      <p style="margin: 10px 0; font-size: 18px;">🕒 Starts at 5:00 PM GMT</p>
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
  <p>After a careful review of all applications, we are unable to offer you an in-person invitation for this session. Due to the intimate nature of the venue, we have to make very difficult decisions to ensure the right mix of profiles.</p>
  
  <div style="background-color: ${GRAY_COLOR}; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #509e71;">
    <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px; color: ${DARK_COLOR};">Join Us Virtually</h3>
    <p style="margin: 0; font-size: 15px; line-height: 1.6;">
      However, we would love to have you participate! Because of the high volume of interest, we are offering full <strong>online attendance</strong>. We will share the virtual streaming links and details with you closer to the event date so you can tune in and join the conversations.
    </p>
  </div>

  <p>We are very impressed by your background and would love to keep your details on file for future Reinvent Africa events and initiatives. We hope to connect with you online on July 17!</p>
  <p>Wishing you the very best in your current endeavors.</p>
  <p style="margin-top: 30px;">Warm regards,<br /><strong>The Reinvent Africa Team</strong></p>
`);

export const getVirtualConfirmedEmail = (firstName: string) => wrapEmail(`
  <h1 style="font-size: 26px; color: #050505; margin-bottom: 20px; font-weight: 700;">Your Virtual Spot is Confirmed!</h1>
  <p>Hi ${firstName},</p>
  <p>We've successfully updated your ticket for the <strong>From Go To Goal Summit</strong> to <strong>Virtual Attendance</strong>.</p>
  <p>While we won't be seeing you in person at the Google AI Office, we are excited to have you join our global community online. You will have full access to the live stream, keynote sessions, and interactive virtual components.</p>
  
  <div style="background-color: ${GRAY_COLOR}; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #0B56A0;">
    <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; color: ${DARK_COLOR};">Virtual Attendance Details:</h3>
    <p style="margin: 8px 0;">📅 <strong>Date:</strong> July 17, 2026</p>
    <p style="margin: 8px 0;">📍 <strong>Access:</strong> Online Stream (Link to be sent closer to the date)</p>
  </div>

  <p>We will share the official live streaming link and virtual schedule with you as we get closer to the event date. If you have any other questions, feel free to reply directly to this email.</p>
  <p>Looking forward to connecting with you online!</p>
  <p style="margin-top: 30px;">Warm regards,<br /><strong>The Reinvent Africa Team</strong></p>
`);

export const getUpdateTimeEmail = (firstName: string) => wrapEmail(`
  <h1 style="font-size: 24px; color: #050505; margin-bottom: 20px; font-weight: 700;">Event Time Update: From Go To Goal Summit</h1>
  <p>Hi ${firstName},</p>
  <p>We are reaching out with an important update regarding the <strong>From Go To Goal Summit</strong> on July 17, 2026.</p>
  <p>Please note that the event will officially start at <strong>5:00 PM GMT</strong>.</p>
  <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #F6C10E;">
    <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; color: #050505;">Event Reminder</h3>
    <p style="margin: 8px 0;">📅 <strong>Date:</strong> July 17, 2026</p>
    <p style="margin: 8px 0;">🕒 <strong>Time:</strong> 5:00 PM GMT</p>
    <p style="margin: 8px 0;">📍 <strong>Venue:</strong> Google AI Office, Accra (or Online Stream for Virtual attendees)</p>
  </div>
  <p>We look forward to seeing you there!</p>
  <p style="margin-top: 30px;">Best regards,<br /><strong>The Reinvent Africa Team</strong></p>
`);
