/**
 * Shared TypeScript types for Supabase Edge Functions
 * 
 * These interfaces ensure type consistency between the frontend
 * application and Edge Functions.
 */

// League Management Types
export interface CreateLeagueRequest {
  name: string;
  description?: string;
  entryFee: number;
  maxMembers: number;
  isPrivate: boolean;
  password?: string;
}

export interface CreateLeagueResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description?: string;
    entryFee: number;
    maxMembers: number;
    isPrivate: boolean;
    inviteCode: string;
    status: string;
    createdAt: string;
  };
  error?: string;
}

export interface JoinLeagueRequest {
  inviteCode: string;
  password?: string;
}

export interface JoinLeagueResponse {
  success: boolean;
  data?: {
    leagueId: string;
    leagueName: string;
    role: 'member';
    joinedAt: string;
    currentMembers: number;
    maxMembers: number;
  };
  error?: string;
}

export interface GetUserLeaguesResponse {
  success: boolean;
  data?: Array<{
    id: string;
    name: string;
    description?: string;
    entryFee: number;
    maxMembers: number;
    currentMembers: number;
    isPrivate: boolean;
    inviteCode?: string; // Only included for admin users
    status: string;
    createdAt: string;
    userRole: 'admin' | 'member';
    joinedAt: string;
  }>;
  error?: string;
}

// Common Response Types
export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export interface ApiSuccess<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Database Entity Types (matching the actual schema)
export interface League {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  entry_fee: string; // Decimal type from DB
  max_members: number;
  is_private: boolean;
  password_hash?: string;
  invite_code: string;
  status: 'active' | 'inactive' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface LeagueInvite {
  id: string;
  league_id: string;
  created_by: string;
  invite_code: string;
  expires_at?: string;
  max_uses?: number;
  uses_count: number;
  created_at: string;
}

// Function-specific Types
export interface SyncNflDataRequest {
  syncType: 'all' | 'teams' | 'games';
  week?: number;
  seasonYear?: number;
  force?: boolean;
}

export interface ProcessGameResultsRequest {
  gameId?: string;
  week?: number;
  seasonYear?: number;
}

export interface GenerateCacheRequest {
  trigger: 'manual' | 'scheduled' | 'game_update';
  cacheTypes?: ('teams' | 'schedule' | 'standings' | 'picks')[];
}

// Authentication Types
export interface AuthenticatedUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

// Validation Error Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationErrorResponse extends ApiError {
  validationErrors?: ValidationError[];
}

// NFL Data Types
export interface NflTeam {
  id: string;
  name: string;
  abbreviation: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  conference: 'AFC' | 'NFC';
  division: string;
}

export interface NflGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  week: number;
  season_year: number;
  game_date: string;
  status: 'scheduled' | 'in_progress' | 'final' | 'postponed' | 'cancelled';
  home_score?: number;
  away_score?: number;
  espn_game_id?: string;
}