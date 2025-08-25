import { QueryClient } from '@tanstack/react-query'

// Create query client with optimized configuration for NFL Pick'em app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time - can be overridden per query
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors or if we've failed 3 times
        if (error instanceof Error && error.message.includes('4') || failureCount >= 3) {
          return false
        }
        return true
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
})

// Query key factories for consistent caching
export const queryKeys = {
  // NFL data queries
  nfl: {
    all: ['nfl'] as const,
    currentWeekGames: () => [...queryKeys.nfl.all, 'current-week-games'] as const,
    historicalGames: (week: number, year: number) => [...queryKeys.nfl.all, 'historical-games', week, year] as const,
    smartGames: (week?: number, year?: number) => [...queryKeys.nfl.all, 'smart-games', week, year] as const,
    teams: () => [...queryKeys.nfl.all, 'teams'] as const,
    cacheFile: (week: number, year: number) => [...queryKeys.nfl.all, 'cache-file', week, year] as const,
  },
  // Picks queries
  picks: {
    all: ['picks'] as const,
    userPicks: (leagueId: string, week?: number, year?: number) => [...queryKeys.picks.all, 'user', leagueId, week, year] as const,
    deadlines: (gameIds: string[]) => [...queryKeys.picks.all, 'deadlines', ...gameIds.sort()] as const,
  },
  // League queries
  leagues: {
    all: ['leagues'] as const,
    userLeagues: () => [...queryKeys.leagues.all, 'user'] as const,
    publicLeagues: (search?: string, offset?: number) => [...queryKeys.leagues.all, 'public', search, offset] as const,
  },
}