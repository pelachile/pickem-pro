// User interface for our application
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  // Supabase specific fields  
  email_confirmed_at?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Authentication context interface
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ isSignUpComplete: boolean; nextStep?: unknown }>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
}

// Sign up response type
export interface SignUpResponse {
  isSignUpComplete: boolean;
  nextStep?: {
    signUpStep: 'CONFIRM_SIGN_UP';
  };
}

// Error handling types
export interface AuthErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

// User metadata interface for Supabase
export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

// Basic auth error type
export interface AuthError {
  message: string;
  status?: number;
}

// Supabase user type (re-exported from Supabase)
export type { User as SupabaseUser } from '@supabase/supabase-js';

// Supabase session type (re-exported from Supabase)  
export type { Session } from '@supabase/supabase-js';