import type { Context } from 'aws-lambda';
import * as fs from 'fs';

// File system operations for ETL pipeline - no S3 needed

interface ESPNGameStatus {
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
}

interface ESPNCompetitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway: string;
  winner: boolean;
  team: {
    id: string;
    uid: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    isActive: boolean;
    logo: string;
  };
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
}

interface ESPNGame {
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
    competitors: ESPNCompetitor[];
    notes: any[];
    status: ESPNGameStatus;
    broadcasts: Array<{
      market: string;
      names: string[];
    }>;
    geoBroadcasts: Array<{
      type: {
        id: string;
        shortName: string;
      };
      market: {
        id: string;
        type: string;
      };
      media: {
        shortName: string;
      };
    }>;
    headlines: Array<{
      description: string;
      type: string;
      shortLinkText: string;
    }>;
  }>;
}

interface ESPNScoreboardResponse {
  leagues: Array<{
    id: string;
    uid: string;
    name: string;
    abbreviation: string;
    season: {
      year: number;
      startDate: string;
      endDate: string;
      type: {
        id: string;
        type: number;
        name: string;
        abbreviation: string;
      };
    };
  }>;
  events: ESPNGame[];
  season: {
    type: number;
    year: number;
  };
  week: {
    number: number;
  };
}

interface LiveScore {
  game_id: string;
  espn_id: string;
  status: {
    type: string;
    detail: string;
    completed: boolean;
    clock: string;
    period: number;
  };
  home_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    score: number;
    winner: boolean;
    linescores: number[];
  };
  away_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    score: number;
    winner: boolean;
    linescores: number[];
  };
  last_updated: string;
  quarter_scores?: number[][];
}

interface ScoresRequest {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  year: number;
  activeOnly?: boolean;
}

interface ETLResult {
  success: boolean;
  data?: LiveScore[];
  error?: string;
  meta?: {
    week: number;
    season_type: string;
    year: number;
    total_games: number;
    active_games: number;
    completed_games: number;
    last_updated: string;
  };
}

/**
 * Determines the current NFL week based on the date
 * @param date Current date
 * @returns Object containing week number, season type, and year
 */
