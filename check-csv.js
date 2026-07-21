const fs = require('fs');
const csv = fs.readFileSync('AICC Event Guest List Template_From Go to Goal Summit -  Guest List.csv', 'utf8');

const rows = csv.split('\n');
const headers = rows[5].split(',');
let confirmedCount = 0;
let checkedInCount = 0;

rows.slice(6).forEach(row => {
  const cols = row.split(',');
  if (cols.length > 8) {
    const preStatus = cols[7];
    const postStatus = cols[8];
    if (preStatus === 'Confirmed') confirmedCount++;
    if (postStatus && postStatus.trim() !== '') checkedInCount++;
  }
});

console.log(`Confirmed: ${confirmedCount}, Checked-In: ${checkedInCount}`);
