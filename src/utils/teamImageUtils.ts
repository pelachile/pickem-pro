// Team Image Utilities for Enhanced AI Team Data Display
// Now includes gradient fallbacks and team color systems

import React from 'react';

export interface TeamColors {
  primary: string;
  secondary: string;
}

export interface TeamImageConfig {
  stadiumImages: Record<string, string>;
  actionShots: Record<string, string[]>;
  bannerImages: Record<string, string>;
  fallbackImages: {
    stadium: string;
    action: string;
    logo: string;
    banner: string;
  };
}

export interface ImageFallbackConfig {
  teamColors: TeamColors;
  teamName: string;
  abbreviation: string;
  preferredImageType?: 'stadium' | 'banner' | 'action';
}

export interface TeamImageResult {
  src: string;
  isGradient: boolean;
  gradientStyle?: React.CSSProperties;
  backgroundColor?: string;
  logoOverlay?: React.CSSProperties;
}

// Default NFL team image mappings
// In a real application, these would come from a CMS or image service
export const NFL_TEAM_IMAGES: TeamImageConfig = {
  // Stadium images by team abbreviation
  stadiumImages: {
    'ARI': '/images/teams/stadiums/arizona-cardinals-stadium.jpg',
    'ATL': '/images/teams/stadiums/atlanta-falcons-stadium.jpg',
    'BAL': '/images/teams/stadiums/baltimore-ravens-stadium.jpg',
    'BUF': '/images/teams/stadiums/buffalo-bills-stadium.jpg',
    'CAR': '/images/teams/stadiums/carolina-panthers-stadium.jpg',
    'CHI': '/images/teams/stadiums/chicago-bears-stadium.jpg',
    'CIN': '/images/teams/stadiums/cincinnati-bengals-stadium.jpg',
    'CLE': '/images/teams/stadiums/cleveland-browns-stadium.jpg',
    'DAL': '/images/teams/stadiums/dallas-cowboys-stadium.jpg',
    'DEN': '/images/teams/stadiums/denver-broncos-stadium.jpg',
    'DET': '/images/teams/stadiums/detroit-lions-stadium.jpg',
    'GB': '/images/teams/stadiums/green-bay-packers-stadium.jpg',
    'HOU': '/images/teams/stadiums/houston-texans-stadium.jpg',
    'IND': '/images/teams/stadiums/indianapolis-colts-stadium.jpg',
    'JAX': '/images/teams/stadiums/jacksonville-jaguars-stadium.jpg',
    'KC': '/images/teams/stadiums/kansas-city-chiefs-stadium.jpg',
    'LV': '/images/teams/stadiums/las-vegas-raiders-stadium.jpg',
    'LAC': '/images/teams/stadiums/los-angeles-chargers-stadium.jpg',
    'LAR': '/images/teams/stadiums/los-angeles-rams-stadium.jpg',
    'MIA': '/images/teams/stadiums/miami-dolphins-stadium.jpg',
    'MIN': '/images/teams/stadiums/minnesota-vikings-stadium.jpg',
    'NE': '/images/teams/stadiums/new-england-patriots-stadium.jpg',
    'NO': '/images/teams/stadiums/new-orleans-saints-stadium.jpg',
    'NYG': '/images/teams/stadiums/new-york-giants-stadium.jpg',
    'NYJ': '/images/teams/stadiums/new-york-jets-stadium.jpg',
    'PHI': '/images/teams/stadiums/philadelphia-eagles-stadium.jpg',
    'PIT': '/images/teams/stadiums/pittsburgh-steelers-stadium.jpg',
    'SF': '/images/teams/stadiums/san-francisco-49ers-stadium.jpg',
    'SEA': '/images/teams/stadiums/seattle-seahawks-stadium.jpg',
    'TB': '/images/teams/stadiums/tampa-bay-buccaneers-stadium.jpg',
    'TEN': '/images/teams/stadiums/tennessee-titans-stadium.jpg',
    'WAS': '/images/teams/stadiums/washington-commanders-stadium.jpg',
  },

  // Action shots for each team
  actionShots: {
    'ARI': [
      '/images/teams/action/arizona-cardinals-1.jpg',
      '/images/teams/action/arizona-cardinals-2.jpg',
      '/images/teams/action/arizona-cardinals-3.jpg',
    ],
    'ATL': [
      '/images/teams/action/atlanta-falcons-1.jpg',
      '/images/teams/action/atlanta-falcons-2.jpg',
      '/images/teams/action/atlanta-falcons-3.jpg',
    ],
    // ... continue for all teams
  },

  // Banner images for hero sections
  bannerImages: {
    'ARI': '/images/teams/banners/arizona-cardinals-banner.jpg',
    'ATL': '/images/teams/banners/atlanta-falcons-banner.jpg',
    'BAL': '/images/teams/banners/baltimore-ravens-banner.jpg',
    'BUF': '/images/teams/banners/buffalo-bills-banner.jpg',
    // ... continue for all teams
  },

  // Fallback images when team-specific images aren't available
  fallbackImages: {
    stadium: '/images/fallbacks/nfl-stadium-generic.jpg',
    action: '/images/fallbacks/nfl-action-generic.jpg',
    logo: '/images/fallbacks/nfl-logo-generic.png',
    banner: '/images/fallbacks/nfl-banner-generic.jpg',
  }
};

