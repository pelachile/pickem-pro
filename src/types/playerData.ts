// Player Data Types for AWS AI Integration
// Generated for Phase 1: Data Foundation & Architecture

// NFL Teams Data - Complete 32 team structure
export const NFL_TEAMS = {
  AFC: {
    North: ['BAL', 'CIN', 'CLE', 'PIT'],
    South: ['HOU', 'IND', 'JAX', 'TEN'],
    East: ['BUF', 'MIA', 'NE', 'NYJ'],
    West: ['DEN', 'KC', 'LV', 'LAC']
  },
  NFC: {
    North: ['CHI', 'DET', 'GB', 'MIN'],
    South: ['ATL', 'CAR', 'NO', 'TB'],
    East: ['DAL', 'NYG', 'PHI', 'WAS'],
    West: ['ARI', 'LAR', 'SF', 'SEA']
  }
} as const;

export type NFLTeamAbbreviation = 
  | 'BAL' | 'CIN' | 'CLE' | 'PIT' // AFC North
  | 'HOU' | 'IND' | 'JAX' | 'TEN' // AFC South  
  | 'BUF' | 'MIA' | 'NE' | 'NYJ'  // AFC East
  | 'DEN' | 'KC' | 'LV' | 'LAC'   // AFC West
  | 'CHI' | 'DET' | 'GB' | 'MIN'  // NFC North
  | 'ATL' | 'CAR' | 'NO' | 'TB'   // NFC South
  | 'DAL' | 'NYG' | 'PHI' | 'WAS' // NFC East  
  | 'ARI' | 'LAR' | 'SF' | 'SEA'; // NFC West

export interface PlayerAnalysis {
  id: string;
  name: string;
  team: NFLTeamAbbreviation;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'DEF' | 'K';
  tier: 'Elite' | 'High-Upside' | 'Volatile' | 'Sleeper' | 'Bust-Risk';
  
  // Core Metrics
  projections: {
    top5Likelihood: number; // Percentage (0-100)
    fantasyPoints: number;
    weeklyFloor: number;
    weeklyCeiling: number;
  };
  
  // 2024 Performance Data
  stats2024: {
    gamesPlayed: number;
    injuryHistory: string[];
    fantasyRank: number;
    positionStats: any; // Position-specific stats as JSON
  };
  
  // Analysis Content
  analysis: {
    summary: string; // 2-3 sentence overview
    strengths: string[];
    concerns: string[];
    keyFactors: string[]; // Schedule, coaching changes, etc.
    upside: string;
    floor: string;
  };
  
  // AI Enhancement Fields
  aiGenerated?: {
    lastUpdated: string; // ISO timestamp
    newsAnalysis?: string;
    injuryUpdate?: string;
    trendingFactors?: string[];
    sentimentScore?: number; // -1 to 1
  };
}

// Position-specific stat interfaces
export interface QuarterbackStats {
  gamesPlayed: number;
  injuryHistory: string[];
  fantasyRank: number;
  passingYards: number;
  passingTouchdowns: number;
  interceptions: number;
  rushingYards: number;
  rushingTouchdowns: number;
  completionPercentage: number;
}

export interface RunningBackStats {
  gamesPlayed: number;
  injuryHistory: string[];
  fantasyRank: number;
  rushingYards: number;
  rushingTouchdowns: number;
  carries: number;
  receivingYards: number;
  receivingTouchdowns: number;
  receptions: number;
  targets: number;
}

export interface WideReceiverStats {
  gamesPlayed: number;
  injuryHistory: string[];
  fantasyRank: number;
  receivingYards: number;
  receivingTouchdowns: number;
  receptions: number;
  targets: number;
  targetShare: number;
  redZoneTargets: number;
  aiYards: number; // Air yards
}

export interface TightEndStats {
  gamesPlayed: number;
  injuryHistory: string[];
  fantasyRank: number;
  receivingYards: number;
  receivingTouchdowns: number;
  receptions: number;
  targets: number;
  blockingGrade?: number; // Optional PFF-style grade
}

export interface DefenseStats {
  gamesPlayed: number;
  injuryHistory: string[];
  fantasyRank: number;
  fantasyPointsAllowed: number;
  sacks: number;
  interceptions: number;
  forcedFumbles: number;
  touchdowns: number;
  safeties: number;
}

