import type { Handler } from 'aws-lambda';
import { 
  BedrockRuntimeClient, 
  InvokeModelCommand,
  InvokeModelCommandInput
} from '@aws-sdk/client-bedrock-runtime';
import {
  S3Client,
  PutObjectCommand
} from '@aws-sdk/client-s3';

// Types for ESPN API responses
interface ESPNTeam {
  id: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  record?: {
    items: Array<{
      type: string;
      summary: string;
      stats: Array<{ name: string; value: number; }>;
    }>;
  };
  // Enhanced team data
  statistics?: {
    splits?: {
      categories: Array<{
        name: string;
        stats: Array<{ name: string; value: number; displayValue: string; }>;
      }>;
    };
  };
  roster?: {
    athletes: Array<{
      id: string;
      displayName: string;
      position: { abbreviation: string; };
      statistics?: {
        splits?: {
          categories: Array<{
            stats: Array<{ name: string; value: number; displayValue: string; }>;
          }>;
        };
      };
    }>;
  };
}

interface ESPNGame {
  id: string;
  date: string;
  competitions: Array<{
    competitors: Array<{
      team: ESPNTeam;
      score: string;
      homeAway: string;
    }>;
    status: {
      type: { completed: boolean; };
    };
  }>;
}

interface ESPNInjury {
  athlete: {
    displayName: string;
    position: { abbreviation: string; };
  };
  status: string;
  details: {
    detail: string;
    fantasyStatus: string;
  };
}

interface ESPNNews {
  headline: string;
  description: string;
  published: string;
  type: string;
}

interface ESPNPlayerStats {
  athlete: {
    id: string;
    displayName: string;
    position: { abbreviation: string; };
  };
  stats: Array<{ name: string; value: number; displayValue: string; }>;
}

interface ESPNTeamStats {
  name: string;
  displayName: string;
  shortDisplayName: string;
  description: string;
  abbreviation: string;
  stats: Array<{ name: string; value: number; displayValue: string; }>;
}

interface TeamAnalysis {
  id: string;
  abbreviation: string;
  displayName: string;
  seasonOutlook: string;
  strengths: string[];
  weaknesses: string[];
  keyInjuries: Array<{
    player: string;
    position: string;
    status: string;
    impact: string;
    fantasyImpact: string;
  }>;
  weeklyHighlights: string;
  gamePreview: string;
  fantasyInsights: string;
  record?: {
    wins: number;
    losses: number;
    ties: number;
  };
  recentGames: Array<{
    opponent: string;
    result: 'W' | 'L' | 'T';
    score: string;
    date: string;
  }>;
  upcomingGames: Array<{
    opponent: string;
    date: string;
    homeAway: 'home' | 'away';
  }>;
  aiGeneratedAt: string;
}

interface PlayerAnalysis {
  id: string;
  name: string;
  team: string;
  position: string;
  tier: string;
  projectedPoints: number;
  weeklyFloor: number;
  weeklyCeiling: number;
  injuryStatus: string;
  newsAnalysis: string;
  fantasyOutlook: string;
  keyFactors: string[];
  aiGeneratedAt: string;
}

interface AnalysisResults {
  version: string;
  generatedAt: string;
  teams: TeamAnalysis[];
  players: {
    quarterbacks: PlayerAnalysis[];
    runningBacks: PlayerAnalysis[];
    wideReceivers: PlayerAnalysis[];
    tightEnds: PlayerAnalysis[];
    kickers: PlayerAnalysis[];
  };
  leagueInsights: {
    trendingUp: string[];
    trendingDown: string[];
    injuryWatch: string[];
    sleepers: string[];
    keyMatchups: string[];
    playoffPicture: string;
  };
}

// Initialize clients
let bedrockClient: BedrockRuntimeClient | null = null;
let s3Client: S3Client | null = null;

function initializeClients() {
  const region = process.env.AWS_REGION || 'us-east-2';
  const bedrockRegion = 'us-east-2'; // Direct foundation model in us-east-2
  
  if (!bedrockClient) {
    bedrockClient = new BedrockRuntimeClient({ 
      region: bedrockRegion,
      maxAttempts: 3,
      retryMode: 'adaptive'
    });
  }
  
  if (!s3Client) {
    s3Client = new S3Client({ region });
  }
  
  return { bedrock: bedrockClient, s3: s3Client };
}

