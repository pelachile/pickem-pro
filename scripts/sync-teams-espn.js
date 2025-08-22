#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sync teams.json with ESPN API data
 * This script fetches team data from ESPN and updates our teams.json file
 * while preserving our internal IDs and structure
 */

const ESPN_BASE_URL = 'http://sports.core.api.espn.com/v2/sports/football/leagues/nfl';
const TEAMS_FILE_PATH = path.join(__dirname, '../data/teams.json');

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

async function getTeamGroupInfo(groupRef) {
  try {
    const groupData = await fetchJson(groupRef);
    const parentData = groupData.parent ? await fetchJson(groupData.parent.$ref) : null;
    
    return {
      conference: parentData ? parentData.abbreviation : null,
      division: groupData.name.split(' ').pop() // Extract division name (e.g., "South" from "NFC South")
    };
  } catch (error) {
    console.warn('Could not fetch group info:', error.message);
    return { conference: null, division: null };
  }
}

async function syncTeamsWithESPN() {
  console.log('Starting ESPN teams sync...');
  
  // Read current teams.json
  const teamsData = JSON.parse(fs.readFileSync(TEAMS_FILE_PATH, 'utf8'));
  const currentTeams = teamsData.teams;
  
  // Create lookup map by espn_id
  const teamsByEspnId = {};
  currentTeams.forEach(team => {
    teamsByEspnId[team.espn_id] = team;
  });
  
  // Fetch all teams from ESPN (handle pagination)
  console.log('Fetching teams list from ESPN...');
  const allTeamRefs = [];
  let page = 1;
  let hasMorePages = true;
  
  while (hasMorePages) {
    const teamsListUrl = `${ESPN_BASE_URL}/seasons/2025/teams?lang=en&region=us&page=${page}`;
    const teamsList = await fetchJson(teamsListUrl);
    
    allTeamRefs.push(...teamsList.items);
    
    hasMorePages = page < teamsList.pageCount;
    page++;
  }
  
  console.log(`Found ${allTeamRefs.length} teams from ESPN`);
  const updatedTeams = [];
  
  for (const teamRef of allTeamRefs) {
    console.log(`Fetching team data from: ${teamRef.$ref}`);
    const espnTeam = await fetchJson(teamRef.$ref);
    
    // Get division/conference info
    const groupInfo = espnTeam.groups ? await getTeamGroupInfo(espnTeam.groups.$ref) : { conference: null, division: null };
    
    // Find our existing team by ESPN ID
    const existingTeam = teamsByEspnId[espnTeam.id];
    
    if (existingTeam) {
      // Update existing team with ESPN data
      const updatedTeam = {
        ...existingTeam,
        // Update with fresh ESPN data
        name: espnTeam.name,
        location: espnTeam.location,
        nickname: espnTeam.nickname || espnTeam.name,
        abbreviation: espnTeam.abbreviation,
        display_name: espnTeam.displayName,
        short_display_name: espnTeam.shortDisplayName,
        color: `#${espnTeam.color}`,
        alternate_color: `#${espnTeam.alternateColor}`,
        slug: espnTeam.slug,
        is_active: espnTeam.isActive,
        // Update conference/division if available
        conference: groupInfo.conference || existingTeam.conference,
        division: groupInfo.division || existingTeam.division
      };
      
      // Keep local logo URL path
      updatedTeam.logo_url = `/images/teams/${espnTeam.abbreviation.toLowerCase()}.png`;
      
      updatedTeams.push(updatedTeam);
      console.log(`✓ Updated ${updatedTeam.display_name}`);
    } else {
      // Create new team entry
      const maxId = Math.max(...currentTeams.map(t => t.id));
      const newTeam = {
        id: maxId + 1,
        espn_id: espnTeam.id,
        name: espnTeam.name,
        location: espnTeam.location,
        nickname: espnTeam.nickname || espnTeam.name,
        abbreviation: espnTeam.abbreviation,
        display_name: espnTeam.displayName,
        short_display_name: espnTeam.shortDisplayName,
        color: `#${espnTeam.color}`,
        alternate_color: `#${espnTeam.alternateColor}`,
        slug: espnTeam.slug,
        is_active: espnTeam.isActive,
        logo_url: `/images/teams/${espnTeam.abbreviation.toLowerCase()}.png`,
        conference: groupInfo.conference || 'Unknown',
        division: groupInfo.division || 'Unknown'
      };
      
      // Use local logo URL path
      newTeam.logo_url = `/images/teams/${espnTeam.abbreviation.toLowerCase()}.png`;
      
      updatedTeams.push(newTeam);
      currentTeams.push(newTeam); // Add to current teams for future ID calculations
      console.log(`+ Added new team: ${newTeam.display_name}`);
    }
    
    // Add small delay to be respectful to ESPN's API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Sort by our internal ID to maintain order
  updatedTeams.sort((a, b) => a.id - b.id);
  
  // Write updated teams.json
  const updatedData = {
    teams: updatedTeams
  };
  
  fs.writeFileSync(TEAMS_FILE_PATH, JSON.stringify(updatedData, null, 2));
  console.log(`\n✅ Successfully synced ${updatedTeams.length} teams!`);
  console.log(`📁 Updated file: ${TEAMS_FILE_PATH}`);
}

// Run the sync
syncTeamsWithESPN().catch(error => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});