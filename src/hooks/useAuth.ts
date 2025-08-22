import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * Provides type-safe access to authentication state and methods
 * 
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;