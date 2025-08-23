import React from 'react';
import { cn } from '../utils';
import type { ButtonProps } from '../types';

/**
 * Button Component
 * 
 * A flexible button component with multiple variants and sizes.
 * Styled to match the ocean-to-sunset design system.
 * 
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button variant="ghost" size="sm" disabled>Small ghost button</Button>
 * <Button variant="destructive" loading onClick={() => alert('clicked')}>
 *   Delete item
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className,
  onClick,
  type = 'button',
  ...props
}) => {
  // Variant styles mapping - optimized for dark theme with improved contrast
  const variantStyles = {
    primary: 'bg-sky-400 hover:bg-sky-500 text-white border-transparent focus:ring-sky-500/50 shadow-sm backdrop-blur-lg',
    secondary: 'bg-ocean-600 hover:bg-ocean-700 text-white border-transparent focus:ring-ocean-500/50 shadow-sm backdrop-blur-lg',
    ghost: 'bg-white/5 hover:bg-white/15 text-white border-transparent focus:ring-white/50 backdrop-blur-lg',
    destructive: 'bg-sunset-500 hover:bg-sunset-600 text-white border-transparent focus:ring-sunset-500/50 shadow-sm backdrop-blur-lg',
    outline: 'bg-white/5 hover:bg-white/15 text-white border-white/40 hover:border-white/60 focus:ring-white/50 backdrop-blur-lg hover:text-sky-300',
  };

  // Size styles mapping - ensuring minimum 44px touch targets
  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm font-medium min-h-[44px] min-w-[44px]', // Meets touch target requirement
    md: 'px-6 py-3 text-sm font-semibold min-h-[44px]',
    lg: 'px-8 py-4 text-base font-semibold min-h-[48px]',
    xl: 'px-10 py-5 text-lg font-semibold min-h-[52px]',
    '2xl': 'px-12 py-6 text-xl font-semibold min-h-[56px]',
  };

  // Combine all classes
  const buttonClasses = cn(
    // Base styles with improved accessibility
    'inline-flex items-center justify-center gap-2 rounded-lg border transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
    'focus-visible:ring-2 focus-visible:ring-sunrise-400 focus-visible:ring-offset-2',
    'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100',
    'hover:scale-[1.02] active:scale-[0.98]',
    'select-none', // Prevent text selection
    
    // Variant and size styles
    variantStyles[variant],
    sizeStyles[size],
    
    // Loading and disabled states
    loading && 'cursor-wait',
    
    className
  );

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={loading ? `Loading...` : props['aria-label']}
      {...props}
    >
      {loading && (
        <div 
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" 
          aria-hidden="true"
          role="status"
        />
      )}
      <span className={loading ? 'sr-only' : ''}>{children}</span>
    </button>
  );
};

export default Button;