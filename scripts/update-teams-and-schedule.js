#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Update teams-and-schedule.json with fresh team data from teams.json
 * This preserves the existing file structure while updating team information
 */

const TEAMS_FILE_PATH = path.join(__dirname, '../data/teams.json');
const TEAMS_SCHEDULE_FILE_PATH = path.join(__dirname, '../data/teams-and-schedule.json');

async function updateTeamsAndSchedule() {
  console.log('Updating teams-and-schedule.json with fresh team data...');
  
  // Read current files
  const teamsData = JSON.parse(fs.readFileSync(TEAMS_FILE_PATH, 'utf8'));
  const teamsScheduleData = JSON.parse(fs.readFileSync(TEAMS_SCHEDULE_FILE_PATH, 'utf8'));
  
  // Create lookup map by espn_id for quick access to updated team data
  const teamsByEspnId = {};
  teamsData.teams.forEach(team => {
    teamsByEspnId[team.espn_id] = team;
  });
  
  // Update teams in the "all" array
  const updatedAllTeams = teamsScheduleData.teams.all.map(team => {
    const updatedTeam = teamsByEspnId[team.espn_id];
    if (updatedTeam) {
      console.log(`✓ Updated ${updatedTeam.display_name}`);
      return {
        ...team,
        ...updatedTeam,
        // Preserve the original structure fields if they exist
        is_active: updatedTeam.is_active
      };
    } else {
      console.warn(`⚠ Team with ESPN ID ${team.espn_id} not found in updated teams.json`);
      return team;
    }
  });
  
  // Add any missing teams from teams.json
  const existingEspnIds = new Set(teamsScheduleData.teams.all.map(t => t.espn_id));
  const missingTeams = teamsData.teams.filter(team => !existingEspnIds.has(team.espn_id));
  
  missingTeams.forEach(team => {
    console.log(`+ Adding missing team: ${team.display_name}`);
    updatedAllTeams.push(team);
  });
  
  // Function to update teams in conference/division structure
  function updateConferenceDivisionTeams(confDivTeams) {
    if (Array.isArray(confDivTeams)) {
      return confDivTeams.map(team => {
        const updatedTeam = teamsByEspnId[team.espn_id];
        if (updatedTeam) {
          return {
            ...team,
            ...updatedTeam,
            is_active: updatedTeam.is_active
          };
        }
        return team;
      });
    }
    return confDivTeams;
  }
  
  // Update teams in conference/division structure
  const updatedTeamsData = {
    ...teamsScheduleData.teams,
    all: updatedAllTeams
  };
  
  // Update AFC and NFC conference structures if they exist
  if (updatedTeamsData.AFC) {
    Object.keys(updatedTeamsData.AFC).forEach(division => {
      updatedTeamsData.AFC[division] = updateConferenceDivisionTeams(updatedTeamsData.AFC[division]);
    });
  }
  
  if (updatedTeamsData.NFC) {
    Object.keys(updatedTeamsData.NFC).forEach(division => {
      updatedTeamsData.NFC[division] = updateConferenceDivisionTeams(updatedTeamsData.NFC[division]);
    });
  }
  
  // Update meta information
  const updatedMeta = {
    ...teamsScheduleData.meta,
    total_teams: updatedAllTeams.length,
    export_date: new Date().toISOString()
  };
  
  // Function to update team data in games
  function updateTeamInGame(team) {
    const updatedTeam = teamsByEspnId[team.espn_id];
    if (updatedTeam) {
      return {
        ...team,
        ...updatedTeam,
        is_active: updatedTeam.is_active
      };
    }
    return team;
  }

  // Update teams in schedule games
  const updatedSchedule = { ...teamsScheduleData.schedule };
  
  if (updatedSchedule.all_games) {
    updatedSchedule.all_games = updatedSchedule.all_games.map(game => ({
      ...game,
      home_team: updateTeamInGame(game.home_team),
      away_team: updateTeamInGame(game.away_team)
    }));
  }
  
  if (updatedSchedule.by_week) {
    Object.keys(updatedSchedule.by_week).forEach(week => {
      updatedSchedule.by_week[week] = updatedSchedule.by_week[week].map(game => ({
        ...game,
        home_team: updateTeamInGame(game.home_team),
        away_team: updateTeamInGame(game.away_team)
      }));
    });
  }

  // Create updated file structure
  const updatedData = {
    ...teamsScheduleData,
    meta: updatedMeta,
    teams: updatedTeamsData,
    schedule: updatedSchedule
  };
  
  // Write updated file
  fs.writeFileSync(TEAMS_SCHEDULE_FILE_PATH, JSON.stringify(updatedData, null, 2));
  
  console.log(`\\n✅ Successfully updated teams-and-schedule.json!`);
  console.log(`📊 Total teams: ${updatedAllTeams.length}`);
  console.log(`📁 Updated file: ${TEAMS_SCHEDULE_FILE_PATH}`);
}

// Run the update
updateTeamsAndSchedule().catch(error => {
  console.error('❌ Update failed:', error);
  process.exit(1);
});