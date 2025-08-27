import React from 'react';
import { cn } from '../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button' | 'game-card';
  animation?: 'pulse' | 'shimmer' | 'wave';
  lines?: number;
  height?: string;
  width?: string;
}

/**
 * Skeleton Component
 * 
 * A flexible skeleton loader with multiple variants and animations.
 * Used for loading states throughout the application.
 * 
 * @example
 * <Skeleton variant="card" />
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="game-card" animation="shimmer" />
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  animation = 'pulse',
  lines = 1,
  height,
  width,
}) => {
  const baseClasses = cn(
    'bg-white/10 rounded-lg',
    {
      'animate-pulse': animation === 'pulse',
      'loading-shimmer': animation === 'shimmer',
      'animate-wave': animation === 'wave',
    }
  );

  const variantClasses = {
    default: 'h-4 w-full',
    card: 'h-48 w-full',
    text: 'h-3 w-full',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    'game-card': 'h-80 w-full rounded-xl',
  };

  const skeletonClasses = cn(
    baseClasses,
    variantClasses[variant],
    className
  );

  const style: React.CSSProperties = {
    ...(height && { height }),
    ...(width && { width }),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              skeletonClasses,
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return <div className={skeletonClasses} style={style} />;
};

/**
 * GameCardSkeleton Component
 * 
 * Specialized skeleton for game cards with proper proportions.
 */
export const GameCardSkeleton: React.FC<{ 
  layout?: 'default' | 'wide' | 'full';
  className?: string; 
}> = ({ layout = 'default', className }) => {
  const cardHeight = layout === 'full' ? 'h-96' : layout === 'wide' ? 'h-80' : 'h-64';
  
  return (
    <div className={cn(
      'bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4',
      cardHeight,
      className
    )}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      
      {/* Team sections */}
      <div className="space-y-4">
        {/* Away team */}
        <div className="flex items-center space-x-4 bg-white/5 rounded-lg p-3">
          <Skeleton variant="avatar" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-12" />
        </div>
        
        {/* VS indicator */}
        <div className="flex justify-center">
          <Skeleton className="h-4 w-8 rounded-full" />
        </div>
        
        {/* Home team */}
        <div className="flex items-center space-x-4 bg-white/5 rounded-lg p-3">
          <Skeleton variant="avatar" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-2 border-t border-white/10">
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
};

/**
 * DashboardStatsSkeleton Component
 * 
 * Skeleton for dashboard statistics cards.
 */
export const DashboardStatsSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white/[0.05] border border-white/10 rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * LeagueListSkeleton Component
 * 
 * Skeleton for league list items in sidebar.
 */
export const LeagueListSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className 
}) => (
  <div className={cn('space-y-1', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex gap-x-3 rounded-md p-2">
        <Skeleton className="h-6 w-6 rounded-lg" />
        <div className="flex flex-col min-w-0 flex-1 space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;