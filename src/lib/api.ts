// API configuration
const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const CACHE_BASE_URL = `${API_BASE_URL}/storage/v1/object/public/cache`
const FUNCTIONS_BASE_URL = `${API_BASE_URL}/functions/v1`

// Types (matching your cache structure)
export interface Team {
  id: number
  espn_id: string
  name: string
  location: string
  nickname: string
  abbreviation: string
  display_name: string
  short_display_name: string
  color: string
  alternate_color: string
  slug: string
  conference: string
  division: string
  is_active: boolean
  logo_url: string
}

export interface GameTeam {
  id: number
  espn_id: string
  name: string
  location: string
  display_name: string
  abbreviation: string
  color: string
  alternate_color: string
  logo_url: string
}

export interface Game {
  id: string
  espn_id: string
  week: number
  season_year: number
  season_type: string
  date: string
  home_team: GameTeam
  away_team: GameTeam
  home_score?: number
  away_score?: number
  status: string
  status_detail?: string
}

export interface CacheData {
  meta: {
    export_date: string
    total_teams: number
    total_games: number
    current_season: number
    weeks_available: number[]
    cache_version: string
  }
  teams: {
    all: Team[]
    by_conference: {
      AFC: {
        North: Team[]
        South: Team[]
        East: Team[]
        West: Team[]
      }
      NFC: {
        North: Team[]
        South: Team[]
        East: Team[]
        West: Team[]
      }
    }
  }
  schedule: {
    by_week: Record<number, Game[]>
    all_games: Game[]
  }
}

// Import league types
import type {
  JoinLeagueRequest,
  JoinLeagueResponse,
  GetPublicLeaguesParams,
  GetPublicLeaguesResponse,
  GetUserLeaguesResponse,
  UpdateLeagueRequest,
  UpdateLeagueResponse,
  DeleteLeagueResponse,
  ApiError
} from '../types/league';
import { supabase, isFeatureEnabled, migrationTracker } from './supabase';
import * as directDB from './database';
import type { PaginatedResponse } from '../types/database';

// Helper function to get authorization headers
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
};

// Helper function to handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  let errorData: ApiError;
  
  try {
    errorData = await response.json();
  } catch {
    errorData = {
      message: `HTTP ${response.status}: ${response.statusText}`,
      code: response.status.toString()
    };
  }
  
  throw new Error(errorData.message || 'An unexpected error occurred');
};

