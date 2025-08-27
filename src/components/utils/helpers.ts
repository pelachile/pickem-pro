/**
 * Helper functions converted from Laravel PHP helpers
 * For use in React components
 */

// Status mapping for badges and indicators
export const statusVariantMap = {
  live: 'sunset-orange',
  active: 'sunset-orange',
  online: 'sunset-orange',
  scheduled: 'sky-blue',
  pending: 'sky-blue',
  upcoming: 'sky-blue',
  final: 'midnight-navy',
  completed: 'midnight-navy',
  finished: 'midnight-navy',
  red_zone: 'sunrise-gold',
  urgent: 'sunrise-gold',
  critical: 'sunrise-gold',
  inactive: 'ocean-blue',
  offline: 'ocean-blue',
  default: 'ocean-blue',
} as const;

// Status text mapping
export const statusTextMap = {
  live: 'Live',
  scheduled: 'Scheduled',
  final: 'Final',
  red_zone: 'Red Zone',
  active: 'Active',
  inactive: 'Inactive',
  online: 'Online',
  offline: 'Offline',
  pending: 'Pending',
  upcoming: 'Upcoming',
  completed: 'Completed',
  finished: 'Finished',
  urgent: 'Urgent',
  critical: 'Critical',
  // Handle internal status codes - security fix to avoid exposing internals
  'STATUS_FINAL': 'Final',
  'STATUS_LIVE': 'Live',
  'STATUS_SCHEDULED': 'Scheduled',
  'STATUS_POSTPONED': 'Postponed',
  'STATUS_CANCELLED': 'Cancelled',
  'STATUS_SUSPENDED': 'Suspended',
} as const;

// Avatar color mapping
export const avatarColorMap = {
  lime: 'bg-lime-400',
  'light-orange': 'bg-orange-400',
  'dark-orange': 'bg-orange-600',
  'fire-red': 'bg-red-500',
  slate: 'bg-slate-600',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  'midnight-navy': 'bg-navy-900',
  'ocean-blue': 'bg-ocean-600',
  'sky-blue': 'bg-sky-300',
  'sunset-orange': 'bg-sunset-500',
  'sunrise-gold': 'bg-sunrise-400',
} as const;

// Size mappings for components
export const avatarSizes = {
  sm: { container: 'w-6 h-6', icon: 'h-3 w-3' },
  md: { container: 'w-8 h-8', icon: 'h-4 w-4' },
  lg: { container: 'w-10 h-10', icon: 'h-5 w-5' },
  xl: { container: 'w-12 h-12', icon: 'h-6 w-6' },
  '2xl': { container: 'w-16 h-16', icon: 'h-8 w-8' },
} as const;

export const badgeSizes = {
  sm: 'badge-sm',
  default: '',
  lg: 'badge-lg',
} as const;

// Animation mappings
export const getStatusAnimation = (status: string, animate: boolean = false) => {
  if (!animate) return 'hover:scale-105 transition-transform duration-200';
  
  switch (status) {
    case 'live':
    case 'active':
    case 'online':
      return 'animate-pulse-slow';
    case 'red_zone':
    case 'urgent':
    case 'critical':
      return 'animate-pulse-fast';
    default:
      return 'hover:scale-105 transition-transform duration-200';
  }
};

// Status helpers
export const shouldShowIndicator = (status: string): boolean => {
  return ['live', 'active', 'online', 'red_zone', 'urgent', 'critical'].includes(status);
};

export const getStatusVariant = (status: string): string => {
  return statusVariantMap[status as keyof typeof statusVariantMap] || statusVariantMap.default;
};

export const getStatusText = (status: string, customText?: string): string => {
  // Security: Always use custom text if provided
  if (customText) return customText;
  
  // Security: Use explicit mapping to avoid exposing internal codes
  const mappedText = statusTextMap[status as keyof typeof statusTextMap];
  if (mappedText) return mappedText;
  
  // Security: For unmapped statuses, provide generic text instead of raw status
  if (status.startsWith('STATUS_')) {
    return 'Unknown'; // Don't expose internal status format
  }
  
  // For user-friendly statuses, capitalize normally
  return capitalize(status);
};

export const getAvatarColorClass = (color: string): string => {
  return avatarColorMap[color as keyof typeof avatarColorMap] || avatarColorMap['ocean-blue'];
};

// Utility functions
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatGameTime = (gameTime: string | Date): string => {
  const date = new Date(gameTime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatGameDate = (gameDate: string | Date): string => {
  const date = new Date(gameDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};