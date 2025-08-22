import React from 'react';

interface AnimatedContentProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slideUp' | 'slideRight' | 'slideLeft' | 'scale';
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
        return 'animate-fade-in-up';
      case 'slideRight':
        return 'animate-slide-in-right';
      case 'slideLeft':
        return 'animate-slide-in-left';
      case 'scale':
        return 'animate-scale-in';
      case 'fade':
      default:
        return 'animate-fade-in';
    }
  };

  const getDelayClass = () => {
    if (delay === 75) return 'animate-delay-75';
    if (delay === 150) return 'animate-delay-150';
    if (delay === 225) return 'animate-delay-225';
    if (delay === 300) return 'animate-delay-300';
    return '';
  };

  return (
    <div className={`${getAnimationClass()} ${getDelayClass()} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedContent;