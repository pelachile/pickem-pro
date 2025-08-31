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
      upcomingGames: espnData.schedule.map(game => {
        const comp = game.competitions[0];
        const teamComp = comp.competitors.find(c => c.team.id === espnData.team.id);
        const opponentComp = comp.competitors.find(c => c.team.id !== espnData.team.id);
        
        return {
          opponent: opponentComp?.team.shortDisplayName || 'Unknown',
          date: game.date,
          homeAway: teamComp?.homeAway === 'home' ? 'home' : 'away'
        };
      }),
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
    
    // FULL NFL ANALYSIS: All 32 teams with real ESPN data + Bedrock AI
    console.log('🏈 FULL NFL ANALYSIS - Processing all 32 teams with ESPN + Bedrock');
    
    // Complete ESPN team ID mapping (all 32 NFL teams)
    const NFL_TEAM_IDS_MAPPING = {
      // AFC Teams
      '1': 'ATL',   // Atlanta Falcons (actually NFC, but ESPN uses ID 1)
      '2': 'BUF',   // Buffalo Bills
      '3': 'CHI',   // Chicago Bears (NFC)
      '4': 'CIN',   // Cincinnati Bengals
      '5': 'CLE',   // Cleveland Browns
      '6': 'DAL',   // Dallas Cowboys (NFC)
      '7': 'DEN',   // Denver Broncos
      '8': 'DET',   // Detroit Lions (NFC)
      '9': 'GB',    // Green Bay Packers (NFC)
      '10': 'TEN',  // Tennessee Titans
      '11': 'IND',  // Indianapolis Colts
      '12': 'KC',   // Kansas City Chiefs
      '13': 'LV',   // Las Vegas Raiders
      '14': 'LAR',  // Los Angeles Rams (NFC)
      '15': 'MIA',  // Miami Dolphins
      '16': 'MIN',  // Minnesota Vikings (NFC)
      '17': 'NE',   // New England Patriots
      '18': 'NO',   // New Orleans Saints (NFC)
      '19': 'NYG',  // New York Giants (NFC)
      '20': 'NYJ',  // New York Jets
      '21': 'PHI',  // Philadelphia Eagles (NFC)
      '22': 'ARI',  // Arizona Cardinals (NFC)
      '23': 'PIT',  // Pittsburgh Steelers
      '24': 'LAC',  // Los Angeles Chargers
      '25': 'SF',   // San Francisco 49ers (NFC)
      '26': 'SEA',  // Seattle Seahawks (NFC)
      '27': 'TB',   // Tampa Bay Buccaneers (NFC)
      '28': 'WSH',  // Washington Commanders (NFC)
      '29': 'CAR',  // Carolina Panthers (NFC) 
      '30': 'JAX',  // Jacksonville Jaguars
      '33': 'BAL',  // Baltimore Ravens
      '34': 'HOU',  // Houston Texans
    };

    const NFL_TEAM_IDS = Object.keys(NFL_TEAM_IDS_MAPPING);
    console.log(`📊 Processing ${NFL_TEAM_IDS.length} NFL teams...`);
    
    const teams: TeamAnalysis[] = [];
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;
    
    // Process all 32 teams with proper rate limiting and error handling
    for (const teamId of NFL_TEAM_IDS) {
      try {
        const teamAbbr = NFL_TEAM_IDS_MAPPING[teamId as keyof typeof NFL_TEAM_IDS_MAPPING];
        console.log(`🏈 Processing team ${teamAbbr} (ESPN ID: ${teamId})... (${processedCount + 1}/${NFL_TEAM_IDS.length})`);
        
        // Step 1: ESPN API call with comprehensive data
        console.log(`📡 Fetching ESPN data for ${teamAbbr}...`);
        const espnData = await fetchESPNTeamData(teamId);
        console.log(`✅ ESPN data fetched for ${espnData.team?.displayName || 'Unknown Team'}`);
        
        // Verify we have essential data
        if (!espnData.team || !espnData.team.displayName) {
          throw new Error(`ESPN API returned invalid data for team ${teamAbbr}`);
        }
        
        // Step 2: Bedrock AI analysis
        console.log(`🤖 Generating AI analysis for ${espnData.team.displayName}...`);
        const analysis = await generateTeamAnalysis(espnData);
        console.log(`✅ AI analysis completed for ${analysis.displayName}`);
        
        // Verify analysis quality
        if (!analysis || !analysis.displayName || !analysis.seasonOutlook) {
          throw new Error(`Invalid AI analysis generated for ${teamAbbr}`);
        }
        
        teams.push(analysis);
        successCount++;
        console.log(`🎉 SUCCESS: ${teamAbbr} analysis complete (${analysis.strengths?.length || 0} strengths, ${analysis.weaknesses?.length || 0} weaknesses, ${analysis.keyInjuries?.length || 0} injuries)`);
        
        processedCount++;
        
        // Rate limiting between API calls (2 second delay)
        if (processedCount < NFL_TEAM_IDS.length) {
          console.log(`⏱️ Rate limiting: waiting 2 seconds before next team...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        errorCount++;
        const teamAbbr = NFL_TEAM_IDS_MAPPING[teamId as keyof typeof NFL_TEAM_IDS_MAPPING];
        console.error(`❌ Failed to process team ${teamAbbr} (${teamId}):`, error);
        
        // Create error entry for this team so we can track failures
        teams.push({
          id: `error-${teamId}`,
          abbreviation: teamAbbr,
          displayName: `${teamAbbr} Analysis Error`,
          seasonOutlook: `Failed to analyze: ${error instanceof Error ? error.message : 'Unknown error'}`,
          strengths: ['Error processing'],
          weaknesses: ['Data unavailable'],
          keyInjuries: [],
          weeklyHighlights: 'Analysis failed - check logs',
          gamePreview: 'Retry analysis needed',
          fantasyInsights: error instanceof Error ? error.message : 'Processing error',
          record: { wins: 0, losses: 0, ties: 0 },
          recentGames: [],
          upcomingGames: [],
          aiGeneratedAt: new Date().toISOString()
        });
        
        processedCount++;
        console.log(`📋 Error entry created for ${teamAbbr}, continuing with next team...`);
        
        // Continue processing other teams even if one fails
        if (processedCount < NFL_TEAM_IDS.length) {
          console.log(`⏱️ Rate limiting after error: waiting 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    console.log('🏁 Processing complete! Now preparing results for S3 caching...');
    
    // Create comprehensive results for S3 storage  
    const analysisResults: AnalysisResults = {
      version: Date.now().toString(),
      generatedAt: new Date().toISOString(),
      teams: teams,
      players: {
        quarterbacks: [],
        runningBacks: [],
        wideReceivers: [],
        tightEnds: [],
        kickers: []
      },
      leagueInsights: {
        trendingUp: teams.filter(t => t.seasonOutlook?.includes('trending up') || t.strengths.length > t.weaknesses.length).map(t => t.abbreviation).slice(0, 5),
        trendingDown: teams.filter(t => t.seasonOutlook?.includes('struggle') || t.weaknesses.length > t.strengths.length).map(t => t.abbreviation).slice(0, 5),
        injuryWatch: teams.flatMap(t => t.keyInjuries.filter(i => i.impact.includes('high') || i.impact.includes('significant')).map(i => `${t.abbreviation}: ${i.player}`)).slice(0, 10),
        sleepers: [], // TODO: Add sleeper team detection
        keyMatchups: teams.flatMap(t => t.upcomingGames.slice(0, 1).map(g => `${t.abbreviation} vs ${g.opponent}`)).slice(0, 8),
        playoffPicture: `Analysis generated for ${teams.length} teams - playoff picture analysis pending`
      }
    };
    
    // Save to S3 for caching
    try {
      console.log('💾 Saving analysis results to S3...');
      await saveToS3(analysisResults);
      console.log('✅ Successfully saved analysis to S3 cache!');
    } catch (s3Error) {
      console.error('❌ Failed to save to S3, but analysis was successful:', s3Error);
      // Don't throw - analysis succeeded even if S3 save failed
    }
    
    console.log(`✅ NFL ANALYSIS COMPLETE!`);
    console.log(`📊 Teams successfully processed: ${teams.length}`);
    console.log(`🎉 Success rate: ${successCount}/${NFL_TEAM_IDS.length} (${Math.round(successCount/NFL_TEAM_IDS.length*100)}%)`);
    console.log(`❌ Errors encountered: ${errorCount}`);
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
    
    console.log(`✅ Full NFL analysis complete!`);
    console.log(`📊 Teams analyzed: ${teams.length}`);
    console.log(`🏈 Successful analyses: ${successCount}`);
    console.log(`⚠️ Failed analyses: ${errorCount}`);
    console.log(`👥 FINAL TEAMS COUNT: ${teams.length}`);
    console.log(`👥 FINAL TEAMS DATA:`, JSON.stringify(teams, null, 2));
    console.log(`⏱️  FINAL EXECUTION TIME: ${executionTime}ms`);
    console.log(`📁 FINAL VERSION: ${version}`);
    
    const finalResponse = {
      statusCode: 200,
      message: `NFL team analysis completed: ${successCount} successful, ${errorCount} errors`,
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