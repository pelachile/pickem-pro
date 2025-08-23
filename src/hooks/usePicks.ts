// Custom hooks for picks-related operations using TanStack Query

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { picksApi } from '../lib/api';
import type {
  SubmitPicksRequest,
  SubmitPicksResponse,
  GetUserPicksRequest,
  GetUserPicksResponse,
  UpdatePickRequest,
  UpdatePickResponse,
  GetLeagueStandingsRequest,
  UserPick,
} from '../types/picks';

// Query keys for caching
export const picksQueryKeys = {
  all: ['picks'] as const,
  userPicks: (leagueId: string, week?: number, seasonYear?: number) => 
    [...picksQueryKeys.all, 'user', leagueId, week, seasonYear] as const,
  standings: (leagueId: string, week?: number, seasonYear?: number) => 
    [...picksQueryKeys.all, 'standings', leagueId, week, seasonYear] as const,
  upcomingGames: (leagueId: string, week?: number) => 
    [...picksQueryKeys.all, 'upcoming', leagueId, week] as const,
  pickHistory: (leagueId: string) => 
    [...picksQueryKeys.all, 'history', leagueId] as const,
  deadlines: (gameIds: string[]) => 
    [...picksQueryKeys.all, 'deadlines', ...gameIds.sort()] as const,
};

// Hook to fetch user picks for a league
export function useUserPicks(request: GetUserPicksRequest, enabled: boolean = true) {
  return useQuery({
    queryKey: picksQueryKeys.userPicks(request.league_id, request.week, request.season_year),
    queryFn: () => picksApi.getUserPicks(request),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to submit picks with optimistic updates
export function useSubmitPicks() {
  const queryClient = useQueryClient();

  return useMutation<SubmitPicksResponse, Error, SubmitPicksRequest>({
    mutationFn: picksApi.submitPicks,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: picksQueryKeys.userPicks(variables.league_id) 
      });

      // Snapshot the previous value for rollback
      const previousPicks = queryClient.getQueryData(
        picksQueryKeys.userPicks(variables.league_id)
      );

      // Optimistically update the cache with new picks
      queryClient.setQueryData(
        picksQueryKeys.userPicks(variables.league_id),
        (old: GetUserPicksResponse | undefined) => {
          if (!old) return old;
          
          // Create optimistic picks based on submissions
          const optimisticPicks: UserPick[] = variables.picks.map(pick => ({
            id: `temp-${pick.game_id}`,
            user_id: 'current-user',
            league_id: variables.league_id,
            game_id: pick.game_id,
            picked_team_id: pick.picked_team_id,
            confidence_points: pick.confidence_points || 1,
            is_correct: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          return {
            ...old,
            data: [...(old.data || []), ...optimisticPicks],
          };
        }
      );

      return { previousPicks };
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update on error
      if (context && typeof context === 'object' && 'previousPicks' in context && context.previousPicks) {
        queryClient.setQueryData(
          picksQueryKeys.userPicks(variables.league_id),
          context.previousPicks
        );
      }
      console.error('Failed to submit picks:', error);
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ 
        queryKey: picksQueryKeys.userPicks(variables.league_id)
      });
      queryClient.invalidateQueries({ 
        queryKey: picksQueryKeys.standings(variables.league_id)
      });
      queryClient.invalidateQueries({ 
        queryKey: picksQueryKeys.pickHistory(variables.league_id)
      });
    },
  });
}

// Hook to update a single pick
export function useUpdatePick() {
  const queryClient = useQueryClient();

  return useMutation<UpdatePickResponse, Error, { pickId: string; data: UpdatePickRequest; leagueId: string }>({
    mutationFn: ({ pickId, data }) => picksApi.updatePick(pickId, data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: picksQueryKeys.userPicks(variables.leagueId)
      });

      // Snapshot the previous value
      const previousPicks = queryClient.getQueryData(
        picksQueryKeys.userPicks(variables.leagueId)
      );

      // Optimistically update the pick
      queryClient.setQueryData(
        picksQueryKeys.userPicks(variables.leagueId),
        (old: GetUserPicksResponse | undefined) => {
          if (!old) return old;
          
          const updatedData = old.data?.map(pick => 
            pick.id === variables.pickId 
              ? {
                  ...pick,
                  picked_team_id: variables.data.picked_team_id,
                  confidence_points: variables.data.confidence_points || pick.confidence_points,
                  updated_at: new Date().toISOString(),
                }
              : pick
          );

          return {
            ...old,
            data: updatedData || [],
          };
        }
      );

      return { previousPicks };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context && typeof context === 'object' && 'previousPicks' in context && context.previousPicks) {
        queryClient.setQueryData(
          picksQueryKeys.userPicks(variables.leagueId),
          context.previousPicks
        );
      }
      console.error('Failed to update pick:', error);
    },
    onSuccess: (_data, variables) => {
      // Refresh picks and standings
      queryClient.invalidateQueries({ 
        queryKey: picksQueryKeys.userPicks(variables.leagueId)
      });
      queryClient.invalidateQueries({ 
        queryKey: picksQueryKeys.standings(variables.leagueId)
      });
    },
  });
}