function getCurrentNFLWeek(date: Date = new Date()) {
  const year = date.getFullYear();
  
  // NFL preseason typically starts in August
  const preseasonStart = new Date(year, 7, 1); // August 1
  const regularSeasonStart = new Date(year, 8, 7); // September 7 (approximate)
  
  if (date < preseasonStart) {
    // Off-season, return previous year's data
    return { week: 18, seasonType: 'regular', year: year - 1 };
  } else if (date < regularSeasonStart) {
    // Preseason (3 weeks)
    const weeksDiff = Math.floor((date.getTime() - preseasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const week = Math.min(Math.max(weeksDiff + 1, 1), 3);
    return { week, seasonType: 'preseason', year };
  } else {
    // Regular season (18 weeks)
    const weeksDiff = Math.floor((date.getTime() - regularSeasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const week = Math.min(Math.max(weeksDiff + 1, 1), 18);
    return { week, seasonType: 'regular', year };
  }
}

/**
 * Fetches live scores from ESPN API
 * @param week Week number
 * @param seasonType Type of season (preseason, regular, postseason)
 * @param year Season year
 * @returns Promise<ESPNScoreboardResponse>
 */
async function fetchESPNScores(
  week: number,
  seasonType: string,
  year: number
): Promise<ESPNScoreboardResponse> {
  const seasonTypeMap = {
    'preseason': 1,
    'regular': 2,
    'postseason': 3
  };
  
  const seasonTypeId = seasonTypeMap[seasonType as keyof typeof seasonTypeMap] || 2;
  const baseUrl = process.env.ESPN_API_BASE_URL || 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
  
  const url = `${baseUrl}/scoreboard?limit=1000&dates=${year}&seasontype=${seasonTypeId}&week=${week}`;
  
  console.log(`Fetching ESPN scores from: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'PickemApp/1.0',
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`ESPN API request failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`Successfully fetched ${data.events?.length || 0} games with scores from ESPN`);
  
  return data;
}

/**
 * Transforms ESPN scoreboard data to our live scores format
 * @param espnData ESPN API response
 * @param activeOnly If true, only return active/in-progress games
 * @returns Array of LiveScore objects
 */
function transformESPNScores(espnData: ESPNScoreboardResponse, activeOnly: boolean = false): LiveScore[] {
  if (!espnData.events || espnData.events.length === 0) {
    console.log('No games found in ESPN scores data');
    return [];
  }
  
  return espnData.events
    .filter(game => {
      if (!activeOnly) return true;
      
      // Only return active games (in-progress, not pre-game or final)
      const competition = game.competitions[0];
      const status = competition.status;
      return !status.type.completed && status.type.state !== 'pre';
    })
    .map((game: ESPNGame): LiveScore => {
      const competition = game.competitions[0];
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
      
      if (!homeTeam || !awayTeam) {
        throw new Error(`Invalid game data: missing home or away team for game ${game.id}`);
      }
      
      return {
        game_id: game.uid,
        espn_id: game.id,
        status: {
          type: competition.status.type.name,
          detail: competition.status.type.detail,
          completed: competition.status.type.completed,
          clock: competition.status.displayClock,
          period: competition.status.period,
        },
        home_team: {
          id: homeTeam.team.id,
          abbreviation: homeTeam.team.abbreviation,
          display_name: homeTeam.team.displayName,
          score: parseInt(homeTeam.score) || 0,
          winner: homeTeam.winner || false,
          linescores: homeTeam.linescores?.map(ls => ls.value) || [],
        },
        away_team: {
          id: awayTeam.team.id,
          abbreviation: awayTeam.team.abbreviation,
          display_name: awayTeam.team.displayName,
          score: parseInt(awayTeam.score) || 0,
          winner: awayTeam.winner || false,
          linescores: awayTeam.linescores?.map(ls => ls.value) || [],
        },
        last_updated: new Date().toISOString(),
        quarter_scores: [
          homeTeam.linescores?.map(ls => ls.value) || [],
          awayTeam.linescores?.map(ls => ls.value) || []
        ].filter(qs => qs.length > 0)
      };
    });
}

/**
 * Stores live scores data to temporary file for ETL processing
 * @param scores Array of live score data
 * @param week Week number
 * @param seasonType Season type
 * @param year Season year
 */
async function storeScoresData(
  scores: LiveScore[],
  week: number,
  seasonType: string,
  year: number
): Promise<void> {
  const filePath = process.env.DATA_FILE_PATH || '/tmp/scores-data.json';
  
  const activeGames = scores.filter(s => !s.status.completed);
  const completedGames = scores.filter(s => s.status.completed);
  
  const scoresData = {
    meta: {
      export_date: new Date().toISOString(),
      week,
      season_type: seasonType,
      year,
      total_games: scores.length,
      active_games: activeGames.length,
      completed_games: completedGames.length,
      last_updated: new Date().toISOString()
    },
    scores
  };
  
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(scoresData, null, 2), 'utf8');
    console.log(`Successfully stored scores data to file: ${filePath}`);
  } catch (error) {
    console.error('Failed to store scores data to file:', error);
    throw error;
  }
}

/**
 * Gets scores data from temporary file if it exists
 * @param week Week number
 * @param seasonType Season type
 * @param year Season year
 * @returns Existing scores data or null if not found
 */
async function getExistingScoresData(
  week: number,
  seasonType: string,
  year: number
): Promise<LiveScore[] | null> {
  const filePath = process.env.DATA_FILE_PATH || '/tmp/scores-data.json';
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`No existing scores found for ${seasonType} week ${week}, ${year}`);
      return null;
    }
    
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Check if the data is for the requested week/season
    if (data.meta && 
        data.meta.week === week && 
        data.meta.season_type === seasonType && 
        data.meta.year === year) {
      return data.scores || [];
    }
    
    return null;
  } catch (error: any) {
    console.log(`No existing scores found for ${seasonType} week ${week}, ${year}`);
    return null;
  }
}

