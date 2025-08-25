// Import Supabase and migration helpers
import { supabase, isFeatureEnabled, migrationTracker } from './supabase';
import * as directDB from './database';

// Import league types
import type {
  GetPublicLeaguesParams,
  GetPublicLeaguesResponse,
  GetUserLeaguesResponse,
  UpdateLeagueRequest,
  UpdateLeagueResponse,
  DeleteLeagueResponse,
  ApiError,
  JoinLeagueRequest,
  JoinLeagueResponse
} from '../types/league';

// API Base URLs
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const FUNCTIONS_BASE_URL = `${supabaseUrl}/functions/v1`;

// Helper function to handle API errors
async function handleApiError(response: Response): Promise<void> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
}

// Helper function to get authorization headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
}

// Import picks types
import type {
  SubmitPicksRequest,
  SubmitPicksResponse,
  GetUserPicksRequest,
  GetUserPicksResponse,
  UpdatePickRequest,
  UpdatePickResponse,
  GetLeagueStandingsRequest,
  GetLeagueStandingsResponse,
  ApiResponse
} from '../types/picks';

// Import database helpers
import { picksDatabase } from './picks-database';
import { profileDatabase } from './profile-database';

import type { PaginatedResponse } from '../types/database';

// NFL API types
export interface CacheData {
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
  meta: {
    weeks_available: number[];
    cache_version: string;
    last_updated: string;
  };
}

export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  logo_url?: string;
  display_name?: string;
  location?: string;
  nickname?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface Game {
  id: number;
  week: number;
  home_team_id: number;
  away_team_id: number;
  date: string;
  status: 'scheduled' | 'upcoming' | 'in_progress' | 'final';
  home_score?: number;
  away_score?: number;
  season_year?: number;
  venue_name?: string;
  game_date?: string;
  // Enhanced team data from cache
  home_team?: Team & { display_name?: string };
  away_team?: Team & { display_name?: string };
}

// Feature flag helper
function shouldUseDirectDB(operation: string): boolean {
  const flags = {
    'getPublicLeagues': 'use_direct_league_queries',
    'joinLeague': 'use_direct_league_queries', 
    'getUserLeagues': 'use_direct_league_queries',
    'updateLeague': 'use_direct_league_queries',
    'deleteLeague': 'use_direct_league_queries',
    'createLeague': 'use_direct_league_queries',
  };
  
  const flag = flags[operation as keyof typeof flags];
  return flag ? isFeatureEnabled(flag) : false;
}

