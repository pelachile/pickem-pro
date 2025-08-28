import { useState, useEffect, useCallback } from 'react';
import { ComponentPlayerData, ComponentPlayer } from '../../types/componentData';

// Define ComponentPlayerDataResult here to avoid import issues
export interface ComponentPlayerDataResult {
  data: ComponentPlayerData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastRefresh: string | null;
  cacheAge: number; // minutes since last fetch
}

// Re-export types for component use
export { ComponentPlayer };
export type { ComponentPlayerData };

// Configuration
const CDN_BASE_URL = process.env.VITE_PLAYER_DATA_CDN || '/data/playerData-json';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Enhanced hook for consuming JSON player data from S3/CDN
 * Replaces usePlayerData for AI-enhanced JSON format
 */
export const usePlayerDataJSON = (position: string): ComponentPlayerDataResult => {
  const [data, setData] = useState<ComponentPlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const loadPlayerData = useCallback(async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check cache first (unless force refresh)
      const cacheKey = `player-data-${position}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);
      
      const now = Date.now();
      const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;
      
      if (!forceRefresh && cachedData && cacheAge < CACHE_DURATION) {
        console.log(`📦 Using cached data for ${position} (age: ${Math.round(cacheAge / 1000 / 60)}min)`);
        const parsed: ComponentPlayerData = JSON.parse(cachedData);
        setData(parsed);
        setLastRefresh(cacheTimestamp ? new Date(parseInt(cacheTimestamp)).toISOString() : null);
        setIsLoading(false);
        return;
      }

      // Fetch from CDN/S3
      const url = `${CDN_BASE_URL}/${position}.json?t=${now}`;
      console.log(`🌐 Fetching player data from: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No player data found for ${position}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const jsonData: ComponentPlayerData = await response.json();
      
      // Validate data structure
      if (!jsonData.content || !jsonData.content.players) {
        throw new Error('Invalid player data format received');
      }
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(jsonData));
      localStorage.setItem(`${cacheKey}-timestamp`, now.toString());
      
      setData(jsonData);
      setLastRefresh(new Date().toISOString());
      
      console.log(`✅ Loaded ${jsonData.content.players.length} players for ${position}`);
      
    } catch (err) {
      console.error('Error loading player data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load player data');
      
      // Try to use stale cache on error
      const cacheKey = `player-data-${position}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        console.log('📦 Using stale cached data due to fetch error');
        try {
          const parsed: ComponentPlayerData = JSON.parse(cachedData);
          setData(parsed);
          setError(`Using cached data (${err instanceof Error ? err.message : 'Network error'})`);
        } catch (parseError) {
          console.error('Failed to parse cached data:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [position]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await loadPlayerData(true);
  }, [loadPlayerData]);

  // Calculate cache age
  const cacheAge = lastRefresh ? Math.round((Date.now() - new Date(lastRefresh).getTime()) / 1000 / 60) : 0;

  useEffect(() => {
    if (position) {
      loadPlayerData(false);
    }
  }, [position, loadPlayerData]);

  return { 
    data, 
    isLoading, 
    error, 
    refresh, 
    lastRefresh, 
    cacheAge 
  };
};

// Utility functions for working with the new data format

export const getPlayersByTier = (data: ComponentPlayerData, tier: string) => {
  return data.content.players.filter(player => player.tier === tier);
};

export const getFeaturedPlayers = (data: ComponentPlayerData) => {
  return data.content.players.filter(player => 
    data.ui.featuredPlayers.includes(player.id)
  );
};

export const getTopPlayers = (data: ComponentPlayerData, count: number = 5) => {
  return data.content.players
    .sort((a, b) => b.quickStats.top5Likelihood - a.quickStats.top5Likelihood)
    .slice(0, count);
};

export const hasRecentAIUpdate = (player: ComponentPlayer): boolean => {
  if (!player.analysis.aiInsights) return false;
  
  const updateTime = new Date(player.analysis.aiInsights.lastNewsUpdate).getTime();
  const now = Date.now();
  const hoursSinceUpdate = (now - updateTime) / (1000 * 60 * 60);
  
  return hoursSinceUpdate < 24; // Updated within 24 hours
};

// Type guard
export const isComponentPlayerData = (data: any): data is ComponentPlayerData => {
  return data && 
         typeof data.position === 'string' &&
         data.content && 
         Array.isArray(data.content.players);
};

// Re-export types for convenience
export type { ComponentPlayer, ComponentPlayerData } from '../../types/componentData';