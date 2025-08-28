/**
 * AI Analysis Lambda Function
 * 
 * Integrates with AWS Bedrock to generate intelligent insights for NFL teams and fantasy players
 * Processes ESPN data, static team/player data, and generates cached AI analysis content
 * Scheduled to run weekly with smart caching to manage costs
 */

import type { ScheduledHandler, APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { 
  BedrockRuntimeClient, 
  InvokeModelCommand,
  InvokeModelCommandInput
} from '@aws-sdk/client-bedrock-runtime';

// Configure Amplify with environment variables
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT || '',
      region: process.env.AWS_REGION || 'us-east-1',
      defaultAuthMode: 'iam'
    }
  }
});

const client = generateClient<Schema>();
const bedrockClient = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'us-east-2' 
});

// Configuration constants
const CURRENT_SEASON = 2025;
const BEDROCK_MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0'; // Updated model ID
const CACHE_TTL_DAYS = 7; // Weekly cache refresh
const RATE_LIMIT_DELAY = 2000; // 2 second delay between API calls

// Types for external data sources
interface StaticTeamData {
  id: number;
  espn_id: string;
  name: string;
  location: string;
  abbreviation: string;
  display_name: string;
  conference: string;
  division: string;
  is_active: boolean;
  logo_url: string;
}

interface PlayerData {
  id: string;
  name: string;
  team: string;
  position: string;
  tier: string;
  top5_likelihood: number;
  fantasy_points: number;
  weekly_floor: number;
  weekly_ceiling: number;
  games_played: number;
  injury_history: any[];
  fantasy_rank: number;
  position_stats: any;
  summary: string;
  strengths: string[];
  concerns: string[];
  key_factors: string[];
  upside: string;
  floor: string;
}

interface PositionFileData {
  position: string;
  positionFull: string;
  content: {
    overview: {
      title: string;
      summary: string;
      keyInsights: string[];
      totalPlayers: number;
    };
    players: PlayerData[];
  };
}

/**
 * Utility function to delay execution (rate limiting)
 */
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if content is cached and still valid
 */
async function getCachedContent(contentType: string, contentKey: string): Promise<any | null> {
  try {
    const { data: cachedItem } = await client.models.AIContentCache.get({
      content_type: contentType,
      content_key: contentKey
    });

    if (cachedItem && new Date(cachedItem.expires_at) > new Date()) {
      // Update hit count and last accessed
      await client.models.AIContentCache.update({
        content_type: contentType,
        content_key: contentKey,
        hit_count: (cachedItem.hit_count || 0) + 1,
        last_accessed: new Date().toISOString()
      });

      console.log(`Cache hit for ${contentType}:${contentKey}`);
      return cachedItem.content;
    }

    return null;
  } catch (error) {
    console.log(`No cached content for ${contentType}:${contentKey}`);
    return null;
  }
}

/**
 * Cache AI-generated content with TTL
 */
async function cacheContent(contentType: string, contentKey: string, content: any): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

    await client.models.AIContentCache.create({
      content_type: contentType,
      content_key: contentKey,
      content: content,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      hit_count: 0
    });

    console.log(`Cached content for ${contentType}:${contentKey}, expires: ${expiresAt.toISOString()}`);
  } catch (error) {
    // If already exists, update it
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

      await client.models.AIContentCache.update({
        content_type: contentType,
        content_key: contentKey,
        content: content,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        hit_count: 0
      });
    } catch (updateError) {
      console.error(`Failed to cache content for ${contentType}:${contentKey}:`, updateError);
    }
  }
}

/**
 * Invoke Bedrock Claude model with retries and error handling
 */
async function invokeClaudeModel(prompt: string, maxRetries = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const input: InvokeModelCommandInput = {
        modelId: BEDROCK_MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 4000,
          temperature: 0.7,
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      };

      const command = new InvokeModelCommand(input);
      const response = await bedrockClient.send(command);
      
      if (!response.body) {
        throw new Error('Empty response from Bedrock');
      }

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.content[0].text;

    } catch (error: any) {
      console.error(`Bedrock attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`Bedrock failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Exponential backoff
      await delay(Math.pow(2, attempt) * 1000);
    }
  }
  
  throw new Error('All Bedrock attempts failed');
}

/**
 * Generate team analysis using AI
 */
