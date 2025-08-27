/**
 * Authentication Context Provider
 * 
 * Provides authentication state management across the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentAuthUser, signOutUser, signUpUser, signInUser, confirmUserSignUp, type AuthUser, type AuthError } from '../../lib/auth'

// Legacy interfaces for backward compatibility
interface SignUpResponse {
  isSignUpComplete: boolean;
  nextStep?: {
    signUpStep: string;
  };
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isInitialized: boolean
  error: AuthError | null
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  // Legacy functions for backward compatibility
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<SignUpResponse>
  signIn: (email: string, password: string) => Promise<void>
  confirmSignUp: (email: string, code: string) => Promise<void>
  resendConfirmationCode: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const isAuthenticated = !!user

  const refreshUser = async () => {
    try {
      setError(null)
      const { user: currentUser, error: authError } = await getCurrentAuthUser()
      
      if (authError) {
        setError(authError)
        setUser(null)
      } else {
        setUser(currentUser)
      }
    } catch (err) {
      setError({ message: 'Failed to get current user' })
      setUser(null)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    const result = await signOutUser()
    
    if (result.success) {
      setUser(null)
      setError(null)
    } else {
      setError(result.error!)
    }
    
    setIsLoading(false)
  }

  // Legacy auth functions for backward compatibility
  const handleSignUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<SignUpResponse> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signUpUser({
        email,
        password,
        confirmPassword: password // For legacy compatibility
      })
      
      if (result.success) {
        return {
          isSignUpComplete: !result.requiresConfirmation,
          nextStep: result.requiresConfirmation ? { signUpStep: 'CONFIRM_SIGN_UP' } : undefined
        }
      } else {
        throw new Error(result.error?.message || 'Sign up failed')
      }
    } catch (error) {
      const authError = {
        message: error instanceof Error ? error.message : 'Sign up failed'
      }
      setError(authError)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signInUser({ email, password })
      
      if (result.success) {
        // Sign-in completed successfully
        await refreshUser()
        return
      } else {
        // Check if it's just an additional step but user is actually signed in
        try {
          await refreshUser()
          // If refreshUser succeeds, the user is actually signed in
          if (user) {
            return
          }
        } catch (refreshError) {
          // User not actually signed in, proceed with error
        }
        
        throw new Error(result.error?.message || 'Sign in failed')
      }
    } catch (error) {
      const authError = {
        message: error instanceof Error ? error.message : 'Sign in failed'
      }
      setError(authError)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmSignUp = async (email: string, code: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await confirmUserSignUp(email, code)
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Confirmation failed')
      }
    } catch (error) {
      const authError = {
        message: error instanceof Error ? error.message : 'Confirmation failed'
      }
      setError(authError)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmationCode = async (email: string): Promise<void> => {
    // For now, just a stub - you can implement this later
    console.log('Resend confirmation code for:', email)
  }

  // Check authentication status on mount
  useEffect(() => {
    refreshUser()
  }, [])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isInitialized,
    error,
    signOut: handleSignOut,
    refreshUser,
    // Legacy functions for backward compatibility
    signUp: handleSignUp,
    signIn: handleSignIn,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}