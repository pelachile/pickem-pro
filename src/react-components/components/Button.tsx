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
  // Variant styles mapping - optimized for dark theme
  const variantStyles = {
    primary: 'bg-sky-400 hover:bg-sky-500 text-white border-transparent focus:ring-sky-500/50 shadow-sm',
    secondary: 'bg-ocean-600 hover:bg-ocean-700 text-white border-transparent focus:ring-ocean-500/50 shadow-sm',
    ghost: 'bg-transparent hover:bg-white/10 text-white border-transparent focus:ring-white/30',
    destructive: 'bg-sunset-500 hover:bg-sunset-600 text-white border-transparent focus:ring-sunset-500/50 shadow-sm',
    outline: 'bg-transparent hover:bg-white/10 text-white border-white/30 hover:border-white/50 focus:ring-white/30 backdrop-blur-sm hover:text-sky-400',
  };

  // Size styles mapping
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-6 py-3 text-base font-semibold',
    xl: 'px-8 py-4 text-lg font-semibold',
    '2xl': 'px-10 py-5 text-xl font-semibold',
  };

  // Combine all classes
  const buttonClasses = cn(
    // Base styles
    'inline-flex items-center justify-center gap-2 rounded-lg border transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    'hover:scale-105 active:scale-95',
    
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
      {...props}
    >
      {loading && (
        <div 
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" 
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

export default Button;