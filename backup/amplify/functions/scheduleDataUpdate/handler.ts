import type { EventBridgeEvent, Context } from 'aws-lambda';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Lambda client outside handler for better cold start performance
const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION || 'us-west-2' });

// Define interfaces for ETL results from individual functions
interface TeamETLResult {
  success: boolean;
  data?: {
    teams: {
      all: any[];
      by_conference: { AFC: any[]; NFC: any[]; };
      by_division: Record<string, any[]>;
    };
  };
  error?: string;
  meta?: {
    total_teams: number;
    last_updated: string;
  };
}

interface ScheduleETLResult {
  success: boolean;
  data?: any[];
  error?: string;
  meta?: {
    week: number;
    season_type: string;
    year: number;
    total_games: number;
    last_updated: string;
  };
}

interface ScoresETLResult {
  success: boolean;
  data?: any[];
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

interface ScheduledUpdateEvent {
  version: string;
  id: string;
  'detail-type': string;
  source: string;
  account: string;
  time: string;
  region: string;
  detail: Record<string, any>;
}

interface UpdateResult {
  function_name: string;
  success: boolean;
  duration_ms: number;
  error?: string;
  data_summary?: {
    teams_updated?: boolean;
    games_updated?: number;
    scores_updated?: number;
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
 * Invokes a Lambda function directly for ETL processing
 * @param functionName Name of the Lambda function to invoke
 * @param payload Payload to send to the function
 * @returns Promise<UpdateResult>
 */
async function invokeLambdaFunction(
  functionName: string,
  payload: Record<string, any>
): Promise<UpdateResult> {
  const startTime = Date.now();
  
  try {
    console.log(`Invoking ETL function: ${functionName}`, payload);
    
    const command = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(payload), // Direct payload, no HTTP wrapping
    });
    
    const response = await lambdaClient.send(command);
    const duration = Date.now() - startTime;
    
    if (response.StatusCode !== 200) {
      throw new Error(`Function invocation failed with status code: ${response.StatusCode}`);
    }
    
    let responsePayload: any = {};
    if (response.Payload) {
      const payloadString = Buffer.from(response.Payload).toString('utf-8');
      responsePayload = JSON.parse(payloadString);
      
      if (!responsePayload.success) {
        throw new Error(`Function returned error: ${responsePayload.error || 'Unknown error'}`);
      }
    }
    
    console.log(`Successfully invoked ${functionName} in ${duration}ms`);
    
    return {
      function_name: functionName,
      success: true,
      duration_ms: duration,
      data_summary: extractDataSummary(functionName, responsePayload),
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`Error invoking ${functionName}:`, error);
    
    return {
      function_name: functionName,
      success: false,
      duration_ms: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Extracts data summary from function response
 * @param functionName Name of the function
 * @param responsePayload Response payload from the function
 * @returns Data summary object
 */
function extractDataSummary(
  functionName: string,
  responsePayload: any
): UpdateResult['data_summary'] {
  try {
    if (!responsePayload.success || !responsePayload.data) {
      return undefined;
    }
    
    const data = responsePayload.data;
    
    switch (functionName) {
      case 'getTeamInfo':
        return {
          teams_updated: data.teams?.all?.length > 0,
        };
        
      case 'getGameSchedule':
        return {
          games_updated: data.games?.length || 0,
        };
        
      case 'getLiveScores':
        return {
          scores_updated: data.scores?.length || 0,
        };
        
      default:
        return undefined;
    }
  } catch (error) {
    console.warn(`Failed to extract data summary for ${functionName}:`, error);
    return undefined;
  }
}

/**
 * Consolidates ETL data into the final teams-and-schedule.json file
 * @param teamsData Team data from getTeamInfo
 * @param scheduleData Schedule data from getGameSchedule
 * @param scoresData Scores data from getLiveScores
 * @param currentWeek Current week information
 */
async function consolidateDataToFile(
  teamsData: TeamETLResult | null,
  scheduleData: ScheduleETLResult | null,
  scoresData: ScoresETLResult | null,
  currentWeek: ReturnType<typeof getCurrentNFLWeek>
): Promise<void> {
  console.log('Consolidating ETL data into teams-and-schedule.json');
  
  try {
    // Build the consolidated data structure
    const consolidatedData = {
      meta: {
        export_date: new Date().toISOString(),
        total_teams: teamsData?.meta?.total_teams || 32,
        total_games: scheduleData?.meta?.total_games || 0,
        current_season: currentWeek.year,
        current_week: currentWeek.week,
        current_season_type: currentWeek.seasonType,
        weeks_available: [currentWeek.week],
        last_updated: new Date().toISOString(),
        version: '3.0' // ETL version
      },
      teams: teamsData?.data?.teams || {
        all: [],
        by_conference: { AFC: [], NFC: [] },
        by_division: {}
      },
      games: {
        [`${currentWeek.seasonType}_week_${currentWeek.week}`]: scheduleData?.data || [],
        scores: scoresData?.data || []
      },
      schedule: {
        current_week: currentWeek.week,
        current_season_type: currentWeek.seasonType,
        current_year: currentWeek.year,
        games: scheduleData?.data || []
      }
    };
    
    // Write to temporary file first
    const tempFilePath = process.env.DATA_FILE_PATH || '/tmp/teams-and-schedule.json';
    await fs.promises.writeFile(tempFilePath, JSON.stringify(consolidatedData, null, 2), 'utf8');
    
    console.log(`Successfully consolidated data to: ${tempFilePath}`);
    
    // If we have a public data path, also copy it there (for local development)
    const publicDataPath = process.env.PUBLIC_DATA_PATH;
    if (publicDataPath) {
      try {
        // Ensure directory exists
        const publicDir = path.dirname(publicDataPath);
        if (!fs.existsSync(publicDir)) {
          await fs.promises.mkdir(publicDir, { recursive: true });
        }
        
        // Copy the file
        await fs.promises.copyFile(tempFilePath, publicDataPath);
        console.log(`Successfully copied data to public path: ${publicDataPath}`);
      } catch (error) {
        console.warn('Could not copy to public path (normal in Lambda):', error);
      }
    }
    
  } catch (error) {
    console.error('Failed to consolidate data to file:', error);
    throw error;
  }
}

/**
 * Performs the complete data update sequence
 * @param currentWeek Current NFL week information
 * @returns Promise<UpdateResult[]>
 */
async function performDataUpdate(currentWeek: ReturnType<typeof getCurrentNFLWeek>): Promise<UpdateResult[]> {
  const results: UpdateResult[] = [];
  let teamsData: TeamETLResult | null = null;
  let scheduleData: ScheduleETLResult | null = null;
  let scoresData: ScoresETLResult | null = null;
  
  // 1. Update team information (less frequent, but foundation for other data)
  console.log('Step 1: Updating team information...');
  const teamInfoResult = await invokeLambdaFunction(
    process.env.GET_TEAM_INFO_FUNCTION_NAME || 'getTeamInfo',
    {
      forceRefresh: true
    }
  );
  results.push(teamInfoResult);
  if (teamInfoResult.success) {
    // Read team data from temp file for consolidation
    try {
      const teamFilePath = '/tmp/team-data.json';
      if (fs.existsSync(teamFilePath)) {
        const teamFileContent = await fs.promises.readFile(teamFilePath, 'utf8');
        const teamFileData = JSON.parse(teamFileContent);
        teamsData = {
          success: true,
          data: teamFileData.teams,
          meta: teamFileData.meta
        };
      }
    } catch (error) {
      console.warn('Could not read team data for consolidation:', error);
    }
  }
  
  // 2. Update current week's schedule
  console.log(`Step 2: Updating schedule for ${currentWeek.seasonType} week ${currentWeek.week}...`);
  const scheduleResult = await invokeLambdaFunction(
    process.env.GET_GAME_SCHEDULE_FUNCTION_NAME || 'getGameSchedule',
    {
      week: currentWeek.week,
      seasonType: currentWeek.seasonType,
      year: currentWeek.year,
      forceRefresh: true
    }
  );
  results.push(scheduleResult);
  if (scheduleResult.success) {
    // Read schedule data from temp file for consolidation
    try {
      const scheduleFilePath = '/tmp/schedule-data.json';
      if (fs.existsSync(scheduleFilePath)) {
        const scheduleFileContent = await fs.promises.readFile(scheduleFilePath, 'utf8');
        const scheduleFileData = JSON.parse(scheduleFileContent);
        scheduleData = {
          success: true,
          data: scheduleFileData.games,
          meta: scheduleFileData.meta
        };
      }
    } catch (error) {
      console.warn('Could not read schedule data for consolidation:', error);
    }
  }
  
  // 3. Update live scores for current week
  console.log(`Step 3: Updating live scores for ${currentWeek.seasonType} week ${currentWeek.week}...`);
  const scoresResult = await invokeLambdaFunction(
    process.env.GET_LIVE_SCORES_FUNCTION_NAME || 'getLiveScores',
    {
      week: currentWeek.week,
      seasonType: currentWeek.seasonType,
      year: currentWeek.year,
      activeOnly: false
    }
  );
  results.push(scoresResult);
  if (scoresResult.success) {
    // Read scores data from temp file for consolidation
    try {
      const scoresFilePath = '/tmp/scores-data.json';
      if (fs.existsSync(scoresFilePath)) {
        const scoresFileContent = await fs.promises.readFile(scoresFilePath, 'utf8');
        const scoresFileData = JSON.parse(scoresFileContent);
        scoresData = {
          success: true,
          data: scoresFileData.scores,
          meta: scoresFileData.meta
        };
      }
    } catch (error) {
      console.warn('Could not read scores data for consolidation:', error);
    }
  }
  
  // 4. Consolidate all data into final teams-and-schedule.json file
  console.log('Step 4: Consolidating data into final JSON file...');
  try {
    await consolidateDataToFile(teamsData, scheduleData, scoresData, currentWeek);
    console.log('Successfully consolidated all ETL data');
  } catch (error) {
    console.error('Failed to consolidate ETL data:', error);
    results.push({
      function_name: 'consolidateData',
      success: false,
      duration_ms: 0,
      error: error instanceof Error ? error.message : 'Unknown consolidation error'
    });
  }
  
  return results;
}

/**
 * Main Lambda handler for scheduled data updates
 */
export const handler = async (
  event: EventBridgeEvent<string, ScheduledUpdateEvent>,
  context: Context
): Promise<void> => {
  console.log('Scheduled data update function invoked', { 
    requestId: context.awsRequestId,
    event: JSON.stringify(event, null, 2)
  });
  
  const startTime = Date.now();
  
  try {
    // Determine current NFL week
    const currentWeek = getCurrentNFLWeek();
    console.log('Current NFL week info:', currentWeek);
    
    // Perform the complete data update
    const results = await performDataUpdate(currentWeek);
    
    // Calculate overall statistics
    const totalDuration = Date.now() - startTime;
    const successfulUpdates = results.filter(r => r.success).length;
    const failedUpdates = results.filter(r => !r.success).length;
    
    // Log results
    console.log('Data update completed', {
      total_duration_ms: totalDuration,
      successful_updates: successfulUpdates,
      failed_updates: failedUpdates,
      results: results.map(r => ({
        function: r.function_name,
        success: r.success,
        duration_ms: r.duration_ms,
        error: r.error,
        data_summary: r.data_summary
      }))
    });
    
    // Log individual results
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.function_name}: Success (${result.duration_ms}ms)`, result.data_summary);
      } else {
        console.error(`❌ ${result.function_name}: Failed (${result.duration_ms}ms) - ${result.error}`);
      }
    });
    
    // If there were any failures, log a warning but don't throw
    if (failedUpdates > 0) {
      console.warn(`${failedUpdates} out of ${results.length} data updates failed`);
    } else {
      console.log('All data updates completed successfully');
    }
    
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    
    console.error('Critical error in scheduled data update:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: totalDuration,
      requestId: context.awsRequestId
    });
    
    // Don't throw the error - we don't want the scheduled function to retry on systemic failures
    // Instead, log and allow the next scheduled run to try again
  }
};