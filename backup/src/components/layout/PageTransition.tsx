import React, { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    // Reset visibility when route changes
    if (location.pathname !== currentPath) {
      setIsVisible(false);
      setCurrentPath(location.pathname);
      
      // Trigger entrance animation after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Initial load
      setIsVisible(true);
    }
  }, [location.pathname, currentPath]);

  // Determine animation class based on route
  const getAnimationClass = () => {
    const path = location.pathname;
    
    if (path === '/login' || path === '/register') {
      return 'auth-content';
    } else if (path === '/dashboard') {
      return 'dashboard-content';
    } else {
      return 'page-content';
    }
  };

  return (
    <div 
      className={`
        ${className}
        ${isVisible ? getAnimationClass() : 'opacity-0'}
        transition-opacity duration-200 ease-out
      `}
    >
      {children}
    </div>
  );
};

export default PageTransition;