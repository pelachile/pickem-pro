import { useQuery, useQueryClient } from '@tanstack/react-query'
import { nflApi, type CacheData, type Team, type Game } from '../lib/api'
import { queryKeys } from '../lib/queryClient'
import { useGames, useCurrentWeekGames } from './useSmartGames'
import { getCurrentNFLWeek } from '../lib/nflCalendar'

// Legacy query keys - maintained for backward compatibility
export const nflQueryKeys = {
  all: ['nfl'] as const,
  teamsAndSchedule: () => [...nflQueryKeys.all, 'teams-and-schedule'] as const,
  cacheVersion: () => [...nflQueryKeys.all, 'cache-version'] as const,
}

// Main hook for teams and schedule data
export function useTeamsAndSchedule() {
  return useQuery({
    queryKey: nflQueryKeys.teamsAndSchedule(),
    queryFn: nflApi.fetchTeamsAndSchedule,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

// Hook for just teams data
export function useTeams() {
  const { data, ...rest } = useTeamsAndSchedule()
  
  return {
    ...rest,
    data: data?.teams.all || [],
    teamsByConference: data?.teams.by_conference,
  }
}

// Enhanced hook for schedule data with smart fetching
export function useSchedule() {
  const legacyQuery = useTeamsAndSchedule()
  const currentWeekQuery = useCurrentWeekGames()
  const currentNFLWeek = getCurrentNFLWeek()
  
  // If we have current week data from smart fetcher, prefer it for current week
  const enhancedGamesByWeek = { ...legacyQuery.data?.schedule.by_week }
  if (currentWeekQuery.data?.games && currentWeekQuery.data.week === currentNFLWeek.week) {
    enhancedGamesByWeek[currentNFLWeek.week] = currentWeekQuery.data.games
  }
  
  return {
    ...legacyQuery,
    data: legacyQuery.data?.schedule || null,
    gamesByWeek: enhancedGamesByWeek,
    allGames: legacyQuery.data?.schedule.all_games || [],
    availableWeeks: legacyQuery.data?.meta.weeks_available || [],
    // Additional smart data info
    currentWeekSource: currentWeekQuery.data?.source,
    isCurrentWeekLive: currentWeekQuery.data?.source === 'cache',
  }
}

// Enhanced hook for specific week with smart fetching
export function useWeekSchedule(week: number, year?: number) {
  const legacyQuery = useTeamsAndSchedule()
  const smartQuery = useGames(week, year)
  const currentNFLWeek = getCurrentNFLWeek()
  const targetYear = year ?? currentNFLWeek.seasonYear
  
  // Use smart data if available, otherwise fall back to legacy
  const weekGames = smartQuery.data?.games || legacyQuery.data?.schedule.by_week[week] || []
  
  return {
    isLoading: smartQuery.isLoading || legacyQuery.isLoading,
    isError: smartQuery.isError || legacyQuery.isError,
    error: smartQuery.error || legacyQuery.error,
    data: weekGames,
    source: smartQuery.data?.source,
    isFetching: smartQuery.isFetching || legacyQuery.isFetching,
    refetch: () => {
      smartQuery.refetch()
      legacyQuery.refetch()
    },
  }
}

// Hook for cache metadata
export function useCacheMetadata() {
  const { data, ...rest } = useTeamsAndSchedule()
  
  return {
    ...rest,
    data: data?.meta || null,
  }
}

// Hook to check for cache updates
export function useCacheVersion() {
  return useQuery({
    queryKey: nflQueryKeys.cacheVersion(),
    queryFn: nflApi.checkCacheVersion,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Check every 10 minutes
  })
}

// Hook to manually refresh data
export function useRefreshNflData() {
  const queryClient = useQueryClient()
  
  return {
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: nflQueryKeys.all })
    },
    refreshTeamsAndSchedule: () => {
      queryClient.invalidateQueries({ queryKey: nflQueryKeys.teamsAndSchedule() })
    },
  }
}

// Helper hook for team lookup
export function useTeamById(teamId: number) {
  const { data: teams } = useTeams()
  return teams.find(team => team.id === teamId)
}

// Helper hook for conference/division teams
export function useTeamsByDivision(conference: 'AFC' | 'NFC', division: 'North' | 'South' | 'East' | 'West') {
  const { teamsByConference } = useTeams()
  return teamsByConference?.[conference]?.[division] || []
}