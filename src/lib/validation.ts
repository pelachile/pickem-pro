/**
 * Client-side validation utilities for league operations
 * Replaces edge function validation logic during migration
 */

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../types/supabase-generated';
import type {
  JoinLeagueRequest,
  UpdateLeagueRequest,
} from '../types/league';

// Type aliases for cleaner code
type League = Tables<'leagues'>;
type LeagueInsert = TablesInsert<'leagues'>;

// Define missing types locally
interface CreateLeagueRequest {
  name: string;
  description?: string;
  entryFee: number;
  maxMembers: number;
  isPrivate: boolean;
  password?: string;
}

// =====================================
// Validation Error Types
// =====================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// =====================================
// Core Validation Rules
// =====================================

const VALIDATION_RULES = {
  LEAGUE_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9\s\-_'"!&]+$/,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  ENTRY_FEE: {
    MIN: 0,
    MAX: 1000,
  },
  MAX_MEMBERS: {
    MIN: 2,
    MAX: 50,
  },
  INVITE_CODE: {
    LENGTH: 6,
    PATTERN: /^[A-Z0-9]{6}$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
} as const;

// =====================================
// Helper Functions
// =====================================

/**
 * Creates a validation error
 */
function createError(field: string, message: string, code: string): ValidationError {
  return { field, message, code };
}

/**
 * Validates a string field
 */
function validateString(
  value: string | null | undefined,
  field: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    patternMessage?: string;
  }
): ValidationError[] {
  const errors: ValidationError[] = [];
  const str = (value || '').trim();

  if (rules.required && !str) {
    errors.push(createError(field, `${field} is required`, 'REQUIRED'));
    return errors;
  }

  if (str && rules.minLength && str.length < rules.minLength) {
    errors.push(
      createError(
        field,
        `${field} must be at least ${rules.minLength} characters`,
        'MIN_LENGTH'
      )
    );
  }

  if (str && rules.maxLength && str.length > rules.maxLength) {
    errors.push(
      createError(
        field,
        `${field} must be no more than ${rules.maxLength} characters`,
        'MAX_LENGTH'
      )
    );
  }

  if (str && rules.pattern && !rules.pattern.test(str)) {
    errors.push(
      createError(
        field,
        rules.patternMessage || `${field} contains invalid characters`,
        'PATTERN'
      )
    );
  }

  return errors;
}

/**
 * Validates a number field
 */
function validateNumber(
  value: number | string | null | undefined,
  field: string,
  rules: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  }
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (rules.required && (value === null || value === undefined || value === '')) {
    errors.push(createError(field, `${field} is required`, 'REQUIRED'));
    return errors;
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (value !== null && value !== undefined && value !== '' && isNaN(num as number)) {
    errors.push(createError(field, `${field} must be a valid number`, 'INVALID_NUMBER'));
    return errors;
  }

  if (typeof num === 'number') {
    if (rules.integer && !Number.isInteger(num)) {
      errors.push(createError(field, `${field} must be a whole number`, 'NOT_INTEGER'));
    }

    if (rules.min !== undefined && num < rules.min) {
      errors.push(
        createError(field, `${field} must be at least ${rules.min}`, 'MIN_VALUE')
      );
    }

    if (rules.max !== undefined && num > rules.max) {
      errors.push(
        createError(field, `${field} must be no more than ${rules.max}`, 'MAX_VALUE')
      );
    }
  }

  return errors;
}

// =====================================
// League Creation Validation
// =====================================

/**
 * Validates league creation data
 */