// API functions
export const nflApi = {
  // Fetch the main cache file
  async fetchTeamsAndSchedule(): Promise<CacheData> {
    try {
      console.log('Attempting to fetch NFL data from:', `${CACHE_BASE_URL}/teams-and-schedule.json`)
      const response = await fetch(`${CACHE_BASE_URL}/teams-and-schedule.json`)
      
      if (!response.ok) {
        console.warn(`Cache fetch failed with ${response.status}: ${response.statusText}, falling back to mock data`)
        throw new Error(`Cache unavailable: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Successfully loaded NFL data from cache')
      return data
    } catch (error) {
      // Fallback to mock data when cache is not available (for development)
      console.log('Using mock NFL data due to error:', error)
      const mockData = {
        meta: {
          export_date: new Date().toISOString(),
          total_teams: 2,
          total_games: 1,
          current_season: 2025,
          weeks_available: [1],
          cache_version: "mock-1.0"
        },
        teams: {
          all: [
            {
              id: 1, espn_id: "1", name: "Bills", location: "Buffalo", nickname: "Bills",
              abbreviation: "BUF", display_name: "Buffalo Bills", short_display_name: "Bills",
              color: "#00338D", alternate_color: "#C60C30", slug: "buffalo-bills",
              conference: "AFC", division: "East", is_active: true,
              logo_url: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png"
            },
            {
              id: 2, espn_id: "2", name: "Patriots", location: "New England", nickname: "Patriots", 
              abbreviation: "NE", display_name: "New England Patriots", short_display_name: "Patriots",
              color: "#002244", alternate_color: "#C60C30", slug: "new-england-patriots",
              conference: "AFC", division: "East", is_active: true,
              logo_url: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png"
            }
          ],
          by_conference: {
            AFC: { North: [], South: [], East: [], West: [] },
            NFC: { North: [], South: [], East: [], West: [] }
          }
        },
        schedule: {
          by_week: {
            1: [{
              id: "1", espn_id: "1", week: 1, season_year: 2025, season_type: "regular",
              date: new Date().toISOString(), status: "scheduled",
              home_team: {
                id: 1, espn_id: "1", name: "Bills", location: "Buffalo", 
                display_name: "Buffalo Bills", abbreviation: "BUF",
                color: "#00338D", alternate_color: "#C60C30",
                logo_url: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png"
              },
              away_team: {
                id: 2, espn_id: "2", name: "Patriots", location: "New England",
                display_name: "New England Patriots", abbreviation: "NE", 
                color: "#002244", alternate_color: "#C60C30",
                logo_url: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png"
              }
            }]
          },
          all_games: [{
            id: "1", espn_id: "1", week: 1, season_year: 2025, season_type: "regular",
            date: new Date().toISOString(), status: "scheduled",
            home_team: {
              id: 1, espn_id: "1", name: "Bills", location: "Buffalo", 
              display_name: "Buffalo Bills", abbreviation: "BUF",
              color: "#00338D", alternate_color: "#C60C30",
              logo_url: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png"
            },
            away_team: {
              id: 2, espn_id: "2", name: "Patriots", location: "New England",
              display_name: "New England Patriots", abbreviation: "NE", 
              color: "#002244", alternate_color: "#C60C30",
              logo_url: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png"
            }
          }]
        }
      };
      console.log('Returning mock data:', mockData);
      return mockData;
    }
  },

  // Fetch specific cache version (for cache busting)
  async fetchTeamsAndScheduleVersion(version: string): Promise<CacheData> {
    const response = await fetch(`${CACHE_BASE_URL}/teams-and-schedule-v${version}.json`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cache version ${version}: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Check for cache updates
  async checkCacheVersion(): Promise<string> {
    const data = await this.fetchTeamsAndSchedule()
    return data.meta.cache_version
  }
}

// =====================================
// Migration Helper Functions
// =====================================

/**
 * Wrapper to choose between direct DB calls and edge functions
 */
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
    
    if (search && search.trim()) {
      searchParams.append('search', search.trim());
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

  // Join a league using invite code and optional password
  async joinLeague(request: JoinLeagueRequest): Promise<JoinLeagueResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('joinLeague')) {
      migrationTracker.logDirectQuery('leagues', 'joinLeague');
      
      const result = await directDB.joinLeague(request);
      
      // Convert response format to match existing API
      if (result.success && result.data) {
        return {
          success: true,
          message: 'Successfully joined league',
          league: result.data as any, // Type conversion for compatibility
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to join league',
          error: result.error,
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
      
      // Convert response format to match existing API
      if (result.success && result.data) {
        // Transform database format to existing API format
        const userLeagues = result.data.map(league => ({
          ...league,
          userRole: league.user_role,
          joinedAt: league.joined_at,
          // Add computed fields that might be expected by the UI
          season_year: new Date().getFullYear(),
          has_password: !!league.password_hash,
        }));
        
        return {
          success: true,
          data: userLeagues as any[], // Type conversion for compatibility
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

  // Update a league
  async updateLeague(leagueId: string, request: UpdateLeagueRequest): Promise<UpdateLeagueResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('updateLeague')) {
      migrationTracker.logDirectQuery('leagues', 'updateLeague');
      
      const result = await directDB.updateLeague(leagueId, request);
      
      // Convert response format to match existing API
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
            status: result.data.status || 'active',
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
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/update-league/${leagueId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  // Delete a league
  async deleteLeague(leagueId: string): Promise<DeleteLeagueResponse> {
    // Feature flag: Use direct database queries or edge functions
    if (shouldUseDirectDB('deleteLeague')) {
      migrationTracker.logDirectQuery('leagues', 'deleteLeague');
      
      const result = await directDB.deleteLeague(leagueId);
      
      // Convert response format to match existing API
      if (result.success) {
        return {
          success: true,
          message: 'League deleted successfully',
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to delete league',
          error: result.error,
        };
      }
    }
    
    // Legacy edge function approach
    migrationTracker.logEdgeFunction('delete-league');
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/delete-league/${leagueId}`, {
      method: 'DELETE',
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
};