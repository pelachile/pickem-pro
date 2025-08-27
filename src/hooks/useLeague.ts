// Custom hooks for league-related operations using TanStack Query

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { leagueApi } from '../lib/api-minimal';
import type {
  GetPublicLeaguesParams,
  JoinLeagueRequest,
  JoinLeagueResponse,
  UpdateLeagueRequest,
  UpdateLeagueResponse,
  DeleteLeagueResponse,
} from '../types/league';

// Real-time event types
interface LeagueUpdateEvent {
  eventType: 'UPDATE' | 'DELETE';
  new?: any;
  old?: any;
}

interface MemberUpdateEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: any;
  old?: any;
}

// Query keys for caching
export const leagueQueryKeys = {
  all: ['leagues'] as const,
  public: (params: GetPublicLeaguesParams) => [...leagueQueryKeys.all, 'public', params] as const,
  user: (userId?: string) => [...leagueQueryKeys.all, 'user', userId || 'current'] as const,
  detail: (id: string) => [...leagueQueryKeys.all, 'detail', id] as const,
};

// Hook to fetch public leagues with search and pagination
export function usePublicLeagues(params: GetPublicLeaguesParams = {}) {
  return useQuery({
    queryKey: leagueQueryKeys.public(params),
    queryFn: () => leagueApi.getPublicLeagues(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to join a league
export function useJoinLeague() {
  const queryClient = useQueryClient();

  return useMutation<JoinLeagueResponse, Error, JoinLeagueRequest>({
    mutationFn: leagueApi.joinLeague,
    onSuccess: () => {
      // Invalidate public leagues query to refresh the list
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.all });
      
      // Invalidate user's leagues as well since they joined a new one
      queryClient.invalidateQueries({ queryKey: [...leagueQueryKeys.all, 'user'] });
    },
    onError: (error) => {
      // Failed to join league
    },
  });
}

// Hook to search public leagues with debouncing
export function useSearchPublicLeagues(searchQuery: string, enabled: boolean = true) {
  return useQuery({
    queryKey: leagueQueryKeys.public({ search: searchQuery, limit: 20, offset: 0 }),
    queryFn: () => leagueApi.getPublicLeagues({ search: searchQuery, limit: 20, offset: 0 }),
    enabled: enabled && searchQuery.length >= 2, // Only search if query is at least 2 characters
    staleTime: 1000 * 60 * 1, // 1 minute for search results
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch user's leagues
export function useUserLeagues(userId?: string) {
  return useQuery({
    queryKey: leagueQueryKeys.user(userId),
    queryFn: () => leagueApi.getUserLeagues(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to update a league
export function useUpdateLeague() {
  const queryClient = useQueryClient();

  return useMutation<UpdateLeagueResponse, Error, { leagueId: string; data: UpdateLeagueRequest }>({
    mutationFn: ({ leagueId, data }) => leagueApi.updateLeague(leagueId, data),
    onSuccess: (data, variables) => {
      // Invalidate all league queries to refresh data
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.all });
      
      // Update the specific league detail cache if it exists
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.detail(variables.leagueId) });
      
      // Update user leagues cache
      queryClient.invalidateQueries({ queryKey: [...leagueQueryKeys.all, 'user'] });
    },
    onError: (error) => {
      // Failed to update league
    },
  });
}

// Hook to delete a league
export function useDeleteLeague() {
  const queryClient = useQueryClient();

  return useMutation<DeleteLeagueResponse, Error, string>({
    mutationFn: (leagueId: string) => leagueApi.deleteLeague(leagueId),
    onSuccess: (data, leagueId) => {
      // Invalidate all league queries to refresh data
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.all });
      
      // Remove the specific league from cache
      queryClient.removeQueries({ queryKey: leagueQueryKeys.detail(leagueId) });
      
      // Update user leagues cache
      queryClient.invalidateQueries({ queryKey: [...leagueQueryKeys.all, 'user'] });
    },
    onError: (error) => {
      // Failed to delete league
    },
  });
}

// =====================================
// New hooks for Phase 3 features
// =====================================

// Hook to create a league (new for direct database operations)
export function useCreateLeague() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: leagueApi.createLeague,
    onSuccess: () => {
      // Invalidate user leagues first - this will update the sidebar immediately
      queryClient.invalidateQueries({ queryKey: [...leagueQueryKeys.all, 'user'] });
      
      // Invalidate all league queries to refresh data
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.all });
      
      // Update public leagues if the new league is public
      queryClient.invalidateQueries({ queryKey: [...leagueQueryKeys.all, 'public'] });
      
      // Cache invalidated after league creation
    },
    onError: (error) => {
      // Failed to create league
    },
  });
}

// Hook for league detail with real-time updates
export function useLeagueDetail(leagueId: string | null) {
  const queryClient = useQueryClient();

  // Real-time subscription for this specific league
  const handleLeagueUpdate = useCallback((event: LeagueUpdateEvent) => {
    // League detail real-time update
    
    // Invalidate league detail cache
    if (leagueId) {
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.detail(leagueId) });
    }
  }, [queryClient, leagueId]);

  const handleMemberUpdate = useCallback((event: MemberUpdateEvent) => {
    // League members real-time update
    
    // Invalidate league detail cache when members change
    if (leagueId) {
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.detail(leagueId) });
      queryClient.invalidateQueries({ queryKey: [...leagueQueryKeys.all, 'user'] });
    }
  }, [queryClient, leagueId]);

  // Real-time subscriptions would be implemented here
  // const leagueRealtime = useLeagueRealtime(leagueId, handleLeagueUpdate);
  // const membersRealtime = useLeagueMembersRealtime(leagueId, handleMemberUpdate);

  // Set up real-time subscriptions
  useEffect(() => {
    // TODO: Implement real-time subscriptions when ready
    // if (!leagueId || !leagueRealtime.isEnabled) return;

    // const unsubscribeLeague = leagueRealtime.subscribe();
    // const unsubscribeMembers = membersRealtime.subscribe();

    // return () => {
    //   unsubscribeLeague();
    //   unsubscribeMembers();
    // };
  }, [leagueId]);

  return {
    realtimeEnabled: false, // TODO: Enable when real-time is implemented
    // Note: This would need a separate API endpoint for league details
    // For now, it falls back to finding the league in the user's leagues
  };
}

// Performance monitoring hook
export function useLeaguePerformanceMetrics() {
  const queryClient = useQueryClient();

  return {
    getCacheStats: () => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      const leagueQueries = queries.filter(q => 
        q.queryKey[0] === 'leagues'
      );
      
      return {
        totalQueries: queries.length,
        leagueQueries: leagueQueries.length,
        activeSubscriptions: 0, // realtimeManager.getActiveSubscriptionCount(),
        cacheSize: queries.reduce((size, q) => size + JSON.stringify(q.state.data || {}).length, 0),
      };
    },
    clearLeagueCache: () => {
      queryClient.removeQueries({ queryKey: leagueQueryKeys.all });
    },
    isUsingDirectDB: true, // isFeatureEnabled('use_direct_league_queries'),
    isRealtimeEnabled: false, // isFeatureEnabled('use_realtime_subscriptions'),
  };
}