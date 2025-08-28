import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Generate the Amplify Data client
const client = generateClient<Schema>();

export interface AIAnalysisRequest {
  week?: number;
  type?: 'full' | 'teams' | 'players' | 'insights';
}

export interface AIAnalysisResponse {
  message: string;
  results: {
    week: number;
    season: number;
    analysis_type: string;
    teams_processed: number;
    players_processed: number;
    execution_time: number;
  };
  timestamp: string;
}

export interface TeamAnalysis {
  id: string;
  abbreviation: string;
  season_year: number;
  season_outlook?: string;
  strengths?: string[];
  weaknesses?: string[];
  key_injuries?: Array<{
    player: string;
    injury: string;
    impact: string;
    status: string;
  }>;
  weekly_highlights?: string;
  game_preview?: string;
  ai_last_updated?: string;
}

export interface PlayerAnalysis {
  id: string;
  name: string;
  team: string;
  position: string;
  news_analysis?: string;
  injury_update?: string;
  trending_factors?: string[];
  sentiment_score?: number;
  weekly_floor?: number;
  weekly_ceiling?: number;
  ai_last_updated?: string;
}

export interface LeagueInsights {
  week: number;
  season: number;
  overview: string;
  trending_teams: {
    up: string[];
    down: string[];
  };
  injury_watch: string[];
  key_matchups: string[];
  fantasy_trends: string[];
  playoff_picture: string;
  predictions: string[];
  ai_last_updated: string;
}

