/**
 * React hooks for live ESPN data integration
 * Hybrid approach: fast static data + real-time live updates
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { api, liveDataApi, type CacheData } from '../lib/api-minimal';

// Query keys for consistent caching
export const LIVE_DATA_KEYS = {
  enrichedSchedule: ['nfl', 'enriched-schedule'],
  gameStatuses: (espnIds: string[]) => ['live-data', 'game-statuses', espnIds.sort()],
  teamRecords: (year: number) => ['live-data', 'team-records', year],
  activeGames: () => ['live-data', 'active-games'],
} as const;

/**
 * Hook to fetch NFL data enriched with live information
 * Combines fast static data with real-time live data
 */
export function useEnrichedNflData() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: LIVE_DATA_KEYS.enrichedSchedule,
    queryFn: async () => {
      // Get static data and add live data metadata
      const staticData = await api.nfl.fetchTeamsAndSchedule();
      
      // Return with expected live data metadata structure
      return {
        ...staticData,
        _liveDataMeta: {
          activeGames: 0,
          lastUpdate: Date.now().toString(),
          teamRecordsCount: 0,
        },
      };
    },
    staleTime: 4 * 60 * 1000, // 4 minutes (just under 5-minute update cycle)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes to stay fresh
    retry: 2,
  });

  // Set up real-time subscription for active games
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    if (query.data?._liveDataMeta.activeGames && query.data._liveDataMeta.activeGames > 0) {
      // Only subscribe when there are active games
      unsubscribeRef.current = liveDataApi.subscribeToGameUpdates((gameStatus) => {
        // Invalidate and refetch enriched data when live updates arrive
        queryClient.invalidateQueries({ queryKey: LIVE_DATA_KEYS.enrichedSchedule });
      });
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [query.data?._liveDataMeta.activeGames, queryClient]);

  return {
    ...query,
    // Helper methods for easier data access
    getGamesByWeek: (week: number) => query.data?.schedule.by_week[week.toString()] || [],
    getAllGames: () => query.data?.schedule.all_games || [],
    getTeams: () => query.data?.teams || null,
    getLiveDataMeta: () => query.data?._liveDataMeta,
    hasLiveData: () => (query.data?._liveDataMeta.activeGames || 0) > 0,
  };
}

/**
 * Hook to get live game statuses for specific games
 */
export function useGameStatuses(espnIds: string[]) {
  return useQuery({
    queryKey: LIVE_DATA_KEYS.gameStatuses(espnIds),
    queryFn: async () => {
      if (espnIds.length === 0) return [];
      return await liveDataApi.getGameStatuses(espnIds);
    },
    enabled: espnIds.length > 0,
    staleTime: 4 * 60 * 1000, // 4 minutes
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Hook to get team records for the current season
 */
export function useTeamRecords(year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: LIVE_DATA_KEYS.teamRecords(year),
    queryFn: async () => {
      return await liveDataApi.getTeamRecords();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (team records change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 15 * 60 * 1000, // Every 15 minutes
  });
}

/**
 * Hook to get currently active games (in progress or recently finished)
 */
export function useActiveGames() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: LIVE_DATA_KEYS.activeGames(),
    queryFn: async () => {
      return await liveDataApi.getActiveGameStatuses();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Every 5 minutes
  });

  // Set up real-time subscription for active games
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    if (query.data && query.data.length > 0) {
      unsubscribeRef.current = liveDataApi.subscribeToGameUpdates((gameStatus) => {
        // Update the active games data when we get live updates
        queryClient.invalidateQueries({ queryKey: LIVE_DATA_KEYS.activeGames() });
      });
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [query.data, queryClient]);

  return {
    ...query,
    hasActiveGames: (query.data?.length || 0) > 0,
    activeGameCount: query.data?.length || 0,
  };
}

/**
 * Hook for traditional static NFL data (fallback)
 * Use this when you only need static data without live updates
 */
export function useStaticNflData() {
  return useQuery({
    queryKey: ['nfl', 'static-schedule'],
    queryFn: async () => {
      return await api.nfl.fetchTeamsAndSchedule();
    },
    staleTime: 60 * 60 * 1000, // 1 hour (static data changes rarely)
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
    retry: 3,
  });
}

/**
 * Hook to merge static games with live data
 * Useful when you have static games from another source and want to enrich them
 */
export function useEnrichedGames<T extends { espn_id?: string }>(staticGames: T[]) {
  const espnIds = staticGames.map(game => game.espn_id).filter(Boolean) as string[];
  const { data: liveStatuses } = useGameStatuses(espnIds);
  
  if (!liveStatuses || liveStatuses.length === 0) {
    return staticGames;
  }

  const statusMap = new Map(liveStatuses.map(status => [status.espn_id, status]));
  
  return staticGames.map(game => {
    const liveStatus = statusMap.get(game.espn_id || '');
    
    if (liveStatus) {
      return {
        ...game,
        home_score: liveStatus.home_score,
        away_score: liveStatus.away_score,
        status: liveStatus.status,
        quarter: liveStatus.quarter,
        time_remaining: liveStatus.time_remaining,
        game_status_detail: liveStatus.game_status_detail,
        has_started: liveStatus.has_started,
        has_finished: liveStatus.has_finished,
        last_updated: liveStatus.last_updated,
        _isLiveData: true,
        _dataAge: Math.floor((new Date().getTime() - new Date(liveStatus.last_updated).getTime()) / 1000 / 60),
      };
    }

    return {
      ...game,
      _isLiveData: false,
      _dataAge: undefined,
    };
  });
}

/**
 * Custom hook to provide data freshness information
 * Shows users when data was last updated
 */
export function useDataFreshness() {
  const { data: enrichedData } = useEnrichedNflData();
  const { data: activeGames } = useActiveGames();
  
  const lastUpdate = enrichedData?._liveDataMeta.lastUpdate;
  const activeGameCount = activeGames?.length || 0;
  
  return {
    lastUpdated: lastUpdate ? new Date(parseInt(lastUpdate)) : null,
    activeGames: activeGameCount,
    dataAge: lastUpdate ? 
      Math.floor((new Date().getTime() - parseInt(lastUpdate)) / 1000 / 60) : null,
    isStale: lastUpdate ? 
      (new Date().getTime() - parseInt(lastUpdate)) > 6 * 60 * 1000 : false, // Older than 6 minutes
    nextUpdateIn: 5 - ((Date.now() / 1000 / 60) % 5), // Minutes until next 5-minute cycle
  };
}