/**
 * Application constants with const assertions for better performance
 * Const assertions provide literal types and prevent mutations
 */

/**
 * API configuration constants
 */
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  MAX_CONCURRENT_REQUESTS: 5,
} as const;

/**
 * League constants
 */
export const LEAGUE_CONSTANTS = {
  MIN_MEMBERS: 2,
  MAX_MEMBERS: 100,
  DEFAULT_MAX_MEMBERS: 50,
  MIN_ENTRY_FEE: 0,
  MAX_ENTRY_FEE: 10000,
  INVITE_CODE_LENGTH: 6,
  STATUSES: ['draft', 'active', 'completed', 'cancelled'] as const,
  MEMBER_ROLES: ['admin', 'moderator', 'member'] as const,
} as const;

/**
 * Profile constants
 */
export const PROFILE_CONSTANTS = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_FULL_NAME_LENGTH: 2,
  MAX_FULL_NAME_LENGTH: 100,
  MAX_WEBSITE_LENGTH: 255,
  AVATAR_COLORS: [
    'ocean-blue',
    'sunset-orange', 
    'forest-green',
    'royal-purple',
    'cherry-red',
    'golden-yellow',
    'cosmic-pink',
    'midnight-blue',
  ] as const,
  DEFAULT_AVATAR_ICON: '👤',
  DEFAULT_AVATAR_COLOR: 'ocean-blue',
} as const;

/**
 * Game status constants
 */
export const GAME_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  FINAL: 'final',
  POSTPONED: 'postponed',
  CANCELLED: 'cancelled',
} as const;

/**
 * Pick confidence points
 */
export const CONFIDENCE_POINTS = {
  MIN: 1,
  MAX: 16,
  DEFAULT: 1,
} as const;

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  STALE_TIME: {
    TEAMS: 1000 * 60 * 60 * 24, // 24 hours
    GAMES: 1000 * 60 * 5, // 5 minutes
    LEAGUES: 1000 * 60 * 10, // 10 minutes
    PROFILE: 1000 * 60 * 15, // 15 minutes
    PICKS: 1000 * 60 * 2, // 2 minutes
  },
  GC_TIME: {
    TEAMS: 1000 * 60 * 60 * 48, // 48 hours
    GAMES: 1000 * 60 * 10, // 10 minutes
    LEAGUES: 1000 * 60 * 20, // 20 minutes
    PROFILE: 1000 * 60 * 30, // 30 minutes
    PICKS: 1000 * 60 * 5, // 5 minutes
  },
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  AUTH: {
    UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    EMAIL_NOT_CONFIRMED: 'AUTH_EMAIL_NOT_CONFIRMED',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
    INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
    OUT_OF_RANGE: 'VALIDATION_OUT_OF_RANGE',
    DUPLICATE_VALUE: 'VALIDATION_DUPLICATE_VALUE',
  },
  DATABASE: {
    CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
    QUERY_ERROR: 'DB_QUERY_ERROR',
    CONSTRAINT_VIOLATION: 'DB_CONSTRAINT_VIOLATION',
    NOT_FOUND: 'DB_NOT_FOUND',
  },
  NETWORK: {
    TIMEOUT: 'NETWORK_TIMEOUT',
    NO_CONNECTION: 'NETWORK_NO_CONNECTION',
    SERVER_ERROR: 'NETWORK_SERVER_ERROR',
  },
} as const;

/**
 * Type extractions from const assertions
 */
export type LeagueStatus = typeof LEAGUE_CONSTANTS.STATUSES[number];
export type MemberRole = typeof LEAGUE_CONSTANTS.MEMBER_ROLES[number];
export type AvatarColor = typeof PROFILE_CONSTANTS.AVATAR_COLORS[number];
export type GameStatusType = typeof GAME_STATUS[keyof typeof GAME_STATUS];
export type AuthErrorCode = typeof ERROR_CODES.AUTH[keyof typeof ERROR_CODES.AUTH];
export type ValidationErrorCode = typeof ERROR_CODES.VALIDATION[keyof typeof ERROR_CODES.VALIDATION];
export type DatabaseErrorCode = typeof ERROR_CODES.DATABASE[keyof typeof ERROR_CODES.DATABASE];
export type NetworkErrorCode = typeof ERROR_CODES.NETWORK[keyof typeof ERROR_CODES.NETWORK];
export type ErrorCode = AuthErrorCode | ValidationErrorCode | DatabaseErrorCode | NetworkErrorCode;