// NFL Team interface for team pages
export interface NFLTeamData {
  id: string;
  name: string;
  abbreviation: NFLTeamAbbreviation;
  city: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  
  // Team Analysis (AI-Enhanced)
  analysis?: {
    seasonOutlook: string;
    strengths: string[];
    weaknesses: string[];
    keyInjuries: string[];
    coachingChanges: string[];
    offensiveScheme: string;
    defensiveScheme: string;
  };
  
  // AI-Generated Content
  aiContent?: {
    lastUpdated: string;
    weeklyHighlights: string[];
    injuryReport: string;
    fantasyRelevantNews: string[];
    gamePreview?: string;
    sentimentAnalysis?: {
      score: number; // -1 to 1
      factors: string[];
    };
  };
}

// Position Group Collections
export interface PositionGroup {
  position: 'quarterbacks' | 'running-backs' | 'wide-receivers' | 'tightends' | 'defense-kickers';
  players: PlayerAnalysis[];
  lastUpdated: string;
  
  // Position-specific analysis
  positionAnalysis: {
    overview: string;
    trendingThemes: string[];
    sleepers: string[];
    avoids: string[];
    draftStrategy: string;
  };
  
  // AI Enhancement
  aiInsights?: {
    weeklyTrends: string[];
    injuryImpacts: string[];
    breakoutCandidates: string[];
    generatedAt: string;
  };
}

// Migration and utility types
export interface MarkdownPlayerSection {
  name: string;
  team: string;
  tier: 'Elite' | 'High-Upside' | 'Volatile' | 'Sleeper' | 'Bust-Risk';
  likelihood: number;
  content: string;
}

export interface MigrationResult {
  success: boolean;
  playersProcessed: number;
  errors: Array<{ player: string; error: string }>;
}

// Search and filtering
export interface PlayerSearchFilters {
  position?: PlayerAnalysis['position'];
  tier?: PlayerAnalysis['tier'];
  team?: NFLTeamAbbreviation;
  conference?: 'AFC' | 'NFC';
  division?: 'North' | 'South' | 'East' | 'West';
  minTop5Likelihood?: number;
  maxTop5Likelihood?: number;
}

export interface TeamSearchFilters {
  conference?: 'AFC' | 'NFC';
  division?: 'North' | 'South' | 'East' | 'West';
  hasAIContent?: boolean;
}

// Type Guards and Utilities
export const isValidPosition = (pos: string): pos is PlayerAnalysis['position'] => {
  return ['QB', 'RB', 'WR', 'TE', 'DEF', 'K'].includes(pos);
};

export const isValidTier = (tier: string): tier is PlayerAnalysis['tier'] => {
  return ['Elite', 'High-Upside', 'Volatile', 'Sleeper', 'Bust-Risk'].includes(tier);
};

export const isValidTeam = (team: string): team is NFLTeamAbbreviation => {
  const allTeams = Object.values(NFL_TEAMS).flatMap(conference => 
    Object.values(conference).flat()
  );
  return allTeams.includes(team as NFLTeamAbbreviation);
};

export const getTeamsByConference = (conference: 'AFC' | 'NFC'): NFLTeamAbbreviation[] => {
  return Object.values(NFL_TEAMS[conference]).flat();
};

export const getTeamsByDivision = (
  conference: 'AFC' | 'NFC', 
  division: 'North' | 'South' | 'East' | 'West'
): NFLTeamAbbreviation[] => {
  return NFL_TEAMS[conference][division];
};

export const getTeamConference = (team: NFLTeamAbbreviation): 'AFC' | 'NFC' => {
  for (const [conference, divisions] of Object.entries(NFL_TEAMS)) {
    for (const divisionTeams of Object.values(divisions)) {
      if (divisionTeams.includes(team)) {
        return conference as 'AFC' | 'NFC';
      }
    }
  }
  throw new Error(`Team ${team} not found`);
};

export const getTeamDivision = (team: NFLTeamAbbreviation): 'North' | 'South' | 'East' | 'West' => {
  for (const conference of Object.values(NFL_TEAMS)) {
    for (const [division, teams] of Object.entries(conference)) {
      if (teams.includes(team)) {
        return division as 'North' | 'South' | 'East' | 'West';
      }
    }
  }
  throw new Error(`Team ${team} not found`);
};