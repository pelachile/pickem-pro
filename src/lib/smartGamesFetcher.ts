import { getCurrentNFLWeek } from './nflCalendar'
import type { NFLWeekInfo } from './nflCalendar'
import { supabase } from './supabase'
import type { Game } from './api'

// Types for smart game fetching
export interface SmartGameData {
  games: Game[]
  source: 'cache' | 'database'
  week: number
  year: number
  lastUpdated?: string
}

export interface CacheFileData {
  games: Game[]
  meta: {
    week: number
    year: number
    last_updated: string
    total_games: number
  }
}

// Determine if we should use cache file or database for a given week/year
export function shouldUseCacheFile(week: number, year: number): boolean {
  const currentNFLWeek = getCurrentNFLWeek()
  const currentWeek = currentNFLWeek.week
  const currentYear = currentNFLWeek.seasonYear
  
  // Use cache file for:
  // 1. Current week of current season (live/updated data)
  // 2. Recent weeks that might have live updates (within 2 weeks of current)
  if (year === currentYear) {
    if (week === currentWeek) {
      return true // Current week - always use cache for live updates
    }
    // Recent weeks might have score updates, use cache if available
    if (Math.abs(week - currentWeek) <= 2) {
      return true
    }
  }
  
  // For historical data or future weeks, use database
  return false
}

// Fetch games from cache file (Supabase Storage)
export async function fetchGamesFromCache(week: number, year: number): Promise<Game[]> {
  // Try both naming conventions and bucket names (prioritize existing format)
  const attempts = [
    { bucket: 'cache', fileName: 'teams-and-schedule.json' },
    { bucket: 'cache', fileName: `games-cache-week-${week}-${year}.json` },
    { bucket: 'nfl-cache', fileName: `games-cache-week-${week}-${year}.json` }
  ]
  
  for (const { bucket, fileName } of attempts) {
    try {
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(fileName)
      
      if (error) {
        continue
      }
      
      if (!data) {
        continue
      }
      
      // Convert blob to JSON
      const text = await data.text()
      const cacheData = JSON.parse(text)
      
      // Handle different cache formats
      let games: Game[] = []
      if (cacheData.games) {
        // New format: { games: Game[], meta: {...} }
        games = cacheData.games
      } else if (cacheData.schedule && cacheData.schedule.by_week && cacheData.schedule.by_week[week]) {
        // Current format: { schedule: { by_week: { [weekNum]: Game[] } } }
        games = cacheData.schedule.by_week[week]
      } else if (cacheData.weeks && cacheData.weeks[week]) {
        // Old format: { weeks: { [weekNum]: Game[] } }
        games = cacheData.weeks[week]
      } else if (Array.isArray(cacheData)) {
        // Direct array format
        games = cacheData
      } else {
        continue
      }
      
      // Filter games by week and year if needed
      const filteredGames = games.filter(game => {
        const gameWeek = game.week || parseInt(String(game.id).substring(0,1)) || week
        const gameYear = game.season_year || year
        return gameWeek === week && gameYear === year
      })
      
      return filteredGames
      
    } catch (error) {
      continue
    }
  }
  
  throw new Error(`No cache file found for week ${week}, year ${year}`)
}

// Fetch games from database
export async function fetchGamesFromDatabase(week: number, year: number): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select(`
        id,
        week,
        season_year,
        home_team_id,
        away_team_id,
        game_date,
        status,
        home_score,
        away_score,
        venue_name
      `)
      .eq('week', week)
      .eq('season_year', year)
      .order('game_date', { ascending: true })
    
    if (error) {
      throw error
    }
    
    // Transform database format to API format
    return (data || []).map((dbGame: any): Game => ({
      id: dbGame.id,
      week: dbGame.week,
      home_team_id: dbGame.home_team_id,
      away_team_id: dbGame.away_team_id,
      date: dbGame.game_date,
      status: dbGame.status as 'scheduled' | 'upcoming' | 'in_progress' | 'final',
      home_score: dbGame.home_score,
      away_score: dbGame.away_score,
      venue_name: dbGame.venue_name,
    }))
  } catch (error) {
    throw error
  }
}

