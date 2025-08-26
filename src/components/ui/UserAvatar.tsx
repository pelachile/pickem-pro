import React from 'react';
import { cn, getAvatarColorClass, avatarSizes } from '../utils';
import type { UserAvatarProps } from '../types';

/**
 * Simple icon component for avatars
 * Handles both emoji icons and named icons
 */
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  // Check if it's already an emoji (unicode character)
  const isEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(name);
  
  if (isEmoji) {
    return (
      <span className={cn('flex items-center justify-center', className)}>
        {name}
      </span>
    );
  }
  
  // Fallback to iconMap for named icons
  const iconMap: Record<string, string> = {
    users: '👥',
    user: '👤',
    star: '⭐',
    heart: '❤️',
    home: '🏠',
    settings: '⚙️',
    // Add more icons as needed
  };
  
  return (
    <span className={cn('flex items-center justify-center', className)}>
      {iconMap[name] || '👤'}
    </span>
  );
};

/**
 * UserAvatar Component
 * 
 * Displays a user avatar with customizable icon and color.
 * Converted from Laravel Blade user-avatar component.
 * 
 * @example
 * <UserAvatar user={{ name: "John", avatar_icon: "users", avatar_color: "lime" }} />
 * <UserAvatar user={{ avatar_icon: "star", avatar_color: "sunset-orange" }} size="lg" />
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  className,
  ...props
}) => {
  const icon = user.avatar_icon ?? 'users';
  const color = user.avatar_color ?? 'lime';
  
  const bgClass = getAvatarColorClass(color);
  const sizeConfig = avatarSizes[size] || avatarSizes.md;
  
  return (
    <div 
      className={cn(
        sizeConfig.container,
        bgClass,
        'text-white rounded-lg flex items-center justify-center backdrop-blur-sm shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-sunrise-400 focus:ring-offset-2',
        className
      )}
      role="img"
      aria-label={user.name ? `${user.name}'s avatar` : 'User avatar'}
      title={user.name || 'User avatar'}
      {...props}
    >
      <Icon name={icon} className={cn(sizeConfig.icon, 'select-none')} aria-hidden="true" />
    </div>
  );
};

export default UserAvatar;