import { createClient } from 'npm:@supabase/supabase-js@2'

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

// Transform database game to frontend format
function transformGame(dbGame: any, teams: Map<number, any>): Game {
  const homeTeam = teams.get(dbGame.home_team_id)
  const awayTeam = teams.get(dbGame.away_team_id)
  
  if (!homeTeam || !awayTeam) {
    throw new Error(`Missing team data for game ${dbGame.id}`)
  }
  
  return {
    id: dbGame.id,
    espn_id: dbGame.espn_id,
    week: dbGame.week,
    season_year: dbGame.season_year,
    season_type: dbGame.season_type,
    date: dbGame.game_date,
    home_team: {
      id: homeTeam.id,
      espn_id: homeTeam.espn_id,
      name: homeTeam.name,
      location: homeTeam.location,
      display_name: homeTeam.display_name,
      abbreviation: homeTeam.abbreviation,
      color: cleanHexColor(homeTeam.primary_color),
      alternate_color: cleanHexColor(homeTeam.secondary_color),
      logo_url: homeTeam.logo_url || ''
    },
    away_team: {
      id: awayTeam.id,
      espn_id: awayTeam.espn_id,
      name: awayTeam.name,
      location: awayTeam.location,
      display_name: awayTeam.display_name,
      abbreviation: awayTeam.abbreviation,
      color: cleanHexColor(awayTeam.primary_color),
      alternate_color: cleanHexColor(awayTeam.secondary_color),
      logo_url: awayTeam.logo_url || ''
    },
    home_score: dbGame.home_score,
    away_score: dbGame.away_score,
    status: dbGame.status,
    status_detail: dbGame.game_status_detail
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

// Main cache generation function
async function generateCache(supabase: any) {
  try {
    console.log('Starting cache generation...')
    
    // Fetch all teams
    const { data: dbTeams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('is_active', true)
      .order('display_name')
    
    if (teamsError) throw teamsError
    
    // Transform teams
    const teams = dbTeams.map(transformTeam)
    const teamMap = new Map(dbTeams.map((t: any) => [t.id, t]))
    
    // Fetch current season games
    const currentYear = new Date().getFullYear()
    const { data: dbGames, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .eq('season_year', currentYear)
      .eq('season_type', 'regular')
      .order('game_date')
    
    if (gamesError) throw gamesError
    
    // Transform games
    const games = dbGames.map((game: any) => transformGame(game, teamMap))
    
    // Organize games by week
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
        current_season: currentYear,
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
    
    console.log(`Cache generated successfully: ${fileName}`)
    
    return {
      cache_version: cacheData.meta.cache_version,
      file_name: fileName,
      teams_count: teams.length,
      games_count: games.length,
      weeks_available: availableWeeks,
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
    
    console.log('Starting cache generation...', body)
    
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