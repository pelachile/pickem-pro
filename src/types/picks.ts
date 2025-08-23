// Picks-related types for the NFL Pick'em application

import type { Game, Team } from '../lib/api';

// Base pick interface matching database schema
export interface Pick {
  id: string;
  user_id: string;
  league_id: string;
  game_id: string;
  picked_team_id: number;
  is_correct: boolean | null;
  confidence_points: number;
  created_at: string;
  updated_at: string;
}

// Pick with additional data for UI display
export interface UserPick extends Pick {
  game?: Game;
  picked_team?: Team;
}

// Pick submission for creating/updating picks
export interface PickSubmission {
  game_id: string;
  picked_team_id: number;
  confidence_points?: number;
}

// Batch pick submission
export interface BatchPickSubmission {
  league_id: string;
  picks: PickSubmission[];
}

// League standings entry
export interface LeagueStanding {
  user_id: string;
  display_name: string;
  email?: string;
  total_picks: number;
  correct_picks: number;
  incorrect_picks: number;
  pending_picks: number;
  win_percentage: number;
  total_confidence_points: number;
  position: number;
  is_tied: boolean;
}

// Week-specific pick summary
export interface WeekPickSummary {
  week: number;
  total_games: number;
  picks_made: number;
  picks_pending: number;
  deadline_passed: boolean;
  last_pick_deadline?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pick operations request/response types
export interface SubmitPicksRequest {
  league_id: string;
  picks: PickSubmission[];
}

export interface SubmitPicksResponse extends ApiResponse<UserPick[]> {
  picks_created: number;
  picks_updated: number;
}

export interface GetUserPicksRequest {
  league_id: string;
  week?: number;
  season_year?: number;
}

export interface GetUserPicksResponse extends ApiResponse<UserPick[]> {
  total_picks: number;
  week_summary?: WeekPickSummary;
}

export interface UpdatePickRequest {
  picked_team_id: number;
  confidence_points?: number;
}

export interface UpdatePickResponse extends ApiResponse<UserPick> {}

export interface GetLeagueStandingsRequest {
  league_id: string;
  week?: number;
  season_year?: number;
}

export interface GetLeagueStandingsResponse extends ApiResponse<LeagueStanding[]> {
  total_participants: number;
  last_updated?: string;
}

// Pick validation types
export interface PickValidationError {
  game_id: string;
  error_type: 'deadline_passed' | 'game_started' | 'invalid_team' | 'duplicate_pick';
  message: string;
}

export interface PickValidationResult {
  valid: boolean;
  errors: PickValidationError[];
  warnings: string[];
}

// Confidence points settings
export interface ConfidenceSettings {
  enabled: boolean;
  min_points: number;
  max_points: number;
  must_use_all_points: boolean;
}

// Pick deadline information
export interface PickDeadline {
  game_id: string;
  game_date: string;
  deadline_passed: boolean;
  minutes_until_deadline?: number;
}

// Database operation options
export interface PicksQueryOptions {
  include_game_data?: boolean;
  include_team_data?: boolean;
  order_by?: 'created_at' | 'game_date' | 'confidence_points';
  order_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Upsert operation result
export interface UpsertResult<T> {
  created: T[];
  updated: T[];
  errors: string[];
}