// Smart fetcher that chooses the appropriate data source
export async function fetchGamesSmartly(week?: number, year?: number): Promise<SmartGameData> {
  // Use current week/year if not specified
  const currentNFLWeek = getCurrentNFLWeek()
  const targetWeek = week ?? currentNFLWeek.week
  const targetYear = year ?? currentNFLWeek.seasonYear
  
  const shouldUseCache = shouldUseCacheFile(targetWeek, targetYear)
  
  try {
    if (shouldUseCache) {
      const games = await fetchGamesFromCache(targetWeek, targetYear)
      return {
        games,
        source: 'cache',
        week: targetWeek,
        year: targetYear,
        lastUpdated: new Date().toISOString(),
      }
    } else {
      const games = await fetchGamesFromDatabase(targetWeek, targetYear)
      return {
        games,
        source: 'database',
        week: targetWeek,
        year: targetYear,
      }
    }
  } catch (error) {
    // For current week, don't fallback to database - this is expected to use cache only
    const currentNFLWeek = getCurrentNFLWeek()
    const isCurrentWeek = targetWeek === currentNFLWeek.week && targetYear === currentNFLWeek.seasonYear
    
    if (isCurrentWeek && shouldUseCache) {
      throw new Error(`Cache file not found for current week ${targetWeek}, ${targetYear}. Please generate cache first.`)
    }
    
    // Fallback logic: if cache fails, try database; if database fails, try cache
    
    try {
      if (shouldUseCache) {
        // Cache failed, try database
        const games = await fetchGamesFromDatabase(targetWeek, targetYear)
        return {
          games,
          source: 'database',
          week: targetWeek,
          year: targetYear,
        }
      } else {
        // Database failed, try cache
        const games = await fetchGamesFromCache(targetWeek, targetYear)
        return {
          games,
          source: 'cache',
          week: targetWeek,
          year: targetYear,
          lastUpdated: new Date().toISOString(),
        }
      }
    } catch (fallbackError) {
      throw fallbackError
    }
  }
}

// Check if cache file exists and get metadata
export async function getCacheFileMetadata(week: number, year: number): Promise<{ exists: boolean; lastModified?: Date; size?: number }> {
  const fileName = `games-cache-week-${week}-${year}.json`
  
  try {
    const { data, error } = await supabase.storage
      .from('nfl-cache')
      .list('', {
        search: fileName,
        limit: 1,
      })
    
    if (error) {
      return { exists: false }
    }
    
    if (!data || data.length === 0) {
      return { exists: false }
    }
    
    const file = data[0]
    return {
      exists: true,
      lastModified: file.updated_at ? new Date(file.updated_at) : undefined,
      size: file.metadata?.size,
    }
  } catch (error) {
    return { exists: false }
  }
}

// Get available weeks from both sources
export async function getAvailableWeeks(year?: number): Promise<{ cache: number[]; database: number[] }> {
  const targetYear = year ?? getCurrentNFLWeek().seasonYear
  
  // Check cache files
  const cacheWeeks: number[] = []
  try {
    const { data: cacheFiles, error: cacheError } = await supabase.storage
      .from('nfl-cache')
      .list('', {
        search: `games-cache-week-`,
      })
    
    if (!cacheError && cacheFiles) {
      for (const file of cacheFiles) {
        const match = file.name.match(/games-cache-week-(\d+)-(\d+)\.json/)
        if (match && parseInt(match[2]) === targetYear) {
          cacheWeeks.push(parseInt(match[1]))
        }
      }
    }
  } catch (error) {
  }
  
  // Check database
  const databaseWeeks: number[] = []
  try {
    const { data: dbWeeks, error: dbError } = await supabase
      .from('games')
      .select('week')
      .eq('season_year', targetYear)
      .order('week', { ascending: true })
    
    if (!dbError && dbWeeks) {
      const uniqueWeeks = [...new Set(dbWeeks.map(row => row.week))]
      databaseWeeks.push(...uniqueWeeks)
    }
  } catch (error) {
  }
  
  return {
    cache: cacheWeeks.sort((a, b) => a - b),
    database: databaseWeeks.sort((a, b) => a - b),
  }
}