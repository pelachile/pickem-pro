// Supabase client and types
export { supabase } from './supabase';
export type { User } from './supabase';

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
  SupabaseUser,
  Session,
  AuthError,
} from '../types/auth';

// Authentication utilities
export {
  getAuthErrorMessage,
  isValidEmail,
  isValidPassword,
  formatDisplayName,
  validateSupabaseConfig,
} from '../utils/authUtils';