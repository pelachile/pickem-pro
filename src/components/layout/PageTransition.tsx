import React, { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    // Only transition if the content actually changed
    if (displayedChildren !== children) {
      setIsTransitioning(true);
      
      // Quick fade transition
      const timer = setTimeout(() => {
        setDisplayedChildren(children);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [children, displayedChildren]);

  return (
    <div 
      className={`
        ${className}
        transition-opacity duration-150 ease-out
        ${isTransitioning ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {displayedChildren}
    </div>
  );
};

export default PageTransition;