async function generateTeamAnalysis(team: StaticTeamData, currentWeek: number): Promise<any> {
  const cacheKey = `${team.abbreviation}_${CURRENT_SEASON}_W${currentWeek}`;
  
  // Check cache first
  const cached = await getCachedContent('team_analysis', cacheKey);
  if (cached) return cached;

  console.log(`Generating AI analysis for ${team.display_name}`);

  try {
    // Get current team record if available
    const { data: teamRecord } = await client.models.TeamRecord.get({
      espn_id: team.espn_id,
      season_year: CURRENT_SEASON
    });

    const recordInfo = teamRecord 
      ? `Current record: ${teamRecord.wins}-${teamRecord.losses}${(teamRecord.ties || 0) > 0 ? `-${teamRecord.ties}` : ''} (${((teamRecord.win_percentage || 0) * 100).toFixed(1)}%)`
      : 'Current record: Not available';

    const prompt = `
As an expert NFL analyst, provide a comprehensive analysis for the ${team.display_name} for the ${CURRENT_SEASON} season, Week ${currentWeek}.

Context:
- Team: ${team.display_name} (${team.conference} ${team.division})
- Season: ${CURRENT_SEASON}, Week ${currentWeek}
- ${recordInfo}

Please provide analysis in the following JSON structure:
{
  "season_outlook": "2-3 sentence season assessment and trajectory",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "key_injuries": [{"player": "name", "position": "pos", "status": "status", "impact": "impact description"}],
  "coaching_changes": "Brief overview of any significant coaching changes and their impact",
  "weekly_highlights": "Key storylines and developments for this specific week",
  "injury_report": "Current injury concerns and their fantasy impact",
  "fantasy_relevant_news": "News and developments that affect fantasy football decisions",
  "game_preview": "Preview of upcoming game(s) with key matchups and factors to watch",
  "playoff_odds": "Assessment of playoff probability and division standing",
  "trending_factors": ["factor 1", "factor 2", "factor 3"],
  "sentiment_score": 0.5
}

Provide specific, actionable insights based on current NFL trends, team performance, and fantasy football relevance. Keep responses concise but informative. The sentiment_score should be between -1.0 (very negative) and 1.0 (very positive).
`;

    const aiResponse = await invokeClaudeModel(prompt);
    
    // Parse AI response as JSON
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback with structured data
      analysis = {
        season_outlook: "Analysis temporarily unavailable",
        strengths: ["Team analysis pending"],
        weaknesses: ["Team analysis pending"],
        key_injuries: [],
        coaching_changes: "No significant changes reported",
        weekly_highlights: "Weekly highlights pending",
        injury_report: "Injury report pending",
        fantasy_relevant_news: "Fantasy news pending",
        game_preview: "Game preview pending",
        playoff_odds: "Playoff assessment pending",
        trending_factors: ["Analysis pending"],
        sentiment_score: 0.0
      };
    }

    // Cache the result
    await cacheContent('team_analysis', cacheKey, analysis);
    
    // Rate limiting
    await delay(RATE_LIMIT_DELAY);
    
    return analysis;

  } catch (error) {
    console.error(`Error generating team analysis for ${team.abbreviation}:`, error);
    throw error;
  }
}

/**
 * Generate enhanced player analysis using AI
 */
