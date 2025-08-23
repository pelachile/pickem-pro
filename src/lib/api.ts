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
import { supabase } from './supabase';

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

// League API functions
export const leagueApi = {
  // Fetch public leagues with optional search and pagination
  async getPublicLeagues(params: GetPublicLeaguesParams = {}): Promise<GetPublicLeaguesResponse> {
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
};