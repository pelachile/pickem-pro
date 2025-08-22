import type { Context } from 'aws-lambda';
import * as fs from 'fs';

// File system operations for ETL pipeline - no S3 needed

interface ESPNTeam {
  id: string;
  uid: string;
  slug: string;
  location: string;
  name: string;
  nickname: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  isActive: boolean;
  isAllStar: boolean;
  logos: Array<{
    href: string;
    alt: string;
    rel: string[];
    width: number;
    height: number;
  }>;
  record?: {
    items: Array<{
      description: string;
      type: string;
      summary: string;
    }>;
  };
  groups?: {
    id: string;
    parent: {
      id: string;
    };
    isConference: boolean;
  };
  venue?: {
    id: string;
    fullName: string;
    address: {
      city: string;
      state: string;
    };
    capacity: number;
    grass: boolean;
  };
}

interface ESPNTeamsResponse {
  sports: Array<{
    leagues: Array<{
      id: string;
      name: string;
      abbreviation: string;
      teams: ESPNTeam[];
    }>;
  }>;
}

interface PickemTeam {
  id: number;
  espn_id: string;
  name: string;
  location: string;
  nickname: string;
  abbreviation: string;
  display_name: string;
  short_display_name: string;
  color: string;
  alternate_color: string;
  slug: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  is_active: boolean;
  logo_url: string;
  venue?: {
    name: string;
    city: string;
    state: string;
    capacity: number;
    surface: string;
  };
  record?: {
    wins: number;
    losses: number;
    ties: number;
    win_percentage: number;
  };
}

interface TeamInfoRequest {
  teamId?: string;
  forceRefresh?: boolean;
}

interface ETLResult {
  success: boolean;
  data?: {
    teams: {
      all: PickemTeam[];
      by_conference: {
        AFC: PickemTeam[];
        NFC: PickemTeam[];
      };
      by_division: Record<string, PickemTeam[]>;
    };
  };
  error?: string;
  meta?: {
    total_teams: number;
    last_updated: string;
  };
}

/**
 * Fetches all NFL teams from ESPN API
 * @returns Promise<ESPNTeamsResponse>
 */
async function fetchESPNTeams(): Promise<ESPNTeamsResponse> {
  const baseUrl = process.env.ESPN_API_BASE_URL || 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
  const url = `${baseUrl}/teams`;
  
  console.log(`Fetching NFL teams from ESPN: ${url}`);
  
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
  console.log(`Successfully fetched ${data.sports?.[0]?.leagues?.[0]?.teams?.length || 0} teams from ESPN`);
  
  return data;
}

/**
 * Gets the best logo URL from the logos array
 * @param logos Array of logo objects
 * @returns Best logo URL
 */
function getBestLogoUrl(logos: ESPNTeam['logos']): string {
  if (!logos || logos.length === 0) {
    return '';
  }
  
  // Prefer dark logos, then any logo
  const darkLogo = logos.find(logo => logo.rel.includes('dark'));
  if (darkLogo) {
    return darkLogo.href;
  }
  
  return logos[0]?.href || '';
}

/**
 * Determines conference and division from ESPN team data
 * @param team ESPN team object
 * @returns Conference and division
 */
