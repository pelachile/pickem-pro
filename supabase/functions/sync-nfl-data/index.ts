import { createClient } from 'npm:@supabase/supabase-js@2'

// NFL Calendar utilities (same as generate-cache)
interface NFLWeekInfo {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  seasonYear: number;
  isDeadPeriod?: boolean;
  displayWeek?: number;
  displaySeasonType?: 'preseason' | 'regular' | 'postseason';
  deadPeriodReason?: string;
}

function getCurrentNFLWeek(): NFLWeekInfo {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  let seasonYear: number;
  let seasonType: 'preseason' | 'regular' | 'postseason';
  let week: number;

  if (currentMonth >= 8) {
    seasonYear = currentYear;
  } else {
    seasonYear = currentYear - 1;
  }

  // For development/testing: Enhanced logic for August 2025
  if (currentYear === 2025 && currentMonth === 8) {
    if (currentDay >= 25 && currentDay <= 31) {
      // Dead period between preseason and regular season (Aug 25-31)
      return {
        week: 1, // Next regular season week
        seasonType: 'regular',
        seasonYear: 2025,
        isDeadPeriod: true,
        displayWeek: 3, // Show last completed preseason week
        displaySeasonType: 'preseason',
        deadPeriodReason: 'Between preseason and regular season'
      };
    } else if (currentDay >= 21) {
      // Preseason week 3
      return {
        week: 3,
        seasonType: 'preseason',
        seasonYear: 2025
      };
    }
  }

  // Check for dead period between preseason and regular season (Aug 25 - Sep 3)
  if ((currentMonth === 8 && currentDay >= 25) || (currentMonth === 9 && currentDay <= 3)) {
    return {
      week: 1, // Next regular season week
      seasonType: 'regular',
      seasonYear: seasonYear,
      isDeadPeriod: true,
      displayWeek: 3, // Show last completed preseason week
      displaySeasonType: 'preseason',
      deadPeriodReason: 'Between preseason and regular season'
    };
  }

  // Determine season type and week based on month and day
  if (currentMonth === 8) {
    seasonType = 'preseason';
    if (currentDay <= 15) {
      week = 1;
    } else if (currentDay <= 22) {
      week = 2;
    } else {
      week = 3;
    }
  } else if (currentMonth >= 9 || (currentMonth === 1 && currentDay <= 7)) {
    seasonType = 'regular';
    // Simplified regular season week logic
    week = 1;
  } else {
    seasonType = 'postseason';
    week = 1;
  }

  return { week, seasonType, seasonYear };
}

function getESPNSeasonType(seasonType: string): string {
  switch (seasonType) {
    case 'preseason': return '1';
    case 'regular': return '2';
    case 'postseason': return '3';
    default: return '2';
  }
}

function getESPNWeekNumber(week: number, seasonType: string): number {
  if (seasonType === 'preseason') {
    switch (week) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 4; // ESPN mapping fix
      default: return week;
    }
  }
  return week;
}

// Helper functions to map ESPN data to our schema
function mapConference(espnConference?: string): string {
  if (!espnConference) return 'AFC' // default fallback
  
  if (espnConference.includes('American') || espnConference === 'AFC') {
    return 'AFC'
  } else if (espnConference.includes('National') || espnConference === 'NFC') {
    return 'NFC'
  }
  
  return 'AFC' // fallback
}

function mapDivision(espnDivision?: string): string {
  if (!espnDivision) return 'North' // default fallback
  
  if (espnDivision.includes('North')) return 'North'
  if (espnDivision.includes('South')) return 'South'
  if (espnDivision.includes('East')) return 'East'
  if (espnDivision.includes('West')) return 'West'
  
  return 'North' // fallback
}

// Types for ESPN API responses
interface ESPNTeam {
  id: string
  name: string
  location: string
  nickname: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  color: string
  alternateColor: string
  logos: Array<{ href: string }>
}

interface ESPNGame {
  id: string
  date: string
  week: { number: number }
  season: { year: number; type: number }
  competitions: Array<{
    competitors: Array<{
      team: ESPNTeam
      homeAway: 'home' | 'away'
      score: string
    }>
    status: {
      type: { name: string; state: string }
      displayClock: string
    }
  }>
}

