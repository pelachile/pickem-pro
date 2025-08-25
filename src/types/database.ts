/**
 * Database TypeScript Types
 * Generated from Supabase schema for type-safe database operations
 * 
 * This file contains all database table types and relationships
 * for direct Supabase client usage (Phase 1 of migration)
 */

// =====================================
// Core Database Types
// =====================================

export type Database = {
  public: {
    Tables: {
      leagues: {
        Row: League;
        Insert: LeagueInsert;
        Update: LeagueUpdate;
      };
      league_members: {
        Row: LeagueMember;
        Insert: LeagueMemberInsert;
        Update: LeagueMemberUpdate;
      };
      league_invites: {
        Row: LeagueInvite;
        Insert: LeagueInviteInsert;
        Update: LeagueInviteUpdate;
      };
      teams: {
        Row: Team;
        Insert: TeamInsert;
        Update: TeamUpdate;
      };
      games: {
        Row: Game;
        Insert: GameInsert;
        Update: GameUpdate;
      };
      picks: {
        Row: Pick;
        Insert: PickInsert;
        Update: PickUpdate;
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
    };
    Views: {
      // Add any database views here when they exist
    };
    Functions: {
      generate_invite_code: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      league_status: 'active' | 'inactive' | 'completed' | 'draft' | 'cancelled';
      member_role: 'admin' | 'member' | 'owner';
      game_status: 'scheduled' | 'in_progress' | 'final' | 'postponed' | 'cancelled';
      season_type: 'preseason' | 'regular' | 'postseason';
      conference: 'AFC' | 'NFC';
      division: 'North' | 'South' | 'East' | 'West';
    };
  };
};

// =====================================
// Table Row Types
// =====================================

/**
 * Leagues table - Core league information
 */
export interface League {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  entry_fee: number;
  max_members: number;
  is_private: boolean;
  password_hash: string | null;
  invite_code: string;
  status: Database['public']['Enums']['league_status'];
  created_at: string;
  updated_at: string;
  // Additional computed fields from joins
  current_members?: number;
  user_role?: Database['public']['Enums']['member_role'];
  joined_at?: string;
}

/**
 * League members table - User membership in leagues
 */
export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  role: Database['public']['Enums']['member_role'];
  joined_at: string;
}

/**
 * League invites table - Invitation system for leagues
 */
export interface LeagueInvite {
  id: string;
  league_id: string;
  created_by: string | null;
  invite_code: string;
  expires_at: string | null;
  max_uses: number | null;
  uses_count: number;
  created_at: string;
}

/**
 * Teams table - NFL team information
 */