async function generatePlayerAnalysis(player: PlayerData, currentWeek: number): Promise<any> {
  const cacheKey = `${player.id}_${CURRENT_SEASON}_W${currentWeek}`;
  
  // Check cache first
  const cached = await getCachedContent('player_analysis', cacheKey);
  if (cached) return cached;

  console.log(`Generating AI analysis for ${player.name} (${player.team})`);

  try {
    const prompt = `
As an expert fantasy football analyst, provide an enhanced analysis for ${player.name} (${player.position}, ${player.team}) for Week ${currentWeek} of the ${CURRENT_SEASON} season.

Current Player Data:
- Position: ${player.position}
- Team: ${player.team}
- Tier: ${player.tier}
- Fantasy Rank: ${player.fantasy_rank}
- Top 5 Likelihood: ${player.top5_likelihood}%
- Weekly Floor: ${player.weekly_floor}
- Weekly Ceiling: ${player.weekly_ceiling}
- Games Played: ${player.games_played}
- Current Summary: ${player.summary}
- Current Strengths: ${player.strengths?.join(', ') || 'None listed'}
- Current Concerns: ${player.concerns?.join(', ') || 'None listed'}

Please provide enhanced analysis in the following JSON structure:
{
  "news_analysis": "Latest news and developments affecting this player",
  "injury_update": "Current injury status and timeline for return/impact",
  "matchup_analysis": "Analysis of upcoming matchup and how it affects fantasy value",
  "weekly_projection": {
    "floor": number,
    "ceiling": number,
    "projection": number
  },
  "trending_factors": ["factor affecting value up/down", "another factor", "third factor"],
  "sentiment_score": 0.5,
  "weekly_rank": number,
  "start_sit_recommendation": "START/SIT/FLEX with brief reasoning",
  "key_stats_to_watch": ["stat 1", "stat 2", "stat 3"],
  "upside_scenario": "Best case scenario for this week",
  "downside_scenario": "Worst case scenario for this week"
}

Focus on actionable insights for fantasy managers. Consider recent performance, matchup data, injury concerns, and team context. Sentiment score should be between -1.0 (avoid) and 1.0 (target). Weekly rank should be relative to position (1 = best option at position this week).
`;

    const aiResponse = await invokeClaudeModel(prompt);
    
    // Parse AI response
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error(`Failed to parse AI response for ${player.name}:`, parseError);
      // Fallback analysis
      analysis = {
        news_analysis: "Analysis pending",
        injury_update: "No injury concerns reported",
        matchup_analysis: "Matchup analysis pending",
        weekly_projection: {
          floor: player.weekly_floor || 0,
          ceiling: player.weekly_ceiling || 0,
          projection: player.fantasy_points || 0
        },
        trending_factors: ["Analysis pending"],
        sentiment_score: 0.0,
        weekly_rank: player.fantasy_rank || 999,
        start_sit_recommendation: "ANALYSIS PENDING",
        key_stats_to_watch: ["Analysis pending"],
        upside_scenario: "Analysis pending",
        downside_scenario: "Analysis pending"
      };
    }

    // Cache the result
    await cacheContent('player_analysis', cacheKey, analysis);
    
    // Rate limiting
    await delay(RATE_LIMIT_DELAY);
    
    return analysis;

  } catch (error) {
    console.error(`Error generating player analysis for ${player.name}:`, error);
    throw error;
  }
}

/**
 * Load static team data from JSON
 */
