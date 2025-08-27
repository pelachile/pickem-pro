import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Trophy } from 'lucide-react';
import { useAuth } from '../components/auth';
import { RouteErrorBoundary } from '../components/RouteErrorBoundary';

function RootComponent() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400">
      {/* Minimal navbar only for unauthenticated users */}
      {!isLoading && isInitialized && !isAuthenticated && (
        <nav className="bg-navy-900/80 backdrop-blur-md border-b border-ocean-600/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/home" className="flex items-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-sky-400 hover:text-sunrise-500 transition-colors duration-200 ease-out">
                  <Trophy className="h-8 w-8" />
                  <span className="hidden sm:inline">Pick'em Pro</span>
                  <span className="sm:hidden">Pick'em</span>
                </div>
              </Link>

              {/* Auth buttons */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sky-400 hover:text-sunrise-500 transition-colors duration-200 ease-out px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="relative min-h-full">
        <RouteErrorBoundary routeName="Application">
          <Outlet />
        </RouteErrorBoundary>
      </main>

      {/* Dev Tools */}
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});