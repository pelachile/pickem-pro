/**
 * Tailwind CSS Theme Extension
 * Extracted from Laravel NFL Pick'em App Design System
 * 
 * Usage: Merge this object into your Tailwind config's theme.extend
 */

export const themeExtension = {
  colors: {
    // ===== OCEAN-TO-SUNSET COLOR SYSTEM =====
    // Primary Ocean-to-Sunset Palette
    'midnight-navy': '#062440',
    'ocean-blue': '#005A7C',
    'sky-blue': '#87B9F5',
    'sunset-orange': '#FF7D17',
    'sunrise-gold': '#FFA61C',

    // Ocean-to-Sunset Color Scales
    'sky-blue': {
      50: '#F0F8FF',
      100: '#E1F1FE',
      200: '#C3E3FD',
      300: '#87B9F5',
      400: '#6BA8F3',
      500: '#4F96F1',
      600: '#3485EF',
      700: '#2563EB',
      800: '#1D4ED8',
      900: '#1E40AF',
    },

    'ocean-blue': {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#005A7C',
      600: '#004A65',
      700: '#003A4E',
      800: '#002A37',
      900: '#001A20',
    },

    // Extended Neutral Palette
    gray: {
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#BDC1C6',
      500: '#9AA0A6',
      600: '#80868B',
      700: '#5F6368',
      800: '#3C4043',
      900: '#202124',
    },

    // Color Variants
    'slate-light': '#2A2E32',
    'lime-light': '#8BC924',
    'lime-dark': '#6BA00E',
    'orange-light': '#F4A03F',
    'orange-dark': '#E16A0C',
    'red-light': '#E55A4A',
    'red-dark': '#C12A1A',

    // ===== DARK MODE COLOR SYSTEM =====
    // Dark Mode Background Colors
    'dark-bg-primary': '#0D1117',
    'dark-bg-secondary': '#161B22',
    'dark-bg-tertiary': '#21262D',
    'dark-bg-overlay': '#30363D',
    'dark-bg-hover': '#292E36',

    // Dark Mode Text Colors
    'dark-text-primary': '#F0F6FC',
    'dark-text-secondary': '#C9D1D9',
    'dark-text-tertiary': '#8B949E',
    'dark-text-inverse': '#0D1117',

    // Dark Mode Border Colors
    'dark-border-primary': '#30363D',
    'dark-border-secondary': '#21262D',
    'dark-border-muted': '#373E47',

    // Dark Mode Brand Colors
    'dark-lime': '#7ED321',
    'dark-lime-light': '#A0E847',
    'dark-lime-dark': '#6BA00E',
    'dark-light-orange': '#FF9500',
    'dark-orange': '#FF6B35',
    'dark-orange-light': '#FF8C5A',
    'dark-fire-red': '#FF453A',
    'dark-fire-red-light': '#FF6961',
    'dark-fire-red-dark': '#D93223',

    // Semantic Color Mapping
    success: '#FFA61C', // sunrise-gold
    warning: '#FF7D17', // sunset-orange
    error: '#FF453A',   // dark-fire-red
    info: '#87B9F5',    // sky-blue
  },

  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  },

  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1rem' }],
    'sm': ['0.875rem', { lineHeight: '1.25rem' }],
    'base': ['1rem', { lineHeight: '1.5rem' }],
    'lg': ['1.125rem', { lineHeight: '1.75rem' }],
    'xl': ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },

  spacing: {
    '0.5': '0.125rem', // 2px
    '1': '0.25rem',    // 4px
    '1.5': '0.375rem', // 6px
    '2': '0.5rem',     // 8px
    '2.5': '0.625rem', // 10px
    '3': '0.75rem',    // 12px
    '3.5': '0.875rem', // 14px
    '4': '1rem',       // 16px
    '5': '1.25rem',    // 20px
    '6': '1.5rem',     // 24px
    '7': '1.75rem',    // 28px
    '8': '2rem',       // 32px
    '9': '2.25rem',    // 36px
    '10': '2.5rem',    // 40px
    '11': '2.75rem',   // 44px
    '12': '3rem',      // 48px
  },

  borderRadius: {
    'none': '0',
    'sm': '0.25rem',   // 4px
    'DEFAULT': '0.375rem', // 6px
    'md': '0.5rem',    // 8px
    'lg': '0.75rem',   // 12px
    'xl': '1rem',      // 16px
    '2xl': '1.5rem',   // 24px
    'full': '9999px',
  },

  animation: {
    'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'slideInUp': 'slideInUp 0.3s ease-out',
    'slideInDown': 'slideInDown 0.3s ease-out',
    'fadeIn': 'fadeIn 0.3s ease-out',
    'scaleIn': 'scaleIn 0.2s ease-out',
  },

  keyframes: {
    slideInUp: {
      '0%': { transform: 'translateY(20px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideInDown: {
      '0%': { transform: 'translateY(-20px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
  },

  boxShadow: {
    'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.37)',
    'glow': '0 0 20px rgba(135, 185, 245, 0.3)',
    'glow-orange': '0 0 20px rgba(255, 125, 23, 0.3)',
  },

  backdropBlur: {
    'xs': '2px',
    'sm': '4px',
    'md': '8px',
    'lg': '12px',
    'xl': '16px',
  },
};

// Default Tailwind config structure for easy copy-paste
export const tailwindConfig = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: themeExtension
  },
  plugins: [],
};

export default tailwindConfig;