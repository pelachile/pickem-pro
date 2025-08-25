/**
 * Utility types for improved type safety and reusability
 */

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * Make all properties of T required recursively
 */
export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

/**
 * Make specific keys of T required while keeping others optional
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific keys of T optional while keeping others required
 */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract the type of array elements
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Create a discriminated union type
 */
export type DiscriminatedUnion<T extends Record<string, unknown>, K extends keyof T> = T[K];

/**
 * Strict omit that ensures keys exist
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/**
 * Type-safe object keys
 */
export type KeysOf<T> = keyof T;

/**
 * Type-safe object values
 */
export type ValuesOf<T> = T[keyof T];

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Maybe type helper (nullable or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Non-nullable required fields
 */
export type NonNullableFields<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * Extract promise type
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Type for form field values with proper typing
 */
export type FormFieldValue = string | number | boolean | Date | null;

/**
 * Type for form data with typed fields
 */
export type FormData<T extends Record<string, FormFieldValue>> = T;

/**
 * Type for form errors
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Type for form touched state
 */
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Type guard for checking if a value is defined
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Type guard for checking if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for checking if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard for checking if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for checking if a value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for checking if a value is an array
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Assert that a condition is true, narrowing the type
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Assert that a value is never (exhaustive check)
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}