/**
 * Fetch team data from ESPN API
 */
async function fetchESPNTeamData(teamId: string): Promise<{
  team: ESPNTeam;
  recentGames: ESPNGame[];
  injuries: ESPNInjury[];
  teamStats: ESPNTeamStats[];
  topPlayers: ESPNPlayerStats[];
  news: ESPNNews[];
  schedule: ESPNGame[];
}> {
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
  
  try {
    console.log(`🔄 Fetching comprehensive ESPN data for team ${teamId}...`);
    
    // Fetch team data using known working ESPN endpoints
    const [teamResponse, injuryResponse] = await Promise.all([
      fetch(`${baseUrl}/teams/${teamId}`),
      fetch(`${baseUrl}/teams/${teamId}/injuries`)
    ]);
    
    const teamData = await teamResponse.json();
    const injuryData = await injuryResponse.json();
    
    // Extract comprehensive data from team endpoint (includes stats and roster)
    const team = teamData.team || {};
    const teamStats = team.record?.items || [];
    const roster = team.athletes || [];
    
    console.log(`📊 Team data fetched - Stats: ${teamStats.length} categories, Roster: ${roster.length} players`);
    
    // Get recent games and schedule from scoreboard (more reliable)
    const scoreboardResponse = await fetch(`${baseUrl}/scoreboard`);
    const scoreboardData = await scoreboardResponse.json();
    
    // Filter recent completed games
    const recentGames = scoreboardData.events?.filter((game: ESPNGame) => 
      game.competitions[0].competitors.some(comp => comp.team.id === teamId) &&
      game.competitions[0].status.type.completed
    ) || [];
    
    // Filter upcoming games from same scoreboard data
    const upcomingGames = scoreboardData.events?.filter((game: ESPNGame) => 
      game.competitions[0].competitors.some(comp => comp.team.id === teamId) &&
      !game.competitions[0].status.type.completed
    ).slice(0, 3) || []; // Next 3 games
    
    console.log(`🎮 Games data: ${recentGames.length} recent, ${upcomingGames.length} upcoming`);
    
    // Extract key players from roster data  
    const topPlayers = roster.slice(0, 10).map((athlete: any) => ({
      athlete: {
        id: athlete.id || 'unknown',
        displayName: athlete.displayName || athlete.fullName || 'Unknown',
        position: athlete.position || { abbreviation: 'UNK' }
      },
      stats: [] // ESPN team endpoint doesn't include individual stats
    })) || [];
    
    // Format team record statistics for analysis
    const formattedTeamStats = teamStats.map((record: any) => ({
      name: record.type || 'overall',
      displayName: record.displayName || record.name || 'Team Record',
      shortDisplayName: record.abbreviation || 'Record',
      description: record.summary || 'Season record',
      abbreviation: record.abbreviation || 'REC',
      stats: record.stats || []
    }));
    
    console.log(`✅ ESPN data collected - Players: ${topPlayers.length}, Team Stats: ${formattedTeamStats.length}`);
    
    return {
      team: teamData.team,
      recentGames: recentGames.slice(0, 5), // Last 5 games
      injuries: injuryData.injuries || [],
      teamStats: formattedTeamStats,
      topPlayers: topPlayers,
      news: [], // ESPN team endpoint doesn't include news
      schedule: upcomingGames
    };
  } catch (error) {
    console.error(`❌ Error fetching comprehensive ESPN data for team ${teamId}:`, error);
    throw error;
  }
}

/**
 * Generate team analysis using Bedrock Claude
 */
