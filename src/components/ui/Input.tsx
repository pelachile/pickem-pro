import React, { forwardRef } from 'react';
import { cn } from '../utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  variant?: 'default' | 'glass';
  icon?: React.ReactNode;
}

/**
 * Input Component
 * 
 * A flexible input component with glass morphism effects, error states,
 * and password visibility toggle. Follows the ocean-to-sunset design system.
 * 
 * @example
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * <Input label="Password" type="password" showPassword onTogglePassword={() => {}} />
 * <Input variant="glass" icon={<UserIcon />} placeholder="Username" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    className,
    variant = 'default',
    type = 'text',
    showPassword,
    onTogglePassword,
    icon,
    ...props
  },
  ref
) => {
  const baseStyles = cn(
    'w-full px-4 py-3 rounded-lg border transition-all duration-400 ease-out',
    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const variantStyles = {
    default: cn(
      'bg-white border-gray-300 text-gray-900',
      'hover:border-ocean-400 focus:border-ocean-500 focus:ring-ocean-500/50',
      'dark:bg-navy-800 dark:border-gray-600 dark:text-white',
      'dark:hover:border-ocean-400 dark:focus:border-ocean-400'
    ),
    glass: cn(
      'bg-white/[0.02] backdrop-blur-sm border-white/10 text-white',
      'hover:bg-white/[0.03] hover:border-white/10',
      'focus:bg-white/[0.04] focus:border-sky-400/30 focus:ring-sky-400/10',
      'placeholder:text-white/40'
    )
  };

  const errorStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
    : '';

  const inputClasses = cn(
    baseStyles,
    variantStyles[variant],
    errorStyles,
    icon && 'pl-12', // Extra padding for icon
    (type === 'password' && onTogglePassword) && 'pr-12', // Extra padding for toggle
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(
          'block text-sm font-medium',
          variant === 'glass' ? 'text-white' : 'text-gray-700 dark:text-white'
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type === 'password' && showPassword ? 'text' : type}
          className={inputClasses}
          {...props}
        />
        
        {type === 'password' && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2',
              'text-gray-500 hover:text-gray-700 transition-colors duration-200',
              'dark:text-gray-400 dark:hover:text-gray-200',
              variant === 'glass' && 'text-white/60 hover:text-white'
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;