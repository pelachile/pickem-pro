import type { Context } from 'aws-lambda';
import * as fs from 'fs';
// File system operations for ETL pipeline - no S3 needed

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
    competitors: Array<{
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
    }>;
    notes: any[];
    status: {
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
    };
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

interface ESPNScheduleResponse {
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

interface PickemGame {
  id: string;
  espn_id: string;
  week: number;
  season: number;
  season_type: string;
  date: string;
  status: string;
  home_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    color: string;
    logo_url: string;
  };
  away_team: {
    id: string;
    abbreviation: string;
    display_name: string;
    color: string;
    logo_url: string;
  };
  home_score: number | null;
  away_score: number | null;
  quarter: number | null;
  clock: string | null;
  broadcasts: string[];
  spread: {
    home: number;
    away: number;
  } | null;
}

interface ScheduleRequest {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  year: number;
  forceRefresh?: boolean;
}

interface ETLResult {
  success: boolean;
  data?: PickemGame[];
  error?: string;
  meta?: {
    week: number;
    season_type: string;
    year: number;
    total_games: number;
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
  // Week 1 preseason usually starts around August 1st
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
 * Maps NFL week number to ESPN week number based on season type
 * @param week Traditional NFL week number
 * @param seasonType Type of season (preseason, regular, postseason)
 * @returns ESPN week number
 */
function mapToESPNWeek(week: number, seasonType: string): number {
  if (seasonType === 'preseason') {
    // ESPN preseason weeks are offset by +1
    // Traditional preseason week 1 = ESPN week 2
    // Traditional preseason week 2 = ESPN week 3
    // Traditional preseason week 3 = ESPN week 4
    return week + 1;
  }
  
  // Regular season and postseason use week numbers as-is
  return week;
}

/**
 * Fetches NFL schedule data from ESPN API
 * @param week Week number (traditional NFL week numbering)
 * @param seasonType Type of season (preseason, regular, postseason)
 * @param year Season year
 * @returns Promise<ESPNScheduleResponse>
 */
async function fetchESPNSchedule(
  week: number,
  seasonType: string,
  year: number
): Promise<ESPNScheduleResponse> {
  const seasonTypeMap = {
    'preseason': 1,
    'regular': 2,
    'postseason': 3
  };
  
  const seasonTypeId = seasonTypeMap[seasonType as keyof typeof seasonTypeMap] || 2;
  const espnWeek = mapToESPNWeek(week, seasonType);
  const baseUrl = process.env.ESPN_API_BASE_URL || 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
  
  const url = `${baseUrl}/scoreboard?limit=1000&dates=${year}&seasontype=${seasonTypeId}&week=${espnWeek}`;
  
  console.log(`Fetching ESPN schedule from: ${url} (Traditional week ${week} -> ESPN week ${espnWeek})`);
  
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
  console.log(`Successfully fetched ${data.events?.length || 0} games from ESPN`);
  
  return data;
}

/**
 * Transforms ESPN API response to our application format
 * @param espnData ESPN API response
 * @returns Array of PickemGame objects
 */
function transformESPNData(espnData: ESPNScheduleResponse): PickemGame[] {
  if (!espnData.events || espnData.events.length === 0) {
    console.log('No events found in ESPN data');
    return [];
  }
  
  return espnData.events.map((game: ESPNGame): PickemGame => {
    const competition = game.competitions[0];
    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
    
    if (!homeTeam || !awayTeam) {
      throw new Error(`Invalid game data: missing home or away team for game ${game.id}`);
    }
    
    // Extract broadcast information
    const broadcasts = competition.broadcasts
      ?.flatMap(b => b.names)
      .filter(name => name && name !== 'undefined') || [];
    
    return {
      id: game.uid,
      espn_id: game.id,
      week: game.week.number,
      season: game.season.year,
      season_type: game.season.type === 1 ? 'preseason' : 
                   game.season.type === 3 ? 'postseason' : 'regular',
      date: game.date,
      status: competition.status.type.name,
      home_team: {
        id: homeTeam.team.id,
        abbreviation: homeTeam.team.abbreviation,
        display_name: homeTeam.team.displayName,
        color: homeTeam.team.color,
        logo_url: homeTeam.team.logo,
      },
      away_team: {
        id: awayTeam.team.id,
        abbreviation: awayTeam.team.abbreviation,
        display_name: awayTeam.team.displayName,
        color: awayTeam.team.color,
        logo_url: awayTeam.team.logo,
      },
      home_score: homeTeam.score ? parseInt(homeTeam.score) : null,
      away_score: awayTeam.score ? parseInt(awayTeam.score) : null,
      quarter: competition.status.period || null,
      clock: competition.status.displayClock || null,
      broadcasts,
      spread: null, // ESPN doesn't provide spread data in this endpoint
    };
  });
}

/**
 * Stores schedule data to temporary file for ETL processing
 * @param data Transformed game data
 * @param week Week number
 * @param seasonType Season type
 * @param year Season year
 */
async function storeScheduleData(
  data: PickemGame[],
  week: number,
  seasonType: string,
  year: number
): Promise<void> {
  const filePath = process.env.DATA_FILE_PATH || '/tmp/schedule-data.json';
  
  const scheduleData = {
    meta: {
      export_date: new Date().toISOString(),
      week,
      season_type: seasonType,
      year,
      total_games: data.length,
      last_updated: new Date().toISOString()
    },
    games: data
  };
  
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(scheduleData, null, 2), 'utf8');
    console.log(`Successfully stored schedule data to file: ${filePath}`);
  } catch (error) {
    console.error('Failed to store schedule data to file:', error);
    throw error;
  }
}

