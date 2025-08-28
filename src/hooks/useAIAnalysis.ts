import { useState, useEffect, useCallback } from 'react';
import { AIAnalysisService, type TeamAnalysis, type PlayerAnalysis, type LeagueInsights, type AIAnalysisRequest } from '../services/aiAnalysisService';

interface UseAIAnalysisState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export function useAITeamAnalysis(abbreviation?: string, seasonYear?: number) {
  const [state, setState] = useState<UseAIAnalysisState>({
    loading: false,
    error: null,
    lastUpdated: null
  });
  const [teams, setTeams] = useState<TeamAnalysis[]>([]);

  const fetchTeams = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const teamData = await AIAnalysisService.getTeamAnalysis(abbreviation, seasonYear);
      setTeams(teamData);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        lastUpdated: teamData[0]?.ai_last_updated || null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch team analysis' 
      }));
    }
  }, [abbreviation, seasonYear]);

  const refresh = useCallback(async (params?: AIAnalysisRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Trigger new AI analysis
      await AIAnalysisService.triggerAnalysis({ ...params, type: 'teams' });
      
      // Fetch updated data after a brief delay
      setTimeout(() => {
        fetchTeams();
      }, 2000);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to refresh team analysis' 
      }));
    }
  }, [fetchTeams]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refresh,
    isContentFresh: AIAnalysisService.isContentFresh(state.lastUpdated || undefined)
  };
}

export function useAIPlayerAnalysis(playerId?: string, team?: string, position?: string) {
  const [state, setState] = useState<UseAIAnalysisState>({
    loading: false,
    error: null,
    lastUpdated: null
  });
  const [players, setPlayers] = useState<PlayerAnalysis[]>([]);

  const fetchPlayers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const playerData = await AIAnalysisService.getPlayerAnalysis(playerId, team, position);
      setPlayers(playerData);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        lastUpdated: playerData[0]?.ai_last_updated || null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch player analysis' 
      }));
    }
  }, [playerId, team, position]);

  const refresh = useCallback(async (params?: AIAnalysisRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Trigger new AI analysis
      await AIAnalysisService.triggerAnalysis({ ...params, type: 'players' });
      
      // Fetch updated data after a brief delay
      setTimeout(() => {
        fetchPlayers();
      }, 2000);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to refresh player analysis' 
      }));
    }
  }, [fetchPlayers]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return {
    players,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refresh,
    isContentFresh: AIAnalysisService.isContentFresh(state.lastUpdated || undefined)
  };
}

export function useLeagueInsights(week?: number, season?: number) {
  const [state, setState] = useState<UseAIAnalysisState>({
    loading: false,
    error: null,
    lastUpdated: null
  });
  const [insights, setInsights] = useState<LeagueInsights | null>(null);

  const fetchInsights = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const insightsData = await AIAnalysisService.getLeagueInsights(week, season);
      setInsights(insightsData);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        lastUpdated: insightsData?.ai_last_updated || null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch league insights' 
      }));
    }
  }, [week, season]);

  const refresh = useCallback(async (params?: AIAnalysisRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Trigger new AI analysis
      await AIAnalysisService.triggerAnalysis({ ...params, type: 'insights' });
      
      // Fetch updated data after a brief delay
      setTimeout(() => {
        fetchInsights();
      }, 2000);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to refresh league insights' 
      }));
    }
  }, [fetchInsights]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refresh,
    isContentFresh: AIAnalysisService.isContentFresh(state.lastUpdated || undefined)
  };
}

export function useAIAnalysisStatus() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    teamsAnalyzed: 0,
    playersAnalyzed: 0,
    lastUpdate: null as string | null,
    cacheHitRate: 0
  });

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const statusData = await AIAnalysisService.getAnalysisStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Failed to fetch AI analysis status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return {
    ...status,
    loading,
    refresh: fetchStatus
  };
}