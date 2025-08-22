import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

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
              <Link to="/" className="flex items-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-sky-400 hover:text-sunrise-500 transition-all duration-300 ease-out hover:scale-105">
                  <TrophyIcon className="h-8 w-8 transition-transform duration-300 hover:rotate-12" />
                  <span className="hidden sm:inline">Pick'em Pro</span>
                  <span className="sm:hidden">Pick'em</span>
                </div>
              </Link>

              {/* Auth buttons */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sky-400 hover:text-sunrise-500 transition-all duration-300 ease-out px-3 py-2 text-sm font-medium hover:scale-105 rounded-lg hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5"
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
        <Outlet />
      </main>

      {/* Dev Tools */}
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});