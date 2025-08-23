/**
 * Validation utilities for Supabase Edge Functions
 */

import { ValidationResult, GetPublicLeaguesParams } from './types.ts';

export function validateNumber(
  value: string | null | undefined, 
  min?: number, 
  max?: number, 
  defaultValue?: number
): ValidationResult {
  if (!value) {
    if (defaultValue !== undefined) {
      return { isValid: true, value: defaultValue };
    }
    return { isValid: false, error: 'Value is required' };
  }

  const numValue = parseInt(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Value must be a valid number' };
  }

  if (min !== undefined && numValue < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && numValue > max) {
    return { isValid: false, error: `Value must be at most ${max}` };
  }

  return { isValid: true, value: numValue };
}

export function validateString(
  value: string | null | undefined,
  allowedValues?: string[],
  defaultValue?: string
): ValidationResult {
  if (!value) {
    if (defaultValue !== undefined) {
      return { isValid: true, value: defaultValue };
    }
    return { isValid: false, error: 'Value is required' };
  }

  if (allowedValues && !allowedValues.includes(value)) {
    return { isValid: false, error: `Value must be one of: ${allowedValues.join(', ')}` };
  }

  return { isValid: true, value };
}

export function sanitizeSearchTerm(search: string | null | undefined): string | null {
  if (!search) return null;
  
  // Remove potentially harmful characters and trim
  const sanitized = search
    .trim()
    .replace(/[%_\\]/g, '') // Remove SQL wildcards and escape characters
    .replace(/[<>\"']/g, '') // Remove potential XSS characters
    .slice(0, 100); // Limit length
    
  return sanitized.length > 0 ? sanitized : null;
}

export function validateGetPublicLeaguesParams(url: URL): ValidationResult {
  const params: GetPublicLeaguesParams = {};
  
  // Validate limit
  const limitResult = validateNumber(
    url.searchParams.get('limit'),
    1,
    50,
    20
  );
  if (!limitResult.isValid) {
    return { isValid: false, error: `Invalid limit: ${limitResult.error}` };
  }
  params.limit = limitResult.value;

  // Validate offset
  const offsetResult = validateNumber(
    url.searchParams.get('offset'),
    0,
    undefined,
    0
  );
  if (!offsetResult.isValid) {
    return { isValid: false, error: `Invalid offset: ${offsetResult.error}` };
  }
  params.offset = offsetResult.value;

  // Validate sortBy
  const sortByResult = validateString(
    url.searchParams.get('sortBy'),
    ['created_at', 'name', 'members'],
    'created_at'
  );
  if (!sortByResult.isValid) {
    return { isValid: false, error: `Invalid sortBy: ${sortByResult.error}` };
  }
  params.sortBy = sortByResult.value;

  // Validate sortOrder
  const sortOrderResult = validateString(
    url.searchParams.get('sortOrder'),
    ['asc', 'desc'],
    'desc'
  );
  if (!sortOrderResult.isValid) {
    return { isValid: false, error: `Invalid sortOrder: ${sortOrderResult.error}` };
  }
  params.sortOrder = sortOrderResult.value;

  // Sanitize search term
  params.search = sanitizeSearchTerm(url.searchParams.get('search'));

  return { isValid: true, value: params };
}