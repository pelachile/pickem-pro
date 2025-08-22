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
  // Glass effect styles - optimized for dark theme
  const glassStyles = glass 
    ? 'backdrop-blur-lg bg-navy-900/60 border border-white/10 shadow-lg' 
    : 'bg-navy-900/60 border border-white/10 shadow-sm';

  // Hover effect styles
  const hoverStyles = hover 
    ? 'transition-all duration-300 ease-in-out hover:bg-navy-900/70 hover:border-white/20 hover:shadow-xl' 
    : 'transition-colors duration-200';

  // Padding styles mapping
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-10',
  };

  // Combine all classes
  const cardClasses = cn(
    // Base styles
    'rounded-lg',
    
    // Glass effect
    glassStyles,
    
    // Hover effects
    hoverStyles,
    
    // Padding
    paddingStyles[padding],
    
    className
  );

  return (
    <div 
      className={cardClasses}
      {...props}
    >
      {children}
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