function getConferenceDivision(team: ESPNTeam): { conference: 'AFC' | 'NFC'; division: 'North' | 'South' | 'East' | 'West' } {
  // ESPN uses groups to indicate conference/division
  // This is a mapping based on known NFL structure
  const teamMappings: Record<string, { conference: 'AFC' | 'NFC'; division: 'North' | 'South' | 'East' | 'West' }> = {
    'BAL': { conference: 'AFC', division: 'North' },
    'CIN': { conference: 'AFC', division: 'North' },
    'CLE': { conference: 'AFC', division: 'North' },
    'PIT': { conference: 'AFC', division: 'North' },
    'HOU': { conference: 'AFC', division: 'South' },
    'IND': { conference: 'AFC', division: 'South' },
    'JAX': { conference: 'AFC', division: 'South' },
    'TEN': { conference: 'AFC', division: 'South' },
    'BUF': { conference: 'AFC', division: 'East' },
    'MIA': { conference: 'AFC', division: 'East' },
    'NE': { conference: 'AFC', division: 'East' },
    'NYJ': { conference: 'AFC', division: 'East' },
    'DEN': { conference: 'AFC', division: 'West' },
    'KC': { conference: 'AFC', division: 'West' },
    'LV': { conference: 'AFC', division: 'West' },
    'LAC': { conference: 'AFC', division: 'West' },
    'CHI': { conference: 'NFC', division: 'North' },
    'DET': { conference: 'NFC', division: 'North' },
    'GB': { conference: 'NFC', division: 'North' },
    'MIN': { conference: 'NFC', division: 'North' },
    'ATL': { conference: 'NFC', division: 'South' },
    'CAR': { conference: 'NFC', division: 'South' },
    'NO': { conference: 'NFC', division: 'South' },
    'TB': { conference: 'NFC', division: 'South' },
    'DAL': { conference: 'NFC', division: 'East' },
    'NYG': { conference: 'NFC', division: 'East' },
    'PHI': { conference: 'NFC', division: 'East' },
    'WSH': { conference: 'NFC', division: 'East' },
    'ARI': { conference: 'NFC', division: 'West' },
    'LAR': { conference: 'NFC', division: 'West' },
    'SF': { conference: 'NFC', division: 'West' },
    'SEA': { conference: 'NFC', division: 'West' },
  };
  
  return teamMappings[team.abbreviation] || { conference: 'AFC', division: 'North' };
}

/**
 * Extracts team record information
 * @param team ESPN team object
 * @returns Team record or null
 */
function extractTeamRecord(team: ESPNTeam): PickemTeam['record'] | null {
  if (!team.record?.items) {
    return null;
  }
  
  const overallRecord = team.record.items.find(item => item.type === 'total');
  if (!overallRecord) {
    return null;
  }
  
  const recordMatch = overallRecord.summary.match(/(\d+)-(\d+)(?:-(\d+))?/);
  if (!recordMatch) {
    return null;
  }
  
  const wins = parseInt(recordMatch[1]);
  const losses = parseInt(recordMatch[2]);
  const ties = parseInt(recordMatch[3] || '0');
  const totalGames = wins + losses + ties;
  
  return {
    wins,
    losses,
    ties,
    win_percentage: totalGames > 0 ? wins / totalGames : 0,
  };
}

/**
 * Transforms ESPN team data to our application format
 * @param espnData ESPN API response
 * @returns Array of PickemTeam objects
 */
function transformESPNTeams(espnData: ESPNTeamsResponse): PickemTeam[] {
  const nflLeague = espnData.sports?.[0]?.leagues?.[0];
  if (!nflLeague?.teams) {
    console.log('No NFL teams found in ESPN data');
    return [];
  }
  
  return nflLeague.teams
    .filter(team => team.isActive && !team.isAllStar)
    .map((team, index): PickemTeam => {
      const confDiv = getConferenceDivision(team);
      const record = extractTeamRecord(team);
      
      // Map ESPN logo to local image path
      const logoUrl = `/images/teams/${team.abbreviation.toLowerCase()}.png`;
      
      return {
        id: index + 1,
        espn_id: team.id,
        name: team.name,
        location: team.location,
        nickname: team.nickname || team.name,
        abbreviation: team.abbreviation,
        display_name: team.displayName,
        short_display_name: team.shortDisplayName,
        color: team.color ? `#${team.color}` : '#000000',
        alternate_color: team.alternateColor ? `#${team.alternateColor}` : '#ffffff',
        slug: team.slug,
        conference: confDiv.conference,
        division: confDiv.division,
        is_active: team.isActive,
        logo_url: logoUrl,
        venue: team.venue ? {
          name: team.venue.fullName,
          city: team.venue.address?.city || '',
          state: team.venue.address?.state || '',
          capacity: team.venue.capacity || 0,
          surface: team.venue.grass ? 'Grass' : 'Artificial'
        } : undefined,
        record: record || undefined
      };
    });
}

/**
 * Stores teams data to temporary file for ETL processing
 * @param teams Array of team data
 */