async function loadStaticTeamData(): Promise<StaticTeamData[]> {
  try {
    // In Lambda, we need to fetch from a URL or include the data directly
    // For now, we'll include essential team data directly
    const staticTeams: StaticTeamData[] = [
      { id: 1, espn_id: "22", name: "Cardinals", location: "Arizona", abbreviation: "ARI", display_name: "Arizona Cardinals", conference: "NFC", division: "West", is_active: true, logo_url: "" },
      { id: 2, espn_id: "1", name: "Falcons", location: "Atlanta", abbreviation: "ATL", display_name: "Atlanta Falcons", conference: "NFC", division: "South", is_active: true, logo_url: "" },
      { id: 3, espn_id: "33", name: "Ravens", location: "Baltimore", abbreviation: "BAL", display_name: "Baltimore Ravens", conference: "AFC", division: "North", is_active: true, logo_url: "" },
      { id: 4, espn_id: "2", name: "Bills", location: "Buffalo", abbreviation: "BUF", display_name: "Buffalo Bills", conference: "AFC", division: "East", is_active: true, logo_url: "" },
      { id: 5, espn_id: "29", name: "Panthers", location: "Carolina", abbreviation: "CAR", display_name: "Carolina Panthers", conference: "NFC", division: "South", is_active: true, logo_url: "" },
      { id: 6, espn_id: "3", name: "Bears", location: "Chicago", abbreviation: "CHI", display_name: "Chicago Bears", conference: "NFC", division: "North", is_active: true, logo_url: "" },
      { id: 7, espn_id: "4", name: "Bengals", location: "Cincinnati", abbreviation: "CIN", display_name: "Cincinnati Bengals", conference: "AFC", division: "North", is_active: true, logo_url: "" },
      { id: 8, espn_id: "5", name: "Browns", location: "Cleveland", abbreviation: "CLE", display_name: "Cleveland Browns", conference: "AFC", division: "North", is_active: true, logo_url: "" },
      { id: 9, espn_id: "6", name: "Cowboys", location: "Dallas", abbreviation: "DAL", display_name: "Dallas Cowboys", conference: "NFC", division: "East", is_active: true, logo_url: "" },
      { id: 10, espn_id: "7", name: "Broncos", location: "Denver", abbreviation: "DEN", display_name: "Denver Broncos", conference: "AFC", division: "West", is_active: true, logo_url: "" },
      { id: 11, espn_id: "8", name: "Lions", location: "Detroit", abbreviation: "DET", display_name: "Detroit Lions", conference: "NFC", division: "North", is_active: true, logo_url: "" },
      { id: 12, espn_id: "9", name: "Packers", location: "Green Bay", abbreviation: "GB", display_name: "Green Bay Packers", conference: "NFC", division: "North", is_active: true, logo_url: "" },
      { id: 13, espn_id: "34", name: "Texans", location: "Houston", abbreviation: "HOU", display_name: "Houston Texans", conference: "AFC", division: "South", is_active: true, logo_url: "" },
      { id: 14, espn_id: "11", name: "Colts", location: "Indianapolis", abbreviation: "IND", display_name: "Indianapolis Colts", conference: "AFC", division: "South", is_active: true, logo_url: "" },
      { id: 15, espn_id: "30", name: "Jaguars", location: "Jacksonville", abbreviation: "JAX", display_name: "Jacksonville Jaguars", conference: "AFC", division: "South", is_active: true, logo_url: "" },
      { id: 16, espn_id: "12", name: "Chiefs", location: "Kansas City", abbreviation: "KC", display_name: "Kansas City Chiefs", conference: "AFC", division: "West", is_active: true, logo_url: "" },
      { id: 17, espn_id: "13", name: "Raiders", location: "Las Vegas", abbreviation: "LV", display_name: "Las Vegas Raiders", conference: "AFC", division: "West", is_active: true, logo_url: "" },
      { id: 18, espn_id: "24", name: "Chargers", location: "Los Angeles", abbreviation: "LAC", display_name: "Los Angeles Chargers", conference: "AFC", division: "West", is_active: true, logo_url: "" },
      { id: 19, espn_id: "14", name: "Rams", location: "Los Angeles", abbreviation: "LAR", display_name: "Los Angeles Rams", conference: "NFC", division: "West", is_active: true, logo_url: "" },
      { id: 20, espn_id: "15", name: "Dolphins", location: "Miami", abbreviation: "MIA", display_name: "Miami Dolphins", conference: "AFC", division: "East", is_active: true, logo_url: "" },
      { id: 21, espn_id: "16", name: "Vikings", location: "Minnesota", abbreviation: "MIN", display_name: "Minnesota Vikings", conference: "NFC", division: "North", is_active: true, logo_url: "" },
      { id: 22, espn_id: "17", name: "Patriots", location: "New England", abbreviation: "NE", display_name: "New England Patriots", conference: "AFC", division: "East", is_active: true, logo_url: "" },
      { id: 23, espn_id: "18", name: "Saints", location: "New Orleans", abbreviation: "NO", display_name: "New Orleans Saints", conference: "NFC", division: "South", is_active: true, logo_url: "" },
      { id: 24, espn_id: "19", name: "Giants", location: "New York", abbreviation: "NYG", display_name: "New York Giants", conference: "NFC", division: "East", is_active: true, logo_url: "" },
      { id: 25, espn_id: "20", name: "Jets", location: "New York", abbreviation: "NYJ", display_name: "New York Jets", conference: "AFC", division: "East", is_active: true, logo_url: "" },
      { id: 26, espn_id: "21", name: "Eagles", location: "Philadelphia", abbreviation: "PHI", display_name: "Philadelphia Eagles", conference: "NFC", division: "East", is_active: true, logo_url: "" },
      { id: 27, espn_id: "23", name: "Steelers", location: "Pittsburgh", abbreviation: "PIT", display_name: "Pittsburgh Steelers", conference: "AFC", division: "North", is_active: true, logo_url: "" },
      { id: 28, espn_id: "25", name: "49ers", location: "San Francisco", abbreviation: "SF", display_name: "San Francisco 49ers", conference: "NFC", division: "West", is_active: true, logo_url: "" },
      { id: 29, espn_id: "26", name: "Seahawks", location: "Seattle", abbreviation: "SEA", display_name: "Seattle Seahawks", conference: "NFC", division: "West", is_active: true, logo_url: "" },
      { id: 30, espn_id: "27", name: "Buccaneers", location: "Tampa Bay", abbreviation: "TB", display_name: "Tampa Bay Buccaneers", conference: "NFC", division: "South", is_active: true, logo_url: "" },
      { id: 31, espn_id: "10", name: "Titans", location: "Tennessee", abbreviation: "TEN", display_name: "Tennessee Titans", conference: "AFC", division: "South", is_active: true, logo_url: "" },
      { id: 32, espn_id: "28", name: "Commanders", location: "Washington", abbreviation: "WAS", display_name: "Washington Commanders", conference: "NFC", division: "East", is_active: true, logo_url: "" }
    ];

    return staticTeams;
  } catch (error) {
    console.error('Error loading static team data:', error);
    return [];
  }
}

