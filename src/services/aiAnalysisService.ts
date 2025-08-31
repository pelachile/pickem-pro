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
   * Trigger AI analysis for teams using the new GraphQL resolver
   */
  static async triggerAnalysis(params: AIAnalysisRequest = {}): Promise<AIAnalysisResponse> {
    try {
      console.log('Triggering AI analysis via GraphQL with params:', params);
      
      // Use the new GraphQL resolver instead of direct Lambda invocation
      const result = await client.queries.runTeamAnalysis({
        triggerImmediate: params.type === 'full' || params.type === 'teams'
      });
      
      if (result.data) {
        console.log('GraphQL team analysis response:', result.data);
        
        return {
          message: result.data.message || 'Analysis completed',
          results: {
            week: params.week || Math.ceil((Date.now() - new Date('2024-09-01').getTime()) / (7 * 24 * 60 * 60 * 1000)),
            season: new Date().getFullYear(),
            analysis_type: params.type || 'teams',
            teams_processed: result.data.teamsProcessed || 0,
            players_processed: 0, // Not implemented in team analysis
            execution_time: result.data.executionTime || 0
          },
          timestamp: result.data.timestamp || new Date().toISOString()
        };
      } else {
        throw new Error('No response from GraphQL resolver');
      }
    } catch (error) {
      console.error('Error triggering AI analysis via GraphQL:', error);
      
      // Provide more detailed error information
      if (error instanceof Error) {
        if (error.message.includes('credentials') || error.message.includes('Unauthorized')) {
          throw new Error('Authentication failed - please ensure you are logged in');
        } else if (error.message.includes('AccessDenied')) {
          throw new Error('Permission denied - check GraphQL resolver permissions');
        } else if (error.message.includes('not found')) {
          throw new Error('GraphQL resolver not found - check deployment');
        }
      }
      
      throw new Error(`Failed to trigger AI analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test Bedrock connectivity using the GraphQL resolver
   */
  static async testBedrock(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('Testing Bedrock connectivity via GraphQL...');
      
      // Test the simpler bedrock hello function first
      const helloResult = await client.queries.sayHello({
        name: 'Frontend Test'
      });
      
      if (helloResult.data?.message) {
        console.log('Hello test succeeded:', helloResult.data.message);
        
        // Now test the team analysis function
        try {
          const analysisResult = await client.queries.runTeamAnalysis({
            triggerImmediate: false // Test mode, don't actually run analysis
          });
          
          if (analysisResult.data) {
            return {
              success: true,
              message: `Bedrock connectivity successful! Team analysis function responding.`,
              details: {
                helloTest: helloResult.data.message,
                analysisTest: {
                  statusCode: analysisResult.data.statusCode,
                  message: analysisResult.data.message,
                  teamsProcessed: analysisResult.data.teamsProcessed
                }
              }
            };
          }
        } catch (analysisError) {
          // Hello worked but analysis failed - partial success
          return {
            success: true,
            message: `Bedrock basic connectivity works, but team analysis needs attention: ${analysisError instanceof Error ? analysisError.message : 'Unknown error'}`,
            details: {
              helloTest: helloResult.data.message,
              analysisError: analysisError instanceof Error ? analysisError.message : 'Unknown error'
            }
          };
        }
      }
      
      return {
        success: false,
        message: 'Bedrock hello test failed - no response from GraphQL resolver',
        details: {
          helloResult: helloResult
        }
      };
      
    } catch (error) {
      console.error('Error testing Bedrock connectivity via GraphQL:', error);
      return {
        success: false,
        message: `Bedrock test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: {
          error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
          } : error
        }
      };
    }
  }

  /**
   * Get AI-enhanced team analysis data from GraphQL or trigger new analysis
   */
  static async getTeamAnalysis(abbreviation?: string, seasonYear?: number): Promise<TeamAnalysis[]> {
    try {
      console.log(`Reading team analysis for ${abbreviation || 'all teams'}...`);
      
      // Call runTeamAnalysis with triggerImmediate: false to read from cache
      const result = await client.queries.runTeamAnalysis({
        triggerImmediate: false
      });
      
      if (result.data?.teamsData) {
        console.log('✅ Got teams data from GraphQL response');
        const teamsData = JSON.parse(result.data.teamsData as string);
        
        // Filter by abbreviation if specified
        if (abbreviation) {
          const filtered = teamsData.filter((team: any) => 
            team.abbreviation?.toLowerCase() === abbreviation.toLowerCase()
          );
          console.log(`Filtered to ${filtered.length} teams for ${abbreviation}`);
          return filtered;
        }
        
        return teamsData;
      }

      // Fallback to DynamoDB if no teams data returned
      console.log('No teams data in GraphQL response, trying DynamoDB...');
      const dbResult = await client.models.NFLTeam.list({
        filter: {
          ...(abbreviation && { abbreviation: { eq: abbreviation } }),
          ...(seasonYear && { season_year: { eq: seasonYear } })
        }
      });

      if (dbResult.data.length > 0) {
        console.log(`Found ${dbResult.data.length} teams in database`);
        return dbResult.data.map(team => ({
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
      }
      
      // No data found anywhere
      console.log('No team analysis found.');
      return [];
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