/**
 * Get stadium image URL for a team
 */
export function getStadiumImage(teamAbbreviation: string): string {
  return NFL_TEAM_IMAGES.stadiumImages[teamAbbreviation.toUpperCase()] || 
         NFL_TEAM_IMAGES.fallbackImages.stadium;
}

/**
 * Get action shots for a team
 */
export function getActionShots(teamAbbreviation: string): string[] {
  return NFL_TEAM_IMAGES.actionShots[teamAbbreviation.toUpperCase()] || [];
}

/**
 * Get banner image for a team
 */
export function getBannerImage(teamAbbreviation: string): string {
  return NFL_TEAM_IMAGES.bannerImages[teamAbbreviation.toUpperCase()] || 
         NFL_TEAM_IMAGES.fallbackImages.banner;
}

/**
 * Generate a complete image gallery for a team
 */
export function generateTeamImageGallery(teamAbbreviation: string, teamName: string) {
  const images = [];
  
  // Add stadium image
  const stadiumImage = getStadiumImage(teamAbbreviation);
  if (stadiumImage !== NFL_TEAM_IMAGES.fallbackImages.stadium) {
    images.push({
      url: stadiumImage,
      caption: `${teamName} Stadium`,
      type: 'stadium' as const
    });
  }
  
  // Add action shots
  const actionShots = getActionShots(teamAbbreviation);
  actionShots.forEach((shot, index) => {
    images.push({
      url: shot,
      caption: `${teamName} in action ${index + 1}`,
      type: 'action' as const
    });
  });
  
  return images;
}

/**
 * Enhance team data with comprehensive image support
 */
export function enhanceTeamDataWithImages<T extends { basic: { abbreviation: string; name: string } }>(
  teamData: T
): T & { 
  visuals: {
    stadiumImage: string;
    bannerImage: string;
    galleryImages: Array<{
      url: string;
      caption: string;
      type: 'stadium' | 'action' | 'celebration' | 'training' | 'fan';
    }>;
  }
} {
  const { abbreviation, name } = teamData.basic;
  
  return {
    ...teamData,
    visuals: {
      stadiumImage: getStadiumImage(abbreviation),
      bannerImage: getBannerImage(abbreviation),
      galleryImages: generateTeamImageGallery(abbreviation, name),
      ...('visuals' in teamData ? teamData.visuals : {})
    }
  };
}

/**
 * Validate image URL and provide fallback
 */
export async function validateImageUrl(url: string, fallback: string): Promise<string> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok ? url : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Preload critical team images for better performance
 */
