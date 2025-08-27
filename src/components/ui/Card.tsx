import React from 'react';
import { cn } from '../utils';
import type { CardProps } from '../types';

/**
 * Card Component
 * 
 * A flexible card component with glass morphism effects.
 * Includes hover animations and multiple padding options.
 * Based on the ocean-to-sunset design system.
 * 
 * @example
 * <Card glass hover>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * <Card padding="lg" className="border border-sky-blue/20">
 *   Large padding card with custom border
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = true,
  hover = true,
  padding = 'md',
  ...props
}) => {
  // Enhanced glass effect styles with better depth
  const glassStyles = glass 
    ? 'glass-enhanced backdrop-blur-xl bg-navy-900/30 border border-white/20 shadow-2xl' 
    : 'bg-navy-900/60 border border-white/10 shadow-lg';

  // Enhanced hover effect styles with smooth micro-interactions
  const hoverStyles = hover 
    ? 'card-hover-lift hover:bg-navy-900/40 hover:border-white/30 hover:shadow-3xl focus-within:bg-navy-900/40 focus-within:border-white/30 group' 
    : 'transition-colors duration-200';

  // Padding styles mapping with consistent spacing
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-10',
  };

  // Combine all classes with transform optimizations
  const cardClasses = cn(
    // Base styles with GPU acceleration
    'relative rounded-xl transform-gpu',
    
    // Glass effect
    glassStyles,
    
    // Hover effects
    hoverStyles,
    
    // Padding
    paddingStyles[padding],
    
    // Enhanced accessibility
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
    
    className
  );

  return (
    <div 
      className={cardClasses}
      role="region"
      {...props}
    >
      {/* Subtle inner glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/5 via-transparent to-sunset-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * CardHeader Component
 * 
 * A header section for cards with consistent spacing and typography.
 */
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('mb-4 pb-2 border-b border-white/10', className)}>
    {children}
  </div>
);

/**
 * CardTitle Component
 * 
 * A title component for card headers with proper typography scaling.
 */
export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h3 className={cn('text-lg font-semibold text-white', className)}>
    {children}
  </h3>
);

/**
 * CardContent Component
 * 
 * Main content area for cards with appropriate text styling.
 */
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('text-white/80', className)}>
    {children}
  </div>
);

/**
 * CardFooter Component
 * 
 * Footer section for cards, typically used for actions or metadata.
 */
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('mt-4 pt-2 border-t border-white/10 flex items-center justify-between', className)}>
    {children}
  </div>
);

export default Card;