/**
 * Load player data from position files
 * In production, this would fetch from S3 or CDN
 */
async function loadPlayerData(): Promise<PlayerData[]> {
  try {
    const allPlayers: PlayerData[] = [];
    
    // List of position files to load
    const positionFiles = [
      'quarterbacks.json',
      'running-backs.json', 
      'wide-receivers.json',
      'tightends.json',
      'defense-kickers.json'
    ];
    
    for (const fileName of positionFiles) {
      try {
        // In Lambda, you would fetch from S3 or public URL
        // For now, we'll create sample data structure
        const position = fileName.replace('.json', '').replace('-', '_');
        
        // Generate sample players for each position for testing
        if (position === 'quarterbacks') {
          const samplePlayers: PlayerData[] = [
            {
              id: 'lamar-jackson-bal',
              name: 'Lamar Jackson',
              team: 'BAL',
              position: 'QB',
              tier: 'Elite',
              top5_likelihood: 85,
              fantasy_points: 340,
              weekly_floor: 18,
              weekly_ceiling: 35,
              games_played: 16,
              injury_history: [],
              fantasy_rank: 1,
              position_stats: { passing_yards: 3678, rushing_yards: 821, total_tds: 28 },
              summary: 'Elite dual-threat quarterback with highest floor at the position',
              strengths: ['Rushing ability', 'Red zone efficiency', 'Playoff experience'],
              concerns: ['Passing consistency', 'Injury risk'],
              key_factors: ['Goal line carries', 'Offensive line health'],
              upside: 'QB1 overall with 400+ fantasy points',
              floor: 'High-end QB1 with 300+ points'
            }
          ];
          allPlayers.push(...samplePlayers);
        }
        
        console.log(`Loaded sample ${position} data (${positionFiles.indexOf(fileName) === 0 ? 1 : 0} players)`);
        
      } catch (fileError) {
        console.error(`Error loading ${fileName}:`, fileError);
        // Continue with other files
      }
    }
    
    console.log(`Total players loaded: ${allPlayers.length}`);
    return allPlayers;
    
  } catch (error) {
    console.error('Error loading player data:', error);
    return [];
  }
}

/**
 * Update NFLTeam records with AI analysis
 */
async function updateTeamAnalysis(teams: StaticTeamData[], currentWeek: number): Promise<void> {
  console.log(`Starting team analysis updates for Week ${currentWeek}`);
  
  for (const team of teams) {
    try {
      console.log(`Processing ${team.display_name}...`);
      
      const analysis = await generateTeamAnalysis(team, currentWeek);
      
      const teamData = {
        abbreviation: team.abbreviation,
        season_year: CURRENT_SEASON,
        name: team.name,
        city: team.location,
        conference: team.conference,
        division: team.division,
        season_outlook: analysis.season_outlook,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        key_injuries: analysis.key_injuries,
        coaching_changes: analysis.coaching_changes,
        weekly_highlights: analysis.weekly_highlights,
        injury_report: analysis.injury_report,
        fantasy_relevant_news: analysis.fantasy_relevant_news,
        game_preview: analysis.game_preview,
        week: currentWeek,
        ai_last_updated: new Date().toISOString()
      };

      // Create or update team record
      try {
        await client.models.NFLTeam.create(teamData);
      } catch (error) {
        // If exists, update it
        await client.models.NFLTeam.update(teamData);
      }
      
      console.log(`✓ Updated AI analysis for ${team.display_name}`);
      
      // Rate limiting between teams
      await delay(RATE_LIMIT_DELAY);
      
    } catch (error) {
      console.error(`Error updating ${team.display_name}:`, error);
      // Continue with other teams
    }
  }
}

