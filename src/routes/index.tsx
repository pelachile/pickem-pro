import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/auth';

function IndexRedirect() {
  const { user, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && isInitialized && !hasRedirected) {
      setHasRedirected(true);
      if (user) {
        console.log('Index: User authenticated, redirecting to dashboard');
        navigate({ to: '/dashboard' });
      } else {
        console.log('Index: User not authenticated, redirecting to home');
        navigate({ to: '/home' });
      }
    }
  }, [user, isLoading, isInitialized, navigate, hasRedirected]);

  // Show loading spinner while checking auth
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}

export const Route = createFileRoute('/')({ 
  component: IndexRedirect,
});