// Import Supabase and migration helpers
import { supabase, isFeatureEnabled, migrationTracker } from './supabase';
import * as directDB from './database';

// Import league types
import {
  GetPublicLeaguesParams,
  GetPublicLeaguesResponse,
  GetUserLeaguesResponse,
  UpdateLeagueRequest,
  UpdateLeagueResponse,
  DeleteLeagueResponse,
  ApiError
} from '../types/league';

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
  async createProfile(data: any) {
    return profileDatabase.createUserProfile(data);
  },

  // Update user profile
  async updateProfile(data: any) {
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

// Export all API functions for easy access
export const api = {
  nfl: nflApi,
  league: leagueApi,
  picks: picksApi,
  profile: profileApi,
};