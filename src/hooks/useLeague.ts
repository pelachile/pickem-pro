// Custom hooks for league-related operations using TanStack Query

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '../lib/api';
import type {
  GetPublicLeaguesParams,
  JoinLeagueRequest,
  JoinLeagueResponse,
  UpdateLeagueRequest,
  UpdateLeagueResponse,
  DeleteLeagueResponse,
} from '../types/league';

// Query keys for caching
export const leagueQueryKeys = {
  all: ['leagues'] as const,
  public: (params: GetPublicLeaguesParams) => [...leagueQueryKeys.all, 'public', params] as const,
  user: () => [...leagueQueryKeys.all, 'user'] as const,
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
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.user() });
    },
    onError: (error) => {
      console.error('Failed to join league:', error);
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
export function useUserLeagues() {
  return useQuery({
    queryKey: leagueQueryKeys.user(),
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
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.user() });
    },
    onError: (error) => {
      console.error('Failed to update league:', error);
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
      queryClient.invalidateQueries({ queryKey: leagueQueryKeys.user() });
    },
    onError: (error) => {
      console.error('Failed to delete league:', error);
    },
  });
}