import React from 'react';

interface AnimatedContentProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slideUp' | 'none';
  delay?: number;
  className?: string;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  animation = 'fade',
  delay = 0,
  className = '',
}) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'slideUp':
        return 'animate-fade-in-subtle';
      case 'fade':
        return 'animate-fade-in-quick';
      case 'none':
      default:
        return '';
    }
  };

  const getDelayClass = () => {
    if (delay === 75) return 'animate-delay-75';
    if (delay === 150) return 'animate-delay-150';
    return '';
  };

  return (
    <div className={`${getAnimationClass()} ${getDelayClass()} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedContent;