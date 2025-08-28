// Component-Driven JSON Data Types
// Designed for optimal React component consumption and PWA performance

/**
 * Current Component Requirements Analysis:
 * - PlayerDataDisplay expects: { filename, content, lastModified }[]
 * - MarkdownRenderer renders content as markdown
 * - Needs loading states, error handling, and caching
 */

// === CURRENT FORMAT (Markdown-based) ===
export interface PlayerDataFile {
  filename: string;
  content: string; // Raw markdown content
  lastModified: string;
}

// === NEW FORMAT (JSON-based, AI-Enhanced) ===

/**
 * Enhanced Player Data for Components
 * Optimized for React rendering and PWA caching
 */
export interface ComponentPlayerData {
  // Metadata
  position: string;
  positionFull: string;
  filename: string; // e.g., "quarterbacks.json"
  lastUpdated: string; // ISO timestamp
  aiGenerated: boolean;
  version: string;

  // Content for rendering
  content: {
    // Overview section (replaces markdown intro)
    overview: {
      title: string;
      summary: string; // Rich text summary
      keyInsights: string[]; // Bullet points for quick scanning
      totalPlayers: number;
    };

    // Individual player cards
    players: ComponentPlayer[];

    // Position analysis (replaces markdown conclusion)
    analysis: {
      trendingThemes: string[];
      keyFactors: string[];
      draftStrategy: string;
      riskFactors: string[];
    };

    // AI-generated additions
    weeklyUpdate?: {
      headline: string;
      updates: string[];
      generatedAt: string;
    };
  };

  // Component metadata
  ui: {
    displayMode: 'cards' | 'list' | 'table';
    featuredPlayers: string[]; // Player IDs to highlight
    tierColors: { [tier: string]: string }; // CSS colors for tiers
  };
}

/**
 * Individual Player Data for Component Rendering
 * Optimized for card display and interaction
 */
export interface ComponentPlayer {
  // Identity
  id: string;
  name: string;
  team: string;
  position: string;
  
  // Visual/UI data
  tier: 'Elite' | 'High-Upside' | 'Volatile' | 'Sleeper' | 'Bust-Risk';
  tierColor: string; // CSS color for tier badge
  avatarUrl?: string; // Player image URL
  teamLogoUrl?: string; // Team logo URL
  
  // Quick stats for card header
  quickStats: {
    top5Likelihood: number; // 0-100
    projectedRank: number; // 1-32
    weeklyFloor: number;
    weeklyCeiling: number;
  };

  // Rich content for card body
  analysis: {
    // Headline summary (1-2 sentences)
    headline: string;
    
    // Structured analysis for easy rendering
    strengths: string[];
    concerns: string[];
    keyFactors: string[];
    
    // AI-enhanced insights
    aiInsights?: {
      trendingUp: boolean;
      confidenceScore: number; // 0-1
      lastNewsUpdate: string;
      riskAlert?: string;
    };
  };

  // Stats for expandable section
  detailedStats?: {
    [key: string]: number | string; // Position-specific stats
  };

  // Interaction data
  metadata: {
    lastUpdated: string;
    dataSource: 'ai' | 'manual' | 'hybrid';
    popularity?: number; // View/interaction count
  };
}

// === S3/CDN STRUCTURE ===

/**
 * S3 File Structure for CDN delivery
 */
export interface S3PlayerDataStructure {
  // Individual position files
  '/positions/quarterbacks.json': ComponentPlayerData;
  '/positions/running-backs.json': ComponentPlayerData;
  '/positions/wide-receivers.json': ComponentPlayerData;
  '/positions/tight-ends.json': ComponentPlayerData;
  '/positions/defense-kickers.json': ComponentPlayerData;
  
  // Metadata and manifests
  '/meta/manifest.json': {
    positions: string[];
    lastUpdated: string;
    version: string;
    cdnUrls: { [position: string]: string };
  };
  
  // Weekly updates
  '/updates/week-{n}.json': {
    position: string;
    updates: ComponentPlayer[];
    generatedAt: string;
  };
}

// === COMPONENT API ===

/**
 * Updated hook interface for JSON consumption
 */
export interface ComponentPlayerDataResult {
  data: ComponentPlayerData | null;
  isLoading: boolean;
  error: string | null;
  
  // Enhanced functionality
  refresh: () => Promise<void>;
  lastRefresh: string | null;
  cacheAge: number; // minutes since last fetch
}

// === AI SERVICE OUTPUT SPECIFICATION ===

/**
 * What AI services (Bedrock, etc.) should return
 * This is the CONTRACT between AI Lambda functions and components
 */
export interface AIPlayerAnalysisOutput {
  // Required fields for component rendering
  player: {
    name: string;
    team: string;
    position: string;
  };
  
  // AI-generated analysis in component-ready format
  analysis: {
    headline: string; // Max 150 chars
    strengths: string[]; // Max 5 items, 50 chars each
    concerns: string[]; // Max 5 items, 50 chars each
    keyFactors: string[]; // Max 3 items, 75 chars each
  };
  
  // AI projections
  projections: {
    top5Likelihood: number; // 0-100
    weeklyFloor: number;
    weeklyCeiling: number;
    tier: ComponentPlayer['tier'];
  };
  
  // AI metadata
  aiMetadata: {
    model: string; // e.g., 'claude-3-sonnet'
    confidence: number; // 0-1
    dataSourcesUsed: string[];
    generatedAt: string;
    prompt?: string; // For debugging
  };
}

/**
 * Lambda Function Output Schema
 * What Lambda writes to S3 for component consumption
 */
export interface LambdaOutputSchema {
  // Direct mapping to ComponentPlayerData
  position: string;
  positionFull: string;
  filename: string;
  lastUpdated: string;
  aiGenerated: true;
  version: string;
  
  content: {
    overview: {
      title: string;
      summary: string; // AI-generated position overview
      keyInsights: string[]; // AI-generated key themes
      totalPlayers: number;
    };
    
    players: AIPlayerAnalysisOutput[]; // Transformed to ComponentPlayer format
    
    analysis: {
      trendingThemes: string[]; // AI-generated from all players
      keyFactors: string[]; // AI-identified position factors
      draftStrategy: string; // AI-generated strategy
      riskFactors: string[]; // AI-identified risks
    };
    
    weeklyUpdate: {
      headline: string; // AI-generated weekly insight
      updates: string[]; // Recent developments
      generatedAt: string;
    };
  };
  
  ui: {
    displayMode: 'cards';
    featuredPlayers: string[]; // AI-selected top players
    tierColors: { [tier: string]: string };
  };
}