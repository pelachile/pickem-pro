import { createClient } from 'npm:@supabase/supabase-js@2'

// NFL Calendar utilities for determining current week, season type, and year
interface NFLWeekInfo {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  seasonYear: number;
}

function getCurrentNFLWeek(): NFLWeekInfo {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  // NFL season year is the year the season starts (e.g., 2025 season runs Aug 2025 - Feb 2026)
  let seasonYear: number;
  let seasonType: 'preseason' | 'regular' | 'postseason';
  let week: number;

  if (currentMonth >= 8) {
    // August - December: current year season
    seasonYear = currentYear;
  } else {
    // January - July: previous year season (e.g., Jan 2026 is part of 2025 season)
    seasonYear = currentYear - 1;
  }

  // For development/testing: if we're in August 2025, assume preseason week 3
  if (currentYear === 2025 && currentMonth === 8 && currentDay >= 24) {
    return {
      week: 3,
      seasonType: 'preseason',
      seasonYear: 2025
    };
  }

  // Determine season type and week based on month and day
  if (currentMonth === 8) {
    // August: Preseason
    seasonType = 'preseason';
    if (currentDay <= 15) {
      week = 1;
    } else if (currentDay <= 22) {
      week = 2;
    } else {
      week = 3;
    }
  } else if (currentMonth >= 9 || (currentMonth === 1 && currentDay <= 7)) {
    // September - December or early January: Regular season
    seasonType = 'regular';
    
    if (currentMonth === 9) {
      // September weeks 1-4
      if (currentDay <= 7) week = 1;
      else if (currentDay <= 14) week = 2;
      else if (currentDay <= 21) week = 3;
      else week = 4;
    } else if (currentMonth === 10) {
      // October weeks 5-8
      if (currentDay <= 7) week = 5;
      else if (currentDay <= 14) week = 6;
      else if (currentDay <= 21) week = 7;
      else week = 8;
    } else if (currentMonth === 11) {
      // November weeks 9-12
      if (currentDay <= 7) week = 9;
      else if (currentDay <= 14) week = 10;
      else if (currentDay <= 21) week = 11;
      else week = 12;
    } else if (currentMonth === 12) {
      // December weeks 13-17
      if (currentDay <= 7) week = 13;
      else if (currentDay <= 14) week = 14;
      else if (currentDay <= 21) week = 15;
      else if (currentDay <= 28) week = 16;
      else week = 17;
    } else {
      // Early January week 18
      week = 18;
    }
  } else {
    // January (after week 18) - February: Postseason
    seasonType = 'postseason';
    
    if (currentMonth === 1) {
      if (currentDay <= 14) week = 1; // Wild Card
      else if (currentDay <= 21) week = 2; // Divisional
      else if (currentDay <= 28) week = 3; // Conference Championships
      else week = 4; // Pro Bowl week
    } else {
      // February
      if (currentDay <= 14) week = 4; // Super Bowl
      else week = 1; // Offseason/Draft prep
    }
  }

  return {
    week,
    seasonType,
    seasonYear
  };
}

// ESPN API utility functions
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
    // ESPN preseason week mapping
    switch (week) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 4; // This is the key fix for ESPN mapping!
      default: return week;
    }
  }
  
  // Regular season and postseason map directly
  return week;
}

// Types matching your existing frontend types
interface Team {
  id: number
  espn_id: string
  name: string
  location: string
  nickname: string
  abbreviation: string
  display_name: string
  short_display_name: string
  color: string
  alternate_color: string
  slug: string
  conference: string
  division: string
  is_active: boolean
  logo_url: string
}

interface GameTeam {
  id: number
  espn_id: string
  name: string
  location: string
  display_name: string
  abbreviation: string
  color: string
  alternate_color: string
  logo_url: string
}

interface Game {
  id: string
  espn_id: string
  week: number
  season_year: number
  season_type: string
  date: string
  home_team: GameTeam
  away_team: GameTeam
  home_score?: number
  away_score?: number
  status: string
  status_detail?: string
}

