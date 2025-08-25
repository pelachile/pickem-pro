/**
 * Discriminated union types for API responses
 * These types provide type-safe API response handling with proper discrimination
 */

/**
 * Base success response
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  error?: never;
  code?: never;
}

/**
 * Base error response
 */
export interface ErrorResponse {
  success: false;
  data?: never;
  error: string;
  code?: string;
}

/**
 * Discriminated union for API responses
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Type guard for success responses
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard for error responses
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ErrorResponse {
  return response.success === false;
}

/**
 * Paginated success response
 */
export interface PaginatedSuccessResponse<T> extends SuccessResponse<T[]> {
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Discriminated union for paginated responses
 */
export type PaginatedApiResponse<T> = PaginatedSuccessResponse<T> | ErrorResponse;

/**
 * Type guard for paginated success responses
 */
export function isPaginatedSuccessResponse<T>(
  response: PaginatedApiResponse<T>
): response is PaginatedSuccessResponse<T> {
  return response.success === true && 'pagination' in response;
}

/**
 * Async operation states
 */
export type AsyncState<T> = 
  | { status: 'idle'; data?: never; error?: never }
  | { status: 'loading'; data?: never; error?: never }
  | { status: 'success'; data: T; error?: never }
  | { status: 'error'; data?: never; error: Error };

/**
 * Type guards for async states
 */
export function isIdleState<T>(state: AsyncState<T>): state is { status: 'idle' } {
  return state.status === 'idle';
}

export function isLoadingState<T>(state: AsyncState<T>): state is { status: 'loading' } {
  return state.status === 'loading';
}

export function isSuccessState<T>(state: AsyncState<T>): state is { status: 'success'; data: T } {
  return state.status === 'success';
}

export function isErrorState<T>(state: AsyncState<T>): state is { status: 'error'; error: Error } {
  return state.status === 'error';
}

/**
 * Mutation result type
 */
export interface MutationResult<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Query result type
 */
export interface QueryResult<T> extends MutationResult<T> {
  isIdle: boolean;
  isFetching: boolean;
  isStale: boolean;
  refetch: () => Promise<void>;
}