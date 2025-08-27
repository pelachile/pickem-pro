import React from 'react';
import { cn } from '../utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'bars' | 'pulse';
  className?: string;
  color?: 'sky' | 'sunset' | 'white' | 'ocean';
  label?: string;
}

/**
 * LoadingSpinner Component
 * 
 * Various animated loading indicators with different styles and sizes.
 * Optimized for performance and accessibility.
 * 
 * @example
 * <LoadingSpinner size="lg" variant="dots" color="sky" />
 * <LoadingSpinner variant="bars" label="Loading games..." />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  color = 'sky',
  label = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    sky: 'text-sky-400',
    sunset: 'text-sunset-500',
    white: 'text-white',
    ocean: 'text-ocean-400',
  };

  const baseClasses = cn(sizeClasses[size], colorClasses[color], className);

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center space-x-1', className)} aria-label={label}>
        <div className={cn('rounded-full animate-bounce', colorClasses[color], {
          'w-2 h-2': size === 'sm',
          'w-3 h-3': size === 'md',
          'w-4 h-4': size === 'lg',
          'w-5 h-5': size === 'xl',
        })} style={{ animationDelay: '0ms', backgroundColor: 'currentColor' }} />
        <div className={cn('rounded-full animate-bounce', colorClasses[color], {
          'w-2 h-2': size === 'sm',
          'w-3 h-3': size === 'md',
          'w-4 h-4': size === 'lg',
          'w-5 h-5': size === 'xl',
        })} style={{ animationDelay: '150ms', backgroundColor: 'currentColor' }} />
        <div className={cn('rounded-full animate-bounce', colorClasses[color], {
          'w-2 h-2': size === 'sm',
          'w-3 h-3': size === 'md',
          'w-4 h-4': size === 'lg',
          'w-5 h-5': size === 'xl',
        })} style={{ animationDelay: '300ms', backgroundColor: 'currentColor' }} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex items-center justify-center space-x-1', className)} aria-label={label}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn('animate-pulse', colorClasses[color], {
              'w-1 h-4': size === 'sm',
              'w-1.5 h-6': size === 'md',
              'w-2 h-8': size === 'lg',
              'w-2.5 h-10': size === 'xl',
            })}
            style={{ 
              animationDelay: `${index * 100}ms`,
              backgroundColor: 'currentColor',
              animationDuration: '1.4s',
            }}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)} aria-label={label}>
        <div className={cn(
          'rounded-full animate-ping opacity-75',
          baseClasses,
          colorClasses[color]
        )} style={{ backgroundColor: 'currentColor' }} />
        <div className={cn(
          'absolute rounded-full',
          baseClasses,
          colorClasses[color]
        )} style={{ backgroundColor: 'currentColor' }} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn('flex items-center justify-center', className)} aria-label={label}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          baseClasses
        )}
        role="status"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

/**
 * PageLoader Component
 * 
 * Full-page loading state with branded styling.
 */
export const PageLoader: React.FC<{ 
  message?: string; 
  variant?: 'default' | 'minimal';
}> = ({ 
  message = 'Loading...', 
  variant = 'default' 
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" color="sky" label={message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto">
            <LoadingSpinner size="xl" color="white" label={message} />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="w-20 h-20 border-4 border-white rounded-full" />
          </div>
          <div className="absolute inset-2 animate-pulse opacity-30">
            <div className="w-16 h-16 border-2 border-sky-400 rounded-full" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">{message}</h2>
          <p className="text-white/70 text-sm">Just a moment while we get things ready</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;