async function generateTeamAnalysis(espnData: {
  team: ESPNTeam;
  recentGames: ESPNGame[];
  injuries: ESPNInjury[];
  teamStats: ESPNTeamStats[];
  topPlayers: ESPNPlayerStats[];
  news: ESPNNews[];
  schedule: ESPNGame[];
}): Promise<TeamAnalysis> {
  const { bedrock } = initializeClients();
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  
  console.log(`🤖 BEDROCK: Using model ID: ${modelId}`);
  console.log(`🤖 BEDROCK: Using region: us-east-2`);
  
  // Prepare comprehensive data for Claude
  const teamContext = `
=== TEAM OVERVIEW ===
TEAM: ${espnData.team.displayName} (${espnData.team.abbreviation})
CURRENT RECORD: ${espnData.team.record?.items[0]?.summary || 'N/A'}

=== RECENT PERFORMANCE ===
RECENT GAMES (Last 5):
${espnData.recentGames.map(game => {
  const comp = game.competitions[0];
  const teamComp = comp.competitors.find(c => c.team.id === espnData.team.id);
  const opponentComp = comp.competitors.find(c => c.team.id !== espnData.team.id);
  const result = parseInt(teamComp?.score || '0') > parseInt(opponentComp?.score || '0') ? 'W' : 'L';
  return `${result} ${teamComp?.score}-${opponentComp?.score} vs ${opponentComp?.team.shortDisplayName} (${game.date})`;
}).join('\n')}

=== UPCOMING SCHEDULE ===
NEXT 3 GAMES:
${espnData.schedule.map(game => {
  const comp = game.competitions[0];
  const teamComp = comp.competitors.find(c => c.team.id === espnData.team.id);
  const opponentComp = comp.competitors.find(c => c.team.id !== espnData.team.id);
  const homeAway = teamComp?.homeAway === 'home' ? 'vs' : '@';
  return `${homeAway} ${opponentComp?.team.shortDisplayName} (${game.date})`;
}).join('\n')}

=== TEAM STATISTICS ===
${espnData.teamStats.map(category => 
  `${category.displayName}: ${category.description}\n${category.stats.map((stat: any) => `  ${stat.name}: ${stat.displayValue || stat.value}`).join('\n')}`
).join('\n\n')}

=== KEY PLAYERS ===
${espnData.topPlayers.map(player => 
  `${player.athlete.displayName} (${player.athlete.position?.abbreviation || 'UNK'})`
).join('\n')}

=== INJURY REPORT ===
CURRENT INJURIES:
${espnData.injuries.map(injury => 
  `${injury.athlete.displayName} (${injury.athlete.position.abbreviation}) - ${injury.status}\n  Details: ${injury.details.detail}\n  Fantasy Impact: ${injury.details.fantasyStatus}`
).join('\n\n')}

=== ADDITIONAL CONTEXT ===
Analysis based on current ESPN team data, recent game results, and injury reports.
`;

  const prompt = `
You are an expert NFL analyst and fantasy football expert with deep knowledge of advanced statistics, coaching schemes, and fantasy football strategy. Analyze the comprehensive team data provided and generate professional-grade insights.

${teamContext}

Based on this comprehensive data including recent performance, advanced team statistics, player stats, injury reports, upcoming schedule, and recent news, provide a detailed analysis in the following JSON format:

{
  "seasonOutlook": "3-4 sentence comprehensive season assessment based on record, statistical trends, and trajectory",
  "strengths": ["4-5 specific team strengths with statistical backing"],
  "weaknesses": ["4-5 key areas of concern with data support"],
  "weeklyHighlights": "Detailed recent performance analysis including statistical trends and key storylines from the news",
  "gamePreview": "In-depth upcoming matchup analysis considering opponent strengths/weaknesses and team trends",
  "fantasyInsights": "Comprehensive fantasy advice including specific player recommendations, injury impacts, and weekly start/sit guidance"
}

Your analysis should be data-driven and include:
- Statistical trend analysis from team stats
- Player performance evaluation from individual stats
- Injury impact assessment on team strategy and fantasy production
- Matchup-specific insights for upcoming games
- News-driven storyline integration
- Advanced fantasy football strategy recommendations
- Specific actionable insights for fantasy managers

Provide ONLY the JSON response with no additional text or formatting.
`;

  try {
    const input: InvokeModelCommandInput = {
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrock.send(command);
    
    if (!response.body) {
      throw new Error('Empty response from Bedrock');
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const analysisText = responseBody.content[0].text;
    
    // Parse the JSON response from Claude
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', analysisText);
      // Fallback with basic structure
      analysis = {
        seasonOutlook: "Analysis in progress - please check back later",
        strengths: ["Strong team fundamentals"],
        weaknesses: ["Areas for improvement identified"],
        weeklyHighlights: "Recent performance review pending",
        gamePreview: "Upcoming matchup analysis pending",
        fantasyInsights: "Fantasy recommendations being prepared"
      };
    }
    
    // Build complete team analysis
    const teamAnalysis: TeamAnalysis = {
      id: espnData.team.id,
      abbreviation: espnData.team.abbreviation,
      displayName: espnData.team.displayName,
      seasonOutlook: analysis.seasonOutlook,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      keyInjuries: espnData.injuries.map(injury => ({
        player: injury.athlete.displayName,
        position: injury.athlete.position.abbreviation,
        status: injury.status,
        impact: injury.details.detail,
        fantasyImpact: injury.details.fantasyStatus
      })),
      weeklyHighlights: analysis.weeklyHighlights,
      gamePreview: analysis.gamePreview,
      fantasyInsights: analysis.fantasyInsights,
      record: espnData.team.record?.items[0]?.stats ? {
        wins: espnData.team.record.items[0].stats.find(s => s.name === 'wins')?.value || 0,
        losses: espnData.team.record.items[0].stats.find(s => s.name === 'losses')?.value || 0,
        ties: espnData.team.record.items[0].stats.find(s => s.name === 'ties')?.value || 0
      } : undefined,
      recentGames: espnData.recentGames.map(game => {
        const comp = game.competitions[0];
        const teamComp = comp.competitors.find(c => c.team.id === espnData.team.id);
        const opponentComp = comp.competitors.find(c => c.team.id !== espnData.team.id);
        const teamScore = parseInt(teamComp?.score || '0');
        const opponentScore = parseInt(opponentComp?.score || '0');
        const result = teamScore > opponentScore ? 'W' : (teamScore < opponentScore ? 'L' : 'T');
        
        return {
          opponent: opponentComp?.team.shortDisplayName || 'Unknown',
          result: result as 'W' | 'L' | 'T',
          score: `${teamComp?.score}-${opponentComp?.score}`,
          date: game.date
        };
      }),
      upcomingGames: [], // TODO: Add upcoming games from schedule
      aiGeneratedAt: new Date().toISOString()
    };
    
    return teamAnalysis;
  } catch (error) {
    console.error('Error generating team analysis:', error);
    throw error;
  }
}

/**
 * Save analysis results to S3
 */
async function saveToS3(results: AnalysisResults): Promise<void> {
  const { s3 } = initializeClients();
  const bucketName = process.env.S3_BUCKET_NAME || 'amplify-pickemapp-cory-sa-amplifydataamplifycodege-xlbjhi6tuxfw';
  
  try {
    // Save main analysis file
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: `v${results.version}/analysis.json`,
      Body: JSON.stringify(results, null, 2),
      ContentType: 'application/json',
      CacheControl: 'public, max-age=86400' // 24 hours
    }));
    
    // Save individual team files
    for (const team of results.teams) {
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: `v${results.version}/teams/${team.abbreviation.toLowerCase()}.json`,
        Body: JSON.stringify(team, null, 2),
        ContentType: 'application/json',
        CacheControl: 'public, max-age=86400'
      }));
    }
    
    // Save player position files
    for (const [position, players] of Object.entries(results.players)) {
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: `v${results.version}/players/${position}.json`,
        Body: JSON.stringify(players, null, 2),
        ContentType: 'application/json',
        CacheControl: 'public, max-age=86400'
      }));
    }
    
    // Update current version pointer
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: 'current/manifest.json',
      Body: JSON.stringify({
        version: results.version,
        generatedAt: results.generatedAt,
        teamsCount: results.teams.length,
        playersCount: Object.values(results.players).flat().length
      }, null, 2),
      ContentType: 'application/json',
      CacheControl: 'public, max-age=300' // 5 minutes
    }));
    
    console.log(`✅ Analysis saved to S3 version: ${results.version}`);
  } catch (error) {
    console.error('❌ Error saving to S3:', error);
    throw error;
  }
}

