import React from 'react';
import { cn, getStatusVariant, getStatusText, getStatusAnimation, shouldShowIndicator } from '../utils';
import type { StatusBadgeProps } from '../types';

/**
 * StatusBadge Component
 * 
 * Displays status information with optional live indicators and animations.
 * Converted from Laravel Blade status-badge component.
 * 
 * @example
 * <StatusBadge status="live" animate showIndicator />
 * <StatusBadge status="scheduled" text="Game starts soon" />
 * <StatusBadge status="final" size="lg" />
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'default',
  variant,
  animate = false,
  showIndicator = false,
  indicatorType = 'pulse',
  size = 'default',
  text,
  className,
  children,
  ...props
}) => {
  // Determine variant based on status if not explicitly provided
  const badgeVariant = variant ?? getStatusVariant(status);
  
  // Determine display text
  const displayText = getStatusText(status, text);
  
  // Determine size classes
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' 
    : size === 'lg' ? 'text-sm px-3 py-1.5' 
    : 'text-xs px-2.5 py-1';
  
  // Determine animation classes
  const animationClasses = getStatusAnimation(status, animate);
  
  // Variant styles mapping - improved contrast for WCAG AA compliance
  const variantStyles = {
    'sunset-orange': 'bg-sunset-500/95 text-white border border-sunset-400/30 shadow-lg backdrop-blur-sm',
    'sky-blue': 'bg-sky-400/95 text-white border border-sky-300/30 shadow-lg backdrop-blur-sm',
    'midnight-navy': 'bg-navy-900/95 text-white border border-navy-700/30 shadow-lg backdrop-blur-sm',
    'sunrise-gold': 'bg-sunrise-500/95 text-white border border-sunrise-400/30 shadow-lg backdrop-blur-sm',
    'ocean-blue': 'bg-ocean-600/95 text-white border border-ocean-500/30 shadow-lg backdrop-blur-sm',
  };
  
  // Combine all classes
  const badgeClasses = cn(
    'inline-flex items-center font-semibold rounded-md backdrop-blur-sm transition-all duration-300',
    sizeClasses,
    variantStyles[badgeVariant as keyof typeof variantStyles] || variantStyles['ocean-blue'],
    animationClasses,
    className
  );
  
  const showIndicatorForStatus = showIndicator && shouldShowIndicator(status);

  return (
    <span 
      className={badgeClasses}
      role="status"
      aria-label={`Status: ${displayText}`}
      {...props}
    >
      {showIndicatorForStatus && (
        <>
          {indicatorType === 'pulse' && (
            <div 
              className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse-slow shadow-sm" 
              aria-hidden="true"
            />
          )}
          {indicatorType === 'double-pulse' && ['red_zone', 'urgent', 'critical'].includes(status) && (
            <div className="w-2 h-2 mr-2 relative" aria-hidden="true">
              <div className="absolute inset-0 bg-current rounded-full animate-pulse-fast" />
              <div className="absolute inset-0 bg-current rounded-full animate-pulse-slow opacity-50" />
            </div>
          )}
        </>
      )}
      
      {displayText}
      
      {children}
    </span>
  );
};

export default StatusBadge;