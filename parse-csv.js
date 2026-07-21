const fs = require('fs');

function parseCSV(content) {
  const lines = content.split('\n');
  const results = [];
  
  // Headers are at line 6 (index 5)
  for (let i = 6; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Basic CSV split
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' && line[j+1] === '"') {
        current += '"';
        j++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    const firstName = parts[1];
    const email = parts[4];
    const status = parts[7];
    
    if (email && email.includes('@') && status === 'Confirmed') {
      results.push({ firstName, email });
    }
  }
  return results;
}

const content = fs.readFileSync('AICC Event Guest List Template_From Go to Goal Summit -  Guest List.csv', 'utf8');
const attendees = parseCSV(content);

console.log(`Found ${attendees.length} confirmed attendees in the CSV:`);
attendees.forEach((a, i) => {
  console.log(`${i + 1}. ${a.firstName} (${a.email})`);
});
