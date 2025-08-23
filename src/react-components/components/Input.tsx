import React, { forwardRef } from 'react';
import { cn } from '../utils';

// Input Props Interface
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual style variant */
  variant?: 'default' | 'error' | 'success';
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Icon to display on the left */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right */
  rightIcon?: React.ReactNode;
  /** Custom className for the wrapper */
  wrapperClassName?: string;
}

/**
 * Input Component
 * 
 * A flexible input component with multiple variants and sizes.
 * Styled to match the ocean-to-sunset design system with glass morphism.
 * 
 * @example
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * <Input variant="error" error="This field is required" />
 * <Input size="lg" leftIcon={<SearchIcon />} placeholder="Search..." />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  required = false,
  leftIcon,
  rightIcon,
  className,
  wrapperClassName,
  disabled = false,
  ...props
}, ref) => {
  // Determine effective variant based on error prop
  const effectiveVariant = error ? 'error' : variant;

  // Variant styles mapping
  const variantStyles = {
    default: 'border-white/30 bg-white/5 focus:border-sky-400 focus:ring-sky-400/50 text-white placeholder-white/60',
    error: 'border-sunset-400 bg-sunset-400/10 focus:border-sunset-400 focus:ring-sunset-400/50 text-white placeholder-white/60',
    success: 'border-emerald-400 bg-emerald-400/10 focus:border-emerald-400 focus:ring-emerald-400/50 text-white placeholder-white/60',
  };

  // Size styles mapping
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // Icon size mapping
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Combine input classes
  const inputClasses = cn(
    // Base styles with glass morphism
    'w-full rounded-lg border backdrop-blur-lg transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Apply variant and size styles
    variantStyles[effectiveVariant],
    sizeStyles[size],
    // Icon padding adjustments
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  );

  const iconClasses = cn(
    'absolute top-1/2 transform -translate-y-1/2 text-white/60',
    iconSizes[size]
  );

  return (
    <div className={cn('w-full', wrapperClassName)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-white/90 mb-1">
          {label}
          {required && <span className="text-sunset-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={cn(iconClasses, 'left-3')}>
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={effectiveVariant === 'error'}
          aria-describedby={
            error ? `${props.id}-error` : 
            helperText ? `${props.id}-helper` : 
            undefined
          }
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className={cn(iconClasses, 'right-3')}>
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-1 text-sm text-sunset-400"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p 
          id={`${props.id}-helper`}
          className="mt-1 text-sm text-white/60"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';