async function storeTeamsData(teams: PickemTeam[]): Promise<void> {
  const filePath = process.env.DATA_FILE_PATH || '/tmp/team-data.json';
  
  const teamsData = {
    meta: {
      export_date: new Date().toISOString(),
      total_teams: teams.length,
      last_updated: new Date().toISOString(),
      version: '2.0'
    },
    teams: {
      all: teams,
      by_conference: {
        AFC: teams.filter(t => t.conference === 'AFC'),
        NFC: teams.filter(t => t.conference === 'NFC')
      },
      by_division: teams.reduce((acc, team) => {
        const divisionKey = `${team.conference}_${team.division}`;
        if (!acc[divisionKey]) {
          acc[divisionKey] = [];
        }
        acc[divisionKey].push(team);
        return acc;
      }, {} as Record<string, PickemTeam[]>)
    }
  };
  
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(teamsData, null, 2), 'utf8');
    console.log(`Successfully stored teams data to file: ${filePath}`);
  } catch (error) {
    console.error('Failed to store teams data to file:', error);
    throw error;
  }
}

/**
 * Gets teams data from temporary file if it exists
 * @returns Existing teams data or null if not found
 */
async function getExistingTeamsData(): Promise<PickemTeam[] | null> {
  const filePath = process.env.DATA_FILE_PATH || '/tmp/team-data.json';
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log('No existing teams data found');
      return null;
    }
    
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return data.teams?.all || [];
  } catch (error: any) {
    console.log('No existing teams data found');
    return null;
  }
}

/**
 * Compares two team datasets to detect changes
 * @param oldTeams Existing team data
 * @param newTeams New team data
 * @returns True if teams data has changed
 */
function hasTeamsChanged(oldTeams: PickemTeam[], newTeams: PickemTeam[]): boolean {
  if (oldTeams.length !== newTeams.length) {
    return true;
  }
  
  // Sort both arrays by abbreviation for comparison
  const sortedOld = [...oldTeams].sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
  const sortedNew = [...newTeams].sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
  
  for (let i = 0; i < sortedOld.length; i++) {
    const oldTeam = sortedOld[i];
    const newTeam = sortedNew[i];
    
    // Check for significant changes (colors, names, records can change)
    if (
      oldTeam.abbreviation !== newTeam.abbreviation ||
      oldTeam.display_name !== newTeam.display_name ||
      oldTeam.color !== newTeam.color ||
      oldTeam.is_active !== newTeam.is_active ||
      JSON.stringify(oldTeam.record) !== JSON.stringify(newTeam.record)
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * ETL handler function for team information processing
 * Called directly by the main scheduler function
 */
export const handler = async (
  request: TeamInfoRequest,
  context: Context
): Promise<ETLResult> => {
  console.log('getTeamInfo ETL function invoked', { 
    requestId: context.awsRequestId,
    request
  });
  
  try {
    const { forceRefresh = false } = request;
    
    console.log('Processing team info ETL', { forceRefresh });
    
    // Check for existing data unless force refresh is requested
    let shouldUpdate = forceRefresh;
    if (!shouldUpdate) {
      const existingTeams = await getExistingTeamsData();
      shouldUpdate = existingTeams === null;
    }
    
    let teams: PickemTeam[] = [];
    
    if (shouldUpdate) {
      // Fetch fresh data from ESPN
      console.log('Fetching fresh teams data from ESPN API');
      const espnData = await fetchESPNTeams();
      teams = transformESPNTeams(espnData);
      
      // Check if data has actually changed before storing
      const existingTeams = await getExistingTeamsData();
      if (!existingTeams || hasTeamsChanged(existingTeams, teams)) {
        await storeTeamsData(teams);
        console.log('Updated teams data');
      } else {
        console.log('No changes detected, skipping file update');
        teams = existingTeams;
      }
    } else {
      // Use existing data
      const existingTeams = await getExistingTeamsData();
      teams = existingTeams || [];
      console.log('Using existing teams data');
    }
    
    // Return ETL result
    return {
      success: true,
      data: {
        teams: {
          all: teams,
          by_conference: {
            AFC: teams.filter(t => t.conference === 'AFC'),
            NFC: teams.filter(t => t.conference === 'NFC')
          },
          by_division: teams.reduce((acc, team) => {
            const divisionKey = `${team.conference}_${team.division}`;
            if (!acc[divisionKey]) {
              acc[divisionKey] = [];
            }
            acc[divisionKey].push(team);
            return acc;
          }, {} as Record<string, PickemTeam[]>)
        }
      },
      meta: {
        total_teams: teams.length,
        last_updated: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error in getTeamInfo ETL function:', error);
    
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
  const body = event.body ? JSON.parse(event.body) : {};
  const queryParams = event.queryStringParameters || {};
  const requestParams = { ...queryParams, ...body };
  
  const request: TeamInfoRequest = {
    teamId: requestParams.teamId,
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