// League API functions
export const leagueApi = {
  // Fetch public leagues with optional search and pagination
  async getPublicLeagues(params: GetPublicLeaguesParams = {}): Promise<GetPublicLeaguesResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('getPublicLeagues')) {
      migrationTracker.logDirectQuery('leagues', 'getPublicLeagues');
      
      // Convert parameters to match direct DB function
      const dbParams = {
        search: params.search,
        limit: params.limit || 20,
        offset: params.offset || 0,
      };
      
      const result = await directDB.getPublicLeagues(dbParams);
      
      // Convert response format to match existing API
      if (result.success && result.data) {
        return {
          leagues: result.data,
          total_count: result.pagination?.total || 0,
          has_more: result.pagination?.hasMore || false,
        };
      } else {
        throw new Error(result.error || 'Failed to get public leagues');
      }
    }
    
    // Legacy edge function approach
    migrationTracker.logEdgeFunction('get-public-leagues');
    
    const { search, limit = 20, offset = 0 } = params;
    const headers = await getAuthHeaders();
    
    const searchParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    if (search) {
      searchParams.set('search', search);
    }
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/get-public-leagues?${searchParams}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Create a new league (new function for direct DB operations)
  async createLeague(request: { name: string; description?: string; entryFee: number; maxMembers: number; isPrivate: boolean; password?: string }): Promise<any> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('createLeague')) {
      migrationTracker.logDirectQuery('leagues', 'createLeague');
      
      const result = await directDB.createLeague(request);
      
      // Convert response format to match existing API pattern
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data,
          message: 'League created successfully',
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to create league',
        };
      }
    }
    
    // Legacy edge function approach (would need to be implemented)
    migrationTracker.logEdgeFunction('create-league');
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/create-league`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Join a league using invite code and password
  async joinLeague(request: JoinLeagueRequest): Promise<JoinLeagueResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('joinLeague')) {
      migrationTracker.logDirectQuery('leagues', 'joinLeague');
      
      const result = await directDB.joinLeague(request);
      
      if (result.success && result.data) {
        // Transform database League to API League format
        const apiLeague = {
          ...result.data,
          current_members: 0, // Will be populated by the UI
          has_password: !!result.data.password_hash,
          season_year: new Date().getFullYear(), // Default to current year
        };
        
        return {
          success: true,
          message: 'Successfully joined league',
          league: apiLeague,
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to join league',
        };
      }
    }
    
    // Legacy edge function approach
    migrationTracker.logEdgeFunction('join-league');
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/join-league`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Get user's leagues
  async getUserLeagues(): Promise<GetUserLeaguesResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('getUserLeagues')) {
      migrationTracker.logDirectQuery('leagues', 'getUserLeagues');
      
      const result = await directDB.getUserLeagues();
      
      if (result.success && result.data) {
        // Transform LeagueWithMembership to UserLeague format
        const userLeagues = result.data.map((league) => ({
          ...league,
          userRole: league.user_role,
          joinedAt: league.joined_at,
          has_password: !!league.password_hash,
          season_year: new Date().getFullYear(), // Default to current year
        }));
        
        return {
          success: true,
          data: userLeagues,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to get user leagues',
        };
      }
    }
    
    // Legacy edge function approach
    migrationTracker.logEdgeFunction('get-user-leagues');
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/get-user-leagues`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Update league settings
  async updateLeague(leagueId: string, request: UpdateLeagueRequest): Promise<UpdateLeagueResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('updateLeague')) {
      migrationTracker.logDirectQuery('leagues', 'updateLeague');
      
      const result = await directDB.updateLeague(leagueId, request);
      
      if (result.success && result.data) {
        return {
          success: true,
          data: {
            id: result.data.id,
            name: result.data.name,
            description: result.data.description || undefined,
            entryFee: result.data.entry_fee || 0,
            maxMembers: result.data.max_members || 10,
            isPrivate: result.data.is_private || false,
            inviteCode: result.data.invite_code || '',
            status: result.data.status || 'draft',
            updatedAt: result.data.updated_at || '',
          },
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to update league',
        };
      }
    }
    
    // Legacy edge function approach
    migrationTracker.logEdgeFunction('update-league');
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/update-league`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ leagueId, ...request }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Delete league
  async deleteLeague(leagueId: string): Promise<DeleteLeagueResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('deleteLeague')) {
      migrationTracker.logDirectQuery('leagues', 'deleteLeague');
      
      const result = await directDB.deleteLeague(leagueId);
      
      if (result.success) {
        return {
          success: true,
          message: 'League deleted successfully',
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to delete league',
        };
      }
    }
    
    // Legacy edge function approach
    migrationTracker.logEdgeFunction('delete-league');
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/delete-league`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ leagueId }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },
};

// Picks API functions
export const picksApi = {
  // Submit user picks
  async submitPicks(request: SubmitPicksRequest): Promise<SubmitPicksResponse> {
    return picksDatabase.submitUserPicks(request);
  },

  // Get user picks for a league
  async getUserPicks(request: GetUserPicksRequest): Promise<GetUserPicksResponse> {
    return picksDatabase.getUserPicks(request);
  },

  // Update a single pick
  async updatePick(pickId: string, request: UpdatePickRequest): Promise<UpdatePickResponse> {
    return picksDatabase.updateUserPick(pickId, request);
  },

  // Get league standings
  async getLeagueStandings(request: GetLeagueStandingsRequest): Promise<GetLeagueStandingsResponse> {
    return picksDatabase.getLeagueStandings(request);
  },

  // Get upcoming games for picks
  async getUpcomingGames(leagueId: string, week?: number): Promise<ApiResponse<any[]>> {
    return picksDatabase.getUpcomingGames(leagueId, week);
  },

  // Get user pick history
  async getUserPickHistory(leagueId: string): Promise<ApiResponse<any>> {
    return picksDatabase.getUserPickHistory(leagueId);
  },

  // Check multiple game deadlines
  async checkGameDeadlines(gameIds: string[]): Promise<ApiResponse<any[]>> {
    return picksDatabase.checkMultipleGameDeadlines(gameIds);
  },
};

// Profile API functions
export const profileApi = {
  // Get user profile
  async getUserProfile(userId?: string) {
    return profileDatabase.getUserProfile(userId);
  },

  // Create user profile
  async createProfile(data: Parameters<typeof profileDatabase.createUserProfile>[0]) {
    return profileDatabase.createUserProfile(data);
  },

  // Update user profile
  async updateProfile(data: Parameters<typeof profileDatabase.updateUserProfile>[0]) {
    return profileDatabase.updateUserProfile(data);
  },

  // Check username availability
  async checkUsername(username: string) {
    return profileDatabase.checkUsernameAvailability(username);
  },

  // Get profile statistics
  async getProfileStats() {
    return profileDatabase.getProfileStats();
  },
};

// NFL API functions (reads from cached JSON file maintained by edge functions)
export const nflApi = {
  // Fetch teams and schedule data from cached JSON file
  async fetchTeamsAndSchedule(): Promise<CacheData> {
    // Read from the cached JSON file that gets updated by the edge function
    const response = await fetch('/data/teams-and-schedule.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NFL data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform games to match Game interface (game_date -> date)
    interface GameWithDate {
      id: number;
      espn_id: string;
      game_date?: string;
      date?: string;
      home_team_id: number;
      away_team_id: number;
      home_team?: { name: string; short_name: string };
      away_team?: { name: string; short_name: string };
      home_score?: number;
      away_score?: number;
      game_status?: string;
      has_started?: boolean;
      has_finished?: boolean;
      quarter?: string;
      time_remaining?: string;
    }
    
    const transformGame = (game: GameWithDate) => ({
      ...game,
      date: game.game_date || game.date,
      status: game.status === 'STATUS_SCHEDULED' ? 'scheduled' : 
              game.status === 'STATUS_IN_PROGRESS' ? 'in_progress' :
              game.status === 'STATUS_FINAL' ? 'final' : 'scheduled',
    });

    const transformGamesInWeeks = (weekData: Record<string, GameWithDate[]>) => {
      const transformed = {};
      for (const [week, games] of Object.entries(weekData)) {
        transformed[week] = games.map(transformGame);
      }
      return transformed;
    };

    const weeklyGames = data.schedule.by_week ? transformGamesInWeeks(data.schedule.by_week) : {};
    
    // Generate all_games from by_week data to avoid duplication
    const allGamesFromWeeks = Object.values(weeklyGames).flat();
    
    // Transform to match CacheData interface
    return {
      teams: {
        all: data.teams.all,
        by_conference: data.teams.by_conference,
      },
      schedule: {
        all_games: allGamesFromWeeks, // Generated from by_week data
        by_week: weeklyGames,
      },
      meta: {
        weeks_available: data.meta.weeks_available || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        cache_version: data.meta.cache_version || '1.0.0',
        last_updated: data.meta.last_updated || new Date().toISOString(),
      },
    };
  },

  // Check cache version from the JSON metadata
  async checkCacheVersion(): Promise<{ version: string; last_updated: string }> {
    const response = await fetch('/data/teams-and-schedule.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cache version: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      version: data.meta.cache_version || '1.0.0',
      last_updated: data.meta.last_updated || new Date().toISOString(),
    };
  },
};

// Export all API functions for easy access
export const api = {
  nfl: nflApi,
  league: leagueApi,
  picks: picksApi,
  profile: profileApi,
};