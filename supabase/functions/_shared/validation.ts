/**
 * Validation utilities for Supabase Edge Functions
 * 
 * Provides reusable validation functions for common input types
 * and request validation patterns.
 */

import { ValidationError, CreateLeagueRequest, JoinLeagueRequest } from './types.ts';

/**
 * Validate a league creation request
 * 
 * @param data - The request data to validate
 * @returns ValidationError[] - Array of validation errors (empty if valid)
 */
export function validateCreateLeagueRequest(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Type validation
  if (typeof data.name !== 'string') {
    errors.push({ field: 'name', message: 'Name must be a string', code: 'INVALID_TYPE' });
  }
  
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string', code: 'INVALID_TYPE' });
  }
  
  if (typeof data.entryFee !== 'number') {
    errors.push({ field: 'entryFee', message: 'Entry fee must be a number', code: 'INVALID_TYPE' });
  }
  
  if (typeof data.maxMembers !== 'number') {
    errors.push({ field: 'maxMembers', message: 'Max members must be a number', code: 'INVALID_TYPE' });
  }
  
  if (typeof data.isPrivate !== 'boolean') {
    errors.push({ field: 'isPrivate', message: 'IsPrivate must be a boolean', code: 'INVALID_TYPE' });
  }
  
  if (data.password !== undefined && typeof data.password !== 'string') {
    errors.push({ field: 'password', message: 'Password must be a string', code: 'INVALID_TYPE' });
  }

  // Content validation (only if types are correct)
  if (typeof data.name === 'string') {
    if (!data.name || data.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'League name is required', code: 'REQUIRED' });
    } else if (data.name.trim().length > 100) {
      errors.push({ field: 'name', message: 'League name must be 100 characters or less', code: 'TOO_LONG' });
    }
  }

  if (typeof data.description === 'string' && data.description.trim().length > 500) {
    errors.push({ field: 'description', message: 'Description must be 500 characters or less', code: 'TOO_LONG' });
  }

  if (typeof data.entryFee === 'number') {
    if (data.entryFee < 0) {
      errors.push({ field: 'entryFee', message: 'Entry fee cannot be negative', code: 'INVALID_VALUE' });
    }
    
    // Check for at most 2 decimal places
    if (!Number.isInteger(data.entryFee * 100)) {
      errors.push({ field: 'entryFee', message: 'Entry fee must have at most 2 decimal places', code: 'INVALID_PRECISION' });
    }
  }

  if (typeof data.maxMembers === 'number') {
    if (!Number.isInteger(data.maxMembers)) {
      errors.push({ field: 'maxMembers', message: 'Max members must be an integer', code: 'INVALID_TYPE' });
    } else if (data.maxMembers < 2 || data.maxMembers > 50) {
      errors.push({ field: 'maxMembers', message: 'Max members must be between 2 and 50', code: 'OUT_OF_RANGE' });
    }
  }

  if (typeof data.isPrivate === 'boolean' && data.isPrivate) {
    if (!data.password || typeof data.password !== 'string' || data.password.trim().length === 0) {
      errors.push({ field: 'password', message: 'Password is required for private leagues', code: 'REQUIRED' });
    } else if (data.password.length < 4) {
      errors.push({ field: 'password', message: 'Password must be at least 4 characters long', code: 'TOO_SHORT' });
    }
  }

  return errors;
}

/**
 * Sanitize string input by trimming whitespace and normalizing
 * 
 * @param input - The string to sanitize
 * @param maxLength - Maximum allowed length (optional)
 * @returns string - Sanitized string
 */
export function sanitizeString(input: string, maxLength?: number): string {
  let sanitized = input.trim();
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Check if a value is a valid email address
 * 
 * @param email - The email string to validate
 * @returns boolean - True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a password meets security requirements
 * 
 * @param password - The password to validate
 * @param minLength - Minimum password length (default: 8)
 * @returns ValidationError[] - Array of validation errors
 */
export function validatePassword(password: string, minLength: number = 8): ValidationError[] {
  const errors: ValidationError[] = [];

  if (password.length < minLength) {
    errors.push({ 
      field: 'password', 
      message: `Password must be at least ${minLength} characters long`, 
      code: 'TOO_SHORT' 
    });
  }

  // Check for at least one letter and one number for stronger passwords
  if (minLength >= 8) {
    if (!/[a-zA-Z]/.test(password)) {
      errors.push({ 
        field: 'password', 
        message: 'Password must contain at least one letter', 
        code: 'MISSING_LETTER' 
      });
    }
    
    if (!/\d/.test(password)) {
      errors.push({ 
        field: 'password', 
        message: 'Password must contain at least one number', 
        code: 'MISSING_NUMBER' 
      });
    }
  }

  return errors;
}

/**
 * Validate a join league request
 * 
 * @param data - The request data to validate
 * @returns ValidationError[] - Array of validation errors (empty if valid)
 */
export function validateJoinLeagueRequest(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Type validation
  if (typeof data.inviteCode !== 'string') {
    errors.push({ field: 'inviteCode', message: 'Invite code must be a string', code: 'INVALID_TYPE' });
  }
  
  if (data.password !== undefined && typeof data.password !== 'string') {
    errors.push({ field: 'password', message: 'Password must be a string', code: 'INVALID_TYPE' });
  }

  // Content validation (only if types are correct)
  if (typeof data.inviteCode === 'string') {
    const trimmedCode = data.inviteCode.trim();
    if (!trimmedCode || trimmedCode.length === 0) {
      errors.push({ field: 'inviteCode', message: 'Invite code is required', code: 'REQUIRED' });
    } else if (trimmedCode.length < 4 || trimmedCode.length > 20) {
      errors.push({ field: 'inviteCode', message: 'Invite code must be between 4 and 20 characters', code: 'INVALID_LENGTH' });
    } else if (!/^[A-Z0-9]+$/i.test(trimmedCode)) {
      errors.push({ field: 'inviteCode', message: 'Invite code must contain only letters and numbers', code: 'INVALID_FORMAT' });
    }
  }

  if (typeof data.password === 'string' && data.password.trim().length === 0) {
    errors.push({ field: 'password', message: 'Password cannot be empty', code: 'EMPTY_PASSWORD' });
  }

  return errors;
}

/**
 * Parse and validate JSON request body
 * 
 * @param request - The Request object
 * @returns Promise<any> - Parsed JSON object
 * @throws Error if JSON is invalid
 */
export async function parseJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}