export function preloadTeamImages(teamAbbreviation: string): Promise<void[]> {
  const imagesToPreload = [
    getStadiumImage(teamAbbreviation),
    getBannerImage(teamAbbreviation),
    ...getActionShots(teamAbbreviation).slice(0, 2) // First 2 action shots
  ];
  
  const preloadPromises = imagesToPreload.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });
  });
  
  return Promise.all(preloadPromises);
}

/**
 * Generate responsive image srcSet for different screen sizes
 */
export function generateResponsiveImageSet(baseUrl: string): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  // This would typically generate different sized versions
  // For now, we'll use the base URL for all sizes
  return {
    src: baseUrl,
    srcSet: `${baseUrl} 1x, ${baseUrl} 2x`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  };
}

/**
 * Get optimized image URL based on context and device
 */
export function getOptimizedImageUrl(
  baseUrl: string, 
  context: 'hero' | 'thumbnail' | 'gallery' | 'background',
  devicePixelRatio = 1
): string {
  // In a real application, this would:
  // 1. Detect device capabilities
  // 2. Choose appropriate image format (WebP, AVIF, etc.)
  // 3. Select appropriate dimensions
  // 4. Add optimization parameters to URL
  
  const optimizations = new URLSearchParams();
  
  switch (context) {
    case 'hero':
      optimizations.set('w', '1200');
      optimizations.set('h', '600');
      optimizations.set('fit', 'crop');
      break;
    case 'thumbnail':
      optimizations.set('w', '150');
      optimizations.set('h', '100');
      optimizations.set('fit', 'crop');
      break;
    case 'gallery':
      optimizations.set('w', '800');
      optimizations.set('h', '400');
      optimizations.set('fit', 'crop');
      break;
    case 'background':
      optimizations.set('w', '1600');
      optimizations.set('h', '900');
      optimizations.set('fit', 'crop');
      break;
  }
  
  // Add device pixel ratio if greater than 1
  if (devicePixelRatio > 1) {
    const width = parseInt(optimizations.get('w') || '800');
    const height = parseInt(optimizations.get('h') || '400');
    optimizations.set('w', String(Math.round(width * devicePixelRatio)));
    optimizations.set('h', String(Math.round(height * devicePixelRatio)));
  }
  
  // Add format optimization
  optimizations.set('auto', 'format,compress');
  optimizations.set('q', '85');
  
  return `${baseUrl}?${optimizations.toString()}`;
}

/**
 * Advanced Image Fallback System with Gradient Generation
 */

/**
 * Validates and normalizes hex color values
 */
function normalizeColor(color: string): string {
  // Remove # if present and ensure it's a valid hex
  const cleaned = color.replace('#', '');
  if (cleaned.length === 6 && /^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return `#${cleaned}`;
  }
  // Return a default color if invalid
  return '#1f2937';
}

/**
 * Converts hex color to HSL for brightness calculation
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Determines if a color is dark (for text contrast)
 */
function isColorDark(hex: string): boolean {
  const { l } = hexToHsl(hex);
  return l < 50;
}

/**
 * Creates a beautiful gradient background using team colors
 */
