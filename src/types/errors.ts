/**
 * Centralized error types and interfaces for type-safe error handling
 */

/**
 * Base error response interface for API and authentication errors
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

/**
 * Authentication-specific error response
 */
export interface AuthErrorResponse extends ErrorResponse {
  status: number;
  message: string;
  code?: string;
  isRetryable?: boolean;
}

/**
 * Supabase error structure
 */
export interface SupabaseErrorResponse {
  message: string;
  status?: number;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * API error with validation details
 */
export interface ApiValidationError extends ErrorResponse {
  validationErrors?: ValidationError[];
}

/**
 * Type guard to check if an error is an AuthErrorResponse
 */
export function isAuthError(error: unknown): error is AuthErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    typeof (error as AuthErrorResponse).status === 'number' &&
    typeof (error as AuthErrorResponse).message === 'string'
  );
}

/**
 * Type guard to check if an error is a SupabaseErrorResponse
 */
export function isSupabaseError(error: unknown): error is SupabaseErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as SupabaseErrorResponse).message === 'string'
  );
}

/**
 * Type guard to check if an error has validation errors
 */
export function hasValidationErrors(error: unknown): error is ApiValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'validationErrors' in error &&
    Array.isArray((error as ApiValidationError).validationErrors)
  );
}

/**
 * Extract a user-friendly error message from any error type
 */
export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (isAuthError(error)) {
    return error.message;
  }
  
  if (isSupabaseError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }
  
  return 'An unexpected error occurred';
}

/**
 * Format validation errors into a single message
 */
export function formatValidationErrorMessage(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  
  return errors.map(e => `${e.field}: ${e.message}`).join(', ');
}