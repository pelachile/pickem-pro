import React, { useEffect, useRef } from 'react';
import { cn } from '../utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

/**
 * AnimatedCounter Component
 * 
 * Animates numbers from 0 to target value for engaging statistics display.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2000, 
  className 
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const previousValueRef = useRef<number>(0);
  
  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;
    
    const startValue = previousValueRef.current;
    const endValue = value;
    const startTime = Date.now();
    
    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        previousValueRef.current = endValue;
      }
    };
    
    requestAnimationFrame(updateCounter);
  }, [value, duration]);
  
  return <span ref={counterRef} className={className}>0</span>;
};

interface HoverGlowProps {
  children: React.ReactNode;
  glowColor?: 'sky' | 'sunset' | 'sunrise' | 'ocean';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

/**
 * HoverGlow Component
 * 
 * Adds a subtle glow effect on hover for enhanced interactivity.
 */
export const HoverGlow: React.FC<HoverGlowProps> = ({
  children,
  glowColor = 'sky',
  intensity = 'medium',
  className
}) => {
  const glowColors = {
    sky: 'hover:shadow-sky-400/20',
    sunset: 'hover:shadow-sunset-500/20',
    sunrise: 'hover:shadow-sunrise-500/20',
    ocean: 'hover:shadow-ocean-400/20'
  };

  const intensityClasses = {
    subtle: 'hover:shadow-lg',
    medium: 'hover:shadow-xl',
    strong: 'hover:shadow-2xl'
  };

  return (
    <div className={cn(
      'transition-shadow duration-300 ease-out',
      glowColors[glowColor],
      intensityClasses[intensity],
      className
    )}>
      {children}
    </div>
  );
};

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * FloatingActionButton Component
 * 
 * Floating action button with smooth animations and accessibility.
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label = 'Action',
  position = 'bottom-right',
  variant = 'primary',
  className
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white shadow-lg hover:shadow-sky-500/25',
    secondary: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/20 hover:border-white/30'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-14 h-14 rounded-full flex items-center justify-center z-50',
        'transition-all duration-300 ease-out',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-sunrise-400 focus:ring-offset-2',
        positionClasses[position],
        variantClasses[variant],
        className
      )}
      aria-label={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * ProgressBar Component
 * 
 * Animated progress bar with various styles and smooth transitions.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  animated = true,
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantClasses = {
    default: 'from-sky-400 to-sky-500',
    success: 'from-green-400 to-green-500',
    warning: 'from-yellow-400 to-yellow-500',
    error: 'from-red-400 to-red-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white/80">Progress</span>
          <span className="text-sm text-white/60">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        'bg-white/10 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-500 ease-out',
            variantClasses[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface PulsingDotProps {
  color?: 'sky' | 'green' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * PulsingDot Component
 * 
 * Animated pulsing dot for status indicators.
 */
export const PulsingDot: React.FC<PulsingDotProps> = ({
  color = 'green',
  size = 'md',
  className
}) => {
  const colorClasses = {
    sky: 'bg-sky-400',
    green: 'bg-green-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400'
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <div className={cn(
        'rounded-full animate-ping absolute inline-flex opacity-75',
        colorClasses[color],
        sizeClasses[size]
      )} />
      <div className={cn(
        'relative inline-flex rounded-full',
        colorClasses[color],
        sizeClasses[size]
      )} />
    </div>
  );
};

interface ToastNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

/**
 * ToastNotification Component
 * 
 * Animated toast notification for user feedback.
 */
export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  className
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeClasses = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    info: 'bg-sky-500/20 border-sky-500/30 text-sky-400'
  };

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 p-4 rounded-lg border backdrop-blur-lg',
      'transform transition-all duration-300 ease-out',
      'animate-slide-in-from-top shadow-lg min-w-[300px]',
      typeClasses[type],
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current hover:opacity-70 transition-opacity"
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default {
  AnimatedCounter,
  HoverGlow,
  FloatingActionButton,
  ProgressBar,
  PulsingDot,
  ToastNotification
};