/**
 * ESPN Data Sync Lambda Function
 * 
 * Fetches live game data from ESPN API and updates AWS DynamoDB
 * Runs every 5 minutes during active games only
 * Respects ESPN API rate limits with delays between calls
 */

import type { ScheduledHandler } from 'aws-lambda';
import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../storage/amplify_outputs.json';

// Configure Amplify
Amplify.configure(outputs);
const client = generateClient<Schema>();

interface ESPNGame {
  id: string;
  status: {
    type: {
      name: string; // 'STATUS_SCHEDULED', 'STATUS_IN_PROGRESS', 'STATUS_FINAL'
      state: string;
      completed: boolean;
    };
    period: number;
    clock: number;
    displayClock: string;
  };
  competitions: Array<{
    competitors: Array<{
      id: string;
      team: {
        id: string;
        abbreviation: string;
      };
      homeAway: 'home' | 'away';
      score: string;
    }>;
    status: {
      type: {
        name: string;
        description: string;
      };
    };
  }>;
  season: {
    year: number;
  };
  week: {
    number: number;
  };
}

interface ESPNTeam {
  id: string;
  record: {
    items: Array<{
      stats: Array<{
        name: string;
        value: number;
      }>;
    }>;
  };
}

/**
 * Maps ESPN game status to our enum values
 */
function mapGameStatus(espnStatus: string): 'scheduled' | 'in_progress' | 'final' | 'postponed' | 'cancelled' {
  switch (espnStatus) {
    case 'STATUS_SCHEDULED':
      return 'scheduled';
    case 'STATUS_IN_PROGRESS':
      return 'in_progress';
    case 'STATUS_FINAL':
      return 'final';
    case 'STATUS_POSTPONED':
      return 'postponed';
    case 'STATUS_CANCELLED':
      return 'cancelled';
    default:
      return 'scheduled';
  }
}

/**
 * Maps ESPN period number to quarter string
 */
function mapQuarter(period: number): string {
  switch (period) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    case 4: return '4th';
    case 5: return 'OT';
    default: return `${period}`;
  }
}

/**
 * Fetches current games from ESPN API
 * Only fetches games that are in progress or recently completed
 */
async function fetchActiveGamesFromESPN(): Promise<ESPNGame[]> {
  try {
    // Current year and week - in production, this would be more sophisticated
    const currentYear = new Date().getFullYear();
    
    // ESPN NFL scoreboard API endpoint
    const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`;
    
    console.log('Fetching games from ESPN:', espnUrl);
    
    const response = await fetch(espnUrl);
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filter for games that need updates (in progress or recently finished)
    const activeGames = data.events?.filter((game: ESPNGame) => {
      const status = game.status.type.name;
      return status === 'STATUS_IN_PROGRESS' || 
             (status === 'STATUS_FINAL' && 
              new Date().getTime() - new Date(game.competitions[0]?.status?.type?.description || 0).getTime() < 6 * 60 * 1000); // Within 6 minutes of completion
    }) || [];
    
    console.log(`Found ${activeGames.length} active games to update`);
    return activeGames;
    
  } catch (error) {
    console.error('Error fetching games from ESPN:', error);
    throw error;
  }
}

/**
 * Updates game status in DynamoDB
 */
async function updateGameStatus(game: ESPNGame): Promise<void> {
  try {
    const competition = game.competitions[0];
    if (!competition) return;
    
    // Find home and away teams
    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
    
    if (!homeTeam || !awayTeam) {
      console.warn(`Missing team data for game ${game.id}`);
      return;
    }
    
    const gameStatus = {
      espn_id: game.id,
      home_score: parseInt(homeTeam.score) || 0,
      away_score: parseInt(awayTeam.score) || 0,
      status: mapGameStatus(game.status.type.name),
      quarter: mapQuarter(game.status.period),
      time_remaining: game.status.displayClock || '0:00',
      game_status_detail: competition.status.type.description || '',
      has_started: game.status.type.name !== 'STATUS_SCHEDULED',
      has_finished: game.status.type.completed,
      last_updated: new Date().toISOString(),
      season_year: game.season.year,
      week: game.week.number,
    };
    
    // Create or update game status
    try {
      await client.models.GameStatus.create(gameStatus);
    } catch (error) {
      // If exists, update it
      await client.models.GameStatus.update(gameStatus);
    }
    console.log(`Updated game ${game.id}: ${awayTeam.team.abbreviation} @ ${homeTeam.team.abbreviation}`);
    
    // Add small delay to respect ESPN API
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    
  } catch (error) {
    console.error(`Error updating game ${game.id}:`, error);
  }
}

/**
 * Fetches and updates team records from ESPN
 */
async function updateTeamRecords(year: number): Promise<void> {
  try {
    // ESPN teams API
    const teamsUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams`;
    
    console.log('Fetching team records from ESPN');
    
    const response = await fetch(teamsUrl);
    if (!response.ok) {
      console.warn(`ESPN teams API error: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    const teams = data.sports?.[0]?.leagues?.[0]?.teams || [];
    
    for (const teamData of teams) {
      try {
        const team = teamData.team;
        if (!team.record?.items?.[0]?.stats) continue;
        
        const stats = team.record.items[0].stats;
        const wins = stats.find((s: any) => s.name === 'wins')?.value || 0;
        const losses = stats.find((s: any) => s.name === 'losses')?.value || 0;
        const ties = stats.find((s: any) => s.name === 'ties')?.value || 0;
        
        const teamRecord = {
          espn_id: team.id,
          season_year: year,
          wins,
          losses,
          ties,
          win_percentage: wins + losses + ties > 0 ? wins / (wins + losses + ties) : 0,
          last_updated: new Date().toISOString(),
        };
        
        try {
          await client.models.TeamRecord.create(teamRecord);
        } catch (error) {
          // If exists, update it
          await client.models.TeamRecord.update(teamRecord);
        }
        console.log(`Updated record for team ${team.abbreviation}: ${wins}-${losses}${ties > 0 ? `-${ties}` : ''}`);
        
        // Small delay between team updates
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error updating team record:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error updating team records:', error);
  }
}

/**
 * Main Lambda handler - scheduled to run every 5 minutes
 */
export const handler: ScheduledHandler = async (event): Promise<void> => {
  console.log('ESPN Sync Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    // Only run during NFL season (roughly September-February)
    const currentMonth = new Date().getMonth(); // 0-11
    const isNFLSeason = currentMonth >= 8 || currentMonth <= 1; // Sep-Feb
    
    if (!isNFLSeason) {
      console.log('Outside NFL season, skipping sync');
      return;
    }
    
    // Fetch and update active games
    const activeGames = await fetchActiveGamesFromESPN();
    
    if (activeGames.length === 0) {
      console.log('No active games found, updating team records only');
      await updateTeamRecords(new Date().getFullYear());
      return;
    }
    
    // Update each active game
    for (const game of activeGames) {
      await updateGameStatus(game);
    }
    
    // Update team records less frequently (only when games are active)
    if (activeGames.length > 0) {
      await updateTeamRecords(new Date().getFullYear());
    }
    
    console.log(`Successfully updated ${activeGames.length} games and team records`);
    
  } catch (error) {
    console.error('ESPN Sync Lambda error:', error);
    throw error; // Let Lambda handle the error
  }
};