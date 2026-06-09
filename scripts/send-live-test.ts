import { sendEmail } from '../lib/email';
import { getApplicationReceivedEmail } from '../lib/email-templates';

async function main() {
  const emailHtml = getApplicationReceivedEmail('Newton');
  
  console.log('Sending test email...');
  const result = await sendEmail({
    to: ['dariusasante07@gmail.com', 'kingdarius025@icloud.com'],
    subject: "We've received your application - From Go To Goal Summit",
    html: emailHtml,
  });

  if (result.success) {
    console.log('Email sent successfully:', result.data);
  } else {
    console.error('Failed to send email:', result.error);
  }
}

main();
