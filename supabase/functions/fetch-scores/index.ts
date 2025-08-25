/**
 * ESPN API integration for NFL scores with cache update mechanism
 * Downloads existing cache file, updates with live ESPN data, and re-uploads to Supabase Storage
 */

import { createClient } from 'npm:@supabase/supabase-js@2'

// NFL Calendar utilities for determining current week, season type, and year
interface NFLWeekInfo {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  seasonYear: number;
}

// Types for cache data structure (matching generate-cache function)
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
    all: any[]
    by_conference: any
  }
  schedule: {
    by_week: Record<number, Game[]>
    all_games: Game[]
  }
}

function getCurrentNFLWeek(): NFLWeekInfo {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  // For development/testing: if we're in August 2025, assume preseason week 3
  if (currentYear === 2025 && currentMonth === 8 && currentDay >= 24) {
    return {
      week: 3,
      seasonType: 'preseason',
      seasonYear: 2025
    };
  }

  // NFL season year is the year the season starts (e.g., 2025 season runs Aug 2025 - Feb 2026)
  let seasonYear: number;
  let seasonType: 'preseason' | 'regular' | 'postseason';
  let week: number;

  if (currentMonth >= 8) {
    seasonYear = currentYear;
  } else {
    seasonYear = currentYear - 1;
  }

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
    week = Math.min(18, Math.ceil((currentDay + (currentMonth - 9) * 30) / 7));
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
    // ESPN preseason week mapping
    switch (week) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 4; // This is the key fix!
      default: return week;
    }
  }
  
  // Regular season and postseason map directly
  return week;
}

// Download cache file from Supabase Storage
async function downloadCacheFile(supabase: any, fileName: string): Promise<CacheData | null> {
  try {
    
    const { data, error } = await supabase.storage
      .from('cache')
      .download(fileName)
    
    if (error) {
      if (error.message.includes('not found')) {
        return null
      }
      throw new Error(`Failed to download cache file: ${error.message}`)
    }
    
    const text = await data.text()
    const cacheData = JSON.parse(text)
    
    return cacheData
    
  } catch (error) {
    return null
  }
}

