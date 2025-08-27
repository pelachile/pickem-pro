// Minimal API implementation for AWS Amplify migration
// This replaces the complex api.ts file temporarily

// Import AWS Amplify for live data
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Import types
import type {
  GetPublicLeaguesParams,
  GetPublicLeaguesResponse,
  GetUserLeaguesResponse,
  JoinLeagueRequest,
  JoinLeagueResponse,
  UpdateLeagueRequest,
  UpdateLeagueResponse,
  DeleteLeagueResponse,
} from '../types/league';

// AWS Amplify client for live data (lazy initialization)
let amplifyClient: ReturnType<typeof generateClient<Schema>> | null = null;

function getAmplifyClient() {
  if (!amplifyClient) {
    try {
      amplifyClient = generateClient<Schema>();
    } catch (error) {
      console.error('Error initializing Amplify client:', error);
      throw error;
    }
  }
  return amplifyClient;
}

// Types for NFL data
export interface Team {
  id: number;
  espn_id: string;
  name: string;
  location: string;
  nickname: string;
  abbreviation: string;
  display_name?: string;
  short_display_name?: string;
  color?: string;
  alternate_color?: string;
  slug?: string;
  is_active: boolean;
  logo_url: string;
  conference: string;
  division: string;
}

export interface Game {
  id: number;
  espn_id: string;
  home_team_id: number;
  away_team_id: number;
  week: number;
  date: string;
  home_score?: number;
  away_score?: number;
  status?: string;
  season_year?: number;
  venue_name?: string;
  game_date?: string;
  home_team?: Team & { display_name?: string };
  away_team?: Team & { display_name?: string };
}

export interface CacheData {
  meta: {
    export_date: string;
    total_teams: number;
    total_games: number;
    current_season: number;
    weeks_available: number[];
    cache_version?: string;
  };
  teams: {
    all: Team[];
    by_conference: {
      AFC: { North: Team[]; South: Team[]; East: Team[]; West: Team[] };
      NFC: { North: Team[]; South: Team[]; East: Team[]; West: Team[] };
    };
  };
  schedule: {
    all_games: Game[];
    by_week: { [week: number]: Game[] };
  };
}

