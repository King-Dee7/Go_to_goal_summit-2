import fs from 'fs';
import { getApplicationReceivedEmail, getApprovedEmail, getDeclinedEmail } from './lib/email-templates';

const receivedHtml = getApplicationReceivedEmail('Newton');
const approvedHtml = getApprovedEmail('Newton');
const declinedHtml = getDeclinedEmail('Newton');

fs.writeFileSync('public/test-received.html', receivedHtml);
fs.writeFileSync('public/test-approved.html', approvedHtml);
fs.writeFileSync('public/test-declined.html', declinedHtml);

console.log('Successfully generated test HTML files in the public directory!');