export class AIAnalysisService {
  /**
   * Trigger AI analysis for teams, players, or league insights
   * Note: This would normally trigger the Lambda function, but for now we'll simulate the response
   */
  static async triggerAnalysis(params: AIAnalysisRequest = {}): Promise<AIAnalysisResponse> {
    try {
      // For now, return a simulated response since we need to set up the Lambda trigger properly
      console.log('Triggering AI analysis with params:', params);
      
      return {
        message: `AI Analysis ${params.type || 'full'} triggered successfully`,
        results: {
          week: params.week || Math.ceil((Date.now() - new Date('2024-09-01').getTime()) / (7 * 24 * 60 * 60 * 1000)),
          season: new Date().getFullYear(),
          analysis_type: params.type || 'full',
          teams_processed: params.type === 'teams' || params.type === 'full' ? 32 : 0,
          players_processed: params.type === 'players' || params.type === 'full' ? 250 : 0,
          execution_time: 2000
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error triggering AI analysis:', error);
      throw new Error(`Failed to trigger AI analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get AI-enhanced team analysis data
   */
  static async getTeamAnalysis(abbreviation?: string, seasonYear?: number): Promise<TeamAnalysis[]> {
    try {
      const result = await client.models.NFLTeam.list({
        filter: {
          ...(abbreviation && { abbreviation: { eq: abbreviation } }),
          ...(seasonYear && { season_year: { eq: seasonYear } })
        }
      });

      return result.data.map(team => ({
        id: team.id,
        abbreviation: team.abbreviation,
        season_year: team.season_year,
        season_outlook: team.season_outlook || undefined,
        strengths: team.strengths || undefined,
        weaknesses: team.weaknesses || undefined,
        key_injuries: team.key_injuries || undefined,
        weekly_highlights: team.weekly_highlights || undefined,
        game_preview: team.game_preview || undefined,
        ai_last_updated: team.ai_last_updated || undefined
      }));
    } catch (error) {
      console.error('Error fetching team analysis:', error);
      throw new Error(`Failed to fetch team analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get AI-enhanced player analysis data
   */
  static async getPlayerAnalysis(playerId?: string, team?: string, position?: string): Promise<PlayerAnalysis[]> {
    try {
      const result = await client.models.Player.list({
        filter: {
          ...(playerId && { id: { eq: playerId } }),
          ...(team && { team: { eq: team } }),
          ...(position && { position: { eq: position } })
        }
      });

      return result.data.map(player => ({
        id: player.id,
        name: player.name,
        team: player.team,
        position: player.position,
        news_analysis: player.news_analysis || undefined,
        injury_update: player.injury_update || undefined,
        trending_factors: player.trending_factors || undefined,
        sentiment_score: player.sentiment_score || undefined,
        weekly_floor: player.weekly_floor || undefined,
        weekly_ceiling: player.weekly_ceiling || undefined,
        ai_last_updated: player.ai_last_updated || undefined
      }));
    } catch (error) {
      console.error('Error fetching player analysis:', error);
      throw new Error(`Failed to fetch player analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get cached AI content for performance optimization
   */
  static async getCachedContent(contentType: string, contentKey: string) {
    try {
      const result = await client.models.AIContentCache.list({
        filter: {
          content_type: { eq: contentType },
          content_key: { eq: contentKey },
          expires_at: { gt: new Date().toISOString() }
        }
      });

      if (result.data.length > 0) {
        // Update hit count and last accessed
        const cacheEntry = result.data[0];
        await client.models.AIContentCache.update({
          id: cacheEntry.id,
          hit_count: (cacheEntry.hit_count || 0) + 1,
          last_accessed: new Date().toISOString()
        });

        return cacheEntry.content;
      }

      return null;
    } catch (error) {
      console.error('Error fetching cached content:', error);
      return null;
    }
  }

  /**
   * Get league-wide insights and trends
   */
  static async getLeagueInsights(week?: number, season?: number): Promise<LeagueInsights | null> {
    try {
      const currentWeek = week || Math.ceil((Date.now() - new Date('2024-09-01').getTime()) / (7 * 24 * 60 * 60 * 1000));
      const currentSeason = season || new Date().getFullYear();
      
      const cacheKey = `league_insights_${currentSeason}_week_${currentWeek}`;
      
      // Try to get cached insights first
      const cachedInsights = await this.getCachedContent('league_insights', cacheKey);
      
      if (cachedInsights) {
        return cachedInsights as LeagueInsights;
      }

      // If no cached data, trigger analysis and return placeholder
      await this.triggerAnalysis({ week: currentWeek, type: 'insights' });
      
      return {
        week: currentWeek,
        season: currentSeason,
        overview: 'Analysis in progress. Please check back in a few minutes.',
        trending_teams: { up: [], down: [] },
        injury_watch: [],
        key_matchups: [],
        fantasy_trends: [],
        playoff_picture: 'Analysis pending...',
        predictions: [],
        ai_last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching league insights:', error);
      return null;
    }
  }

  /**
   * Check if AI content is fresh (updated within last 24 hours)
   */
  static isContentFresh(lastUpdated: string | undefined): boolean {
    if (!lastUpdated) return false;
    
    const updateTime = new Date(lastUpdated).getTime();
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    return (now - updateTime) < dayInMs;
  }

  /**
   * Get AI analysis status for teams
   */
  static async getAnalysisStatus(): Promise<{
    teamsAnalyzed: number;
    playersAnalyzed: number;
    lastUpdate: string | null;
    cacheHitRate: number;
  }> {
    try {
      const [teamCount, playerCount, cacheStats] = await Promise.all([
        client.models.NFLTeam.list({
          filter: {
            ai_last_updated: { attributeExists: true }
          }
        }),
        client.models.Player.list({
          filter: {
            ai_last_updated: { attributeExists: true }
          }
        }),
        client.models.AIContentCache.list()
      ]);

      const totalHits = cacheStats.data.reduce((sum, entry) => sum + (entry.hit_count || 0), 0);
      const totalEntries = cacheStats.data.length;
      const cacheHitRate = totalEntries > 0 ? totalHits / totalEntries : 0;

      // Find most recent update
      const allUpdates = [
        ...teamCount.data.map(t => t.ai_last_updated),
        ...playerCount.data.map(p => p.ai_last_updated)
      ].filter(Boolean).sort().reverse();

      return {
        teamsAnalyzed: teamCount.data.length,
        playersAnalyzed: playerCount.data.length,
        lastUpdate: allUpdates[0] || null,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100
      };
    } catch (error) {
      console.error('Error fetching analysis status:', error);
      return {
        teamsAnalyzed: 0,
        playersAnalyzed: 0,
        lastUpdate: null,
        cacheHitRate: 0
      };
    }
  }
}

export default AIAnalysisService;