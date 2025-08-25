import React from 'react';
import { cn, getAvatarColorClass, avatarSizes } from '../utils';
import type { UserAvatarProps, Size } from '../types';

/**
 * UserAvatar Component
 * 
 * A flexible user avatar component with fallback to initials,
 * multiple sizes, and ocean-to-sunset color variants.
 * Designed for accessibility and consistent visual hierarchy.
 * 
 * @example
 * <UserAvatar 
 *   user={{ name: 'John Doe', avatar_color: 'sky-blue' }} 
 *   size="lg"
 * />
 * 
 * <UserAvatar 
 *   user={{ name: 'Jane Smith', avatar_icon: '👤' }}
 *   size="xl"
 *   className="border-2 border-white/20"
 * />
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  className,
  ...props
}) => {
  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display name and initials
  const displayName = user.name || 'User';
  const initials = getInitials(displayName);
  const colorClass = getAvatarColorClass(user.avatar_color || 'ocean-blue');
  
  // Size configurations
  const sizeConfig = avatarSizes[size];
  
  // Enhanced avatar classes with glass morphism
  const avatarClasses = cn(
    // Base styles with glass effect
    'relative inline-flex items-center justify-center rounded-full',
    'bg-gradient-to-br from-white/10 to-white/5',
    'border-2 border-white/20 shadow-lg backdrop-blur-sm',
    'text-white font-bold select-none',
    'transition-all duration-200 ease-out',
    
    // Size-specific classes
    sizeConfig.container,
    
    // Text sizing based on avatar size
    size === 'sm' ? 'text-xs' :
    size === 'md' ? 'text-sm' :
    size === 'lg' ? 'text-base' :
    size === 'xl' ? 'text-lg' :
    size === '2xl' ? 'text-xl' : 'text-sm',
    
    // Color background with glass effect overlay
    colorClass,
    
    // Hover effects for interactive avatars
    'hover:border-white/30 hover:shadow-xl',
    
    className
  );

  // Status indicator for active users
  const StatusIndicator = () => (
    <div 
      className={cn(
        'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-navy-900',
        'bg-green-400 shadow-sm',
        size === 'sm' ? 'w-3 h-3' :
        size === 'md' ? 'w-3 h-3' :
        size === 'lg' ? 'w-4 h-4' :
        size === 'xl' ? 'w-5 h-5' :
        size === '2xl' ? 'w-6 h-6' : 'w-3 h-3'
      )}
      aria-hidden="true"
    />
  );

  return (
    <div
      className={avatarClasses}
      role="img"
      aria-label={`${displayName} avatar`}
      title={displayName}
      {...props}
    >
      {/* Avatar icon or initials */}
      {user.avatar_icon ? (
        <span 
          className={cn('flex items-center justify-center', sizeConfig.icon)}
          aria-hidden="true"
        >
          {user.avatar_icon}
        </span>
      ) : (
        <span aria-hidden="true">
          {initials}
        </span>
      )}
      
      {/* Status indicator - could be made conditional based on user status */}
      <StatusIndicator />
      
      {/* Screen reader text */}
      <span className="sr-only">{displayName}</span>
    </div>
  );
};

/**
 * AvatarGroup Component
 * 
 * Displays multiple user avatars in an overlapping group layout.
 * Useful for showing team members, participants, etc.
 */
export interface AvatarGroupProps {
  users: Array<{
    name?: string;
    avatar_icon?: string;
    avatar_color?: string;
  }>;
  size?: Size;
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  size = 'md',
  max = 5,
  className,
}) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = Math.max(0, users.length - max);
  
  return (
    <div 
      className={cn('flex -space-x-2', className)}
      role="group"
      aria-label={`${users.length} user avatars`}
    >
      {displayUsers.map((user, index) => (
        <UserAvatar
          key={index}
          user={user}
          size={size}
          className="ring-2 ring-navy-900 hover:z-10 relative"
        />
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-full',
            'bg-navy-800/90 border-2 border-navy-600 text-white text-xs font-bold',
            'ring-2 ring-navy-900 backdrop-blur-sm',
            avatarSizes[size].container
          )}
          aria-label={`${remainingCount} more users`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;