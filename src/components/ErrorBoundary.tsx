import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
  showDetails?: boolean
  routeName?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="mb-6 p-4 bg-sunset-500/20 rounded-full">
                <AlertTriangle className="w-12 h-12 text-sunset-400" />
              </div>
              
              {/* Error Title */}
              <h2 className="text-3xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h2>
              
              {/* Route Name */}
              {this.props.routeName && (
                <p className="text-sky-300 mb-4">
                  Error occurred in: <span className="font-semibold">{this.props.routeName}</span>
                </p>
              )}
              
              {/* Error Message */}
              <p className="text-sky-200 mb-6 max-w-md">
                {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
              </p>
              
              {/* Error Details (Development Mode) */}
              {this.props.showDetails && this.state.error && (
                <details className="w-full mb-6 text-left">
                  <summary className="cursor-pointer text-sky-300 hover:text-sky-200 transition-colors mb-2">
                    Show error details
                  </summary>
                  <div className="bg-black/30 rounded-lg p-4 overflow-auto max-h-48">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => {
                    if (this.props.onReset) {
                      this.props.onReset();
                    }
                    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                  }}
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <RotateCw className="w-4 h-4" />
                  Try Again
                </button>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 bg-sunset-500 hover:bg-sunset-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <RotateCw className="w-4 h-4" />
                  Reload Page
                </button>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}