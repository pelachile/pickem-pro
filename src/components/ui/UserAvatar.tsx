import React from 'react';
import { cn, getAvatarColorClass, avatarSizes } from '../utils';
import type { UserAvatarProps } from '../types';

/**
 * Simple icon component for avatars
 * In a real project, you'd replace this with your icon library (e.g., Heroicons, Lucide, etc.)
 */
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  // This is a placeholder - replace with your actual icon implementation
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
        'text-white rounded-lg flex items-center justify-center',
        className
      )}
      title={user.name || 'User avatar'}
      {...props}
    >
      <Icon name={icon} className={sizeConfig.icon} />
    </div>
  );
};

export default UserAvatar;