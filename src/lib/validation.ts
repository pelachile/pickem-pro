/**
 * Validation utilities for the NFL Pick'em application
 * Handles input validation for various database operations
 */

import { supabase } from './supabase';

// League validation
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../types/supabase-generated';

// Picks validation
import type { 
  PickSubmission, 
  PickValidationError, 
  PickValidationResult 
} from '../types/picks';

// Constants for validation
const VALIDATION_RULES = {
  LEAGUE: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    MIN_MEMBERS: 2,
    MAX_MEMBERS: 100,
    MIN_ENTRY_FEE: 0,
    MAX_ENTRY_FEE: 10000,
  },
  INVITE_CODE: {
    LENGTH: 6,
  },
  USER: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 20,
    DISPLAY_NAME_MAX_LENGTH: 50,
  },
};

// Reusable validation functions
export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateStringLength(
  value: string, 
  fieldName: string, 
  minLength: number = 0, 
  maxLength: number = 255
): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
}

export function validatePositiveNumber(value: number, fieldName: string): string | null {
  if (typeof value !== 'number' || value <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
}

export function validateNumberRange(
  value: number, 
  fieldName: string, 
  min: number, 
  max: number
): string | null {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
}

// League-specific validation
export function validateCreateLeague(request: TablesInsert['leagues']): {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // Validate league name
  const nameError = validateStringLength(
    request.name, 
    'League Name', 
    VALIDATION_RULES.LEAGUE.NAME_MIN_LENGTH, 
    VALIDATION_RULES.LEAGUE.NAME_MAX_LENGTH
  );
  if (nameError) errors.push({ field: 'League Name', message: nameError });

  // Validate description (optional)
  if (request.description) {
    const descriptionError = validateStringLength(
      request.description, 
      'Description', 
      0, 
      VALIDATION_RULES.LEAGUE.DESCRIPTION_MAX_LENGTH
    );
    if (descriptionError) errors.push({ field: 'Description', message: descriptionError });
  }

  // Validate max members
  const maxMembersError = validateNumberRange(
    request.max_members || 10, 
    'Max Members', 
    VALIDATION_RULES.LEAGUE.MIN_MEMBERS, 
    VALIDATION_RULES.LEAGUE.MAX_MEMBERS
  );
  if (maxMembersError) errors.push({ field: 'Max Members', message: maxMembersError });

  // Validate entry fee
  const entryFeeError = validateNumberRange(
    request.entry_fee || 0, 
    'Entry Fee', 
    VALIDATION_RULES.LEAGUE.MIN_ENTRY_FEE, 
    VALIDATION_RULES.LEAGUE.MAX_ENTRY_FEE
  );
  if (entryFeeError) errors.push({ field: 'Entry Fee', message: entryFeeError });

  // Validate privacy and password
  if (request.is_private && !request.password) {
    errors.push({ field: 'Password', message: 'Password is required for private leagues' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Picks validation
export function validatePickSubmission(pick: PickSubmission): PickValidationError[] {
  const errors: PickValidationError[] = [];

  // Validate game_id
  const gameIdError = validateRequired(pick.game_id, 'Game ID');
  if (gameIdError) {
    errors.push({
      game_id: pick.game_id,
      error_type: 'invalid_team',
      message: gameIdError
    });
  }

  // Validate picked_team_id
  const teamIdError = validatePositiveNumber(pick.picked_team_id, 'Picked team ID');
  if (teamIdError) {
    errors.push({
      game_id: pick.game_id,
      error_type: 'invalid_team',
      message: teamIdError
    });
  }

  // Validate confidence points if provided
  if (pick.confidence_points !== undefined) {
    const confidenceError = validateNumberRange(
      pick.confidence_points, 
      'Confidence Points', 
      1, 
      16
    );
    if (confidenceError) {
      errors.push({
        game_id: pick.game_id,
        error_type: 'invalid_confidence',
        message: confidenceError
      });
    }
  }

  return errors;
}

// Unique code generation
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < VALIDATION_RULES.INVITE_CODE.LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Sanitization utilities
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeDisplayName(name: string): string {
  return sanitizeString(name).substring(0, VALIDATION_RULES.USER.DISPLAY_NAME_MAX_LENGTH);
}

// Additional league validation functions
export function validateJoinLeague(request: { inviteCode: string; password?: string }): {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // Validate invite code
  const codeError = validateRequired(request.inviteCode, 'Invite Code');
  if (codeError) errors.push({ field: 'Invite Code', message: codeError });
  
  // Validate invite code format
  if (request.inviteCode && request.inviteCode.length !== VALIDATION_RULES.INVITE_CODE.LENGTH) {
    errors.push({ field: 'Invite Code', message: 'Invalid invite code format' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUpdateLeague(request: Partial<TablesUpdate['leagues']>, currentLeague?: Tables['leagues']): {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // Validate name if provided
  if (request.name !== undefined) {
    const nameError = validateStringLength(
      request.name, 
      'League Name', 
      VALIDATION_RULES.LEAGUE.NAME_MIN_LENGTH, 
      VALIDATION_RULES.LEAGUE.NAME_MAX_LENGTH
    );
    if (nameError) errors.push({ field: 'League Name', message: nameError });
  }

  // Validate description if provided
  if (request.description !== undefined && request.description !== null) {
    const descriptionError = validateStringLength(
      request.description, 
      'Description', 
      0, 
      VALIDATION_RULES.LEAGUE.DESCRIPTION_MAX_LENGTH
    );
    if (descriptionError) errors.push({ field: 'Description', message: descriptionError });
  }

  // Validate max members if provided
  if (request.max_members !== undefined) {
    const maxMembersError = validateNumberRange(
      request.max_members, 
      'Max Members', 
      VALIDATION_RULES.LEAGUE.MIN_MEMBERS, 
      VALIDATION_RULES.LEAGUE.MAX_MEMBERS
    );
    if (maxMembersError) errors.push({ field: 'Max Members', message: maxMembersError });
  }

  // Validate entry fee if provided
  if (request.entry_fee !== undefined) {
    const entryFeeError = validateNumberRange(
      request.entry_fee, 
      'Entry Fee', 
      VALIDATION_RULES.LEAGUE.MIN_ENTRY_FEE, 
      VALIDATION_RULES.LEAGUE.MAX_ENTRY_FEE
    );
    if (entryFeeError) errors.push({ field: 'Entry Fee', message: entryFeeError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateLeagueJoinability(
  league: Tables['leagues'] & { current_members?: number },
  isAlreadyMember: boolean = false
): {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // Check if already a member
  if (isAlreadyMember) {
    errors.push({ field: 'membership', message: 'You are already a member of this league' });
  }

  // Check if league is full
  const currentMembers = league.current_members || 0;
  const maxMembers = league.max_members || 50;
  if (currentMembers >= maxMembers) {
    errors.push({ field: 'capacity', message: 'This league is full' });
  }

  // Check league status - only allow joining active leagues
  if (league.status !== 'active') {
    errors.push({ 
      field: 'status', 
      message: `Cannot join ${league.status} league` 
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateLeagueDeletePermissions(
  userRole: 'owner' | 'admin' | 'member',
  leagueStatus: Tables['leagues']['status']
): {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // Only owners can delete leagues
  if (userRole !== 'owner') {
    errors.push({
      field: 'permissions',
      message: 'Only league owners can delete leagues'
    });
  }

  // Cannot delete active leagues
  if (leagueStatus === 'active') {
    errors.push({
      field: 'status',
      message: 'Cannot delete active leagues. Please set status to cancelled first.'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function formatValidationErrors(errors: Array<{ field: string; message: string }>): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  
  return errors
    .map((error, index) => `${index + 1}. ${error.message}`)
    .join('\n');
}

// Picks-specific validation functions
export async function validateLeagueMembership(userId: string, leagueId: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const { data: memberships, error } = await supabase
      .from('league_members')
      .select('id')
      .eq('user_id', userId)
      .eq('league_id', leagueId);

    if (error) {
      return { isValid: false, error: 'Failed to check league membership' };
    }

    const membership = memberships && memberships.length > 0 ? memberships[0] : null;

    return { 
      isValid: !!membership,
      error: membership ? undefined : 'You are not a member of this league'
    };
  } catch (error) {
    return { isValid: false, error: 'Failed to validate league membership' };
  }
}

interface GameCacheData {
  schedule?: {
    by_week?: Record<string, Array<{
      id: string | number;
      espn_id?: string | number;
      game_status?: string;
      has_started?: boolean;
    }>>;
  };
}

interface GameData {
  id: number;
  game_date: string;
  home_team_id: number;
  away_team_id: number;
  game_status?: string;
  has_started?: boolean;
}

export async function validateGameScheduled(gameId: number | string, cacheData?: GameCacheData): Promise<{
  isValid: boolean;
  error?: string;
  gameData?: GameData;
}> {
  try {
    // Get static game data from database (no dynamic fields like status)
    const { data: game, error } = await supabase
      .from('games')
      .select('id, game_date, home_team_id, away_team_id')
      .eq('id', gameId)
      .single();

    if (error) {
      return { isValid: false, error: 'Game not found' };
    }

    // If cache data is provided, check game status from cache
    if (cacheData) {
      const cacheGame = cacheData.schedule?.by_week 
        ? Object.values(cacheData.schedule.by_week).flat().find((g) => 
            String(g.id) === String(gameId) || String(g.espn_id) === String(gameId)
          )
        : null;

      if (cacheGame) {
        // Check if game is completed or in progress based on cache status
        const isCompleted = cacheGame.status === 'STATUS_FINAL' || cacheGame.is_completed;
        const isInProgress = cacheGame.status === 'STATUS_IN_PROGRESS' || cacheGame.is_in_progress;
        
        if (isCompleted || isInProgress) {
          return { 
            isValid: false, 
            error: 'Cannot make picks for games that have already started or finished'
          };
        }
      }
    }

    // Fallback: Check if game is in the future (date-based validation)
    const gameTime = new Date(game.game_date);
    const now = new Date();
    if (gameTime <= now) {
      return { 
        isValid: false, 
        error: 'Cannot make picks for games that have already started'
      };
    }

    return { 
      isValid: true, 
      gameData: game
    };
  } catch (error) {
    return { isValid: false, error: 'Failed to validate game' };
  }
}

export async function validateTeamInGame(gameId: number | string, teamId: number | string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const { data: game, error } = await supabase
      .from('games')
      .select('home_team_id, away_team_id')
      .eq('id', gameId)
      .single();

    if (error) {
      return { isValid: false, error: 'Game not found' };
    }

    const teamIdNum = Number(teamId);
    const isValidTeam = teamIdNum === game.home_team_id || teamIdNum === game.away_team_id;

    return { 
      isValid: isValidTeam,
      error: isValidTeam ? undefined : 'Selected team is not playing in this game'
    };
  } catch (error) {
    return { isValid: false, error: 'Failed to validate team selection' };
  }
}

export function validatePicksBatch(picks: PickSubmission[]): PickValidationResult {
  const errors: PickValidationError[] = [];

  if (!picks || picks.length === 0) {
    return {
      isValid: false,
      errors: [{
        game_id: '',
        error_type: 'invalid_submission',
        message: 'No picks provided'
      }]
    };
  }

  // Validate each pick
  for (const pick of picks) {
    const pickErrors = validatePickSubmission(pick);
    errors.push(...pickErrors);
  }

  // Check for duplicate games
  const gameIds = picks.map(p => p.game_id);
  const duplicateGameIds = gameIds.filter((id, index) => gameIds.indexOf(id) !== index);
  
  for (const duplicateId of duplicateGameIds) {
    errors.push({
      game_id: duplicateId,
      error_type: 'duplicate_pick',
      message: 'Cannot submit multiple picks for the same game'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  validateCreateLeague,
  validateJoinLeague,
  validateUpdateLeague,
  validateLeagueJoinability,
  validateLeagueDeletePermissions,
  validatePickSubmission,
  validateLeagueMembership,
  validateGameScheduled,
  validateTeamInGame,
  validatePicksBatch,
  generateInviteCode,
  formatValidationErrors,
  sanitizeDisplayName,
};