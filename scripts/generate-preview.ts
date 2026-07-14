import fs from 'fs';
import { getApprovedEmail } from '../lib/email-templates';

const html = getApprovedEmail('John Doe');
fs.writeFileSync('preview-approval-email.html', html);
console.log('Preview generated at preview-approval-email.html');
