import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';

function AuthenticatedLayoutComponent() {
  const { user, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && isInitialized) {
      setHasCheckedAuth(true);
      if (!user) {
        console.log('Authenticated route: No user found, redirecting to home');
        navigate({ to: '/home' });
      }
    }
  }, [user, isLoading, isInitialized, navigate]);

  // Show loading state while checking auth - minimized to reduce flicker
  if (isLoading || !isInitialized || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center">
        <div className="animate-fade-in-quick">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayoutComponent,
});