// Upload updated cache file to Supabase Storage
async function uploadUpdatedCache(supabase: any, fileName: string, cacheData: CacheData): Promise<boolean> {
  try {
    const jsonData = JSON.stringify(cacheData, null, 2)
    
    
    const { error } = await supabase.storage
      .from('cache')
      .upload(fileName, new Blob([jsonData], { type: 'application/json' }), {
        upsert: true,
        contentType: 'application/json'
      })
    
    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`)
    }
    
    return true
    
  } catch (error) {
    return false
  }
}

// Update game in cache data with fresh ESPN data
function updateGameInCache(cacheGame: Game, espnGameData: any): Game {
  const competition = espnGameData.competitions?.[0]
  const homeCompetitor = competition?.competitors?.find((c: any) => c.homeAway === 'home')
  const awayCompetitor = competition?.competitors?.find((c: any) => c.homeAway === 'away')
  
  // Update scores and status while preserving existing team data
  return {
    ...cacheGame,
    home_score: homeCompetitor?.score ? parseInt(homeCompetitor.score) : undefined,
    away_score: awayCompetitor?.score ? parseInt(awayCompetitor.score) : undefined,
    status: espnGameData.status?.type?.name || cacheGame.status,
    status_detail: espnGameData.status?.type?.detail || cacheGame.status_detail
  }
}

// Update cache data with fresh ESPN games data
function updateCacheWithESPNData(cacheData: CacheData, espnGames: any[]): CacheData {
  
  // Create a map of ESPN game IDs to ESPN data for quick lookup
  const espnGameMap = new Map()
  espnGames.forEach(game => {
    espnGameMap.set(game.id, game)
  })
  
  let updatedCount = 0
  
  // Update games in all_games array
  const updatedAllGames = cacheData.schedule.all_games.map(cacheGame => {
    const espnGame = espnGameMap.get(cacheGame.espn_id)
    if (espnGame) {
      updatedCount++
      return updateGameInCache(cacheGame, espnGame)
    }
    return cacheGame
  })
  
  // Update games in by_week structure
  const updatedByWeek: Record<number, Game[]> = {}
  for (const [week, games] of Object.entries(cacheData.schedule.by_week)) {
    updatedByWeek[parseInt(week)] = games.map(cacheGame => {
      const espnGame = espnGameMap.get(cacheGame.espn_id)
      if (espnGame) {
        return updateGameInCache(cacheGame, espnGame)
      }
      return cacheGame
    })
  }
  
  
  // Return updated cache data with new timestamp
  return {
    ...cacheData,
    meta: {
      ...cacheData.meta,
      export_date: new Date().toISOString()
    },
    schedule: {
      by_week: updatedByWeek,
      all_games: updatedAllGames
    }
  }
}

Deno.serve(async (req) => {
  let supabase: any
  
  try {
    // Initialize Supabase client for storage operations
    supabase = createClient(
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
    
    
    // Get current NFL week info
    const currentNFLWeek = getCurrentNFLWeek()
    
    // Parse request for week/year parameters (allow override for testing)
    const url = new URL(req.url)
    const requestedWeek = url.searchParams.get('week') ? parseInt(url.searchParams.get('week')!) : currentNFLWeek.week
    const espnWeek = getESPNWeekNumber(requestedWeek, currentNFLWeek.seasonType)
    const week = espnWeek.toString()
    const year = url.searchParams.get('year') || currentNFLWeek.seasonYear.toString()
    const seasontype = url.searchParams.get('seasontype') || getESPNSeasonType(currentNFLWeek.seasonType)
    
    
    // Determine cache file name
    const cacheFileName = `games-cache-week-${currentNFLWeek.week}-${currentNFLWeek.seasonYear}.json`
    
    // Download existing cache file
    const existingCache = await downloadCacheFile(supabase, cacheFileName)
    
    if (!existingCache) {
      // If no cache exists, we'll still fetch ESPN data but won't update cache
    }
    
    const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}&seasontype=${seasontype}&year=${year}`
    
    
    // Call ESPN API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
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
    
    // If we have existing cache, update it with fresh ESPN data
    if (existingCache && data.events?.length > 0) {
      const updatedCache = updateCacheWithESPNData(existingCache, data.events)
      
      // Upload updated cache file
      const uploadSuccess = await uploadUpdatedCache(supabase, cacheFileName, updatedCache)
    }
    
    // Transform ESPN data to our format
    const games = data.events?.map((event: any) => {
      const competition = event.competitions?.[0]
      const homeTeam = competition?.competitors?.find((c: any) => c.homeAway === 'home')
      const awayTeam = competition?.competitors?.find((c: any) => c.homeAway === 'away')
      
      return {
        id: event.id,
        espn_id: event.id,
        name: event.shortName,
        status: event.status?.type?.name,
        status_detail: event.status?.type?.detail,
        week: parseInt(week),
        season_year: parseInt(year),
        date: event.date,
        home_team: {
          id: homeTeam?.team?.id,
          name: homeTeam?.team?.displayName,
          abbreviation: homeTeam?.team?.abbreviation,
          logo: homeTeam?.team?.logo,
          score: homeTeam?.score || 0
        },
        away_team: {
          id: awayTeam?.team?.id,
          name: awayTeam?.team?.displayName,
          abbreviation: awayTeam?.team?.abbreviation,
          logo: awayTeam?.team?.logo,
          score: awayTeam?.score || 0
        }
      }
    }) || []
    
    
    return new Response(
      JSON.stringify({
        success: true,
        message: existingCache 
          ? 'Cache updated successfully with live ESPN data' 
          : 'ESPN API integration successful (no cache to update)',
        week: parseInt(week),
        year: parseInt(year),
        seasontype: parseInt(seasontype),
        total_games: games.length,
        cache_updated: !!existingCache,
        cache_file: existingCache ? cacheFileName : null,
        games: games,
        timestamp: new Date().toISOString()
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
    console.error('ESPN API integration with cache update failed:', error)
    
    if (error.name === 'AbortError') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ESPN API request timed out',
          error: 'TIMEOUT',
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          status: 408,
        }
      )
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        context: 'ESPN API integration with cache update',
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