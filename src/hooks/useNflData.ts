import { useQuery, useQueryClient } from '@tanstack/react-query'
import { nflApi, type CacheData, type Team, type Game } from '../lib/api'

// Query keys
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

// Hook for schedule data
export function useSchedule() {
  const { data, ...rest } = useTeamsAndSchedule()
  
  return {
    ...rest,
    data: data?.schedule || null,
    gamesByWeek: data?.schedule.by_week || {},
    allGames: data?.schedule.all_games || [],
    availableWeeks: data?.meta.weeks_available || [],
  }
}

// Hook for specific week
export function useWeekSchedule(week: number) {
  const { data, ...rest } = useTeamsAndSchedule()
  
  return {
    ...rest,
    data: data?.schedule.by_week[week] || [],
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