// Supabase client and types
export { supabase } from './supabase';

// Authentication context and hooks
export { AuthProvider, AuthContext } from '../contexts/AuthContext';
export { useAuth } from '../hooks/useAuth';

// Authentication types
export type {
  User as AppUser,
  AuthContextType,
  SignUpResponse,
  AuthErrorResponse,
  UserMetadata,
  AuthError,
} from '../types/auth';

// Picks types
export type {
  Pick,
  UserPick,
  PickSubmission,
  BatchPickSubmission,
  LeagueStanding,
  SubmitPicksRequest,
  SubmitPicksResponse,
  GetUserPicksRequest,
  GetUserPicksResponse,
  UpdatePickRequest,
  UpdatePickResponse,
  GetLeagueStandingsRequest,
  GetLeagueStandingsResponse,
  PickValidationError,
  PickValidationResult,
  PickDeadline,
  ApiResponse,
} from '../types/picks';

// Profile types
export type {
  UserProfile,
  CreateProfileRequest,
  UpdateProfileRequest,
  ProfileValidationError,
  ProfileValidationResult,
  UsernameCheckResult,
  AvatarIcon,
  AvatarColor,
  AvatarOption,
  ProfileFormData,
} from '../types/profile';

// Picks hooks
export * from '../hooks/usePicks';

// Profile hooks
export * from '../hooks/useProfile';

// Authentication utilities
export {
  getAuthErrorMessage,
  isValidEmail,
  isValidPassword,
  formatDisplayName,
  validateSupabaseConfig,
} from '../utils/authUtils';

// API operations
export * from './api';

// Picks database operations
export * from './picks-database';

// Profile database operations
export * from './profile-database';

// Validation utilities
export * from './validation';