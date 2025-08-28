export interface ComponentTeamData {
  conference: string; // "afc" or "nfc"
  conferenceFull: string; // "AFC" or "NFC"
  filename: string;
  lastUpdated: string;
  aiGenerated: boolean;
  version: string;
  content: {
    overview: {
      title: string;
      summary: string;
      keyInsights: string[];
      totalTeams: number;
    };
    teams: ComponentTeam[];
    analysis: {
      trendingThemes: string[];
      keyFactors: string[];
      seasonOutlook: string;
      riskFactors: string[];
    };
    weeklyUpdate?: {
      headline: string;
      updates: string[];
      generatedAt: string;
    };
  };
  ui: {
    displayMode: 'cards' | 'list' | 'table';
    featuredTeams: string[];
    conferenceColors: { [conference: string]: string };
  };
}

export interface ComponentTeam {
  id: string;
  name: string;
  location: string;
  abbreviation: string;
  displayName: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  tier: 'Contender' | 'Playoff-Bound' | 'Competitive' | 'Rebuilding' | 'Struggling';
  tierColor: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  
  quickStats: {
    playoffOdds: number; // 0-100 percentage
    projectedWins: number;
    strengthOfSchedule: number; // 1-32 ranking
    powerRanking: number; // 1-32 ranking
  };
  
  analysis: {
    headline: string;
    strengths: string[];
    concerns: string[];
    keyFactors: string[];
    aiInsights?: {
      trendingUp: boolean;
      confidenceScore: number;
      lastNewsUpdate: string;
      riskAlert?: string;
    };
  };
  
  seasonStats?: {
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    pointsAgainst: number;
    pointDifferential: number;
    divisionRecord: string;
    conferenceRecord: string;
  };
  
  keyPlayers?: {
    quarterback: string;
    topSkillPlayer: string;
    defensiveLeader: string;
  };
  
  metadata: {
    lastUpdated: string;
    dataSource: 'ai' | 'manual' | 'hybrid';
    espnId: string;
  };
}

export interface TeamAnalysisProps {
  conference: string;
  title: string;
}