/**
 * Development component to track Phase 3 migration progress
 * Shows feature flag status and performance metrics
 */

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Activity,
  BarChart3,
  Settings,
} from 'lucide-react';
import { isFeatureEnabled } from '../../lib/supabase';
import { useLeaguePerformanceMetrics } from '../../hooks/useLeague';

interface MigrationStatusProps {
  isVisible?: boolean;
}

export default function MigrationStatus({ isVisible = false }: MigrationStatusProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const performanceMetrics = useLeaguePerformanceMetrics();

  // Feature flag status
  const featureFlags = {
    'Direct League Queries': isFeatureEnabled('use_direct_league_queries'),
    'Direct Member Queries': isFeatureEnabled('use_direct_member_queries'),
    'Direct Pick Queries': isFeatureEnabled('use_direct_pick_queries'),
    'Realtime Subscriptions': isFeatureEnabled('use_realtime_subscriptions'),
    'Optimistic Updates': isFeatureEnabled('enable_optimistic_updates'),
  };

  const enabledFeatures = Object.values(featureFlags).filter(Boolean).length;
  const totalFeatures = Object.keys(featureFlags).length;
  const progressPercentage = Math.round((enabledFeatures / totalFeatures) * 100);

  // Mock progress tracking (in real implementation, this would come from actual migration tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = performanceMetrics.getCacheStats();
      const newLog = `${new Date().toLocaleTimeString()}: Cache stats - Queries: ${stats.totalQueries}, League queries: ${stats.leagueQueries}, Subscriptions: ${stats.activeSubscriptions}`;
      
      setLogs(prev => {
        const updated = [...prev, newLog];
        return updated.slice(-10); // Keep only last 10 logs
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [performanceMetrics]);

  if (!isVisible && import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-navy-900/90 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-full ${progressPercentage === 100 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
              {progressPercentage === 100 ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-400" />
              )}
            </div>
            <span className="text-white text-sm font-medium">
              Phase 3 Migration
            </span>
            <span className="text-sky-400 text-xs font-mono">
              {progressPercentage}%
            </span>
          </div>
          <Settings className={`h-4 w-4 text-white/60 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </div>

        {/* Progress bar */}
        <div className="px-3 pb-2">
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${progressPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Detailed view */}
        {showDetails && (
          <div className="border-t border-white/10 p-4 space-y-4">
            {/* Feature Flags */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-2 flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Feature Flags</span>
              </h4>
              <div className="space-y-1">
                {Object.entries(featureFlags).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between text-xs">
                    <span className="text-white/80">{feature}</span>
                    <div className={`flex items-center space-x-1 ${enabled ? 'text-green-400' : 'text-gray-400'}`}>
                      {enabled ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span>{enabled ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-2 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Performance</span>
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Using Direct DB:</span>
                  <span className={performanceMetrics.isUsingDirectDB ? 'text-green-400' : 'text-gray-400'}>
                    {performanceMetrics.isUsingDirectDB ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Realtime Active:</span>
                  <span className={performanceMetrics.isRealtimeEnabled ? 'text-green-400' : 'text-gray-400'}>
                    {performanceMetrics.isRealtimeEnabled ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Cache Queries:</span>
                  <span className="text-sky-400">
                    {performanceMetrics.getCacheStats().totalQueries}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Subscriptions:</span>
                  <span className="text-sky-400">
                    {performanceMetrics.getCacheStats().activeSubscriptions}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-2 flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Activity Log</span>
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.slice(-5).map((log, index) => (
                    <div key={index} className="text-xs text-white/60 font-mono">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-white/40">No recent activity</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2 border-t border-white/10">
              <button
                onClick={() => performanceMetrics.clearLeagueCache()}
                className="flex-1 px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white transition-colors"
              >
                Clear Cache
              </button>
              <button
                onClick={() => setLogs([])}
                className="flex-1 px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white transition-colors"
              >
                Clear Logs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to easily show migration status in development
export function useMigrationStatus() {
  return {
    isVisible: import.meta.env.DEV,
    progressPercentage: Math.round(
      (Object.values({
        directLeague: isFeatureEnabled('use_direct_league_queries'),
        directMember: isFeatureEnabled('use_direct_member_queries'),
        directPick: isFeatureEnabled('use_direct_pick_queries'),
        realtime: isFeatureEnabled('use_realtime_subscriptions'),
        optimistic: isFeatureEnabled('enable_optimistic_updates'),
      }).filter(Boolean).length / 5) * 100
    ),
  };
}