/**
 * Update Player records with AI analysis
 */
async function updatePlayerAnalysis(players: PlayerData[], currentWeek: number): Promise<void> {
  console.log(`Starting player analysis updates for Week ${currentWeek}`);
  
  for (const player of players) {
    try {
      console.log(`Processing ${player.name} (${player.team})...`);
      
      const analysis = await generatePlayerAnalysis(player, currentWeek);
      
      const playerData = {
        id: player.id, // Add required id field
        name: player.name,
        team: player.team,
        position: player.position,
        tier: player.tier,
        top5_likelihood: player.top5_likelihood,
        fantasy_points: player.fantasy_points,
        weekly_floor: analysis.weekly_projection.floor,
        weekly_ceiling: analysis.weekly_projection.ceiling,
        games_played: player.games_played,
        injury_history: player.injury_history,
        fantasy_rank: player.fantasy_rank,
        position_stats: player.position_stats,
        summary: player.summary,
        strengths: player.strengths,
        concerns: player.concerns,
        key_factors: player.key_factors,
        upside: player.upside,
        floor: player.floor,
        ai_last_updated: new Date().toISOString(),
        news_analysis: analysis.news_analysis,
        injury_update: analysis.injury_update,
        trending_factors: analysis.trending_factors,
        sentiment_score: analysis.sentiment_score,
        season_year: CURRENT_SEASON,
        week: currentWeek
      };

      // Create or update player record
      try {
        await client.models.Player.create(playerData);
      } catch (error) {
        // If exists, update it
        await client.models.Player.update(playerData);
      }
      
      console.log(`✓ Updated AI analysis for ${player.name}`);
      
      // Rate limiting between players
      await delay(RATE_LIMIT_DELAY);
      
    } catch (error) {
      console.error(`Error updating ${player.name}:`, error);
      // Continue with other players
    }
  }
}

/**
 * Generate league-wide insights and trends
 */
async function generateLeagueInsights(currentWeek: number): Promise<void> {
  const cacheKey = `league_insights_${CURRENT_SEASON}_W${currentWeek}`;
  
  // Check cache first
  const cached = await getCachedContent('league_insights', cacheKey);
  if (cached) {
    console.log('Using cached league insights');
    return;
  }

  try {
    console.log('Generating league-wide insights...');
    
    const prompt = `
As an expert NFL analyst, provide comprehensive league-wide insights for Week ${currentWeek} of the ${CURRENT_SEASON} NFL season.

Please analyze current trends and provide insights in the following JSON structure:
{
  "week_overview": "2-3 sentence overview of key storylines for this week",
  "trending_teams": [
    {"team": "abbreviation", "trend": "up/down", "reason": "brief explanation"}
  ],
  "injury_watch": [
    {"player": "name", "team": "abbreviation", "position": "pos", "impact": "fantasy impact"}
  ],
  "matchups_to_watch": [
    {"game": "team1 @ team2", "reason": "why this matchup is significant"}
  ],
  "fantasy_trends": {
    "hot_pickups": ["player name (pos, team)", "player 2"],
    "cooling_off": ["player name (pos, team)", "player 2"],
    "position_insights": {
      "QB": "key trend for quarterbacks",
      "RB": "key trend for running backs", 
      "WR": "key trend for wide receivers",
      "TE": "key trend for tight ends"
    }
  },
  "playoff_picture": "Brief assessment of current playoff race developments",
  "week_predictions": ["prediction 1", "prediction 2", "prediction 3"]
}

Focus on actionable insights for fantasy football managers and NFL fans. Consider recent performance, injury reports, and statistical trends.
`;

    const aiResponse = await invokeClaudeModel(prompt);
    
    let insights;
    try {
      insights = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse league insights:', parseError);
      insights = {
        week_overview: "League insights analysis pending",
        trending_teams: [],
        injury_watch: [],
        matchups_to_watch: [],
        fantasy_trends: {
          hot_pickups: [],
          cooling_off: [],
          position_insights: {
            QB: "Analysis pending",
            RB: "Analysis pending",
            WR: "Analysis pending",
            TE: "Analysis pending"
          }
        },
        playoff_picture: "Playoff analysis pending",
        week_predictions: ["Analysis pending"]
      };
    }

    // Cache the insights
    await cacheContent('league_insights', cacheKey, insights);
    
    console.log('✓ Generated and cached league-wide insights');
    
  } catch (error) {
    console.error('Error generating league insights:', error);
  }
}