interface CacheData {
  meta: {
    export_date: string
    total_teams: number
    total_games: number
    current_season: number
    weeks_available: number[]
    cache_version: string
  }
  teams: {
    all: Team[]
    by_conference: {
      AFC: {
        North: Team[]
        South: Team[]
        East: Team[]
        West: Team[]
      }
      NFC: {
        North: Team[]
        South: Team[]
        East: Team[]
        West: Team[]
      }
    }
  }
  schedule: {
    by_week: Record<number, Game[]>
    all_games: Game[]
  }
}

// Generate cache version based on timestamp
function generateCacheVersion(): string {
  return Date.now().toString(36)
}

// Clean and validate hex color
function cleanHexColor(color?: string): string {
  if (!color) return '000000'
  
  // Remove # if present
  let cleaned = color.replace('#', '')
  
  // Validate hex color (should be 3 or 6 characters)
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    console.warn(`Invalid color: ${color}, using default`)
    return '000000'
  }
  
  // Expand 3-digit hex to 6-digit
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('')
  }
  
  return cleaned
}

// Transform database team to frontend format
function transformTeam(dbTeam: any): Team {
  return {
    id: dbTeam.id,
    espn_id: dbTeam.espn_id,
    name: dbTeam.name,
    location: dbTeam.location,
    nickname: dbTeam.nickname,
    abbreviation: dbTeam.abbreviation,
    display_name: dbTeam.display_name,
    short_display_name: dbTeam.short_display_name,
    color: cleanHexColor(dbTeam.primary_color),
    alternate_color: cleanHexColor(dbTeam.secondary_color),
    slug: dbTeam.abbreviation.toLowerCase(),
    conference: dbTeam.conference,
    division: dbTeam.division,
    is_active: dbTeam.is_active,
    logo_url: dbTeam.logo_url || ''
  }
}

// Transform ESPN game data to our cache format
function transformESPNGame(espnEvent: any, teams: Map<string, any>, currentNFLWeek: NFLWeekInfo, dbGames?: any[]): Game {
  const competition = espnEvent.competitions?.[0]
  const homeCompetitor = competition?.competitors?.find((c: any) => c.homeAway === 'home')
  const awayCompetitor = competition?.competitors?.find((c: any) => c.homeAway === 'away')
  
  // Find teams by ESPN ID
  const homeTeam = teams.get(homeCompetitor?.team?.id)
  const awayTeam = teams.get(awayCompetitor?.team?.id)
  
  if (!homeTeam || !awayTeam) {
    console.warn(`Missing team data for ESPN game ${espnEvent.id}. Home: ${homeCompetitor?.team?.id}, Away: ${awayCompetitor?.team?.id}`)
    // Create fallback team data from ESPN
    const fallbackHome = homeTeam || {
      id: 0,
      espn_id: homeCompetitor?.team?.id || '',
      name: homeCompetitor?.team?.displayName || 'Unknown',
      location: homeCompetitor?.team?.location || 'Unknown',
      display_name: homeCompetitor?.team?.displayName || 'Unknown',
      abbreviation: homeCompetitor?.team?.abbreviation || 'UNK',
      primary_color: homeCompetitor?.team?.color || '000000',
      secondary_color: homeCompetitor?.team?.alternateColor || '000000',
      logo_url: homeCompetitor?.team?.logo || ''
    }
    const fallbackAway = awayTeam || {
      id: 0,
      espn_id: awayCompetitor?.team?.id || '',
      name: awayCompetitor?.team?.displayName || 'Unknown',
      location: awayCompetitor?.team?.location || 'Unknown',
      display_name: awayCompetitor?.team?.displayName || 'Unknown',
      abbreviation: awayCompetitor?.team?.abbreviation || 'UNK',
      primary_color: awayCompetitor?.team?.color || '000000',
      secondary_color: awayCompetitor?.team?.alternateColor || '000000',
      logo_url: awayCompetitor?.team?.logo || ''
    }
    
    return createGameFromESPNData(espnEvent, fallbackHome, fallbackAway, currentNFLWeek, dbGames)
  }
  
  return createGameFromESPNData(espnEvent, homeTeam, awayTeam, currentNFLWeek, dbGames)
}

