import React, { useEffect, useState } from 'react';

// Utility for WebP support detection
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webp = new Image();
    webp.onload = () => resolve(true);
    webp.onerror = () => resolve(false);
    webp.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
};

// Utility for responsive image selection
const getOptimizedImagePath = (baseName: string, isMobile: boolean, supportsWebP: boolean): string => {
  const suffix = isMobile ? '-mobile' : '-optimized';
  const extension = supportsWebP ? '.webp' : '.jpg';
  return `/images/${baseName}${suffix}${extension}`;
};

interface NFLHeroBackgroundProps {
  children: React.ReactNode;
}

export function NFLHeroBackground({ children }: NFLHeroBackgroundProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);

  // Check WebP support and preload appropriate images
  useEffect(() => {
    let mounted = true;
    
    const loadImage = async () => {
      try {
        // Check WebP support
        const webpSupported = await checkWebPSupport();
        if (!mounted) return;
        
        setSupportsWebP(webpSupported);
        
        // Preload the appropriate hero image for better performance
        const img = new Image();
        img.onload = () => {
          if (mounted) setImageLoaded(true);
        };
        
        // Use optimized images based on screen size and WebP support
        const isMobile = window.innerWidth < 768;
        img.src = getOptimizedImagePath('hero-background', isMobile, webpSupported);
        
      } catch (error) {
        console.warn('Image loading optimization failed, using fallback:', error);
        if (mounted) {
          setSupportsWebP(false);
          setImageLoaded(true);
        }
      }
    };
    
    loadImage();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Dynamic background image selection using our utility
  const getBackgroundImage = () => {
    const isMobile = window.innerWidth < 768;
    return `url(${getOptimizedImagePath('hero-background', isMobile, supportsWebP)})`;
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Hero background image - friends celebrating, perfect social vibe */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: getBackgroundImage(),
          // Enhanced fallback gradient matching ocean theme
          backgroundColor: '#062440',
          // Optimized positioning to showcase the celebration
          backgroundPosition: 'center 35%',
        }}
      />
      
      {/* Loading state with ocean-themed gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-navy-900 via-ocean-600 to-navy-800 transition-opacity duration-500 ${
          imageLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />
      
      {/* Primary overlay: Ocean-to-sunset themed gradient for brand consistency */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/40 via-ocean-600/30 to-sky-400/25" />
      
      {/* Secondary gradient: Enhanced depth with celebration warmth */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
      
      {/* Celebration enhancement: Warm overlay to amplify the social energy */}
      <div className="absolute inset-0 bg-gradient-to-r from-sunset-500/15 via-sunrise-500/20 to-sunset-500/15" />
      
      {/* Stadium lights effect: Mimics the celebratory atmosphere */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sunrise-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sunset-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      
      {/* Text readability overlay: Minimal for readability while preserving theme colors */}
      <div className="absolute inset-0 bg-black/15" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}