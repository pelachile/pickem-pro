import React, { forwardRef } from 'react';
import { cn, getFocusRingClasses, getTouchButtonClasses } from '../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  variant?: 'default' | 'glass';
  icon?: React.ReactNode;
  helpText?: string;
  'aria-describedby'?: string;
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
    helpText,
    ...props
  },
  ref
) => {
  const baseStyles = cn(
    'w-full px-4 py-3 rounded-lg border transition-all duration-200 ease-out',
    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    'min-h-[44px]', // Touch target compliance
    getFocusRingClasses(),
    'disabled:opacity-60 disabled:cursor-not-allowed'
  );

  const variantStyles = {
    default: cn(
      'bg-navy-800 border-white/20 text-white',
      'hover:border-ocean-400 hover:bg-navy-700',
      'focus:border-sky-400 focus:bg-navy-700',
      'placeholder:text-white/50'
    ),
    glass: cn(
      'bg-white/5 backdrop-blur-lg border-white/15 text-white',
      'hover:bg-white/8 hover:border-white/25',
      'focus:bg-white/10 focus:border-sky-400/40',
      'placeholder:text-white/50'
    )
  };

  const errorStyles = error
    ? 'border-sunset-500 focus:border-sunset-500 focus:ring-sunset-500/50'
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
              'absolute right-2 top-1/2 transform -translate-y-1/2',
              'p-2 rounded-md transition-colors duration-200',
              'text-white/60 hover:text-white hover:bg-white/10',
              getFocusRingClasses(),
              getTouchButtonClasses()
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {showPassword ? '👁️' : '🔒'}
            </span>
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-sunset-400 mt-1" role="alert" id={props.id ? `${props.id}-error` : undefined}>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-white/60 mt-1" id={props.id ? `${props.id}-help` : undefined}>
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;