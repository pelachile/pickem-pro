import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  routeName?: string;
}

/**
 * RouteErrorBoundary Component
 * 
 * A wrapper around ErrorBoundary specifically for route-level error handling.
 * Provides additional context about which route failed and enables development-mode debugging.
 * 
 * @example
 * <RouteErrorBoundary routeName="Dashboard">
 *   <DashboardComponent />
 * </RouteErrorBoundary>
 */
export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = React.memo(({ 
  children, 
  routeName 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const handleReset = () => {
    // Clear any cached data or state that might be causing issues
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear session storage
    sessionStorage.clear();
    
    // Log the reset for debugging
    console.log(`Route error boundary reset for: ${routeName || 'unknown route'}`);
  };
  
  return (
    <ErrorBoundary 
      routeName={routeName}
      onReset={handleReset}
      showDetails={isDevelopment}
    >
      {children}
    </ErrorBoundary>
  );
});

RouteErrorBoundary.displayName = 'RouteErrorBoundary';

export default RouteErrorBoundary;