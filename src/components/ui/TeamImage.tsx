/**
 * Enhanced TeamImage component with gradient fallbacks
 * Provides beautiful team-colored gradients when images aren't available
 */

import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { 
  useTeamImageWithFallback, 
  createTeamGradient, 
  createLogoOverlay,
  type TeamColors,
  type ImageFallbackConfig,
  type TeamImageResult
} from '../../utils/teamImageUtils';

export interface TeamImageProps {
  src?: string;
  alt: string;
  teamColors: TeamColors;
  teamName: string;
  abbreviation: string;
  className?: string;
  imageType?: 'stadium' | 'banner' | 'action';
  showLogoOverlay?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackUrls?: string[];
  enableGradientFallback?: boolean;
  children?: React.ReactNode; // For overlay content
}

export interface TeamImageState {
  loaded: boolean;
  error: boolean;
  usingFallback: boolean;
}

/**
 * Enhanced TeamImage component with intelligent fallback system
 */
export const TeamImage: React.FC<TeamImageProps> = ({
  src,
  alt,
  teamColors,
  teamName,
  abbreviation,
  className = '',
  imageType = 'stadium',
  showLogoOverlay = true,
  priority = false,
  onLoad,
  onError,
  fallbackUrls = [],
  enableGradientFallback = true,
  children
}) => {
  const [imageState, setImageState] = useState<TeamImageState>({
    loaded: false,
    error: false,
    usingFallback: false
  });
  const [currentSrc, setCurrentSrc] = useState(src || '');
  const [fallbackIndex, setFallbackIndex] = useState(-1);
  const [useGradient, setUseGradient] = useState(false);
  
  // Use our enhanced fallback hook for comprehensive image handling
  const config: ImageFallbackConfig = {
    teamColors,
    teamName,
    abbreviation,
    preferredImageType: imageType
  };
  
  const { loading: fallbackLoading, result: fallbackResult, error: fallbackError } = 
    useTeamImageWithFallback(config);
  
  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setFallbackIndex(-1);
      setUseGradient(false);
      setImageState({ loaded: false, error: false, usingFallback: false });
    } else if (fallbackResult && !fallbackLoading) {
      if (fallbackResult.isGradient) {
        setUseGradient(true);
        setImageState({ loaded: true, error: false, usingFallback: true });
      } else {
        setCurrentSrc(fallbackResult.src);
        setUseGradient(false);
      }
    }
  }, [src, fallbackResult, fallbackLoading]);

  const handleLoad = () => {
    setImageState(prev => ({ ...prev, loaded: true, error: false }));
    onLoad?.();
  };

  const handleError = () => {
    // Try next fallback URL
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < fallbackUrls.length) {
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbackUrls[nextIndex]);
      return;
    }
    
    // If all fallbacks failed and gradient fallback is enabled
    if (enableGradientFallback) {
      setUseGradient(true);
      setImageState({ loaded: true, error: false, usingFallback: true });
    } else {
      setImageState(prev => ({ ...prev, error: true, loaded: false }));
    }
    
    onError?.();
  };

  // Generate gradient styles
  const gradientStyle = useGradient || (fallbackResult?.isGradient) ? 
    (fallbackResult?.gradientStyle || createTeamGradient(teamColors, imageType)) : {};
  
  const logoOverlay = (useGradient || fallbackResult?.isGradient) && showLogoOverlay ? 
    (fallbackResult?.logoOverlay || createLogoOverlay(abbreviation, teamColors)) : {};

  // Loading state
  if ((fallbackLoading && !src) || (!imageState.loaded && !useGradient && !imageState.error)) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 ${className}`}>
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-white/40 mx-auto animate-spin" />
          <span className="text-xs text-white/30">Loading image...</span>
        </div>
      </div>
    );
  }

  // Error state (only if gradient fallback is disabled)
  if (imageState.error && !enableGradientFallback) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 ${className}`}>
        <div className="text-center space-y-2">
          <ImageIcon className="h-8 w-8 text-white/40 mx-auto" />
          <span className="text-xs text-white/30">Image unavailable</span>
        </div>
      </div>
    );
  }

  // Gradient fallback mode
  if (useGradient || fallbackResult?.isGradient) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{
          ...gradientStyle,
          minHeight: '200px' // Ensure minimum height for gradients
        }}
        role="img"
        aria-label={alt}
      >
        {/* Team abbreviation overlay */}
        {showLogoOverlay && (
          <div style={logoOverlay}>
            {abbreviation}
          </div>
        )}
        
        {/* Subtle pattern overlay for texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          }}
        />
        
        {/* Content overlay */}
        {children && (
          <div className="absolute inset-0 flex items-end">
            {children}
          </div>
        )}
      </div>
    );
  }

  // Regular image mode
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {!imageState.loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 z-10">
          <div className="text-center space-y-3">
            <Loader2 className="h-6 w-6 text-white/40 mx-auto animate-spin" />
            <span className="text-xs text-white/30">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-700 ${
          imageState.loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
      
      {/* Content overlay */}
      {children && imageState.loaded && (
        <div className="absolute inset-0 flex items-end">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Optimized TeamImage for hero sections with enhanced gradients
 */
export const TeamHeroImage: React.FC<Omit<TeamImageProps, 'imageType'>> = (props) => {
  return (
    <TeamImage
      {...props}
      imageType="stadium"
      priority={true}
      showLogoOverlay={true}
      className={`h-64 lg:h-80 ${props.className || ''}`}
    />
  );
};

/**
 * Compact TeamImage for cards and thumbnails
 */
export const TeamThumbnail: React.FC<Omit<TeamImageProps, 'imageType'>> = (props) => {
  return (
    <TeamImage
      {...props}
      imageType="banner"
      showLogoOverlay={false}
      className={`h-24 ${props.className || ''}`}
    />
  );
};

/**
 * TeamImage with built-in loading and error states
 */
export const SmartTeamImage: React.FC<TeamImageProps & {
  fallbackComponent?: React.ReactNode;
}> = ({ fallbackComponent, ...props }) => {
  return (
    <div className="relative">
      <TeamImage {...props} />
      
      {/* Custom fallback component can be rendered here if needed */}
      {fallbackComponent && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallbackComponent}
        </div>
      )}
    </div>
  );
};

export default TeamImage;
