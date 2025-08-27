import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  signIn as amplifySignIn,
  signUp as amplifySignUp, 
  signOut as amplifySignOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  type AuthUser
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

// User interface for our application - AWS Amplify compatible
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  emailVerified?: boolean;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Sign up response interface - AWS Amplify compatible
interface SignUpResponse {
  isSignUpComplete: boolean;
  nextStep?: {
    signUpStep: string;
  };
}

// Auth state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

// Auth actions interface
interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<SignUpResponse>;
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
  if (error && typeof error === 'object' && 'name' in error) {
    const authError = error as { name: string; message?: string };
    
    switch (authError.name) {
      case 'UserAlreadyExistsException':
        return 'An account with this email already exists. Please sign in instead.';
      case 'UsernameExistsException':
        return 'An account with this email already exists. Please sign in instead.';
      case 'InvalidPasswordException':
        return 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.';
      case 'InvalidParameterException':
        return 'Please check your input and try again.';
      case 'NotAuthorizedException':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'UserNotConfirmedException':
        return 'Please check your email and confirm your account before signing in.';
      case 'CodeMismatchException':
        return 'Invalid verification code. Please check the code and try again.';
      case 'ExpiredCodeException':
        return 'Verification code has expired. Please request a new code.';
      case 'TooManyRequestsException':
        return 'Too many requests. Please wait a moment before trying again.';
      case 'LimitExceededException':
        return 'Too many attempts. Please wait before trying again.';
      case 'UserNotFoundException':
        return 'No account found with this email address.';
      default:
        return authError.message || 'An unexpected error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
};

const formatDisplayName = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '';
};

// Helper function to convert AWS Amplify user to our User interface
const mapAmplifyUser = async (amplifyUser: AuthUser): Promise<User> => {
  try {
    // Get user attributes
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    
    // Extract user attributes from the token payload
    const userAttributes = idToken?.payload || {};
    
    const firstName = userAttributes.given_name as string || userAttributes.first_name as string;
    const lastName = userAttributes.family_name as string || userAttributes.last_name as string;
    const displayName = userAttributes.name as string || formatDisplayName(firstName, lastName);
    
    return {
      id: amplifyUser.userId,
      email: userAttributes.email as string || '',
      firstName,
      lastName,
      displayName,
      emailVerified: userAttributes.email_verified as boolean,
      phone: userAttributes.phone_number as string,
      createdAt: userAttributes.created_at as string,
      updatedAt: userAttributes.updated_at as string,
    };
  } catch (error) {
    // Fallback if we can't get detailed user info
    return {
      id: amplifyUser.userId,
      email: amplifyUser.username || '',
    };
  }
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

  const isAuthenticated = !!user;

  // Initialize auth state and listen for auth changes
  useEffect(() => {
    let isMounted = true;

    // Get initial auth state
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        if (currentUser && isMounted) {
          const mappedUser = await mapAmplifyUser(currentUser);
          setUser(mappedUser);
        }
      } catch (error) {
        // User not authenticated - this is expected
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth events using Hub
    const hubListenerCancel = Hub.listen('auth', async (data) => {
      if (!isMounted) return;

      const { event } = data.payload;
      
      switch (event) {
        case 'signedIn':
          setIsLoading(true);
          try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              const mappedUser = await mapAmplifyUser(currentUser);
              setUser(mappedUser);
            }
          } catch (error) {
            setUser(null);
          } finally {
            setIsLoading(false);
          }
          break;

        case 'signedOut':
          setUser(null);
          setIsLoading(false);
          break;

        case 'signInWithRedirect':
        case 'signInWithRedirect_failure':
        case 'customOAuthState':
          // Handle these events if needed for social login
          break;

        default:
          break;
      }
    });

    return () => {
      isMounted = false;
      hubListenerCancel();
    };
  }, []);

  // Authentication functions
  const handleSignIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { isSignedIn } = await amplifySignIn({
        username: email,
        password: password,
      });
      
      if (isSignedIn) {
        // User state will be updated via Hub listener
      }
    } catch (error) {
      setIsLoading(false);
      const friendlyMessage = getAuthErrorMessage(error);
      throw new Error(friendlyMessage);
    }
  }, []);

  const handleSignUp = useCallback(async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<SignUpResponse> => {
    setIsLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await amplifySignUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            given_name: firstName || '',
            family_name: lastName || '',
            name: formatDisplayName(firstName, lastName),
          },
        },
      });

      return {
        isSignUpComplete,
        nextStep: nextStep ? { signUpStep: nextStep.signUpStep } : undefined,
      };
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error);
      throw new Error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await amplifySignOut();
      // User state will be cleared via Hub listener
    } catch (error) {
      setIsLoading(false);
      const friendlyMessage = getAuthErrorMessage(error);
      throw new Error(friendlyMessage);
    }
  }, []);

  const handleConfirmSignUp = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    try {
      await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code,
      });
      // User state will be updated via Hub listener after confirmation
    } catch (error) {
      setIsLoading(false);
      const friendlyMessage = getAuthErrorMessage(error);
      throw new Error(friendlyMessage);
    }
  }, []);

  const handleResendConfirmationCode = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await resendSignUpCode({
        username: email,
      });
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error);
      throw new Error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await amplifyResetPassword({
        username: email,
      });
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error);
      throw new Error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfirmResetPassword = useCallback(async (
    email: string, 
    code: string, 
    newPassword: string
  ) => {
    setIsLoading(true);
    try {
      await amplifyConfirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      // User might need to sign in again after password reset
    } catch (error) {
      setIsLoading(false);
      const friendlyMessage = getAuthErrorMessage(error);
      throw new Error(friendlyMessage);
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