export interface Team {
  id: number;
  espn_id: string;
  name: string;
  abbreviation: string;
  location: string;
  display_name: string;
  short_display_name: string;
  nickname: string | null;
  conference: Database['public']['Enums']['conference'];
  division: Database['public']['Enums']['division'];
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Games table - NFL game information
 */
export interface Game {
  id: number;
  espn_id: string;
  week: number;
  season_year: number;
  season_type: Database['public']['Enums']['season_type'];
  game_date: string;
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  status: Database['public']['Enums']['game_status'];
  game_status_detail: string | null;
  created_at: string;
  updated_at: string;
  // Joined team data
  home_team?: Team;
  away_team?: Team;
}

/**
 * Picks table - User picks for games (to be created)
 * Note: This table doesn't exist yet but will be needed for the full system
 */
export interface Pick {
  id: string;
  user_id: string;
  league_id: string;
  game_id: number;
  picked_team_id: number;
  confidence_points: number | null;
  is_correct: boolean | null;
  picked_at: string;
  created_at: string;
  updated_at: string;
  // Joined data
  game?: Game;
  picked_team?: Team;
  league?: League;
}

/**
 * Profiles table - User profile information (auth.users extension)
 */
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================
// Insert Types (for creating new records)
// =====================================

export interface LeagueInsert {
  id?: string;
  name: string;
  description?: string | null;
  created_by?: string | null;
  entry_fee?: number;
  max_members?: number;
  is_private?: boolean;
  password_hash?: string | null;
  invite_code?: string;
  status?: Database['public']['Enums']['league_status'];
}

export interface LeagueMemberInsert {
  id?: string;
  league_id: string;
  user_id: string;
  role?: Database['public']['Enums']['member_role'];
}

export interface LeagueInviteInsert {
  id?: string;
  league_id: string;
  created_by?: string | null;
  invite_code: string;
  expires_at?: string | null;
  max_uses?: number | null;
  uses_count?: number;
}

export interface TeamInsert {
  espn_id: string;
  name: string;
  abbreviation: string;
  location: string;
  display_name: string;
  short_display_name: string;
  nickname?: string | null;
  conference: Database['public']['Enums']['conference'];
  division: Database['public']['Enums']['division'];
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  is_active?: boolean;
}

export interface GameInsert {
  espn_id: string;
  week: number;
  season_year: number;
  season_type?: Database['public']['Enums']['season_type'];
  game_date: string;
  home_team_id: number;
  away_team_id: number;
  home_score?: number | null;
  away_score?: number | null;
  status?: Database['public']['Enums']['game_status'];
  game_status_detail?: string | null;
}

export interface PickInsert {
  id?: string;
  user_id: string;
  league_id: string;
  game_id: number;
  picked_team_id: number;
  confidence_points?: number | null;
  is_correct?: boolean | null;
}

export interface ProfileInsert {
  id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
}

// =====================================
// Update Types (for modifying existing records)
// =====================================

export interface LeagueUpdate {
  name?: string;
  description?: string | null;
  entry_fee?: number;
  max_members?: number;
  is_private?: boolean;
  password_hash?: string | null;
  status?: Database['public']['Enums']['league_status'];
}

export interface LeagueMemberUpdate {
  role?: Database['public']['Enums']['member_role'];
}

export interface LeagueInviteUpdate {
  expires_at?: string | null;
  max_uses?: number | null;
  uses_count?: number;
}

export interface TeamUpdate {
  name?: string;
  abbreviation?: string;
  location?: string;
  display_name?: string;
  short_display_name?: string;
  nickname?: string | null;
  conference?: Database['public']['Enums']['conference'];
  division?: Database['public']['Enums']['division'];
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  is_active?: boolean;
}

export interface GameUpdate {
  week?: number;
  season_year?: number;
  season_type?: Database['public']['Enums']['season_type'];
  game_date?: string;
  home_team_id?: number;
  away_team_id?: number;
  home_score?: number | null;
  away_score?: number | null;
  status?: Database['public']['Enums']['game_status'];
  game_status_detail?: string | null;
}

export interface PickUpdate {
  picked_team_id?: number;
  confidence_points?: number | null;
  is_correct?: boolean | null;
}

export interface ProfileUpdate {
  email?: string;
  display_name?: string | null;
  avatar_url?: string | null;
}

// =====================================
// Composite Types for Complex Queries
// =====================================

/**
 * League with member information (used in user leagues query)
 */
export interface LeagueWithMembership extends League {
  user_role: Database['public']['Enums']['member_role'];
  joined_at: string;
  current_members: number;
}

/**
 * Public league information (used in public leagues query)
 */
export interface PublicLeague {
  id: string;
  name: string;
  description: string | null;
  entry_fee: number;
  max_members: number;
  current_members: number;
  invite_code: string;
  created_at: string;
  available_spots: number;
  is_private: boolean;
  status: Database['public']['Enums']['league_status'];
}

/**
 * Game with team information (used in game displays)
 */
export interface GameWithTeams extends Game {
  home_team: Team;
  away_team: Team;
}

/**
 * Pick with related information (used in picks displays)
 */
export interface PickWithDetails extends Pick {
  game: GameWithTeams;
  picked_team: Team;
  user: Profile;
}

// =====================================
// API Response Types
// =====================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  error?: string;
}

// =====================================
// Query Parameter Types
// =====================================

/**
 * Parameters for querying public leagues
 */
