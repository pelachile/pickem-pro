import type { ReactNode } from 'react';

// Re-export InputProps from Input component
export type { InputProps } from './components/Input';

// Base types
export type Status = 
  | 'live' 
  | 'active' 
  | 'online' 
  | 'scheduled' 
  | 'pending' 
  | 'upcoming' 
  | 'final' 
  | 'completed' 
  | 'finished' 
  | 'red_zone' 
  | 'urgent' 
  | 'critical' 
  | 'inactive' 
  | 'offline' 
  | 'default';

export type BadgeVariant = 
  | 'sunset-orange' 
  | 'sky-blue' 
  | 'midnight-navy' 
  | 'sunrise-gold' 
  | 'ocean-blue';

export type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type BadgeSize = 'sm' | 'default' | 'lg';

export type AvatarColor = 
  | 'lime' 
  | 'light-orange' 
  | 'dark-orange' 
  | 'fire-red' 
  | 'slate' 
  | 'blue' 
  | 'purple' 
  | 'green'
  | 'midnight-navy' 
  | 'ocean-blue' 
  | 'sky-blue' 
  | 'sunset-orange' 
  | 'sunrise-gold';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';

export type IndicatorType = 'pulse' | 'double-pulse';

// Component prop interfaces
export interface StatusBadgeProps {
  status?: Status;
  variant?: BadgeVariant;
  animate?: boolean;
  showIndicator?: boolean;
  indicatorType?: IndicatorType;
  size?: BadgeSize;
  text?: string;
  className?: string;
  children?: ReactNode;
}

export interface UserAvatarProps {
  user: {
    name?: string;
    avatar_icon?: string;
    avatar_color?: AvatarColor;
  };
  size?: Size;
  className?: string;
}

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  padding?: Size;
}

// Game-related types for GameCard (simplified)
export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  logo?: string;
  logo_url?: string;
  color?: string;
  alternate_color?: string;
  wins?: number;
  losses?: number;
  record?: string;
  // Additional fields from data file
  espn_id?: string;
  location?: string;
  nickname?: string;
  display_name?: string;
  short_display_name?: string;
  slug?: string;
  conference?: string;
  division?: string;
  is_active?: boolean;
}

export interface Game {
  id: number;
  status: Status;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  gameTime: string;
  venue?: string;
  isRedZone?: boolean;
  possession?: 'home' | 'away' | null;
  // Additional fields from data file
  espn_id?: string;
  name?: string;
  short_name?: string;
  game_date?: string;
  season?: number;
  season_type?: number;
  season_type_label?: string;
  week?: number;
  venue_name?: string;
  is_scheduled?: boolean;
  is_in_progress?: boolean;
  is_completed?: boolean;
  has_started?: boolean;
}

export interface GameCardProps {
  game: Game;
  userPickTeamId?: number | null;
  compact?: boolean;
  layout?: 'default' | 'wide' | 'full'; // Layout variant for different display contexts
  showPicks?: boolean;
  showStats?: boolean;
  enableRefresh?: boolean;
  className?: string;
  onPickTeam?: (teamId: number) => void;
  onRefresh?: () => void;
}

// Schedule-related types
export interface NFLTeamData {
  id: number;
  espn_id: string;
  name: string;
  location: string;
  nickname: string;
  abbreviation: string;
  display_name: string;
  short_display_name: string;
  color: string;
  alternate_color: string;
  slug: string;
  conference: string;
  division: string;
  is_active: boolean;
  logo_url: string;
}

export interface NFLGameData {
  id: number;
  espn_id: string;
  name: string;
  short_name: string;
  game_date: string;
  season: number;
  season_type: number;
  season_type_label: string;
  week: number;
  status: string;
  venue_name: string;
  home_team: NFLTeamData;
  away_team: NFLTeamData;
  is_scheduled: boolean;
  is_in_progress: boolean;
  is_completed: boolean;
  has_started: boolean;
}

export interface ScheduleData {
  meta: {
    export_date: string;
    total_teams: number;
    total_games: number;
    current_season: number;
    weeks_available: number[];
  };
  teams: {
    all: NFLTeamData[];
  };
  schedule: {
    all_games: NFLGameData[];
    by_week: Record<string, NFLGameData[]>;
  };
}

export interface GameScheduleProps {
  week?: number;
  showPicks?: boolean;
  compact?: boolean;
  maxGames?: number;
  className?: string;
  onPickTeam?: (gameId: number, teamId: number) => void;
}

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onTeamSelect?: (team: NFLTeamData) => void;
  variant?: 'default' | 'prominent';
}