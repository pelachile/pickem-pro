// Validation utilities for the NFL Pick'em application

import { supabase } from './supabase';
import type { PickSubmission, PickValidationError } from '../types/picks';

// Validate required fields
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate UUID format
export const validateUuid = (value: string, fieldName: string): string | null => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    return `${fieldName} must be a valid UUID`;
  }
  return null;
};

// Validate positive number
export const validatePositiveNumber = (value: number, fieldName: string): string | null => {
  if (typeof value !== 'number' || value <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

// Validate confidence points range
export const validateConfidencePoints = (points: number): string | null => {
  if (typeof points !== 'number' || points < 1 || points > 16) {
    return 'Confidence points must be between 1 and 16';
  }
  return null;
};

// Validate email format
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

// Validate string length
export const validateStringLength = (
  value: string, 
  fieldName: string, 
  minLength: number = 0, 
  maxLength: number = 255
): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

// Validate array not empty
export const validateArrayNotEmpty = (array: any[], fieldName: string): string | null => {
  if (!Array.isArray(array) || array.length === 0) {
    return `${fieldName} must contain at least one item`;
  }
  return null;
};

// Comprehensive pick submission validation
export const validatePickSubmission = (pick: PickSubmission): PickValidationError[] => {
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
    const confidenceError = validateConfidencePoints(pick.confidence_points);
    if (confidenceError) {
      errors.push({
        game_id: pick.game_id,
        error_type: 'invalid_team',
        message: confidenceError
      });
    }
  }

  return errors;
};

// Validate league membership
export const validateLeagueMembership = async (
  userId: string, 
  leagueId: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const { data: membership, error } = await supabase
      .from('league_members')
      .select('id, status')
      .eq('user_id', userId)
      .eq('league_id', leagueId)
      .eq('status', 'active')
      .single();

    if (error || !membership) {
      return {
        isValid: false,
        error: 'User is not an active member of this league'
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate league membership'
    };
  }
};

// Validate game exists and is scheduled
export const validateGameScheduled = async (gameId: string): Promise<{
  isValid: boolean;
  error?: string;
  game?: any;
}> => {
  try {
    const { data: game, error } = await supabase
      .from('games')
      .select('id, date, status, home_team_id, away_team_id')
      .eq('id', gameId)
      .single();

    if (error || !game) {
      return {
        isValid: false,
        error: 'Game not found'
      };
    }

    const gameDate = new Date(game.date);
    const now = new Date();
    
    if (now >= gameDate) {
      return {
        isValid: false,
        error: 'Game has already started',
        game
      };
    }

    if (game.status !== 'scheduled') {
      return {
        isValid: false,
        error: 'Game is not in scheduled status',
        game
      };
    }

    return {
      isValid: true,
      game
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate game status'
    };
  }
};

// Validate team is playing in the game
export const validateTeamInGame = (
  teamId: number,
  homeTeamId: number,
  awayTeamId: number
): string | null => {
  if (teamId !== homeTeamId && teamId !== awayTeamId) {
    return 'Selected team is not playing in this game';
  }
  return null;
};

// Batch validation for multiple picks
export const validatePicksBatch = (picks: PickSubmission[]): {
  isValid: boolean;
  errors: PickValidationError[];
  duplicateGames: string[];
} => {
  const errors: PickValidationError[] = [];
  const gameIds = new Set<string>();
  const duplicateGames: string[] = [];

  // Validate each pick individually
  picks.forEach(pick => {
    const pickErrors = validatePickSubmission(pick);
    errors.push(...pickErrors);

    // Check for duplicate game picks
    if (gameIds.has(pick.game_id)) {
      duplicateGames.push(pick.game_id);
      errors.push({
        game_id: pick.game_id,
        error_type: 'duplicate_pick',
        message: 'Multiple picks submitted for the same game'
      });
    } else {
      gameIds.add(pick.game_id);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    duplicateGames: [...new Set(duplicateGames)]
  };
};

// Database constraint validation
export const validateDatabaseConstraints = {
  league: {
    name: (name: string) => validateStringLength(name, 'League name', 1, 100),
    description: (description?: string) => 
      description ? validateStringLength(description, 'Description', 0, 500) : null,
    maxMembers: (maxMembers: number) => {
      if (maxMembers < 2 || maxMembers > 100) {
        return 'Max members must be between 2 and 100';
      }
      return null;
    },
    entryFee: (entryFee: number) => {
      if (entryFee < 0 || entryFee > 10000) {
        return 'Entry fee must be between $0 and $10,000';
      }
      return null;
    }
  },
  
  user: {
    email: validateEmail,
    displayName: (name: string) => validateStringLength(name, 'Display name', 1, 50)
  },
  
  pick: {
    confidencePoints: validateConfidencePoints,
    gameId: (gameId: string) => validateUuid(gameId, 'Game ID'),
    teamId: (teamId: number) => validatePositiveNumber(teamId, 'Team ID')
  }
};

// Sanitize user input
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Clean and validate display name
export const sanitizeDisplayName = (name: string): string => {
  return sanitizeString(name).substring(0, 50);
};

// Validate pagination parameters
export const validatePagination = (limit?: number, offset?: number): {
  limit: number;
  offset: number;
  errors: string[];
} => {
  const errors: string[] = [];
  let validLimit = 20; // default
  let validOffset = 0; // default

  if (limit !== undefined) {
    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      errors.push('Limit must be between 1 and 100');
    } else {
      validLimit = limit;
    }
  }

  if (offset !== undefined) {
    if (typeof offset !== 'number' || offset < 0) {
      errors.push('Offset must be a non-negative number');
    } else {
      validOffset = offset;
    }
  }

  return { limit: validLimit, offset: validOffset, errors };
};