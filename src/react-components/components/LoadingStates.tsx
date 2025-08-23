import React from 'react';
import { cn } from '../utils';
import { Card } from './Card';

/**
 * Loading States Components
 * 
 * A collection of loading components with consistent styling
 * that matches the ocean-to-sunset design system.
 */

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)} role="status" aria-label={label}>
      <div 
        className={cn(
          'border-3 border-sky-400/30 border-t-sky-400 rounded-full animate-spin',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => (
  <div 
    className={cn('animate-pulse bg-white/10 rounded-md', className)}
    aria-hidden="true"
  >
    {children}
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={cn('space-y-2', className)} aria-hidden="true">
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton key={i} className="h-4 w-full" />
    ))}
  </div>
);

export const SkeletonCircle: React.FC<{ size?: string; className?: string }> = ({ 
  size = 'w-10 h-10', 
  className 
}) => (
  <Skeleton className={cn('rounded-full', size, className)} />
);

/**
 * GameCard Loading Skeleton
 */
export const GameCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn('space-y-4', className)} aria-label="Loading game information">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-5 w-16" />
    </div>
    
    {/* Matchup Button */}
    <div className="flex justify-center">
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
    
    {/* Teams */}
    <div className="space-y-3">
      {/* Away Team */}
      <div className="bg-white/5 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonCircle size="w-12 h-12" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
      
      {/* VS */}
      <div className="flex justify-center">
        <Skeleton className="h-3 w-6" />
      </div>
      
      {/* Home Team */}
      <div className="bg-white/5 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonCircle size="w-12 h-12" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  </Card>
);

/**
 * League Card Loading Skeleton
 */
export const LeagueCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn('space-y-4', className)} aria-label="Loading league information">
    <div className="flex items-center gap-3">
      <SkeletonCircle size="w-12 h-12" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
    
    <div className="flex gap-2">
      <Skeleton className="h-8 flex-1 rounded-lg" />
      <Skeleton className="h-8 flex-1 rounded-lg" />
    </div>
  </Card>
);

/**
 * Dashboard Stats Loading Skeleton
 */
export const StatsCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn('space-y-3', className)} padding="lg" aria-label="Loading statistics">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-20" />
      <SkeletonCircle size="w-6 h-6" />
    </div>
    <Skeleton className="h-8 w-16" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-3 w-3 rounded-full" />
      <Skeleton className="h-3 w-24" />
    </div>
  </Card>
);

/**
 * Full Page Loading Component
 */
export interface PageLoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  title = 'Loading...',
  description = 'Please wait while we load your content.',
  className
}) => (
  <div 
    className={cn(
      'min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400',
      'flex items-center justify-center p-6',
      className
    )}
  >
    <Card className="max-w-md w-full text-center space-y-6" padding="xl">
      <div className="space-y-4">
        <LoadingSpinner size="xl" />
        <div className="space-y-2">
          <h2 className="text-heading-md text-white">{title}</h2>
          <p className="text-body-sm text-white/70">{description}</p>
        </div>
      </div>
      
      {/* Visual progress indicator */}
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-sky-400 to-sunrise-500 rounded-full animate-pulse"
          style={{ width: '60%' }}
          aria-hidden="true"
        />
      </div>
    </Card>
  </div>
);

/**
 * Inline Loading Component
 */
export interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = 'Loading...',
  size = 'md',
  className
}) => (
  <div className={cn('flex items-center gap-3', className)} role="status">
    <LoadingSpinner size={size} />
    <span className={cn(
      'text-white/80',
      size === 'sm' ? 'text-sm' :
      size === 'md' ? 'text-base' : 'text-lg'
    )}>
      {text}
    </span>
  </div>
);

/**
 * Error State Component
 */
export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'We encountered an error while loading this content.',
  onRetry,
  className
}) => (
  <Card className={cn('text-center space-y-4', className)} padding="xl">
    <div className="w-12 h-12 mx-auto bg-sunset-500/20 rounded-full flex items-center justify-center">
      <span className="text-sunset-500 text-xl">⚠</span>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-heading-sm text-white">{title}</h3>
      <p className="text-body-sm text-white/70">{description}</p>
    </div>
    
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-sky-400/90 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors duration-200 focus:ring-3 focus:ring-sky-400/50 focus:outline-none"
      >
        Try Again
      </button>
    )}
  </Card>
);

/**
 * Empty State Component
 */
export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionText,
  onAction,
  icon,
  className
}) => (
  <Card className={cn('text-center space-y-6', className)} padding="xl">
    <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
      {icon || <span className="text-white/40 text-2xl">📭</span>}
    </div>
    
    <div className="space-y-2">
      <h3 className="text-heading-sm text-white">{title}</h3>
      <p className="text-body-sm text-white/70 max-w-sm mx-auto">{description}</p>
    </div>
    
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-3 bg-sky-400/90 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors duration-200 focus:ring-3 focus:ring-sky-400/50 focus:outline-none"
      >
        {actionText}
      </button>
    )}
  </Card>
);

export default {
  LoadingSpinner,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  GameCardSkeleton,
  LeagueCardSkeleton,
  StatsCardSkeleton,
  PageLoading,
  InlineLoading,
  ErrorState,
  EmptyState,
};