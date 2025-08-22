# Supabase Authentication Setup

This document outlines the Supabase authentication integration for the NFL Pick'em League application.

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project details:

```bash
cp .env.example .env.local
```

Update the values in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Project Configuration

In your Supabase dashboard:

1. **Authentication Settings**:
   - Enable email confirmation (recommended)
   - Set up redirect URLs for password reset
   - Configure any additional auth providers if needed

2. **Database Setup** (if using custom user profiles):
   ```sql
   -- Create a profiles table to store additional user data
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     first_name TEXT,
     last_name TEXT,
     display_name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);
   ```

## Authentication Flow

### Sign Up
```typescript
import { useAuth } from './src/hooks/useAuth';

const { signUp } = useAuth();

try {
  const result = await signUp(email, password, firstName, lastName);
  if (!result.isSignUpComplete) {
    // User needs to confirm email
    // Redirect to confirmation page
  }
} catch (error) {
  // Handle error
}
```

### Sign In
```typescript
const { signIn } = useAuth();

try {
  await signIn(email, password);
  // User is now signed in
} catch (error) {
  // Handle error
}
```

### Sign Out
```typescript
const { signOut } = useAuth();

try {
  await signOut();
  // User is now signed out
} catch (error) {
  // Handle error
}
```

## Features Included

### ✅ Complete Authentication Flow
- Sign up with email confirmation
- Sign in/Sign out
- Password reset with email verification
- Resend confirmation codes
- Automatic session management

### ✅ Type Safety
- Full TypeScript support
- Proper typing for all authentication methods
- Type-safe context and hooks

### ✅ Error Handling
- User-friendly error messages
- Comprehensive error mapping
- Validation utilities

### ✅ State Management
- React Context for global auth state
- Automatic session persistence
- Real-time auth state updates

### ✅ Utilities
- Email validation
- Password strength validation
- Display name formatting
- Configuration validation

## Architecture

### Files Created/Modified

1. **`src/lib/supabase.ts`** - Supabase client configuration
2. **`src/contexts/AuthContext.tsx`** - Updated with Supabase integration
3. **`src/hooks/useAuth.ts`** - Custom hook for auth context
4. **`src/types/auth.ts`** - TypeScript type definitions
5. **`src/utils/authUtils.ts`** - Authentication utilities
6. **`src/lib/index.ts`** - Centralized exports
7. **`.env.example`** - Environment variables template

### Context Interface Compatibility

The AuthContext maintains the same interface as before, ensuring existing components continue to work without modification:

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ isSignUpComplete: boolean; nextStep?: unknown }>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}
```

## Usage Examples

### Using the Auth Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || user.email}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Error Handling
```typescript
import { getAuthErrorMessage } from '@/utils/authUtils';

try {
  await signIn(email, password);
} catch (error) {
  const friendlyMessage = getAuthErrorMessage(error);
  setErrorMessage(friendlyMessage);
}
```

## Security Considerations

1. **Environment Variables**: Never commit actual Supabase keys to version control
2. **Row Level Security**: Enable RLS on all tables in Supabase
3. **Email Confirmation**: Enable email confirmation for additional security
4. **Password Policies**: Use Supabase's built-in password policies
5. **Rate Limiting**: Supabase includes built-in rate limiting for auth endpoints

## Next Steps

1. Set up your Supabase project and get the required environment variables
2. Update `.env.local` with your Supabase credentials
3. Test the authentication flow in your development environment
4. Set up any additional database tables for user profiles if needed
5. Configure your production environment variables