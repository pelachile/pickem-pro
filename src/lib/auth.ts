/**
 * AWS Amplify Headless Authentication API
 * 
 * Custom authentication utilities using AWS Amplify headless APIs
 * Avoids pre-built UI components in favor of custom implementations
 */

import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  confirmSignUp,
  type SignInInput, 
  type SignUpInput 
} from 'aws-amplify/auth'

// Auth Types
export interface AuthUser {
  userId: string
  username: string
}

export interface SignInData {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthError {
  message: string
  code?: string
}

// Authentication Functions
export async function signInUser(data: SignInData): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const { email, password } = data
    
    const result = await signIn({
      username: email,
      password
    })
    
    // Check if sign-in is complete
    if (result.isSignedIn) {
      return { success: true }
    }
    
    // Handle multi-step sign-in flows if needed
    if (result.nextStep) {
      // For now, we'll treat additional steps as errors since the existing UI doesn't handle them
      // In the future, you could handle MFA, email confirmation, etc. here
      return { 
        success: false, 
        error: { 
          message: `Additional step required: ${result.nextStep.signInStep}`,
          code: 'ADDITIONAL_STEP_REQUIRED'
        }
      }
    }
    
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Sign in failed',
        code: error.name
      }
    }
  }
}

export async function signUpUser(data: SignUpData): Promise<{ success: boolean; error?: AuthError; requiresConfirmation?: boolean }> {
  try {
    const { email, password, confirmPassword } = data
    
    if (password !== confirmPassword) {
      return {
        success: false,
        error: { message: 'Passwords do not match' }
      }
    }
    
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email
        }
      }
    })
    
    // Check if email confirmation is required
    if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
      return { 
        success: true, 
        requiresConfirmation: true 
      }
    }
    
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Sign up failed',
        code: error.name
      }
    }
  }
}

export async function confirmUserSignUp(email: string, code: string): Promise<{ success: boolean; error?: AuthError }> {
  try {
    await confirmSignUp({
      username: email,
      confirmationCode: code
    })
    
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Confirmation failed',
        code: error.name
      }
    }
  }
}

export async function signOutUser(): Promise<{ success: boolean; error?: AuthError }> {
  try {
    await signOut()
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Sign out failed',
        code: error.name
      }
    }
  }
}

export async function getCurrentAuthUser(): Promise<{ user: AuthUser | null; error?: AuthError }> {
  try {
    const user = await getCurrentUser()
    return {
      user: {
        userId: user.userId,
        username: user.username
      }
    }
  } catch (error: any) {
    // User not authenticated
    return { user: null }
  }
}

// Auth State Hook
export function useAuthState() {
  // This would be implemented with React state management
  // For now, just return the getCurrentUser function
  return {
    getCurrentAuthUser,
    signInUser,
    signUpUser,
    signOutUser,
    confirmUserSignUp
  }
}