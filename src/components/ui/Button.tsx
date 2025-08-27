import React, { useCallback } from 'react';
import { cn } from '../utils';
import type { ButtonProps } from '../types';

/**
 * Button Component
 * 
 * A flexible button component with multiple variants and sizes.
 * Styled to match the ocean-to-sunset design system with enhanced micro-interactions.
 * 
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button variant="ghost" size="sm" disabled>Small ghost button</Button>
 * <Button variant="destructive" loading onClick={() => alert('clicked')}>
 *   Delete item
 * </Button>
 */
export const Button: React.FC<ButtonProps> = React.memo(({
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
  // Enhanced variant styles with improved micro-interactions
  const variantStyles = {
    primary: 'bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 active:from-sky-600 active:to-sky-700 text-white border-transparent focus:ring-sky-500/50 shadow-lg hover:shadow-sky-500/25 backdrop-blur-lg',
    secondary: 'bg-gradient-to-r from-ocean-600 to-ocean-700 hover:from-ocean-700 hover:to-ocean-800 active:from-ocean-800 active:to-ocean-900 text-white border-transparent focus:ring-ocean-500/50 shadow-lg hover:shadow-ocean-500/25 backdrop-blur-lg',
    ghost: 'bg-white/5 hover:bg-white/15 active:bg-white/20 text-white border-transparent focus:ring-white/50 backdrop-blur-lg hover:shadow-lg hover:shadow-white/10',
    destructive: 'bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 active:from-sunset-700 active:to-sunset-800 text-white border-transparent focus:ring-sunset-500/50 shadow-lg hover:shadow-sunset-500/25 backdrop-blur-lg',
    outline: 'bg-white/5 hover:bg-white/15 active:bg-white/20 text-white border-white/40 hover:border-white/60 active:border-white/80 focus:ring-white/50 backdrop-blur-lg hover:text-sky-300 hover:shadow-lg hover:shadow-white/10',
  };

  // Enhanced size styles with better touch targets and spacing
  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm font-medium min-h-[44px] min-w-[44px] gap-2',
    md: 'px-6 py-3 text-sm font-semibold min-h-[44px] gap-2',
    lg: 'px-8 py-4 text-base font-semibold min-h-[48px] gap-3',
    xl: 'px-10 py-5 text-lg font-semibold min-h-[52px] gap-3',
    '2xl': 'px-12 py-6 text-xl font-semibold min-h-[56px] gap-4',
  };

  // Combine all classes with enhanced animations
  const buttonClasses = cn(
    // Base styles with improved micro-interactions
    'group relative inline-flex items-center justify-center rounded-lg border overflow-hidden',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
    'focus-visible:ring-2 focus-visible:ring-sunrise-400 focus-visible:ring-offset-2',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'select-none', // Prevent text selection
    'transition-all duration-200 ease-out',
    
    // Enhanced hover and active states with performance optimizations
    !disabled && !loading && 'hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0',
    
    // Variant and size styles
    variantStyles[variant],
    sizeStyles[size],
    
    // Loading state styling
    loading && 'cursor-wait',
    
    className
  );

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      // Add ripple effect on click for better user feedback
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      
      // Clean up ripple after animation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
      
      onClick();
    }
  }, [disabled, loading, onClick]);

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
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" 
          aria-hidden="true"
          role="status"
        />
      )}
      <span className={cn(
        'transition-all duration-200 ease-out relative z-10',
        loading && 'opacity-70'
      )}>
        {children}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;