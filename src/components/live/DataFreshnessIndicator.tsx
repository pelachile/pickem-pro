/**
 * Data Freshness Indicator Component
 * Shows users when data was last updated and if live data is available
 */

import React from 'react';
import { Clock, Wifi, WifiOff } from 'lucide-react';
import { useDataFreshness } from '../../hooks/useLiveData';

interface DataFreshnessIndicatorProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function DataFreshnessIndicator({ 
  variant = 'compact', 
  className = '' 
}: DataFreshnessIndicatorProps) {
  const { lastUpdated, activeGames, dataAge, isStale, nextUpdateIn } = useDataFreshness();

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs text-white/70 ${className}`}>
        {activeGames > 0 ? (
          <>
            <Wifi className="h-3 w-3 text-green-400" />
            <span>Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 text-white/50" />
            <span>Static</span>
          </>
        )}
        {dataAge !== null && (
          <>
            <Clock className="h-3 w-3" />
            <span>{dataAge}m ago</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-white/5 border border-white/10 p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">Data Status</h3>
        {activeGames > 0 ? (
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <Wifi className="h-3 w-3" />
            <span>Live Updates</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-white/50 text-xs">
            <WifiOff className="h-3 w-3" />
            <span>Static Data</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1 text-xs">
        {lastUpdated ? (
          <div className="flex items-center justify-between">
            <span className="text-white/60">Last Updated:</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={isStale ? 'text-yellow-400' : 'text-white'}>
                {dataAge !== null ? `${dataAge} min ago` : 'Just now'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-white/60">Status:</span>
            <span className="text-white/70">Loading...</span>
          </div>
        )}
        
        {activeGames > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-white/60">Active Games:</span>
            <span className="text-green-400 font-medium">{activeGames}</span>
          </div>
        )}
        
        {activeGames > 0 && nextUpdateIn > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-white/60">Next Update:</span>
            <span className="text-sky-400">~{Math.ceil(nextUpdateIn)}m</span>
          </div>
        )}
        
        {isStale && (
          <div className="text-yellow-400 text-xs mt-1">
            ⚠️ Data may be stale
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Live Game Status Badge
 * Shows live status for individual games
 */
interface LiveGameStatusProps {
  game: {
    _isLiveData?: boolean;
    _dataAge?: number;
    has_started?: boolean;
    has_finished?: boolean;
    status?: string;
  };
  className?: string;
}

export function LiveGameStatus({ game, className = '' }: LiveGameStatusProps) {
  if (!game._isLiveData) {
    return null;
  }

  const getStatusColor = () => {
    if (game.status === 'in_progress') return 'text-red-400 bg-red-400/20';
    if (game.has_finished) return 'text-green-400 bg-green-400/20';
    if (game.has_started) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-blue-400 bg-blue-400/20';
  };

  const getStatusText = () => {
    if (game.status === 'in_progress') return 'LIVE';
    if (game.has_finished) return 'FINAL';
    if (game.has_started) return 'STARTED';
    return 'SCHEDULED';
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor()} ${className}`}>
      {game.status === 'in_progress' && (
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
      )}
      <span>{getStatusText()}</span>
      {game._dataAge !== undefined && game._dataAge > 5 && (
        <span className="text-white/60">({game._dataAge}m)</span>
      )}
    </div>
  );
}

/**
 * Team Record Display with Live Data
 */
interface LiveTeamRecordProps {
  team: {
    _record?: string;
    _win_percentage?: number;
    name?: string;
  };
  className?: string;
}

export function LiveTeamRecord({ team, className = '' }: LiveTeamRecordProps) {
  if (!team._record) {
    return null;
  }

  const winPct = team._win_percentage || 0;
  const getRecordColor = () => {
    if (winPct >= 0.7) return 'text-green-400';
    if (winPct >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`inline-flex items-center gap-1 text-xs ${className}`}>
      <span className={`font-medium ${getRecordColor()}`}>
        {team._record}
      </span>
      {team._win_percentage !== undefined && (
        <span className="text-white/60">
          ({(winPct * 100).toFixed(1)}%)
        </span>
      )}
    </div>
  );
}