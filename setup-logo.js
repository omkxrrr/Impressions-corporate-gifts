import fs from 'fs';
import path from 'path';

const source = 'C:/Users/datta/.gemini/antigravity/brain/39b218f8-04d2-4e11-ab26-b9df84cd71a0/.user_uploaded/media_1791097411143.png';
const destDir = 'C:/Users/datta/OneDrive/Desktop/Impressions/public';
const dest = path.join(destDir, 'logo.png');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  fs.copyFileSync(source, dest);
  console.log('✅ New transparent PNG Logo successfully copied to public/logo.png!');
} catch (err) {
  console.error('❌ Error copying logo:', err.message);
}