export function validateCreateLeague(data: CreateLeagueRequest): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate name
  errors.push(
    ...validateString(data.name, 'League name', {
      required: true,
      minLength: VALIDATION_RULES.LEAGUE_NAME.MIN_LENGTH,
      maxLength: VALIDATION_RULES.LEAGUE_NAME.MAX_LENGTH,
      pattern: VALIDATION_RULES.LEAGUE_NAME.PATTERN,
      patternMessage:
        'League name can only contain letters, numbers, spaces, and common punctuation',
    })
  );

  // Validate description
  if (data.description) {
    errors.push(
      ...validateString(data.description, 'Description', {
        maxLength: VALIDATION_RULES.DESCRIPTION.MAX_LENGTH,
      })
    );
  }

  // Validate entry fee
  errors.push(
    ...validateNumber(data.entryFee, 'Entry fee', {
      required: true,
      min: VALIDATION_RULES.ENTRY_FEE.MIN,
      max: VALIDATION_RULES.ENTRY_FEE.MAX,
    })
  );

  // Validate max members
  errors.push(
    ...validateNumber(data.maxMembers, 'Maximum members', {
      required: true,
      min: VALIDATION_RULES.MAX_MEMBERS.MIN,
      max: VALIDATION_RULES.MAX_MEMBERS.MAX,
      integer: true,
    })
  );

  // Validate password if private
  if (data.isPrivate && data.password) {
    errors.push(
      ...validateString(data.password, 'Password', {
        required: true,
        minLength: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
        maxLength: VALIDATION_RULES.PASSWORD.MAX_LENGTH,
      })
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates league insert data for database
 */
export function validateLeagueInsert(data: LeagueInsert): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate name
  errors.push(
    ...validateString(data.name, 'League name', {
      required: true,
      minLength: VALIDATION_RULES.LEAGUE_NAME.MIN_LENGTH,
      maxLength: VALIDATION_RULES.LEAGUE_NAME.MAX_LENGTH,
      pattern: VALIDATION_RULES.LEAGUE_NAME.PATTERN,
    })
  );

  // Validate entry fee
  if (data.entry_fee !== undefined) {
    errors.push(
      ...validateNumber(data.entry_fee, 'Entry fee', {
        min: VALIDATION_RULES.ENTRY_FEE.MIN,
        max: VALIDATION_RULES.ENTRY_FEE.MAX,
      })
    );
  }

  // Validate max members
  if (data.max_members !== undefined) {
    errors.push(
      ...validateNumber(data.max_members, 'Maximum members', {
        min: VALIDATION_RULES.MAX_MEMBERS.MIN,
        max: VALIDATION_RULES.MAX_MEMBERS.MAX,
        integer: true,
      })
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// =====================================
// League Update Validation
// =====================================

/**
 * Validates league update data
 */
export function validateUpdateLeague(
  data: UpdateLeagueRequest,
  currentLeague?: League
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate name if provided
  if (data.name !== undefined) {
    errors.push(
      ...validateString(data.name, 'League name', {
        required: true,
        minLength: VALIDATION_RULES.LEAGUE_NAME.MIN_LENGTH,
        maxLength: VALIDATION_RULES.LEAGUE_NAME.MAX_LENGTH,
        pattern: VALIDATION_RULES.LEAGUE_NAME.PATTERN,
      })
    );
  }

  // Validate description if provided
  if (data.description !== undefined) {
    errors.push(
      ...validateString(data.description, 'Description', {
        maxLength: VALIDATION_RULES.DESCRIPTION.MAX_LENGTH,
      })
    );
  }

  // Validate entry fee if provided
  if (data.entryFee !== undefined) {
    errors.push(
      ...validateNumber(data.entryFee, 'Entry fee', {
        min: VALIDATION_RULES.ENTRY_FEE.MIN,
        max: VALIDATION_RULES.ENTRY_FEE.MAX,
      })
    );
  }

  // Validate max members if provided
  if (data.maxMembers !== undefined) {
    errors.push(
      ...validateNumber(data.maxMembers, 'Maximum members', {
        min: VALIDATION_RULES.MAX_MEMBERS.MIN,
        max: VALIDATION_RULES.MAX_MEMBERS.MAX,
        integer: true,
      })
    );

    // Additional validation: can't reduce below current member count
    if (currentLeague && data.maxMembers < currentLeague.current_members!) {
      errors.push(
        createError(
          'maxMembers',
          `Cannot reduce maximum members below current member count (${currentLeague.current_members})`,
          'BELOW_CURRENT_MEMBERS'
        )
      );
    }
  }

  // Validate password if making league private
  if (data.isPrivate === true && data.password) {
    errors.push(
      ...validateString(data.password, 'Password', {
        minLength: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
        maxLength: VALIDATION_RULES.PASSWORD.MAX_LENGTH,
      })
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// =====================================
// Join League Validation
// =====================================

/**
 * Validates join league request
 */
export function validateJoinLeague(data: JoinLeagueRequest): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate invite code
  errors.push(
    ...validateString(data.inviteCode, 'Invite code', {
      required: true,
      pattern: VALIDATION_RULES.INVITE_CODE.PATTERN,
      patternMessage: 'Invite code must be 6 characters long and contain only letters and numbers',
    })
  );

  // Validate password if provided
  if (data.password) {
    errors.push(
      ...validateString(data.password, 'Password', {
        minLength: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
        maxLength: VALIDATION_RULES.PASSWORD.MAX_LENGTH,
      })
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// =====================================
// Business Logic Validation
// =====================================

/**
 * Validates if a user can join a league
 */
export function validateLeagueJoinability(
  league: League & { current_members: number },
  isAlreadyMember: boolean = false
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if already a member
  if (isAlreadyMember) {
    errors.push(createError('membership', 'You are already a member of this league', 'ALREADY_MEMBER'));
  }

  // Check if league is full
  if (league.current_members >= (league.max_members || 50)) {
    errors.push(createError('capacity', 'This league is full', 'LEAGUE_FULL'));
  }

  // Check league status - only allow joining active leagues
  if (league.status !== 'active') {
    errors.push(
      createError(
        'status',
        `Cannot join ${league.status} league`,
        'INVALID_STATUS'
      )
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates if a user can update a league
 */
export function validateLeagueUpdatePermissions(
  userRole: 'owner' | 'admin' | 'member',
  updateData: UpdateLeagueRequest
): ValidationResult {
  const errors: ValidationError[] = [];

  // Only owners and admins can update league
  if (userRole === 'member') {
    errors.push(
      createError(
        'permissions',
        'Only league owners and administrators can update league settings',
        'INSUFFICIENT_PERMISSIONS'
      )
    );
    return { isValid: false, errors };
  }

  // Only owners can delete leagues or change critical settings
  if (userRole === 'admin') {
    const restrictedFields = ['entryFee', 'isPrivate', 'status'];
    const hasRestrictedUpdates = restrictedFields.some(field => 
      updateData[field as keyof UpdateLeagueRequest] !== undefined
    );
    
    if (hasRestrictedUpdates) {
      errors.push(
        createError(
          'permissions',
          'Only league owners can modify entry fee, privacy settings, or status',
          'ADMIN_RESTRICTED'
        )
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates league deletion permissions
 */
export function validateLeagueDeletePermissions(
  userRole: 'owner' | 'admin' | 'member',
  leagueStatus: League['status']
): ValidationResult {
  const errors: ValidationError[] = [];

  // Only owners can delete leagues
  if (userRole !== 'owner') {
    errors.push(
      createError(
        'permissions',
        'Only league owners can delete leagues',
        'INSUFFICIENT_PERMISSIONS'
      )
    );
  }

  // Cannot delete active leagues with picks
  if (leagueStatus === 'active') {
    errors.push(
      createError(
        'status',
        'Cannot delete active leagues. Please set status to cancelled first.',
        'ACTIVE_LEAGUE'
      )
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// =====================================
// Utility Functions
// =====================================

/**
 * Formats validation errors for user display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  
  return errors
    .map((error, index) => `${index + 1}. ${error.message}`)
    .join('\n');
}

/**
 * Gets the first error for a specific field
 */
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(error => error.field.toLowerCase() === field.toLowerCase())?.message;
}

/**
 * Checks if validation errors contain a specific error code
 */
export function hasErrorCode(errors: ValidationError[], code: string): boolean {
  return errors.some(error => error.code === code);
}

/**
 * Generate a random invite code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < VALIDATION_RULES.INVITE_CODE.LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
