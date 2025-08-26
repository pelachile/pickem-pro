import React from 'react';
import { cn } from '../utils';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

/**
 * Toggle Component
 * 
 * A modern toggle/switch component with smooth animations.
 * 
 * @example
 * <Toggle enabled={isEnabled} onChange={setIsEnabled} aria-label="Enable notifications" />
 */
export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  disabled = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}) => {
  const sizeClasses = {
    sm: {
      container: 'h-5 w-9',
      switch: 'size-4',
      translate: enabled ? 'translate-x-4' : 'translate-x-0'
    },
    md: {
      container: 'h-6 w-11',
      switch: 'size-5',
      translate: enabled ? 'translate-x-5' : 'translate-x-0'
    },
    lg: {
      container: 'h-7 w-13',
      switch: 'size-6',
      translate: enabled ? 'translate-x-6' : 'translate-x-0'
    }
  };

  const sizeConfig = sizeClasses[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!enabled);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onChange(!enabled);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 focus:ring-offset-navy-900',
        sizeConfig.container,
        enabled
          ? 'bg-sky-400'
          : 'bg-white/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          sizeConfig.switch,
          sizeConfig.translate
        )}
        aria-hidden="true"
      />
    </button>
  );
};

export default Toggle;