export function createTeamGradient(teamColors: TeamColors, style: 'stadium' | 'banner' | 'subtle' = 'stadium'): React.CSSProperties {
  const primary = normalizeColor(teamColors.primary);
  const secondary = normalizeColor(teamColors.secondary);
  
  // Create variations based on style
  switch (style) {
    case 'stadium':
      // Dramatic gradient for stadium/hero images with particle effect
      return {
        background: `
          radial-gradient(circle at 20% 50%, ${primary}22 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${secondary}22 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, ${primary}11 0%, transparent 50%),
          linear-gradient(135deg, ${primary}ee 0%, ${secondary}aa 25%, ${primary}cc 50%, ${secondary}88 75%, ${primary}66 100%)
        `,
        backgroundSize: '300% 300%, 200% 200%, 250% 250%, 100% 100%',
        backgroundPosition: '0% 0%, 100% 0%, 50% 100%, 0% 0%',
        position: 'relative' as const
      };
    
    case 'banner':
      // Horizontal gradient for banner images
      return {
        background: `
          linear-gradient(45deg, ${primary}33 0%, transparent 70%),
          linear-gradient(90deg, ${primary}dd 0%, ${secondary}bb 30%, ${primary}99 60%, ${secondary}77 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%'
      };
    
    case 'subtle':
      // Subtle gradient for overlays
      return {
        background: `linear-gradient(135deg, ${primary}44 0%, ${secondary}33 50%, ${primary}22 100%)`
      };
    
    default:
      return {
        background: `linear-gradient(135deg, ${primary}cc 0%, ${secondary}99 100%)`
      };
  }
}

/**
 * Generates team logo overlay for gradient backgrounds
 */
export function createLogoOverlay(abbreviation: string, teamColors: TeamColors): React.CSSProperties {
  const primary = normalizeColor(teamColors.primary);
  const secondary = normalizeColor(teamColors.secondary);
  const isDark = isColorDark(primary);
  
  return {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(3rem, 8vw, 8rem)',
    fontWeight: 'bold' as const,
    background: `linear-gradient(45deg, ${isDark ? '#ffffff' : '#000000'}66, ${secondary}44)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    opacity: 0.12,
    textShadow: `2px 2px 8px ${primary}44`,
    userSelect: 'none' as const,
    pointerEvents: 'none' as const,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: '0.05em'
  };
}

/**
 * Enhanced image existence check with timeout
 */
export async function checkImageExists(url: string, timeout = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      cache: 'force-cache'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Main function to get team image with intelligent fallbacks
 */
export async function getTeamImageWithFallback(
  primaryImageUrl: string,
  config: ImageFallbackConfig,
  fallbackUrls: string[] = []
): Promise<TeamImageResult> {
  // First, try the primary image
  if (await checkImageExists(primaryImageUrl)) {
    return {
      src: primaryImageUrl,
      isGradient: false
    };
  }

  // Try fallback URLs in order
  for (const fallbackUrl of fallbackUrls) {
    if (await checkImageExists(fallbackUrl)) {
      return {
        src: fallbackUrl,
        isGradient: false
      };
    }
  }

  // Generate gradient fallback
  const gradientStyle = createTeamGradient(
    config.teamColors,
    config.preferredImageType || 'stadium'
  );
  
  const logoOverlay = createLogoOverlay(config.abbreviation, config.teamColors);

  return {
    src: '', // Empty src indicates to use gradient
    isGradient: true,
    gradientStyle,
    backgroundColor: normalizeColor(config.teamColors.primary),
    logoOverlay
  };
}

/**
 * Hook for managing team images with loading states and gradient fallbacks
 */
export function useTeamImageWithFallback(config: ImageFallbackConfig) {
  const [imageState, setImageState] = React.useState<{
    loading: boolean;
    result: TeamImageResult | null;
    error: boolean;
  }>({ loading: true, result: null, error: false });

  React.useEffect(() => {
    let isMounted = true;
    
    async function loadImage() {
      if (!isMounted) return;
      
      setImageState({ loading: true, result: null, error: false });
      
      try {
        const primaryUrl = `/images/stadiums/${config.abbreviation.toLowerCase()}-stadium.jpg`;
        const fallbackUrls = [
          `/images/banners/${config.abbreviation.toLowerCase()}-banner.jpg`,
          `/images/teams/${config.abbreviation.toLowerCase()}-team.jpg`,
          getStadiumImage(config.abbreviation),
          getBannerImage(config.abbreviation)
        ];
        
        const result = await getTeamImageWithFallback(primaryUrl, config, fallbackUrls);
        
        if (isMounted) {
          setImageState({ loading: false, result, error: false });
        }
      } catch (error) {
        console.warn('Team image loading failed:', error);
        
        if (isMounted) {
          // Fallback to gradient
          const gradientResult: TeamImageResult = {
            src: '',
            isGradient: true,
            gradientStyle: createTeamGradient(config.teamColors),
            backgroundColor: normalizeColor(config.teamColors.primary),
            logoOverlay: createLogoOverlay(config.abbreviation, config.teamColors)
          };
          
          setImageState({ loading: false, result: gradientResult, error: false });
        }
      }
    }

    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [config.abbreviation, config.teamColors.primary, config.teamColors.secondary]);

  return imageState;
}

/**
 * Creates placeholder images for different team image types
 */
export function generatePlaceholderImage(
  type: 'stadium' | 'banner' | 'action' | 'logo',
  config: ImageFallbackConfig
): TeamImageResult {
  const style = type === 'banner' ? 'banner' : type === 'stadium' ? 'stadium' : 'subtle';
  
  return {
    src: '',
    isGradient: true,
    gradientStyle: createTeamGradient(config.teamColors, style),
    backgroundColor: normalizeColor(config.teamColors.primary),
    logoOverlay: type !== 'logo' ? createLogoOverlay(config.abbreviation, config.teamColors) : undefined
  };
}

/**
 * Gets optimal text color for overlay on team colors
 */
export function getOptimalTextColor(backgroundColor: string): string {
  const isDark = isColorDark(backgroundColor);
  return isDark ? '#ffffff' : '#000000';
}

/**
 * Creates team-specific CSS custom properties for consistent theming
 */
export function createTeamCSSVars(teamColors: TeamColors, prefix = 'team'): React.CSSProperties {
  const primary = normalizeColor(teamColors.primary);
  const secondary = normalizeColor(teamColors.secondary);
  
  const primaryRgb = primary.slice(1).match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0';
  const secondaryRgb = secondary.slice(1).match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0';
  
  return {
    [`--${prefix}-primary`]: primary,
    [`--${prefix}-secondary`]: secondary,
    [`--${prefix}-primary-rgb`]: primaryRgb,
    [`--${prefix}-secondary-rgb`]: secondaryRgb,
    [`--${prefix}-text`]: getOptimalTextColor(primary),
    [`--${prefix}-text-secondary`]: getOptimalTextColor(secondary)
  } as React.CSSProperties;
}

/**
 * Enhanced preload function for team images with fallbacks
 */
export async function preloadTeamImagesWithFallbacks(
  teams: Array<{ abbreviation: string; primaryColor: string; secondaryColor: string }>
): Promise<void> {
  const imagePromises = teams.flatMap(team => {
    const urls = [
      `/images/stadiums/${team.abbreviation.toLowerCase()}-stadium.jpg`,
      `/images/banners/${team.abbreviation.toLowerCase()}-banner.jpg`,
      `/images/teams/${team.abbreviation.toLowerCase()}-team.jpg`,
      getStadiumImage(team.abbreviation),
      getBannerImage(team.abbreviation)
    ].filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicates
    
    return urls.map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error to not block other images
        img.src = url;
        
        // Set a timeout to prevent hanging
        setTimeout(resolve, 5000);
      });
    });
  });
  
  await Promise.allSettled(imagePromises);
}

export default {
  NFL_TEAM_IMAGES,
  getStadiumImage,
  getActionShots,
  getBannerImage,
  generateTeamImageGallery,
  enhanceTeamDataWithImages,
  validateImageUrl,
  preloadTeamImages,
  generateResponsiveImageSet,
  getOptimizedImageUrl,
  // New gradient fallback functions
  createTeamGradient,
  createLogoOverlay,
  checkImageExists,
  getTeamImageWithFallback,
  useTeamImageWithFallback,
  generatePlaceholderImage,
  getOptimalTextColor,
  createTeamCSSVars,
  preloadTeamImagesWithFallbacks
};