/**
 * Main Lambda handler - processes all teams and players
 */
export const handler: Handler = async (event) => {
  console.log('🚀 Starting weekly AI analysis');
  console.log('📋 Event received:', JSON.stringify(event, null, 2));
  
  const startTime = Date.now();
  const version = startTime.toString();
  
  console.log(`⏰ Start time: ${new Date(startTime).toISOString()}`);
  console.log(`📦 Version: ${version}`);
  
  try {
    console.log('🔧 DEBUG: Inside try block');
    
    // PHASE 4 TEST: Full ESPN + Bedrock integration
    console.log('🎯 FULL INTEGRATION TEST - ESPN + Bedrock team analysis');
    
    const teams: TeamAnalysis[] = [];
    
    try {
      const testTeamId = '1'; // Atlanta Falcons
      console.log(`🏈 Testing full integration with team ${testTeamId}...`);
      
      // Step 1: ESPN API
      console.log(`📡 STEP 1: Fetching ESPN data for team ${testTeamId}...`);
      const espnData = await fetchESPNTeamData(testTeamId);
      console.log(`✅ STEP 1 SUCCESS: ESPN data fetched for team: ${espnData.team?.displayName || 'Unknown'}`);
      console.log(`📊 STEP 1 DATA: ${espnData.recentGames?.length || 0} recent games, ${espnData.schedule?.length || 0} upcoming, ${espnData.injuries?.length || 0} injuries, ${espnData.teamStats?.length || 0} stat categories, ${espnData.topPlayers?.length || 0} players`);
      
      // Verify we have essential data
      if (!espnData.team || !espnData.team.displayName) {
        throw new Error('ESPN API returned invalid team data - missing team info');
      }
      
      // Step 2: Bedrock AI Analysis  
      console.log(`🤖 STEP 2: Generating Bedrock AI analysis for ${espnData.team.displayName}...`);
      const analysis = await generateTeamAnalysis(espnData);
      console.log(`✅ STEP 2 SUCCESS: Generated AI insights for ${analysis.displayName}`);
      console.log(`📝 STEP 2 ANALYSIS: Season outlook (first 100 chars): ${analysis.seasonOutlook.substring(0, 100)}...`);
      console.log(`💪 STEP 2 ANALYSIS: Strengths: ${analysis.strengths.length}, Weaknesses: ${analysis.weaknesses.length}`);
      console.log(`🏥 STEP 2 ANALYSIS: Key injuries: ${analysis.keyInjuries.length}`);
      
      // Verify we have valid analysis
      if (!analysis || !analysis.displayName) {
        throw new Error('Bedrock analysis returned invalid data - missing analysis results');
      }
      
      teams.push(analysis);
      console.log(`🎉 FULL INTEGRATION SUCCESS! Real NFL team analysis complete.`);
      console.log(`📊 Final teams array length: ${teams.length}`);
      console.log(`👥 Team names: ${teams.map(t => t.displayName).join(', ')}`);
      console.log(`✅ SUCCESS: Real teams data will be returned to GraphQL`);
      
    } catch (error) {
      console.error(`❌ CRITICAL: Full integration test FAILED:`, error);
      console.error(`❌ CRITICAL: Error details:`, error instanceof Error ? error.stack : error);
      
      // Log additional debugging info
      if (error instanceof Error) {
        console.error(`❌ CRITICAL: Error name: ${error.name}`);
        console.error(`❌ CRITICAL: Error message: ${error.message}`);
      }
      
      // CRITICAL: Add the error team so we can see what went wrong
      teams.push({
        id: 'espn-error',
        abbreviation: 'ERR',
        displayName: `ESPN/Bedrock Error: ${error instanceof Error ? error.message : 'Unknown'}`,
        seasonOutlook: `Integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        strengths: ['Error debugging enabled'],
        weaknesses: ['ESPN or Bedrock failure'],
        keyInjuries: [],
        weeklyHighlights: 'Check CloudWatch logs for full error details',
        gamePreview: 'Fix ESPN API or Bedrock permissions',
        fantasyInsights: error instanceof Error ? (error.stack?.substring(0, 200) || 'No stack trace') : 'No error details',
        record: { wins: 0, losses: 1, ties: 0 },
        recentGames: [],
        upcomingGames: [],
        aiGeneratedAt: new Date().toISOString()
      });
      
      // Create an error team to surface the issue through GraphQL
      const errorTeam: TeamAnalysis = {
        id: 'bedrock-error',
        abbreviation: 'ERR',
        displayName: 'Bedrock Error',
        seasonOutlook: `Bedrock failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        strengths: ['Error captured'],
        weaknesses: [error instanceof Error ? error.name || 'Unknown error type' : 'Unknown'],
        keyInjuries: [],
        weeklyHighlights: 'Debugging Bedrock connectivity',
        gamePreview: 'Fix permissions needed',
        fantasyInsights: error instanceof Error ? error.stack?.substring(0, 200) || 'No stack trace' : 'No error details',
        record: { wins: 0, losses: 1, ties: 0 },
        recentGames: [],
        upcomingGames: [],
        aiGeneratedAt: new Date().toISOString()
      };
      
      teams.push(errorTeam);
      console.log(`📋 Error team created to surface issue via GraphQL`);
    }
    
    // Skip S3 save for now
    console.log('⏭️ Skipping S3 save in test mode');
    
    /*
    // NFL team IDs (ESPN API team IDs) - DISABLED FOR TESTING
    const NFL_TEAM_IDS = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
      '33', '34' // 32 teams total
    ];
    
    console.log(`📊 Processing ${NFL_TEAM_IDS.length} NFL teams...`);
    
    // Process all teams
    const teams: TeamAnalysis[] = [];
    let processedCount = 0;
    
    // TEMPORARY: Process only first 2 teams for debugging
    const testTeamIds = NFL_TEAM_IDS.slice(0, 2);
    console.log(`🔍 DEBUG MODE: Processing only ${testTeamIds.length} teams: ${testTeamIds.join(', ')}`);
    
    for (const teamId of testTeamIds) {
      try {
        console.log(`🏈 Processing team ${teamId}... (${processedCount + 1}/${testTeamIds.length})`);
        
        // Test ESPN API call first
        console.log(`📡 Fetching ESPN data for team ${teamId}...`);
        const espnData = await fetchESPNTeamData(teamId);
        console.log(`✅ ESPN comprehensive data fetched for ${espnData.team?.displayName || 'Unknown Team'} - ${espnData.teamStats?.length || 0} stat categories, ${espnData.topPlayers?.length || 0} players`);
        
        // Test Bedrock analysis
        console.log(`🤖 Generating AI analysis for team ${teamId}...`);
        const analysis = await generateTeamAnalysis(espnData);
        console.log(`✅ AI analysis generated for ${analysis.displayName}`);
        
        teams.push(analysis);
        processedCount++;
        
        // Rate limiting - small delay between API calls
        if (processedCount < testTeamIds.length) {
          console.log(`⏱️ Rate limiting: waiting 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay for debugging
        }
      } catch (error) {
        console.error(`❌ Failed to process team ${teamId}:`, error);
        console.error(`❌ Error details:`, error instanceof Error ? error.stack : error);
        // Continue with other teams even if one fails
      }
    }
    
    */
    
    console.log(`✅ TEST MODE: Teams successfully created: ${teams.length}`);
    console.log(`📋 Team names: ${teams.map(t => t.displayName).join(', ')}`);
    
    // TODO: Process top fantasy players by position
    const players = {
      quarterbacks: [] as PlayerAnalysis[],
      runningBacks: [] as PlayerAnalysis[],
      wideReceivers: [] as PlayerAnalysis[],
      tightEnds: [] as PlayerAnalysis[],
      kickers: [] as PlayerAnalysis[]
    };
    
    console.log('🏁 Reaching final return statement');
    const executionTime = Date.now() - startTime;
    
    console.log(`✅ Test analysis complete!`);
    console.log(`📊 Teams created: ${teams.length}`);
    console.log(`👥 FINAL TEAMS COUNT: ${teams.length}`);
    console.log(`👥 FINAL TEAMS DATA:`, JSON.stringify(teams, null, 2));
    console.log(`⏱️  FINAL EXECUTION TIME: ${executionTime}ms`);
    console.log(`📁 FINAL VERSION: ${version}`);
    
    const finalResponse = {
      statusCode: 200,
      message: 'Full integration AI analysis completed successfully',
      version,
      teamsProcessed: teams.length,
      executionTime,
      timestamp: new Date().toISOString(),
      teamsData: teams // Include the actual teams data
    };
    
    console.log(`🚀 FINAL RESPONSE BEING RETURNED:`, JSON.stringify(finalResponse, null, 2));
    return finalResponse;
  } catch (error) {
    console.error('🚨 Weekly analysis failed:', error);
    
    return {
      statusCode: 500,
      message: 'Weekly AI analysis failed',
      version: null,
      teamsProcessed: 0,
      executionTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      teamsData: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};