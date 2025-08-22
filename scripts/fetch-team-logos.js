import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Read the teams.json file
const teamsData = JSON.parse(fs.readFileSync('./data/teams.json', 'utf8'));

// Function to download image from URL
async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

// Function to fetch logo URL and download image for a single team
async function fetchAndDownloadTeamLogo(team) {
  try {
    const url = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/teams/${team.espn_id}?lang=en&region=us`;
    const response = await axios.get(url);
    
    // Check if logos array exists and has items
    if (response.data.logos && response.data.logos.length > 0) {
      const logoUrl = response.data.logos[0].href;
      
      // Create filename using team abbreviation
      const filename = `${team.abbreviation.toLowerCase()}.png`;
      const filepath = path.join('./public/images/teams', filename);
      
      // Download the image
      await downloadImage(logoUrl, filepath);
      
      // Return local path for the team object
      return `/images/teams/${filename}`;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching/downloading logo for ${team.display_name}:`, error.message);
    return null;
  }
}

// Function to update all teams with downloaded logos
async function updateTeamLogos() {
  console.log('Starting to fetch and download team logos from ESPN API...\n');
  
  let downloadedCount = 0;
  let failedCount = 0;
  
  // Process teams in batches to avoid rate limiting
  const batchSize = 3; // Reduced batch size since we're downloading files
  const teams = teamsData.teams;
  
  for (let i = 0; i < teams.length; i += batchSize) {
    const batch = teams.slice(i, i + batchSize);
    
    // Process batch in parallel
    const promises = batch.map(async (team) => {
      console.log(`Fetching and downloading logo for ${team.display_name} (${team.abbreviation})...`);
      const localLogoPath = await fetchAndDownloadTeamLogo(team);
      
      if (localLogoPath) {
        team.logo_url = localLogoPath;
        downloadedCount++;
        console.log(`✓ Downloaded logo for ${team.display_name} -> ${localLogoPath}`);
      } else {
        failedCount++;
        console.log(`✗ Failed to download logo for ${team.display_name}`);
      }
      
      return team;
    });
    
    // Wait for batch to complete
    await Promise.all(promises);
    
    // Add a small delay between batches to be respectful to the API
    if (i + batchSize < teams.length) {
      console.log('\nWaiting before next batch...\n');
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  // Write the updated data back to teams.json
  fs.writeFileSync('./data/teams.json', JSON.stringify(teamsData, null, 2));
  
  console.log('\n========================================');
  console.log(`Logo download complete!`);
  console.log(`✓ Successfully downloaded: ${downloadedCount} team logos`);
  console.log(`✗ Failed downloads: ${failedCount} teams`);
  console.log('========================================\n');
  console.log('Team logos saved to: public/images/teams/');
  console.log('teams.json has been updated with local image paths.');
}

// Run the update
updateTeamLogos().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});