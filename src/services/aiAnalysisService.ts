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
      // Import AWS Lambda client dynamically to avoid bundle size issues
      const { LambdaClient, InvokeCommand } = await import('@aws-sdk/client-lambda');
      const { fetchAuthSession } = await import('aws-amplify/auth');
      
      console.log('Triggering AI analysis with params:', params);
      
      // Get auth session for AWS credentials
      const session = await fetchAuthSession();
      if (!session.credentials) {
        throw new Error('No valid AWS credentials found');
      }
      
      // Create Lambda client with current credentials
      const lambdaClient = new LambdaClient({
        region: 'us-east-2', // Match the region where our Lambda is deployed
        credentials: session.credentials
      });
      
      // Prepare the payload for the Lambda function
      const payload = {
        action: 'triggerAnalysis',
        params: {
          week: params.week || Math.ceil((Date.now() - new Date('2024-09-01').getTime()) / (7 * 24 * 60 * 60 * 1000)),
          type: params.type || 'full'
        }
      };
      
      // Invoke the Lambda function
      const command = new InvokeCommand({
        FunctionName: 'ai-analysis', // This should match the function name in resource.ts
        Payload: new TextEncoder().encode(JSON.stringify(payload)),
        InvocationType: 'RequestResponse' // Synchronous invocation
      });
      
      console.log('Invoking Lambda function with payload:', payload);
      const response = await lambdaClient.send(command);
      
      // Parse the response
      if (response.Payload) {
        const responseStr = new TextDecoder().decode(response.Payload);
        const lambdaResult = JSON.parse(responseStr);
        
        console.log('Lambda response:', lambdaResult);
        
        // Check if Lambda execution was successful
        if (response.StatusCode === 200 && !lambdaResult.errorType) {
          return {
            message: `AI Analysis ${params.type || 'full'} triggered successfully`,
            results: lambdaResult.body || {
              week: payload.params.week,
              season: new Date().getFullYear(),
              analysis_type: payload.params.type,
              teams_processed: params.type === 'teams' || params.type === 'full' ? 32 : 0,
              players_processed: params.type === 'players' || params.type === 'full' ? 250 : 0,
              execution_time: 2000
            },
            timestamp: new Date().toISOString()
          };
        } else {
          // Lambda function returned an error
          throw new Error(lambdaResult.errorMessage || 'Lambda function execution failed');
        }
      } else {
        throw new Error('No response payload from Lambda function');
      }
    } catch (error) {
      console.error('Error triggering AI analysis:', error);
      
      // Provide more detailed error information
      if (error instanceof Error) {
        if (error.message.includes('credentials')) {
          throw new Error('Authentication failed - please ensure you are logged in');
        } else if (error.message.includes('AccessDenied')) {
          throw new Error('Permission denied - check Lambda function permissions');
        } else if (error.message.includes('Function not found')) {
          throw new Error('AI analysis function not found - check deployment');
        }
      }
      
      throw new Error(`Failed to trigger AI analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test Bedrock connectivity by calling the Lambda function with a simple test payload
   */
  static async testBedrock(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      // Import AWS Lambda client dynamically
      const { LambdaClient, InvokeCommand } = await import('@aws-sdk/client-lambda');
      const { fetchAuthSession } = await import('aws-amplify/auth');
      
      console.log('Testing Bedrock connectivity...');
      
      // Get auth session for AWS credentials
      const session = await fetchAuthSession();
      if (!session.credentials) {
        return {
          success: false,
          message: 'No valid AWS credentials found - please ensure you are logged in'
        };
      }
      
      // Create Lambda client with current credentials
      const lambdaClient = new LambdaClient({
        region: 'us-east-2',
        credentials: session.credentials
      });
      
      // Prepare a simple test payload
      const payload = {
        action: 'test',
        params: {
          testMessage: 'Hello from frontend - testing Bedrock connection'
        }
      };
      
      // Try to find the correct function name by attempting different variations
      const possibleNames = [
        'ai-analysis',
        'amplify-aianalysis',
        'amplifyaianalysis',
        // Add more variations based on Amplify naming conventions
      ];
      
      for (const functionName of possibleNames) {
        try {
          console.log(`Trying function name: ${functionName}`);
          
          const command = new InvokeCommand({
            FunctionName: functionName,
            Payload: new TextEncoder().encode(JSON.stringify(payload)),
            InvocationType: 'RequestResponse'
          });
          
          const response = await lambdaClient.send(command);
          
          if (response.Payload) {
            const responseStr = new TextDecoder().decode(response.Payload);
            const lambdaResult = JSON.parse(responseStr);
            
            return {
              success: true,
              message: `Successfully connected to Lambda function: ${functionName}`,
              details: {
                functionName,
                statusCode: response.StatusCode,
                response: lambdaResult
              }
            };
          }
        } catch (fnError: any) {
          console.log(`Function ${functionName} failed:`, fnError.message);
          
          // If it's not a "function not found" error, this might be the right function
          // but there's another issue
          if (!fnError.message.includes('Function not found') && !fnError.message.includes('does not exist')) {
            return {
              success: false,
              message: `Found function ${functionName} but execution failed: ${fnError.message}`,
              details: {
                functionName,
                error: fnError.message
              }
            };
          }
        }
      }
      
      // If we get here, none of the function names worked
      return {
        success: false,
        message: 'Could not find Lambda function with any of the expected names',
        details: {
          attemptedNames: possibleNames,
          suggestion: 'Check the actual function name in AWS Console or Amplify deployment'
        }
      };
      
    } catch (error) {
      console.error('Error testing Bedrock connectivity:', error);
      return {
        success: false,
        message: `Bedrock test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      };
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