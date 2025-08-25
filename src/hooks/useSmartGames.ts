import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentNFLWeek } from '../lib/nflCalendar'
import { fetchGamesSmartly, getCacheFileMetadata, getAvailableWeeks, type SmartGameData } from '../lib/smartGamesFetcher'
import { queryKeys } from '../lib/queryClient'
import { useTeams } from './useNflData'
import { useDbTeams } from './useDbTeams'

// Smart hook that fetches games intelligently based on context
export function useGames(week?: number, year?: number) {
  const currentNFLWeek = getCurrentNFLWeek()
  // During dead periods, use display week (last completed week) when no specific week is requested
  const defaultWeek = currentNFLWeek.isDeadPeriod ? currentNFLWeek.displayWeek! : currentNFLWeek.week
  const targetWeek = week ?? defaultWeek
  const targetYear = year ?? currentNFLWeek.seasonYear
  
  const isCurrentWeek = targetWeek === currentNFLWeek.week && targetYear === currentNFLWeek.seasonYear
  
  return useQuery({
    queryKey: queryKeys.nfl.smartGames(targetWeek, targetYear),
    queryFn: () => fetchGamesSmartly(targetWeek, targetYear),
    staleTime: isCurrentWeek ? 1000 * 60 * 2 : 1000 * 60 * 30, // 2 min for current week, 30 min for others
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    refetchInterval: isCurrentWeek ? 1000 * 60 * 5 : false, // Auto-refetch current week every 5 minutes
    refetchIntervalInBackground: isCurrentWeek,
    retry: 2,
  })
}

// Hook specifically for current week games (always fresh)
export function useCurrentWeekGames() {
  const currentNFLWeek = getCurrentNFLWeek()
  
  return useQuery({
    queryKey: queryKeys.nfl.currentWeekGames(),
    queryFn: () => fetchGamesSmartly(currentNFLWeek.week, currentNFLWeek.seasonYear),
    staleTime: 1000 * 60 * 1, // 1 minute - keep very fresh for live games
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchIntervalInBackground: true,
    retry: 3,
  })
}

// Hook for historical games (less frequent updates)
export function useHistoricalGames(week: number, year: number) {
  return useQuery({
    queryKey: queryKeys.nfl.historicalGames(week, year),
    queryFn: () => fetchGamesSmartly(week, year),
    staleTime: 1000 * 60 * 60 * 2, // 2 hours - historical data doesn't change
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchInterval: false, // No auto-refetch for historical data
    retry: 1,
  })
}

// Hook to get enhanced game data with team information
export function useEnhancedGames(week?: number, year?: number) {
  const gamesQuery = useGames(week, year)
  const { data: teams, isLoading: teamsLoading } = useTeams()
  
  const enhancedGames = gamesQuery.data?.games.map(game => {
    // If game already has complete team data (from cache), use it
    if (game.home_team && game.away_team && game.home_team.display_name) {
      // Transform to component Game format for cache data
      const homeScore = typeof game.home_score === 'string' ? parseInt(game.home_score, 10) : game.home_score;
      const awayScore = typeof game.away_score === 'string' ? parseInt(game.away_score, 10) : game.away_score;
      
      
      return {
        id: game.id,
        status: game.status as any, // Convert status format
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        homeScore,
        awayScore,
        gameTime: game.date,
        venue: game.venue_name, // Map venue_name to venue
        week: game.week,
        season_year: game.season_year,
        // Preserve original fields for backward compatibility
        home_team: game.home_team,
        away_team: game.away_team,
        venue_name: game.venue_name,
        game_date: game.date,
        date: game.date,
        espn_id: game.id?.toString(),
      }
    }
    
    // Otherwise, enhance with team data from database
    const homeTeam = teams?.find(team => team.id === game.home_team_id)
    const awayTeam = teams?.find(team => team.id === game.away_team_id)
    
    // Transform to component Game format for database data
    return {
      id: game.id,
      status: game.status as any, // Convert status format if needed
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      homeScore: typeof game.home_score === 'string' ? parseInt(game.home_score, 10) : game.home_score,
      awayScore: typeof game.away_score === 'string' ? parseInt(game.away_score, 10) : game.away_score,
      gameTime: game.date,
      venue: game.venue_name, // Map venue_name to venue
      week: game.week,
      season_year: game.season_year,
      // Preserve other fields
      venue_name: game.venue_name,
      game_date: game.date,
      espn_id: game.id?.toString(),
    }
  })
  
  return {
    ...gamesQuery,
    data: gamesQuery.data ? {
      ...gamesQuery.data,
      games: enhancedGames || [],
    } : undefined,
    isLoading: gamesQuery.isLoading || teamsLoading,
  }
}

// Hook to get cache file metadata for debugging/monitoring
export function useCacheMetadata(week: number, year: number) {
  return useQuery({
    queryKey: [...queryKeys.nfl.cacheFile(week, year), 'metadata'],
    queryFn: () => getCacheFileMetadata(week, year),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  })
}

// Hook to get available weeks from both sources
export function useAvailableWeeks(year?: number) {
  const currentYear = year ?? getCurrentNFLWeek().seasonYear
  
  return useQuery({
    queryKey: [...queryKeys.nfl.all, 'available-weeks', currentYear],
    queryFn: () => getAvailableWeeks(currentYear),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  })
}

// Utility hook to prefetch next/previous weeks
export function usePrefetchAdjacentWeeks(currentWeek?: number, currentYear?: number) {
  const queryClient = useQueryClient()
  const nflWeek = getCurrentNFLWeek()
  const week = currentWeek ?? nflWeek.week
  const year = currentYear ?? nflWeek.seasonYear
  
  const prefetchNext = () => {
    if (week < 18) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.nfl.smartGames(week + 1, year),
        queryFn: () => fetchGamesSmartly(week + 1, year),
        staleTime: 1000 * 60 * 15,
      })
    }
  }
  
  const prefetchPrevious = () => {
    if (week > 1) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.nfl.smartGames(week - 1, year),
        queryFn: () => fetchGamesSmartly(week - 1, year),
        staleTime: 1000 * 60 * 30,
      })
    }
  }
  
  return {
    prefetchNext,
    prefetchPrevious,
    prefetchBoth: () => {
      prefetchNext()
      prefetchPrevious()
    },
  }
}

// Hook for games grouped by date (commonly used pattern)
export function useGamesByDate(week?: number, year?: number) {
  const gamesQuery = useEnhancedGames(week, year)
  
  const gamesByDate = gamesQuery.data?.games.reduce((acc, game) => {
    const date = new Date(game.date).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(game)
    return acc
  }, {} as Record<string, typeof gamesQuery.data.games>)
  
  const sortedDates = gamesByDate ? Object.keys(gamesByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  ) : []
  
  return {
    ...gamesQuery,
    gamesByDate: gamesByDate || {},
    sortedDates,
    dateCount: sortedDates.length,
  }
}

// Hook to invalidate games cache (for manual refresh)
export function useRefreshGames() {
  const queryClient = useQueryClient()
  
  return {
    refreshCurrentWeek: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nfl.currentWeekGames() })
    },
    refreshWeek: (week: number, year: number) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nfl.smartGames(week, year) })
    },
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nfl.all })
    },
  }
}