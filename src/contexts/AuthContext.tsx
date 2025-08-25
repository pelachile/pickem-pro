import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { isAuthError } from '../types/errors';

// User interface for our application
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email_confirmed_at?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// User metadata interface for Supabase
interface UserMetadata {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

// Sign up response interface
interface SignUpResponse {
  isSignUpComplete: boolean;
  nextStep?: {
    signUpStep: string;
  };
}

// Split state and actions for better performance
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthActions {
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

// Combined interface for backward compatibility
interface AuthContextType extends AuthState, AuthActions {}

// Utility functions
const getAuthErrorMessage = (error: unknown): string => {
  if (isAuthError(error)) {
    switch (error.status) {
      case 400:
        if (error.message.includes('Invalid login credentials')) {
          return 'Invalid email or password. Please check your credentials and try again.';
        }
        if (error.message.includes('Email not confirmed')) {
          return 'Please check your email and click the confirmation link before signing in.';
        }
        if (error.message.includes('Password should be at least')) {
          return 'Password must be at least 6 characters long.';
        }
        if (error.message.includes('User already registered')) {
          return 'An account with this email already exists. Please sign in instead.';
        }
        break;
      case 422:
        if (error.message.includes('Email rate limit exceeded')) {
          return 'Too many requests. Please wait a moment before trying again.';
        }
        break;
      case 429:
        return 'Too many requests. Please wait a moment before trying again.';
      case 500:
        return 'Server error. Please try again later.';
    }
  }

  // Check for Error instance
  if (error instanceof Error) {
    if (error.message.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }
    
    if (error.message.includes('weak password')) {
      return 'Password is too weak. Please choose a stronger password.';
    }
    
    return error.message;
  }
  
  // Check for object with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = String((error as { message: unknown }).message);
    if (message.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (message.includes('weak password')) {
      return 'Password is too weak. Please choose a stronger password.';
    }
    return message;
  }

  return 'An unexpected error occurred. Please try again.';
};

const formatDisplayName = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '';
};

// Create separate contexts for state and actions
export const AuthStateContext = createContext<AuthState | undefined>(undefined);
export const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

// Keep the original context for backward compatibility
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export types for use in other files
export type { User, AuthContextType, AuthState, AuthActions };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const isAuthenticated = !!user && !!session;

  // Helper function to convert Supabase user to our User interface
  const mapSupabaseUser = (supabaseUser: SupabaseUser, userMetadata?: UserMetadata): User => {
    const firstName = userMetadata?.first_name || userMetadata?.firstName;
    const lastName = userMetadata?.last_name || userMetadata?.lastName;
    const displayName = userMetadata?.display_name || userMetadata?.displayName || formatDisplayName(firstName, lastName);

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      firstName,
      lastName,
      displayName,
      email_confirmed_at: supabaseUser.email_confirmed_at,
      phone: supabaseUser.phone,
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at,
    };
  };

  // Initialize auth state and listen for auth changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          // Error getting session
        } else if (session?.user) {
          setSession(session);
          setUser(mapSupabaseUser(session.user, session.user.user_metadata));
        }
      } catch (error) {
        // Error initializing auth
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          setUser(mapSupabaseUser(session.user, session.user.user_metadata));
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to handle auth errors
  const handleAuthError = (error: AuthError | Error) => {
    const friendlyMessage = getAuthErrorMessage(error);
    throw new Error(friendlyMessage);
  };

  // Memoize authentication functions to prevent recreation on every render
  const handleSignIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        handleAuthError(error);
      }
      
      // User state will be updated via the auth state change listener
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignUp = useCallback(async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: firstName,
            last_name: lastName,
            display_name: firstName && lastName ? `${firstName} ${lastName}` : firstName,
          },
        },
      });
      
      if (error) {
        handleAuthError(error);
      }
      
      // For email confirmation (link-based), user is created but not confirmed
      const isSignUpComplete = !!data.user && data.user.email_confirmed_at;
      
      return {
        isSignUpComplete,
        nextStep: isSignUpComplete ? undefined : { signUpStep: 'CHECK_EMAIL' },
      } as SignUpResponse;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        handleAuthError(error);
      }
      // User state will be cleared via the auth state change listener
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleConfirmSignUp = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });
      
      if (error) {
        handleAuthError(error);
      }
      
      // User state will be updated via the auth state change listener
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleResendConfirmationCode = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        handleAuthError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        handleAuthError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfirmResetPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'recovery',
      });
      
      if (error) {
        handleAuthError(error);
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        handleAuthError(updateError);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  // Memoize state and actions separately to prevent unnecessary re-renders
  const authState = useMemo<AuthState>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      isInitialized,
    }),
    [user, isLoading, isAuthenticated, isInitialized]
  );

  const authActions = useMemo<AuthActions>(
    () => ({
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      confirmSignUp: handleConfirmSignUp,
      resendConfirmationCode: handleResendConfirmationCode,
      resetPassword: handleResetPassword,
      confirmResetPassword: handleConfirmResetPassword,
    }),
    [
      handleSignIn,
      handleSignUp,
      handleSignOut,
      handleConfirmSignUp,
      handleResendConfirmationCode,
      handleResetPassword,
      handleConfirmResetPassword,
    ]
  );

  // Combined value for backward compatibility
  const value = useMemo<AuthContextType>(
    () => ({ ...authState, ...authActions }),
    [authState, authActions]
  );

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthActionsContext.Provider value={authActions}>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};