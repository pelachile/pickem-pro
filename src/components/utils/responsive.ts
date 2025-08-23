/**
 * Responsive Design Utilities
 * 
 * Provides utilities for mobile-first responsive design patterns,
 * touch target sizing, and accessibility improvements.
 */

// Standard breakpoints following mobile-first approach
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
} as const;

// Touch target sizing utilities (WCAG 2.1 AA requirement: minimum 44px)
export const touchTargetSizes = {
  minimum: 'min-h-[44px] min-w-[44px]',
  small: 'min-h-[44px] min-w-[44px]',
  medium: 'min-h-[48px] min-w-[48px]',
  large: 'min-h-[52px] min-w-[52px]',
  extra: 'min-h-[56px] min-w-[56px]'
} as const;

// Responsive text scaling utilities
export const responsiveText = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl'
} as const;

// Responsive spacing utilities  
export const responsiveSpacing = {
  xs: 'p-2 sm:p-3',
  sm: 'p-3 sm:p-4', 
  md: 'p-4 sm:p-5 lg:p-6',
  lg: 'p-5 sm:p-6 lg:p-8',
  xl: 'p-6 sm:p-8 lg:p-10'
} as const;

// Container utilities for different layouts
export const containerSizes = {
  narrow: 'max-w-md mx-auto',
  normal: 'max-w-2xl mx-auto',
  wide: 'max-w-4xl mx-auto',
  full: 'max-w-7xl mx-auto'
} as const;

/**
 * Check if device supports hover (desktop vs mobile)
 */
export const supportsHover = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
};

/**
 * Check if device is mobile/touch-first
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
};

/**
 * Get responsive classes based on screen size
 */
export const getResponsiveClasses = (
  mobile: string,
  tablet?: string,
  desktop?: string
): string => {
  let classes = mobile;
  if (tablet) classes += ` md:${tablet}`;
  if (desktop) classes += ` lg:${desktop}`;
  return classes;
};

/**
 * Get touch-optimized button classes
 */
export const getTouchButtonClasses = (size: keyof typeof touchTargetSizes = 'small') => {
  return `${touchTargetSizes[size]} touch-manipulation select-none`;
};

/**
 * Get accessible focus ring classes
 */
export const getFocusRingClasses = (color: string = 'sunrise-400') => {
  return `focus:outline-none focus:ring-2 focus:ring-${color} focus:ring-offset-2 focus-visible:ring-2`;
};

/**
 * Get high contrast compatible classes
 */
export const getHighContrastClasses = (baseClasses: string) => {
  return `${baseClasses} contrast-more:border-white contrast-more:text-white`;
};

/**
 * Get mobile-optimized glass morphism classes
 */
export const getGlassMorphismClasses = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const intensityMap = {
    light: 'backdrop-blur-sm md:backdrop-blur-md',
    medium: 'backdrop-blur-md md:backdrop-blur-lg', 
    heavy: 'backdrop-blur-lg md:backdrop-blur-xl'
  };
  
  return `${intensityMap[intensity]} bg-navy-900/40 border border-white/15 shadow-xl`;
};

/**
 * Screen reader only text utility
 */
export const srOnly = 'sr-only';

/**
 * Skip to content link utility (for keyboard navigation)
 */
export const skipLinkClasses = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-navy-900 px-4 py-2 rounded-lg shadow-lg z-50';