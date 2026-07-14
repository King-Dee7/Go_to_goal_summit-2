import fs from 'fs';
import { getApplicationReceivedEmail, getApprovedEmail, getDeclinedEmail, getRSVPEmail } from './lib/email-templates';

const receivedHtml = getApplicationReceivedEmail('Newton');
const approvedHtml = getApprovedEmail('Newton');
const declinedHtml = getDeclinedEmail('Newton');
const rsvpHtml = getRSVPEmail('Newton', 'test-app-id-1234');

fs.writeFileSync('public/test-received.html', receivedHtml);
fs.writeFileSync('public/test-approved.html', approvedHtml);
fs.writeFileSync('public/test-declined.html', declinedHtml);
fs.writeFileSync('public/test-rsvp.html', rsvpHtml);

console.log('Successfully generated test HTML files in the public directory!');
