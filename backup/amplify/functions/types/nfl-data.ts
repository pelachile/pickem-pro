/**
 * NFL Data Types for Lambda Functions
 * 
 * This file contains TypeScript interfaces and types used across
 * all NFL-related Lambda functions for consistency and type safety.
 */

// ============================================================================
// Core NFL Data Types
// ============================================================================

export interface NFLTeam {
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
  conference: 'AFC' | 'NFC';
  division: 'East' | 'North' | 'South' | 'West';
  is_active: boolean;
  logo_url: string;
  venue?: {
    name: string;
    city: string;
    state: string;
    capacity: number;
    surface: 'Grass' | 'Artificial';
  };
  record?: {
    wins: number;
    losses: number;
    ties: number;
    win_percentage: number;
  };
}

export interface NFLGame {
  id: string;
  espn_id: string;
  week: number;
  season: number;
  season_type: 'preseason' | 'regular' | 'postseason';
  date: string;
  status: string;
  home_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    color: string;
    logo_url: string;
  };
  away_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    color: string;
    logo_url: string;
  };
  home_score: number | null;
  away_score: number | null;
  quarter: number | null;
  clock: string | null;
  broadcasts: string[];
  spread?: {
    home: number;
    away: number;
  } | null;
}

export interface NFLLiveScore {
  id: string;
  espn_id: string;
  status: {
    type: string;
    state: string;
    completed: boolean;
    detail: string;
    short_detail: string;
  };
  clock: {
    display_clock: string;
    period: number;
    time_remaining: number;
  };
  home_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    score: number;
    winner: boolean;
    line_scores: number[];
  };
  away_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    score: number;
    winner: boolean;
    line_scores: number[];
  };
  game_stats: {
    leaders: Array<{
      category: string;
      home_leader: {
        player_name: string;
        value: string;
        position: string;
      } | null;
      away_leader: {
        player_name: string;
        value: string;
        position: string;
      } | null;
    }>;
  };
  last_updated: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface TeamsResponse {
  success: boolean;
  data?: {
    meta: {
      total_teams: number;
      last_updated: string;
      by_conference: {
        AFC: number;
        NFC: number;
      };
    };
    teams: {
      all: NFLTeam[];
      by_conference: {
        AFC: NFLTeam[];
        NFC: NFLTeam[];
      };
    };
  };
  error?: string;
  requestId?: string;
}

export interface ScheduleResponse {
  success: boolean;
  data?: {
    meta: {
      week: number;
      season_type: string;
      year: number;
      total_games: number;
      last_updated: string;
      current_week_info: {
        week: number;
        seasonType: string;
        year: number;
      };
    };
    games: NFLGame[];
  };
  error?: string;
  requestId?: string;
}

export interface LiveScoresResponse {
  success: boolean;
  data?: {
    meta: {
      week: number;
      season_type: string;
      year: number;
      total_games: number;
      active_games: number;
      completed_games: number;
      last_updated: string;
      current_week_info: {
        week: number;
        seasonType: string;
        year: number;
      };
      active_only: boolean;
    };
    scores: NFLLiveScore[];
  };
  error?: string;
  requestId?: string;
}

// ============================================================================
// Request Types
// ============================================================================

export interface ScheduleRequest {
  week?: number;
  seasonType?: 'preseason' | 'regular' | 'postseason';
  year?: number;
  forceRefresh?: boolean;
}

export interface TeamInfoRequest {
  teamId?: string;
  forceRefresh?: boolean;
}

export interface LiveScoresRequest {
  gameIds?: string[];
  week?: number;
  seasonType?: 'preseason' | 'regular' | 'postseason';
  year?: number;
  activeOnly?: boolean;
}

// ============================================================================
// ESPN API Types (for internal use)
// ============================================================================

export interface ESPNTeam {
  id: string;
  uid: string;
  slug: string;
  location: string;
  name: string;
  nickname: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  isActive: boolean;
  isAllStar: boolean;
  logos: Array<{
    href: string;
    alt: string;
    rel: string[];
    width: number;
    height: number;
  }>;
  record?: {
    items: Array<{
      description: string;
      type: string;
      summary: string;
    }>;
  };
  groups?: {
    id: string;
    parent: {
      id: string;
    };
    isConference: boolean;
  };
  venue?: {
    id: string;
    fullName: string;
    address: {
      city: string;
      state: string;
    };
    capacity: number;
    grass: boolean;
  };
}

export interface ESPNGame {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  season: {
    year: number;
    type: number;
  };
  week: {
    number: number;
  };
  competitions: Array<{
    id: string;
    uid: string;
    date: string;
    attendance: number;
    type: {
      id: string;
      abbreviation: string;
    };
    timeValid: boolean;
    neutralSite: boolean;
    competitors: Array<{
      id: string;
      uid: string;
      type: string;
      order: number;
      homeAway: string;
      winner: boolean;
      team: ESPNTeam;
      score: string;
      linescores: Array<{
        value: number;
      }>;
      statistics: any[];
      records: Array<{
        name: string;
        abbreviation: string;
        type: string;
        summary: string;
      }>;
    }>;
    notes: any[];
    status: {
      clock: number;
      displayClock: string;
      period: number;
      type: {
        id: string;
        name: string;
        state: string;
        completed: boolean;
        description: string;
        detail: string;
        shortDetail: string;
      };
    };
    broadcasts: Array<{
      market: string;
      names: string[];
    }>;
    leaders?: Array<{
      name: string;
      displayName: string;
      shortDisplayName: string;
      abbreviation: string;
      leaders: Array<{
        displayValue: string;
        value: number;
        athlete: {
          id: string;
          fullName: string;
          displayName: string;
          shortName: string;
          links: Array<{
            rel: string[];
            href: string;
            text: string;
          }>;
          headshot: string;
          jersey: string;
          position: {
            abbreviation: string;
          };
          team: {
            id: string;
          };
        };
        team: {
          id: string;
        };
      }>;
    }>;
    headlines: Array<{
      description: string;
      type: string;
      shortLinkText: string;
    }>;
  }>;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface NFLWeekInfo {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  year: number;
}

export interface UpdateResult {
  function_name: string;
  success: boolean;
  duration_ms: number;
  error?: string;
  data_summary?: {
    teams_updated?: boolean;
    games_updated?: number;
    scores_updated?: number;
  };
}

// ============================================================================
// Constants
// ============================================================================

export const NFL_SEASON_TYPES = {
  PRESEASON: 1,
  REGULAR: 2,
  POSTSEASON: 3,
} as const;

export const NFL_DIVISIONS = {
  AFC: {
    EAST: ['BUF', 'MIA', 'NE', 'NYJ'],
    NORTH: ['BAL', 'CIN', 'CLE', 'PIT'],
    SOUTH: ['HOU', 'IND', 'JAX', 'TEN'],
    WEST: ['DEN', 'KC', 'LV', 'LAC'],
  },
  NFC: {
    EAST: ['DAL', 'NYG', 'PHI', 'WSH'],
    NORTH: ['CHI', 'DET', 'GB', 'MIN'],
    SOUTH: ['ATL', 'CAR', 'NO', 'TB'],
    WEST: ['ARI', 'LAR', 'SF', 'SEA'],
  },
} as const;

export const GAME_STATUS_TYPES = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  HALFTIME: 'halftime',
  FINAL: 'final',
  CANCELLED: 'cancelled',
  POSTPONED: 'postponed',
} as const;