export interface GetPublicLeaguesParams {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'name' | 'members';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Parameters for league filtering
 */
export interface LeagueFilters {
  status?: Database['public']['Enums']['league_status'][];
  isPrivate?: boolean;
  minMembers?: number;
  maxMembers?: number;
  entryFeeRange?: [number, number];
}

// =====================================
// Request/Response Types for Migration
// =====================================

/**
 * Create league request (replacing edge function)
 */
export interface CreateLeagueRequest {
  name: string;
  description?: string;
  entryFee: number;
  maxMembers: number;
  isPrivate: boolean;
  password?: string;
}

/**
 * Join league request (replacing edge function)
 */
export interface JoinLeagueRequest {
  inviteCode: string;
  password?: string;
}

/**
 * Update league request (replacing edge function)
 */
export interface UpdateLeagueRequest {
  name?: string;
  description?: string;
  entryFee?: number;
  maxMembers?: number;
  isPrivate?: boolean;
  password?: string;
  status?: Database['public']['Enums']['league_status'];
}

// =====================================
// Type Guards and Utilities
// =====================================

/**
 * Type guard for checking if an object is a League
 */
export function isLeague(obj: unknown): obj is League {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as League).id === 'string' &&
    typeof (obj as League).name === 'string'
  );
}

/**
 * Type guard for checking if an object is a Game
 */
export function isGame(obj: unknown): obj is Game {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'espn_id' in obj &&
    typeof (obj as Game).id === 'number' &&
    typeof (obj as Game).espn_id === 'string'
  );
}

/**
 * Type guard for checking if an object is a Team
 */
export function isTeam(obj: unknown): obj is Team {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as Team).id === 'number' &&
    typeof (obj as Team).name === 'string'
  );
}

// =====================================
// Error Types
// =====================================

/**
 * Database operation errors
 */
export interface DatabaseError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}

/**
 * RLS Policy violation error
 */
export interface RLSError extends DatabaseError {
  table: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  policy?: string;
}

// =====================================
// Migration Types
// =====================================

/**
 * Feature flag configuration
 */
export interface FeatureFlags {
  use_direct_league_queries: boolean;
  use_direct_member_queries: boolean;
  use_direct_pick_queries: boolean;
  use_realtime_subscriptions: boolean;
  enable_optimistic_updates: boolean;
}

/**
 * Migration status tracking
 */
export interface MigrationStatus {
  phase: 1 | 2 | 3 | 4 | 5;
  completed_tasks: string[];
  current_task: string | null;
  progress_percentage: number;
  rollback_available: boolean;
  feature_flags: FeatureFlags;
}

// =====================================
// Export Types for Easy Access
// =====================================

// Re-export common types for convenience (commented to avoid conflict)
// export type { Database } from './database';
export type LeagueStatus = Database['public']['Enums']['league_status'];
export type MemberRole = Database['public']['Enums']['member_role'];
export type GameStatus = Database['public']['Enums']['game_status'];
export type SeasonType = Database['public']['Enums']['season_type'];
export type Conference = Database['public']['Enums']['conference'];
export type Division = Database['public']['Enums']['division'];

// Table types for direct usage
export type Tables = Database['public']['Tables'];
export type LeagueRow = Tables['leagues']['Row'];
export type LeagueMemberRow = Tables['league_members']['Row'];
export type TeamRow = Tables['teams']['Row'];
export type GameRow = Tables['games']['Row'];
export type PickRow = Tables['picks']['Row'];

/**
 * =================
 * Usage Examples:
 * =================
 * 
 * // Direct Supabase query with types
 * const { data: leagues } = await supabase
 *   .from('leagues')
 *   .select('*')
 *   .returns<League[]>();
 * 
 * // Insert with proper typing
 * const newLeague: LeagueInsert = {
 *   name: 'My League',
 *   entry_fee: 25,
 *   max_members: 12
 * };
 * 
 * // Complex query with joins
 * const { data: leaguesWithMembers } = await supabase
 *   .from('leagues')
 *   .select(`
 *     *,
 *     league_members!inner(
 *       role,
 *       joined_at,
 *       user:profiles(display_name)
 *     )
 *   `)
 *   .returns<LeagueWithMembership[]>();
 */