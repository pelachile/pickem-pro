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
  const currentWeek = currentNFLWeek.displayWeek || currentNFLWeek.week
  const currentYear = currentNFLWeek.seasonYear
  
  // During dead periods, always use cache for the current NFL context
  if (currentNFLWeek.isDeadPeriod && year === currentYear) {
    return true // Dead period - cache handles the display logic
  }
  
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
      console.log(`🏈 Trying cache: bucket=${bucket}, file=${fileName}`)
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(fileName)
      
      if (error) {
        console.log(`🏈 Cache error for ${bucket}/${fileName}:`, error)
        continue
      }
      
      if (!data) {
        continue
      }
      
      // Convert blob to JSON
      const text = await data.text()
      const cacheData = JSON.parse(text)
      
      console.log(`🏈 Successfully loaded cache from ${bucket}/${fileName}`, {
        keys: Object.keys(cacheData),
        hasSchedule: !!cacheData.schedule,
        hasAllGames: !!cacheData.schedule?.all_games,
        allGamesCount: cacheData.schedule?.all_games?.length
      })
      
      // Handle different cache formats
      let games: Game[] = []
      
      // Check for dead period and use all games if in dead period
      const currentNFLWeek = getCurrentNFLWeek()
      const isDeadPeriod = currentNFLWeek.isDeadPeriod || cacheData.meta?.is_dead_period
      
      
      if (cacheData.games) {
        // New format: { games: Game[], meta: {...} }
        games = cacheData.games
      } else if (cacheData.schedule && cacheData.schedule.all_games) {
        // Current enhanced format: { schedule: { all_games: Game[], by_week: {...} } }
        if (isDeadPeriod) {
          // During dead period, use all games (they're already filtered by the backend)
          games = cacheData.schedule.all_games
        } else {
          // Normal period, try to get specific week
          games = cacheData.schedule.by_week?.[week] || cacheData.schedule.all_games
        }
      } else if (cacheData.schedule && cacheData.schedule.by_week && cacheData.schedule.by_week[week]) {
        // Legacy format: { schedule: { by_week: { [weekNum]: Game[] } } }
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
      
      
      // Transform games to match expected interface (fix status format and date field)
      const transformedGames = filteredGames.map(game => ({
        ...game,
        date: game.game_date || game.date,
        status: game.status === 'STATUS_SCHEDULED' ? 'scheduled' : 
                game.status === 'STATUS_IN_PROGRESS' ? 'in_progress' :
                game.status === 'STATUS_FINAL' ? 'final' : 'scheduled',
      }))
      
      return transformedGames
      
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
      season_year: dbGame.season_year,
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
  
  // Use current week/year if not specified, but respect dead period logic
  const defaultWeek = currentNFLWeek.isDeadPeriod ? currentNFLWeek.displayWeek! : currentNFLWeek.week
  const targetWeek = week ?? defaultWeek
  const targetYear = year ?? currentNFLWeek.seasonYear
  
  console.log('🏈 fetchGamesSmartly debug:', {
    requestedWeek: week,
    requestedYear: year,
    currentNFLWeek,
    defaultWeek,
    targetWeek,
    targetYear,
    isDeadPeriod: currentNFLWeek.isDeadPeriod,
    displayWeek: currentNFLWeek.displayWeek
  })
  
  
  const shouldUseCache = shouldUseCacheFile(targetWeek, targetYear)
  
  console.log('🏈 shouldUseCache:', shouldUseCache)
  
  try {
    if (shouldUseCache) {
      console.log('🏈 Fetching from cache for week', targetWeek, 'year', targetYear)
      const games = await fetchGamesFromCache(targetWeek, targetYear)
      return {
        games,
        source: 'cache',
        week: targetWeek,
        year: targetYear,
        lastUpdated: new Date().toISOString(),
      }
    } else {
      console.log('🏈 Fetching from database for week', targetWeek, 'year', targetYear)
      const games = await fetchGamesFromDatabase(targetWeek, targetYear)
      return {
        games,
        source: 'database',
        week: targetWeek,
        year: targetYear,
      }
    }
  } catch (error) {
    console.error('🏈 Error in primary fetch:', error)
    
    // For current week in production, don't fallback to database - cache is expected
    // But in development (localhost), allow database fallback for current week
    const currentNFLWeek = getCurrentNFLWeek()
    const isCurrentWeek = targetWeek === currentNFLWeek.week && targetYear === currentNFLWeek.seasonYear
    const isLocalDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    
    console.log('🏈 Error context:', { isCurrentWeek, shouldUseCache, isLocalDevelopment })
    
    if (isCurrentWeek && shouldUseCache && !isLocalDevelopment) {
      throw new Error(`Cache file not found for current week ${targetWeek}, ${targetYear}. Please generate cache first.`)
    }
    
    // Fallback logic: if cache fails, try database; if database fails, try cache
    
    try {
      if (shouldUseCache) {
        // Cache failed, try database
        console.log('🏈 Cache failed, trying database fallback')
        const games = await fetchGamesFromDatabase(targetWeek, targetYear)
        return {
          games,
          source: 'database',
          week: targetWeek,
          year: targetYear,
        }
      } else {
        // Database failed, try cache
        console.log('🏈 Database failed, trying cache fallback')
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
      console.error('🏈 Fallback also failed:', fallbackError)
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