// Hook to fetch league standings
export function useLeagueStandings(request: GetLeagueStandingsRequest, enabled: boolean = true) {
  return useQuery({
    queryKey: picksQueryKeys.standings(request.league_id, request.week, request.season_year),
    queryFn: () => picksApi.getLeagueStandings(request),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch upcoming games for picks
export function useUpcomingGames(leagueId: string, week?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: picksQueryKeys.upcomingGames(leagueId, week),
    queryFn: () => picksApi.getUpcomingGames(leagueId, week),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch user's pick history summary
export function useUserPickHistory(leagueId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: picksQueryKeys.pickHistory(leagueId),
    queryFn: () => picksApi.getUserPickHistory(leagueId),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to check game deadlines
export function useGameDeadlines(gameIds: string[], enabled: boolean = true) {
  return useQuery({
    queryKey: picksQueryKeys.deadlines(gameIds),
    queryFn: () => picksApi.checkGameDeadlines(gameIds),
    enabled: enabled && gameIds.length > 0,
    staleTime: 1000 * 30, // 30 seconds for deadline checks
    gcTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    refetchInterval: 1000 * 60, // Refetch every minute to keep deadlines current
  });
}

// Custom hook that combines picks and deadlines for make-picks page
export function usePicksWithDeadlines(leagueId: string, week?: number) {
  const picksQuery = useUserPicks({ league_id: leagueId, week });
  const upcomingQuery = useUpcomingGames(leagueId, week);
  
  // Extract game IDs from upcoming games
  const gameIds = upcomingQuery.data?.data?.map(game => game.id) || [];
  const deadlinesQuery = useGameDeadlines(gameIds, gameIds.length > 0);

  return {
    picks: picksQuery.data?.data || [],
    upcomingGames: upcomingQuery.data?.data || [],
    deadlines: deadlinesQuery.data?.data || [],
    isLoading: picksQuery.isLoading || upcomingQuery.isLoading || deadlinesQuery.isLoading,
    error: picksQuery.error || upcomingQuery.error || deadlinesQuery.error,
    isPicksLoading: picksQuery.isLoading,
    isGamesLoading: upcomingQuery.isLoading,
    isDeadlinesLoading: deadlinesQuery.isLoading,
    refetch: () => {
      picksQuery.refetch();
      upcomingQuery.refetch();
      deadlinesQuery.refetch();
    },
  };
}

// Utility hook to get pick statistics for display
export function usePickStats(leagueId: string) {
  const { data: pickHistory } = useUserPickHistory(leagueId);
  const { data: standings } = useLeagueStandings({ league_id: leagueId });
  
  const userPosition = standings?.data?.find(standing => 
    standing.user_id === 'current-user' // This would need to be the actual user ID
  )?.position || null;

  return {
    stats: pickHistory?.data || null,
    position: userPosition,
    totalParticipants: standings?.total_participants || 0,
    isLoading: !pickHistory || !standings,
  };
}
