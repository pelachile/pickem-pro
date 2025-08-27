import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary Component
 * 
 * Enhanced error boundary with beautiful UI and recovery options.
 * Catches JavaScript errors anywhere in the child component tree.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-xl p-8 text-center glass-enhanced">
              {/* Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
              
              {/* Error Title */}
              <h1 className="text-2xl font-bold text-white mb-3">
                Something went wrong
              </h1>
              
              {/* Error Description */}
              <p className="text-white/70 mb-6 leading-relaxed">
                We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
              </p>
              
              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-red-400 font-medium mb-2">
                      Error Details (Development)
                    </summary>
                    <pre className="text-red-300/80 text-xs overflow-auto whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  size="sm"
                >
                  Reload Page
                </Button>
              </div>
              
              {/* Additional Help */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50">
                  If this problem persists, please contact support or try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple Error Fallback Component
 * 
 * Lightweight error fallback for specific components.
 */
export const SimpleErrorFallback: React.FC<{
  error?: Error;
  resetError?: () => void;
  message?: string;
}> = ({ 
  error, 
  resetError, 
  message = "Something went wrong with this component" 
}) => (
  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
    <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
    <p className="text-red-300/80 text-sm mb-4">{message}</p>
    
    {process.env.NODE_ENV === 'development' && error && (
      <details className="mb-4 text-left">
        <summary className="cursor-pointer text-red-400 text-xs mb-2">
          Error Details
        </summary>
        <pre className="text-red-300/60 text-xs overflow-auto whitespace-pre-wrap bg-red-500/5 p-2 rounded">
          {error.toString()}
        </pre>
      </details>
    )}
    
    {resetError && (
      <Button
        variant="outline" 
        size="sm"
        onClick={resetError}
        className="text-red-300 border-red-500/30 hover:bg-red-500/10"
      >
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorBoundary;