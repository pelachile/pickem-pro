// User interface for our application - AWS Amplify compatible
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  // AWS Amplify compatible fields
  emailVerified?: boolean;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
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

// User metadata interface for AWS Amplify
export interface UserMetadata {
  given_name?: string;
  family_name?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

// Basic auth error type
export interface AuthError {
  message: string;
  name?: string;
}