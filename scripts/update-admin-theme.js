const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Dark Theme Colors Replacements
content = content.replace(/bg-\[#F2F1EC\]/g, 'bg-[#0B0F19]'); // main body bg
content = content.replace(/bg-white\/80/g, 'bg-[#0B0F19]/80'); // nav
content = content.replace(/bg-white/g, 'bg-[#1A1A1A]'); // cards
content = content.replace(/bg-\[#EAE5DB\]/g, 'bg-white/10'); 
content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#1A1A1A]'); // tables
content = content.replace(/bg-\[#F9F9F7\]/g, 'bg-[#222222]'); // striped tables
content = content.replace(/bg-gray-50\/30/g, 'bg-[#2A2A2A]'); // table header
content = content.replace(/bg-gray-50/g, 'bg-white/5');

content = content.replace(/text-gray-900/g, 'text-gray-100');
content = content.replace(/text-gray-800/g, 'text-gray-200');
content = content.replace(/text-gray-700/g, 'text-gray-300');
content = content.replace(/text-gray-600/g, 'text-gray-400');
content = content.replace(/text-gray-500/g, 'text-gray-400');
content = content.replace(/text-gray-400/g, 'text-gray-500');

content = content.replace(/border-\[#DFD9CF\]\/30/g, 'border-white/10');
content = content.replace(/border-\[#DFD9CF\]\/80/g, 'border-white/20');
content = content.replace(/border-gray-50/g, 'border-white/5');
content = content.replace(/border-gray-100\/80/g, 'border-white/10');
content = content.replace(/border-gray-100/g, 'border-white/10');
content = content.replace(/border-gray-200\/60/g, 'border-white/10');
content = content.replace(/border-gray-200/g, 'border-white/10');

// Fix a few specific text colors for visibility on dark mode
content = content.replace(/text-\[#666A68\]/g, 'text-gray-400');
content = content.replace(/text-\[#1a3b2b\]/g, 'text-[#c8a44e]');
content = content.replace(/bg-\[#1a3b2b\]\/5/g, 'bg-[#c8a44e]/10');
content = content.replace(/border-\[#1a3b2b\]\/15/g, 'border-[#c8a44e]/20');
content = content.replace(/ring-\[#1a3b2b\]/g, 'ring-[#c8a44e]');

// 2. Typography Updates
// Replace syne with open-sans for headers
content = content.replace(/font-syne/g, 'font-open-sans');
// Replace sans with roboto for body
content = content.replace(/font-sans/g, 'font-roboto');

// Font Sizes and Weights
content = content.replace(/text-\[18px\]/g, 'text-[16px]');
content = content.replace(/text-sm/g, 'text-[16px]');
content = content.replace(/font-medium/g, 'font-normal');

// 3. Update the Card Icons to match the Total Applications arrow
// We use regex to replace all inner svgs of those specific divs
const svgsToReplace = [
  /<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>\s*<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" \/>\s*<\/svg>/g,
  /<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>\s*<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" \/>\s*<\/svg>/g,
  /<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>\s*<path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" \/>\s*<\/svg>/g
];

const targetArrowSVG = `<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7h-10M17 7v10" />
                    </svg>`;

svgsToReplace.forEach(regex => {
  content = content.replace(regex, targetArrowSVG);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated app/admin/page.tsx with dark theme, typography, and icons.');
