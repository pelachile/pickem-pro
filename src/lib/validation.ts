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
export function validateRequired(value: any, fieldName: string): string | null {
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

export default {
  validateCreateLeague,
  validatePickSubmission,
  generateInviteCode,
  sanitizeDisplayName,
};