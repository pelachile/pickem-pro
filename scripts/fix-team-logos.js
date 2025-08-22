#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Download correct logos from ESPN for specific problematic teams
 * This will replace the corrupted/mixed-up logo files with correct ones
 */

const PROBLEMATIC_TEAMS = [
  { espn_id: '20', abbreviation: 'NYJ', name: 'New York Jets' },      // Jets
  { espn_id: '2', abbreviation: 'BUF', name: 'Buffalo Bills' },       // Bills
  { espn_id: '11', abbreviation: 'IND', name: 'Indianapolis Colts' }, // Colts
  { espn_id: '29', abbreviation: 'CAR', name: 'Carolina Panthers' }   // Panthers
];

async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    throw error;
  }
}

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

async function fixTeamLogos() {
  console.log('Downloading correct logos for problematic teams...\n');
  
  for (const team of PROBLEMATIC_TEAMS) {
    console.log(`Processing ${team.name} (${team.abbreviation})...`);
    
    try {
      // Fetch team data from ESPN
      const espnUrl = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/teams/${team.espn_id}?lang=en&region=us`;
      const espnTeam = await fetchJson(espnUrl);
      
      // Get team logos
      if (espnTeam.logos && espnTeam.logos.length > 0) {
        // Try to find a good logo (prefer larger ones)
        const logo = espnTeam.logos.find(l => l.width >= 500) || espnTeam.logos[0];
        
        if (logo && logo.href) {
          const logoPath = path.join(__dirname, '../public/images/teams', `${team.abbreviation.toLowerCase()}.png`);
          
          console.log(`  Downloading from: ${logo.href}`);
          const success = await downloadImage(logo.href, logoPath);
          
          if (success) {
            const stats = fs.statSync(logoPath);
            console.log(`  ✓ Downloaded ${team.name} logo (${stats.size} bytes)`);
          } else {
            console.log(`  ✗ Failed to download ${team.name} logo`);
          }
        } else {
          console.log(`  ⚠ No logo URL found for ${team.name}`);
        }
      } else {
        console.log(`  ⚠ No logos found for ${team.name}`);
      }
      
      // Add delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`  ✗ Error processing ${team.name}:`, error.message);
    }
    
    console.log('');
  }
  
  console.log('✅ Logo fix complete!');
}

// Run the fix
fixTeamLogos().catch(error => {
  console.error('❌ Logo fix failed:', error);
  process.exit(1);
});