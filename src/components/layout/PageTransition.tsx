import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Simplified PageTransition - just provides smooth content rendering
// without complex state management that can cause flicker
const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        ${className}
        animate-fade-in-quick
      `}
    >
      {children}
    </div>
  );
};

export default PageTransition;