// NFL API functions (reads from cached JSON file)
export const nflApi = {
  async fetchTeamsAndSchedule(): Promise<CacheData> {
    const response = await fetch('/data/teams-and-schedule.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NFL data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Calculate preseason records from cache data
    const calculatePreseasonRecords = (): Record<string, string> => {
      const records: Record<string, { wins: number; losses: number }> = {};
      let gamesProcessed = 0;
      let cowboysGames: any[] = [];
      
      // Initialize all teams with 0-0
      if (data.teams?.all) {
        data.teams.all.forEach((team: any) => {
          records[team.abbreviation] = { wins: 0, losses: 0 };
        });
      }
      
      // Count wins/losses from all preseason games
      // Check both all_games and by_week to ensure we get all data
      const allPreseasonGames: any[] = [];
      
      // First try all_games if available
      if (data.schedule?.all_games) {
        data.schedule.all_games.forEach((game: any) => {
          if (game.season_type === 'preseason') {
            allPreseasonGames.push(game);
          }
        });
      }
      
      // If no all_games or very few games, try by_week
      if (allPreseasonGames.length < 10 && data.schedule?.by_week) {
        Object.values(data.schedule.by_week).forEach((weekGames: any) => {
          if (Array.isArray(weekGames)) {
            weekGames.forEach((game: any) => {
              if (game.season_type === 'preseason') {
                allPreseasonGames.push(game);
              }
            });
          }
        });
      }
      
      allPreseasonGames.forEach((game: any) => {
          if (game.status === 'STATUS_FINAL' && 
              game.home_team && game.away_team && 
              typeof game.home_score === 'number' && typeof game.away_score === 'number') {
            
            const homeAbbr = game.home_team.abbreviation;
            const awayAbbr = game.away_team.abbreviation;
            
            // Debug: Track Cowboys games specifically
            if (homeAbbr === 'DAL' || awayAbbr === 'DAL') {
              cowboysGames.push({
                id: game.id,
                home: `${homeAbbr} ${game.home_score}`,
                away: `${awayAbbr} ${game.away_score}`,
                week: game.week,
                winner: game.home_score > game.away_score ? homeAbbr : awayAbbr
              });
            }
            
            if (records[homeAbbr] && records[awayAbbr]) {
              if (game.home_score > game.away_score) {
                records[homeAbbr].wins++;
                records[awayAbbr].losses++;
              } else if (game.away_score > game.home_score) {
                records[awayAbbr].wins++;
                records[homeAbbr].losses++;
              }
              // Ties are ignored in preseason
              gamesProcessed++;
            }
          }
        });
      }
      
      // Debug logging for Cowboys specifically
      console.log('Preseason Records Calculation Debug:');
      console.log('- Data source: all_games =', data.schedule?.all_games?.length || 0, 'games');
      console.log('- Data source: by_week =', Object.keys(data.schedule?.by_week || {}).length, 'weeks');
      console.log('- Total preseason games found:', allPreseasonGames.length);
      console.log('- Total preseason games processed:', gamesProcessed);
      console.log('- Cowboys games found:', cowboysGames);
      console.log('- Cowboys final record:', records['DAL']);
      
      // Convert to string format
      const teamRecords: Record<string, string> = {};
      Object.entries(records).forEach(([abbr, record]) => {
        teamRecords[abbr] = `Pre: ${record.wins}-${record.losses}`;
      });
      
      return teamRecords;
    };
    
    const teamRecords = calculatePreseasonRecords();
    
    // Enrich team data with win-loss records
    if (data.teams?.all) {
      data.teams.all = data.teams.all.map((team: any) => ({
        ...team,
        record: teamRecords[team.abbreviation] || '0-0',
      }));
    }
    
    // Transform games to match Game interface and enrich team data
    const transformGame = (game: any) => {
      const homeTeam = game.home_team ? {
        ...game.home_team,
        record: teamRecords[game.home_team.abbreviation] || '0-0',
      } : game.home_team;
      
      const awayTeam = game.away_team ? {
        ...game.away_team,
        record: teamRecords[game.away_team.abbreviation] || '0-0',
      } : game.away_team;
      
      return {
        ...game,
        date: game.game_date || game.date,
        gameTime: game.date || game.game_date, // GameCard expects gameTime
        // Both formats for compatibility
        home_team: homeTeam,
        away_team: awayTeam,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        // Ensure scores are available in both formats
        home_score: game.home_score,
        away_score: game.away_score,
        homeScore: game.home_score,
        awayScore: game.away_score,
      };
    };
    
    if (data.schedule?.all_games) {
      data.schedule.all_games = data.schedule.all_games.map(transformGame);
    }

    if (data.schedule?.by_week) {
      const transformedByWeek: { [week: number]: Game[] } = {};
      Object.entries(data.schedule.by_week).forEach(([week, games]: [string, any]) => {
        transformedByWeek[parseInt(week)] = games.map(transformGame);
      });
      data.schedule.by_week = transformedByWeek;
    }

    return data as CacheData;
  },
};

