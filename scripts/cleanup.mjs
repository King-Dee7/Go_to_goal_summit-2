import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Unwanted temporary files that should be deleted
const tempFiles = [
  'remove-bg.js',
  'update-light-theme.js',
  'update-ui.js',
  'compile_output.txt',
  'hero_diff.txt'
];

console.log('Starting workspace cleanup...');

let deletedCount = 0;

tempFiles.forEach((file) => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted temporary file: ${file}`);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Error deleting ${file}:`, error);
    }
  }
});

if (deletedCount === 0) {
  console.log('No temporary files found to clean.');
} else {
  console.log(`Cleanup complete! Deleted ${deletedCount} temporary file(s).`);
}