// Helper function to create game object from ESPN data
function createGameFromESPNData(espnEvent: any, homeTeam: any, awayTeam: any, currentNFLWeek: NFLWeekInfo, dbGames?: any[]): Game {
  const competition = espnEvent.competitions?.[0]
  const homeCompetitor = competition?.competitors?.find((c: any) => c.homeAway === 'home')
  const awayCompetitor = competition?.competitors?.find((c: any) => c.homeAway === 'away')
  
  // Find matching database game by team IDs or ESPN ID for venue info
  const dbGame = dbGames?.find(game => 
    (game.home_team_id === homeTeam?.id && game.away_team_id === awayTeam?.id) ||
    (game.espn_id === espnEvent.id)
  )
  
  return {
    id: `espn-${espnEvent.id}`,
    espn_id: espnEvent.id,
    week: currentNFLWeek.week,
    season_year: currentNFLWeek.seasonYear,
    season_type: currentNFLWeek.seasonType,
    date: espnEvent.date,
    home_team: {
      id: homeTeam.id || 0,
      espn_id: homeTeam.espn_id || homeCompetitor?.team?.id || '',
      name: homeTeam.name || homeCompetitor?.team?.displayName || 'Unknown',
      location: homeTeam.location || homeCompetitor?.team?.location || 'Unknown',
      display_name: homeTeam.display_name || homeCompetitor?.team?.displayName || 'Unknown',
      abbreviation: homeTeam.abbreviation || homeCompetitor?.team?.abbreviation || 'UNK',
      color: cleanHexColor(homeTeam.primary_color || homeCompetitor?.team?.color),
      alternate_color: cleanHexColor(homeTeam.secondary_color || homeCompetitor?.team?.alternateColor),
      logo_url: homeTeam.logo_url || homeCompetitor?.team?.logo || ''
    },
    away_team: {
      id: awayTeam.id || 0,
      espn_id: awayTeam.espn_id || awayCompetitor?.team?.id || '',
      name: awayTeam.name || awayCompetitor?.team?.displayName || 'Unknown',
      location: awayTeam.location || awayCompetitor?.team?.location || 'Unknown',
      display_name: awayTeam.display_name || awayCompetitor?.team?.displayName || 'Unknown',
      abbreviation: awayTeam.abbreviation || awayCompetitor?.team?.abbreviation || 'UNK',
      color: cleanHexColor(awayTeam.primary_color || awayCompetitor?.team?.color),
      alternate_color: cleanHexColor(awayTeam.secondary_color || awayCompetitor?.team?.alternateColor),
      logo_url: awayTeam.logo_url || awayCompetitor?.team?.logo || ''
    },
    home_score: homeCompetitor?.score ? parseInt(homeCompetitor.score) : undefined,
    away_score: awayCompetitor?.score ? parseInt(awayCompetitor.score) : undefined,
    status: espnEvent.status?.type?.name || 'scheduled',
    status_detail: espnEvent.status?.type?.detail || '',
    venue_name: dbGame?.venue_name || null
  }
}

// Fetch games from ESPN API for current week
async function fetchESPNGames(currentNFLWeek: NFLWeekInfo): Promise<any[]> {
  const espnWeek = getESPNWeekNumber(currentNFLWeek.week, currentNFLWeek.seasonType)
  const seasonType = getESPNSeasonType(currentNFLWeek.seasonType)
  
  const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${espnWeek}&seasontype=${seasonType}&year=${currentNFLWeek.seasonYear}`
  
  
  // Call ESPN API with timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
  
  try {
    const response = await fetch(espnUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PickEmApp/1.0)',
        'Accept': 'application/json',
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`ESPN API failed: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return data.events || []
    
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('ESPN API request timed out')
    }
    throw error
  }
}

// Organize teams by conference and division
function organizeTeamsByConference(teams: Team[]) {
  const organized: CacheData['teams']['by_conference'] = {
    AFC: { North: [], South: [], East: [], West: [] },
    NFC: { North: [], South: [], East: [], West: [] }
  }
  
  teams.forEach(team => {
    if (team.conference === 'AFC' || team.conference === 'NFC') {
      const conference = team.conference as 'AFC' | 'NFC'
      const division = team.division as 'North' | 'South' | 'East' | 'West'
      
      if (organized[conference][division]) {
        organized[conference][division].push(team)
      }
    }
  })
  
  return organized
}

