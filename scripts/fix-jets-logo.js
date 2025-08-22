#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Download a correctly sized Jets logo
 */

async function downloadImage(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error.message);
    return false;
  }
}

async function fixJetsLogo() {
  console.log('Downloading smaller Jets logo...');
  
  // Try different sized Jets logos from ESPN
  const logoUrls = [
    'https://a.espncdn.com/i/teamlogos/nfl/500-dark/nyj.png',
    'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
    'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/nyj.png&h=200&w=200'
  ];
  
  const logoPath = path.join(__dirname, '../public/images/teams/nyj.png');
  
  for (const url of logoUrls) {
    console.log(`Trying: ${url}`);
    const success = await downloadImage(url, logoPath);
    
    if (success) {
      const stats = fs.statSync(logoPath);
      console.log(`✓ Downloaded Jets logo (${stats.size} bytes)`);
      
      // If the file is reasonable size, we're good
      if (stats.size < 100000) { // Less than 100KB
        console.log('✅ Jets logo fixed with reasonable size!');
        return;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('❌ Could not download a suitable Jets logo');
}

// Run the fix
fixJetsLogo().catch(error => {
  console.error('❌ Jets logo fix failed:', error);
  process.exit(1);
});