// Live Data API for AWS Amplify integration
export const liveDataApi = {
  // Get live game statuses for specific ESPN IDs
  async getGameStatuses(espnIds: string[]): Promise<Array<{
    espn_id: string;
    home_score?: number;
    away_score?: number;
    status: 'scheduled' | 'in_progress' | 'final' | 'postponed' | 'cancelled';
    quarter?: string;
    time_remaining?: string;
    game_status_detail?: string;
    has_started: boolean;
    has_finished: boolean;
    last_updated: string;
    season_year: number;
    week: number;
  }>> {
    try {
      const { data } = await getAmplifyClient().models.GameStatus.list();
      const filteredData = data?.filter(game => espnIds.includes(game.espn_id)) || [];
      
      return filteredData?.map(game => ({
        espn_id: game.espn_id,
        home_score: game.home_score ?? undefined,
        away_score: game.away_score ?? undefined,
        status: game.status as any || 'scheduled',
        quarter: game.quarter ?? undefined,
        time_remaining: game.time_remaining ?? undefined,
        game_status_detail: game.game_status_detail ?? undefined,
        has_started: game.has_started ?? false,
        has_finished: game.has_finished ?? false,
        last_updated: game.last_updated,
        season_year: game.season_year,
        week: game.week,
      })) || [];
    } catch (error) {
      console.error('Error fetching game statuses:', error);
      return [];
    }
  },

  // Get all active/recent games
  async getActiveGameStatuses(): Promise<Array<{
    espn_id: string;
    home_score?: number;
    away_score?: number;
    status: 'scheduled' | 'in_progress' | 'final' | 'postponed' | 'cancelled';
    quarter?: string;
    time_remaining?: string;
    game_status_detail?: string;
    has_started: boolean;
    has_finished: boolean;
    last_updated: string;
    season_year: number;
    week: number;
  }>> {
    try {
      const currentYear = new Date().getFullYear();
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      const { data } = await getAmplifyClient().models.GameStatus.list();
      const filteredData = data?.filter(game => 
        game.season_year === currentYear && (
          game.status === 'in_progress' ||
          (game.status === 'final' && new Date(game.last_updated) > tenMinutesAgo)
        )
      ) || [];
      
      return filteredData?.map(game => ({
        espn_id: game.espn_id,
        home_score: game.home_score ?? undefined,
        away_score: game.away_score ?? undefined,
        status: game.status as any || 'scheduled',
        quarter: game.quarter ?? undefined,
        time_remaining: game.time_remaining ?? undefined,
        game_status_detail: game.game_status_detail ?? undefined,
        has_started: game.has_started ?? false,
        has_finished: game.has_finished ?? false,
        last_updated: game.last_updated,
        season_year: game.season_year,
        week: game.week,
      })) || [];
    } catch (error) {
      console.error('Error fetching active game statuses:', error);
      return [];
    }
  },

  // Get team records
  async getTeamRecords(espnIds?: string[]): Promise<Array<{
    espn_id: string;
    season_year: number;
    wins: number;
    losses: number;
    ties: number;
    win_percentage?: number;
    points_for: number;
    points_against: number;
    point_differential: number;
    streak?: string;
    last_updated: string;
  }>> {
    try {
      const currentYear = new Date().getFullYear();
      const { data } = await getAmplifyClient().models.TeamRecord.list();
      const filteredData = data?.filter(record => {
        const matchesYear = record.season_year === currentYear;
        const matchesIds = !espnIds || espnIds.includes(record.espn_id);
        return matchesYear && matchesIds;
      }) || [];
      
      return filteredData?.map(record => ({
        espn_id: record.espn_id,
        season_year: record.season_year,
        wins: record.wins ?? 0,
        losses: record.losses ?? 0,
        ties: record.ties ?? 0,
        win_percentage: record.win_percentage ?? undefined,
        points_for: record.points_for ?? 0,
        points_against: record.points_against ?? 0,
        point_differential: record.point_differential ?? 0,
        streak: record.streak ?? undefined,
        last_updated: record.last_updated,
      })) || [];
    } catch (error) {
      console.error('Error fetching team records:', error);
      return [];
    }
  },

  // Subscribe to live game updates (placeholder)
  subscribeToGameUpdates(callback: (gameStatus: any) => void) {
    try {
      const subscription = getAmplifyClient().models.GameStatus.observeQuery().subscribe({
        next: ({ items }) => {
          items.forEach(callback);
        },
        error: (error) => {
          console.error('GameStatus subscription error:', error);
        },
      });
      
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error setting up GameStatus subscription:', error);
      return () => {};
    }
  },

  // Fetch enriched teams and schedule (hybrid static + live data)
  async fetchEnrichedTeamsAndSchedule(): Promise<CacheData & {
    _liveDataMeta: {
      activeGames: number;
      lastUpdate?: string;
      teamRecordsCount: number;
    }
  }> {
    // Get static data from CDN (fast)
    const staticData = await nflApi.fetchTeamsAndSchedule();
    
    // For now, return static data with minimal live metadata
    return {
      ...staticData,
      _liveDataMeta: {
        activeGames: 0,
        lastUpdate: Date.now().toString(),
        teamRecordsCount: 0,
      },
    };
  },
};

// League API placeholder - TODO: Implement with AWS Amplify
export const leagueApi = {
  async getPublicLeagues(params: GetPublicLeaguesParams = {}): Promise<GetPublicLeaguesResponse> {
    return {
      leagues: [],
      total_count: 0,
      has_more: false,
    };
  },

  async createLeague(request: any): Promise<any> {
    throw new Error('League creation not yet implemented with AWS Amplify');
  },

  async joinLeague(request: JoinLeagueRequest): Promise<JoinLeagueResponse> {
    throw new Error('League joining not yet implemented with AWS Amplify');
  },

  async getUserLeagues(): Promise<GetUserLeaguesResponse> {
    return {
      success: true,
      leagues: [],
    };
  },

  async updateLeague(leagueId: string, request: UpdateLeagueRequest): Promise<UpdateLeagueResponse> {
    throw new Error('League updates not yet implemented with AWS Amplify');
  },

  async deleteLeague(leagueId: string): Promise<DeleteLeagueResponse> {
    throw new Error('League deletion not yet implemented with AWS Amplify');
  },
};

// Export the API as default for easy replacement
export const api = {
  nfl: nflApi,
  league: leagueApi,
  liveData: liveDataApi,
};