// Upload JSON to Supabase Storage
async function uploadToStorage(supabase: any, fileName: string, data: any) {
  const jsonData = JSON.stringify(data, null, 2)
  
  // Upload to storage
  const { data: uploadData, error } = await supabase.storage
    .from('cache')
    .upload(fileName, new Blob([jsonData], { type: 'application/json' }), {
      upsert: true,
      contentType: 'application/json'
    })
  
  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`)
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('cache')
    .getPublicUrl(fileName)
  
  return {
    path: uploadData.path,
    url: urlData.publicUrl,
    size: jsonData.length
  }
}

// Main cache generation function - now uses ESPN API for live game data
async function generateCache(supabase: any) {
  try {
    
    // Fetch all teams from database (teams remain in DB)
    const { data: dbTeams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('is_active', true)
      .order('display_name')
    
    if (teamsError) throw teamsError
    
    // Transform teams and create ESPN ID mapping
    const teams = dbTeams.map(transformTeam)
    const espnTeamMap = new Map(dbTeams.map((t: any) => [t.espn_id, t]))
    
    // Get current NFL week info
    const currentNFLWeek = getCurrentNFLWeek()
    
    // Fetch database games for venue info
    const { data: dbGames, error: gamesError } = await supabase
      .from('games')
      .select('id, espn_id, home_team_id, away_team_id, venue_name, week, season_year')
      .eq('week', currentNFLWeek.week)
      .eq('season_year', currentNFLWeek.seasonYear)
    
    if (gamesError) {
      console.warn('Could not fetch database games for venue info:', gamesError)
    }
    
    // Fetch current week games from ESPN API (LIVE DATA)
    const espnEvents = await fetchESPNGames(currentNFLWeek)
    
    if (espnEvents.length === 0) {
      console.warn('No games found from ESPN API - this may indicate an API issue or off-season')
    }
    
    // Transform ESPN games to our cache format
    const games = espnEvents.map((event: any) => 
      transformESPNGame(event, espnTeamMap, currentNFLWeek, dbGames || [])
    )
    
    
    // Organize games by week (currently just current week, but structure supports multiple)
    const gamesByWeek: Record<number, Game[]> = {}
    const availableWeeks: number[] = []
    
    games.forEach(game => {
      if (!gamesByWeek[game.week]) {
        gamesByWeek[game.week] = []
        availableWeeks.push(game.week)
      }
      gamesByWeek[game.week].push(game)
    })
    
    availableWeeks.sort((a, b) => a - b)
    
    // Build cache data structure
    const cacheData: CacheData = {
      meta: {
        export_date: new Date().toISOString(),
        total_teams: teams.length,
        total_games: games.length,
        current_season: currentNFLWeek.seasonYear,
        weeks_available: availableWeeks,
        cache_version: generateCacheVersion()
      },
      teams: {
        all: teams,
        by_conference: organizeTeamsByConference(teams)
      },
      schedule: {
        by_week: gamesByWeek,
        all_games: games
      }
    }
    
    // Upload to storage with cache-busting filename
    const fileName = `teams-and-schedule-v${cacheData.meta.cache_version}.json`
    const uploadResult = await uploadToStorage(supabase, fileName, cacheData)
    
    // Also upload as current version (for backwards compatibility)
    const currentResult = await uploadToStorage(supabase, 'teams-and-schedule.json', cacheData)
    
    
    return {
      cache_version: cacheData.meta.cache_version,
      file_name: fileName,
      teams_count: teams.length,
      games_count: games.length,
      weeks_available: availableWeeks,
      espn_source: true,
      current_nfl_week: currentNFLWeek,
      versioned_url: uploadResult.url,
      current_url: currentResult.url,
      file_size: uploadResult.size
    }
    
  } catch (error) {
    console.error('Cache generation failed:', error)
    throw error
  }
}

Deno.serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
      })
    }
    
    // Parse request body
    let body: any = {}
    try {
      if (req.method === 'POST') {
        body = await req.json()
      }
    } catch {
      // Handle GET requests or invalid JSON
    }
    
    
    const result = await generateCache(supabase)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cache generated successfully',
        timestamp: new Date().toISOString(),
        result
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
    console.error('Cache generation failed:', error)
    
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