/**
 * Gets schedule data from temporary file if it exists
 * @param week Week number
 * @param seasonType Season type
 * @param year Season year
 * @returns Existing data or null if not found
 */
async function getExistingScheduleData(
  week: number,
  seasonType: string,
  year: number
): Promise<PickemGame[] | null> {
  const filePath = process.env.DATA_FILE_PATH || '/tmp/schedule-data.json';
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`No existing schedule found for ${seasonType} week ${week}, ${year}`);
      return null;
    }
    
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Check if the data is for the requested week/season
    if (data.meta && 
        data.meta.week === week && 
        data.meta.season_type === seasonType && 
        data.meta.year === year) {
      return data.games || [];
    }
    
    return null;
  } catch (error: any) {
    console.log(`No existing schedule found for ${seasonType} week ${week}, ${year}`);
    return null;
  }
}

/**
 * Compares two game datasets to detect changes
 * @param oldData Existing game data
 * @param newData New game data
 * @returns True if data has changed
 */
function hasScheduleChanged(oldData: PickemGame[], newData: PickemGame[]): boolean {
  if (oldData.length !== newData.length) {
    return true;
  }
  
  // Sort both arrays by game ID for comparison
  const sortedOld = [...oldData].sort((a, b) => a.espn_id.localeCompare(b.espn_id));
  const sortedNew = [...newData].sort((a, b) => a.espn_id.localeCompare(b.espn_id));
  
  for (let i = 0; i < sortedOld.length; i++) {
    const oldGame = sortedOld[i];
    const newGame = sortedNew[i];
    
    // Check for significant changes
    if (
      oldGame.date !== newGame.date ||
      oldGame.status !== newGame.status ||
      oldGame.home_score !== newGame.home_score ||
      oldGame.away_score !== newGame.away_score ||
      oldGame.quarter !== newGame.quarter ||
      oldGame.clock !== newGame.clock
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * ETL handler function for game schedule processing
 * Called directly by the main scheduler function
 */
export const handler = async (
  request: ScheduleRequest,
  context: Context
): Promise<ETLResult> => {
  console.log('getGameSchedule ETL function invoked', { 
    requestId: context.awsRequestId,
    request
  });
  
  try {
    const { week, seasonType, year, forceRefresh = false } = request;
    
    console.log(`Processing ETL for ${seasonType} week ${week}, ${year}`, {
      forceRefresh
    });
    
    // Check for existing data unless force refresh is requested
    let shouldUpdate = forceRefresh;
    if (!shouldUpdate) {
      const existingData = await getExistingScheduleData(week, seasonType, year);
      shouldUpdate = existingData === null;
    }
    
    let games: PickemGame[] = [];
    
    if (shouldUpdate) {
      // Fetch fresh data from ESPN
      console.log('Fetching fresh data from ESPN API');
      const espnData = await fetchESPNSchedule(week, seasonType, year);
      games = transformESPNData(espnData);
      
      // Check if data has actually changed before storing
      const existingData = await getExistingScheduleData(week, seasonType, year);
      if (!existingData || hasScheduleChanged(existingData, games)) {
        await storeScheduleData(games, week, seasonType, year);
        console.log(`Updated schedule data for ${seasonType} week ${week}, ${year}`);
      } else {
        console.log('No changes detected, skipping file update');
        games = existingData;
      }
    } else {
      // Use existing data
      const existingData = await getExistingScheduleData(week, seasonType, year);
      games = existingData || [];
      console.log(`Using existing schedule data for ${seasonType} week ${week}, ${year}`);
    }
    
    // Return ETL result
    return {
      success: true,
      data: games,
      meta: {
        week,
        season_type: seasonType,
        year,
        total_games: games.length,
        last_updated: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error in getGameSchedule ETL function:', error);
    
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
  
  const request: ScheduleRequest = {
    week: parseInt(requestParams.week || '') || currentWeekInfo.week,
    seasonType: requestParams.seasonType || currentWeekInfo.seasonType,
    year: parseInt(requestParams.year || '') || currentWeekInfo.year,
    forceRefresh: requestParams.forceRefresh === true || String(requestParams.forceRefresh) === 'true'
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