// Helper function to retry API calls
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PickemApp/1.0)',
        },
      })
      
      if (response.ok) {
        return response
      }
      
      if (response.status === 429) {
        // Rate limited, wait before retry
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000))
        continue
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000))
    }
  }
  throw new Error('Max retries exceeded')
}

// Sync teams data from ESPN
async function syncTeams(supabase: any) {
  try {
    console.log('=== STARTING TEAM SYNC ====')
    console.log('Supabase client initialized:', !!supabase)
    
    // Test database connection and permissions
    console.log('Testing database connection...')
    const { data: testData, error: testError } = await supabase.auth.getUser()
    console.log('Auth test result:', { testData: !!testData, testError: testError?.message })
    
    console.log('Fetching teams from ESPN API...')
    const response = await fetchWithRetry('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams')
    const data = await response.json()
    
    const teams = data.sports[0].leagues[0].teams.map((teamData: any) => {
      const team = teamData.team
      return {
        espn_id: team.id,
        name: team.name,
        abbreviation: team.abbreviation,
        location: team.location,
        display_name: team.displayName,
        short_display_name: team.shortDisplayName,
        nickname: team.nickname,
        conference: mapConference(team.conference?.name),
        division: mapDivision(team.division?.name),
        logo_url: team.logos?.[0]?.href || null,
        primary_color: team.color ? `#${team.color}` : null,
        secondary_color: team.alternateColor ? `#${team.alternateColor}` : null,
        is_active: true,
        updated_at: new Date().toISOString()
      }
    })
    
    // Upsert teams (insert or update if exists)
    let successfulInserts = 0
    const errors = []
    
    console.log(`Attempting to upsert ${teams.length} teams...`)
    
    for (const team of teams) {
      console.log(`Upserting team: ${team.name} (${team.espn_id})`)
      console.log('Team data:', JSON.stringify(team, null, 2))
      
      const { data, error } = await supabase
        .from('teams')
        .upsert(team, { 
          onConflict: 'espn_id',
          ignoreDuplicates: false 
        })
        .select()
      
      if (error) {
        console.error(`ERROR upserting team ${team.name}:`, {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        errors.push(`${team.name}: ${error.message} (${error.code})`)
      } else {
        console.log(`SUCCESS: Upserted team ${team.name}, returned data:`, data)
        successfulInserts++
      }
    }
    
    console.log(`Team sync complete: ${successfulInserts}/${teams.length} successful`)
    if (errors.length > 0) {
      console.error('Team sync errors:', errors)
    }
    
    return { 
      teams: teams.length, 
      successful: successfulInserts,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error) {
    console.error('Error syncing teams:', error)
    throw error
  }
}

// Sync games data from ESPN
async function syncGames(supabase: any, week?: number, seasonYear?: number, seasonType?: string) {
  try {
    // Use NFL calendar logic if no parameters provided
    let currentNFLWeek: NFLWeekInfo;
    if (week && seasonYear) {
      currentNFLWeek = { 
        week, 
        seasonType: (seasonType as any) || 'regular', 
        seasonYear 
      };
    } else {
      currentNFLWeek = getCurrentNFLWeek();
    }
    
    // During dead period, sync the display week/season type
    const weekToSync = currentNFLWeek.isDeadPeriod ? currentNFLWeek.displayWeek! : currentNFLWeek.week;
    const seasonTypeToSync = currentNFLWeek.isDeadPeriod ? currentNFLWeek.displaySeasonType! : currentNFLWeek.seasonType;
    
    const espnWeek = getESPNWeekNumber(weekToSync, seasonTypeToSync);
    const seasonTypeParam = getESPNSeasonType(seasonTypeToSync);
    
    console.log(`Fetching games for ${currentNFLWeek.isDeadPeriod ? 'DEAD PERIOD - ' : ''}${seasonTypeToSync} week ${weekToSync} (ESPN week ${espnWeek}), season ${currentNFLWeek.seasonYear}...`);
    const response = await fetchWithRetry(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${espnWeek}&seasontype=${seasonTypeParam}&year=${currentNFLWeek.seasonYear}`
    )
    const data = await response.json()
    
    // Get team ID mappings
    const { data: teams } = await supabase
      .from('teams')
      .select('id, espn_id')
    
    const teamMap = new Map(teams.map((t: any) => [t.espn_id, t.id]))
    
    const games = data.events.map((event: ESPNGame) => {
      const competition = event.competitions[0]
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away')
      
      const homeTeamId = teamMap.get(homeTeam.team.id)
      const awayTeamId = teamMap.get(awayTeam.team.id)
      
      if (!homeTeamId || !awayTeamId) {
        console.warn(`Missing team mapping for game ${event.id}`)
        return null
      }
      
      // Map ESPN status to our status
      let status = 'scheduled'
      const espnStatus = competition.status.type.state.toLowerCase()
      if (espnStatus === 'in') status = 'in_progress'
      else if (espnStatus === 'post') status = 'final'
      
      return {
        espn_id: event.id,
        week: currentNFLWeek.displayWeek || currentNFLWeek.week,
        season_year: currentNFLWeek.seasonYear,
        season_type: currentNFLWeek.displaySeasonType || currentNFLWeek.seasonType,
        game_date: new Date(event.date).toISOString(),
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_score: competition.status.type.state !== 'pre' ? parseInt(homeTeam.score) || 0 : null,
        away_score: competition.status.type.state !== 'pre' ? parseInt(awayTeam.score) || 0 : null,
        status,
        game_status_detail: competition.status.displayClock || null,
        updated_at: new Date().toISOString()
      }
    }).filter(Boolean)
    
    // Upsert games
    for (const game of games) {
      const { error } = await supabase
        .from('games')
        .upsert(game, { 
          onConflict: 'espn_id',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error(`Error upserting game ${game.espn_id}:`, error)
      }
    }
    
    console.log(`Successfully synced ${games.length} games for ${currentNFLWeek.isDeadPeriod ? 'DEAD PERIOD - ' : ''}${seasonTypeToSync} week ${weekToSync}`)
    return { 
      games: games.length, 
      week: currentNFLWeek.week,
      seasonType: currentNFLWeek.seasonType,
      isDeadPeriod: currentNFLWeek.isDeadPeriod,
      displayWeek: currentNFLWeek.displayWeek,
      displaySeasonType: currentNFLWeek.displaySeasonType
    }
  } catch (error) {
    console.error('Error syncing games:', error)
    throw error
  }
}

Deno.serve(async (req) => {
  try {
    console.log('=== SYNC NFL DATA REQUEST ====')
    console.log('Environment check:')
    console.log('- SUPABASE_URL exists:', !!Deno.env.get('SUPABASE_URL'))
    console.log('- SUPABASE_SERVICE_ROLE_KEY exists:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    console.log('- SUPABASE_SERVICE_ROLE_KEY starts with:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.substring(0, 20))
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { persistSession: false }
      }
    )
    
    console.log('Supabase client created successfully')
    
    // Handle CORS for browser requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
      })
    }
    
    // Parse request body for parameters
    let body: any = {}
    try {
      if (req.method === 'POST') {
        body = await req.json()
      }
    } catch {
      // Handle GET requests or invalid JSON
    }
    
    const { syncType = 'all', week, seasonYear } = body
    
    console.log(`Starting NFL data sync: ${syncType}`)
    const results: any = { timestamp: new Date().toISOString() }
    
    // Sync teams if requested
    if (syncType === 'all' || syncType === 'teams') {
      const teamResults = await syncTeams(supabase)
      results.teams = teamResults
    }
    
    // Sync games if requested
    if (syncType === 'all' || syncType === 'games') {
      const gameResults = await syncGames(supabase, week, seasonYear)
      results.games = gameResults
    }
    
    // Trigger cache regeneration after successful sync
    if (syncType === 'all' || syncType === 'games') {
      try {
        const cacheResponse = await supabase.functions.invoke('generate-cache', {
          body: { trigger: 'data-sync' }
        })
        results.cache_regenerated = cacheResponse.data ? true : false
      } catch (error) {
        console.warn('Failed to trigger cache regeneration:', error)
        results.cache_regenerated = false
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'NFL data sync completed successfully',
        results
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    )
    
  } catch (error) {
    console.error('NFL data sync failed:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      }
    )
  }
})