/**
 * Compares two score datasets to detect changes
 * @param oldScores Existing score data
 * @param newScores New score data
 * @returns True if scores data has changed
 */
function hasScoresChanged(oldScores: LiveScore[], newScores: LiveScore[]): boolean {
  if (oldScores.length !== newScores.length) {
    return true;
  }
  
  // Sort both arrays by game ID for comparison
  const sortedOld = [...oldScores].sort((a, b) => a.espn_id.localeCompare(b.espn_id));
  const sortedNew = [...newScores].sort((a, b) => a.espn_id.localeCompare(b.espn_id));
  
  for (let i = 0; i < sortedOld.length; i++) {
    const oldGame = sortedOld[i];
    const newGame = sortedNew[i];
    
    // Check for score changes or status changes
    if (
      oldGame.home_team.score !== newGame.home_team.score ||
      oldGame.away_team.score !== newGame.away_team.score ||
      oldGame.status.type !== newGame.status.type ||
      oldGame.status.period !== newGame.status.period ||
      oldGame.status.clock !== newGame.status.clock ||
      oldGame.status.completed !== newGame.status.completed
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * ETL handler function for live scores processing
 * Called directly by the main scheduler function
 */
export const handler = async (
  request: ScoresRequest,
  context: Context
): Promise<ETLResult> => {
  console.log('getLiveScores ETL function invoked', { 
    requestId: context.awsRequestId,
    request
  });
  
  try {
    const { week, seasonType, year, activeOnly = false } = request;
    
    console.log(`Processing live scores ETL for ${seasonType} week ${week}, ${year}`, {
      activeOnly
    });
    
    // Always fetch fresh scores data (scores change frequently during games)
    console.log('Fetching fresh scores data from ESPN API');
    const espnData = await fetchESPNScores(week, seasonType, year);
    let scores = transformESPNScores(espnData, activeOnly);
    
    // Check if data has actually changed before storing
    const existingScores = await getExistingScoresData(week, seasonType, year);
    if (!existingScores || hasScoresChanged(existingScores, scores)) {
      await storeScoresData(scores, week, seasonType, year);
      console.log(`Updated scores data for ${seasonType} week ${week}, ${year}`);
    } else {
      console.log('No score changes detected, skipping file update');
      scores = existingScores;
    }
    
    const activeGames = scores.filter(s => !s.status.completed);
    const completedGames = scores.filter(s => s.status.completed);
    
    // Return ETL result
    return {
      success: true,
      data: scores,
      meta: {
        week,
        season_type: seasonType,
        year,
        total_games: scores.length,
        active_games: activeGames.length,
        completed_games: completedGames.length,
        last_updated: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error in getLiveScores ETL function:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Legacy HTTP handler wrapper (if needed for testing)
 */
export const httpHandler = async (event: any, context: Context) => {
  const currentWeekInfo = getCurrentNFLWeek();
  const body = event.body ? JSON.parse(event.body) : {};
  const queryParams = event.queryStringParameters || {};
  const requestParams = { ...queryParams, ...body };
  
  const request: ScoresRequest = {
    week: parseInt(requestParams.week || '') || currentWeekInfo.week,
    seasonType: requestParams.seasonType || currentWeekInfo.seasonType,
    year: parseInt(requestParams.year || '') || currentWeekInfo.year,
    activeOnly: requestParams.activeOnly === true || String(requestParams.activeOnly) === 'true'
  };
  
  const result = await handler(request, context);
  
  if (result.success) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } else {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: result.error })
    };
  }
};