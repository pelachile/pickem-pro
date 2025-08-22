import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';

function AuthenticatedLayoutComponent() {
  const { user, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && isInitialized) {
      setHasCheckedAuth(true);
      if (!user) {
        console.log('Authenticated route: No user found, redirecting to login');
        navigate({ to: '/login' });
      }
    }
  }, [user, isLoading, isInitialized, navigate]);

  // Show loading spinner while checking auth
  if (isLoading || !isInitialized || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
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