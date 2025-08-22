/**
 * Maps Supabase auth errors to user-friendly messages
 */
export const getAuthErrorMessage = (error: any): string => {
  // Handle Supabase auth errors
  if ('status' in error && error.status) {
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

  // Handle common error messages
  if (error.message.includes('Invalid email')) {
    return 'Please enter a valid email address.';
  }
  
  if (error.message.includes('weak password')) {
    return 'Password is too weak. Please choose a stronger password.';
  }

  // Return the original message if we don't have a specific mapping
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 */
export const isValidPassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long.' };
  }
  
  if (password.length > 72) {
    return { isValid: false, message: 'Password must be less than 72 characters long.' };
  }
  
  return { isValid: true };
};

/**
 * Formats user display name from first and last name
 */
export const formatDisplayName = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '';
};

/**
 * Checks if the current environment has required Supabase configuration
 */
export const validateSupabaseConfig = (): { isValid: boolean; missingVars: string[] } => {
  const requiredVars = [
    { key: 'VITE_SUPABASE_URL', value: import.meta.env.VITE_SUPABASE_URL },
    { key: 'VITE_SUPABASE_ANON_KEY', value: import.meta.env.VITE_SUPABASE_ANON_KEY },
  ];

  const missingVars = requiredVars
    .filter(({ value }) => !value)
    .map(({ key }) => key);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};