/**
 * Cleanup expired cache entries
 */
async function cleanupExpiredCache(): Promise<void> {
  try {
    console.log('Cleaning up expired cache entries...');
    
    // Query for expired entries using the list method and filter
    const { data: allEntries } = await client.models.AIContentCache.list();
    const expiredEntries = allEntries?.filter(entry => 
      new Date(entry.expires_at) <= new Date()
    ) || [];

    let deletedCount = 0;
    for (const entry of expiredEntries) {
      try {
        await client.models.AIContentCache.delete({
          content_type: entry.content_type,
          content_key: entry.content_key
        });
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete expired cache entry:`, error);
      }
    }

    console.log(`✓ Cleaned up ${deletedCount} expired cache entries`);
    
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}

/**
 * Core analysis logic (shared between scheduled and manual triggers)
 */
async function runAIAnalysis(targetWeek?: number, analysisType?: string): Promise<any> {
  // Determine current week (in production, this would be more sophisticated)
  const currentWeek = targetWeek || Math.ceil(((new Date().getTime() - new Date(`${CURRENT_SEASON}-09-01`).getTime()) / (1000 * 60 * 60 * 24)) / 7);
  const weekToProcess = Math.max(1, Math.min(18, currentWeek)); // Clamp to valid week range
  
  console.log(`Processing AI analysis for ${CURRENT_SEASON} Season, Week ${weekToProcess}`);
  console.log(`Analysis type: ${analysisType || 'full'}`);
  
  const results = {
    week: weekToProcess,
    season: CURRENT_SEASON,
    analysis_type: analysisType || 'full',
    teams_processed: 0,
    players_processed: 0,
    cache_entries_cleaned: 0,
    execution_time: Date.now()
  };
  
  // Step 1: Cleanup expired cache entries
  await cleanupExpiredCache();
  
  // Step 2: Load static data
  const teams = await loadStaticTeamData();
  const players = await loadPlayerData();
  
  console.log(`Loaded ${teams.length} teams and ${players.length} players`);
  
  // Step 3: Generate league-wide insights first (sets context)
  if (!analysisType || analysisType === 'full' || analysisType === 'insights') {
    await generateLeagueInsights(weekToProcess);
  }
  
  // Step 4: Update team analysis
  if ((!analysisType || analysisType === 'full' || analysisType === 'teams') && teams.length > 0) {
    await updateTeamAnalysis(teams, weekToProcess);
    results.teams_processed = teams.length;
  }
  
  // Step 5: Update player analysis
  if ((!analysisType || analysisType === 'full' || analysisType === 'players') && players.length > 0) {
    await updatePlayerAnalysis(players, weekToProcess);
    results.players_processed = players.length;
  }
  
  results.execution_time = Date.now() - results.execution_time;
  
  console.log(`✓ AI Analysis completed for Week ${weekToProcess}`);
  console.log(`✓ Processed ${results.teams_processed} teams and ${results.players_processed} players`);
  console.log(`✓ Execution time: ${results.execution_time}ms`);
  
  return results;
}

/**
 * Manual HTTP trigger handler for testing and on-demand analysis
 */
export const manualHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  console.log('AI Analysis Lambda manually triggered via HTTP:', JSON.stringify(event, null, 2));
  
  try {
    const { queryStringParameters } = event;
    const targetWeek = queryStringParameters?.week ? parseInt(queryStringParameters.week) : undefined;
    const analysisType = queryStringParameters?.type || 'full'; // full, teams, players, insights
    
    if (targetWeek && (targetWeek < 1 || targetWeek > 18)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Invalid week parameter. Must be between 1 and 18.',
          week_provided: targetWeek
        })
      };
    }
    
    const results = await runAIAnalysis(targetWeek, analysisType);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'AI Analysis completed successfully',
        results,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error: any) {
    console.error('Manual AI Analysis Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'AI Analysis failed',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

/**
 * Main Lambda handler - scheduled to run weekly
 */
export const handler: ScheduledHandler = async (event): Promise<void> => {
  console.log('AI Analysis Lambda triggered via schedule:', JSON.stringify(event, null, 2));
  
  try {
    await runAIAnalysis();
  } catch (error) {
    console.error('Scheduled AI Analysis Lambda error:', error);
    throw error; // Let Lambda handle the error
  }
};