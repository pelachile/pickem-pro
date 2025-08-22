import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, signIn, signOut, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword, getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import type { SignUpOutput } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

// User type based on Amplify auth
interface AmplifyUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

interface AuthContextType {
  user: AmplifyUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<SignUpOutput>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Real Amplify AuthProvider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AmplifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAuthenticated = !!user;

  // Check for existing user session on mount
  useEffect(() => {
    // Add a delay to ensure Amplify has fully initialized and can read from localStorage
    const initializeAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsInitialized(true);
      await checkCurrentUser();
    };
    
    initializeAuth();
  }, []);

  // Listen to auth events
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', (data) => {
      const { event } = data.payload;
      console.log('Auth Hub event:', event);
      
      if (event === 'signedIn') {
        checkCurrentUser();
      } else if (event === 'signedOut') {
        setUser(null);
      } else if (event === 'tokenRefresh') {
        // Token was refreshed, user is still authenticated
        console.log('Token refreshed successfully');
      } else if (event === 'tokenRefresh_failure') {
        // Token refresh failed, user needs to sign in again
        console.log('Token refresh failed, signing out user');
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const checkCurrentUser = async () => {
    try {
      setIsLoading(true);
      
      // First check if we have a valid session
      const session = await fetchAuthSession();
      
      // If no tokens exist, user is not authenticated
      if (!session.tokens?.accessToken) {
        setUser(null);
        return;
      }
      
      // If we have tokens, get user info
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setUser({
        id: currentUser.userId,
        email: attributes.email || '',
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        displayName: attributes.name || `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
      });
    } catch (error) {
      console.log('No authenticated user found:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Real authentication functions
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn({ username: email, password });
      await checkCurrentUser();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            ...(firstName && { given_name: firstName }),
            ...(lastName && { family_name: lastName }),
            ...(firstName && lastName && { name: `${firstName} ${lastName}` }),
          },
        },
      });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
    } catch (error) {
      console.error('Confirmation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmationCode = async (email: string) => {
    setIsLoading(true);
    try {
      await resendSignUpCode({ username: email });
    } catch (error) {
      console.error('Resend code error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await resetPassword({ username: email });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmResetPassword = async (email: string, code: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isInitialized,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    resetPassword: handleResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};