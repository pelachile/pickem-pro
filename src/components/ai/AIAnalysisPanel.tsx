import React, { useState } from 'react';
import { useAIAnalysisStatus } from '../../hooks/useAIAnalysis';
import { AIAnalysisService } from '../../services/aiAnalysisService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { StatusBadge } from '../ui/StatusBadge';

interface AIAnalysisPanelProps {
  className?: string;
}

export function AIAnalysisPanel({ className = '' }: AIAnalysisPanelProps) {
  const { teamsAnalyzed, playersAnalyzed, lastUpdate, cacheHitRate, loading, refresh } = useAIAnalysisStatus();
  const [triggering, setTriggering] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleTriggerAnalysis = async (type: 'full' | 'teams' | 'players' | 'insights') => {
    setTriggering(type);
    setMessage(null);
    
    try {
      const result = await AIAnalysisService.triggerAnalysis({ type });
      setMessage(`✅ ${result.message}`);
      
      // Refresh status after a delay
      setTimeout(() => {
        refresh();
      }, 2000);
    } catch (error) {
      setMessage(`❌ Failed to trigger analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTriggering(null);
    }
  };

  const formatLastUpdate = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getStatusColor = (timestamp: string | null) => {
    if (!timestamp) return 'red';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 6) return 'green';
    if (diffInHours < 24) return 'yellow';
    return 'red';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">AI Analysis Status</h3>
          <StatusBadge 
            text={lastUpdate ? 'Active' : 'Inactive'} 
            variant={getStatusColor(lastUpdate) as 'green' | 'yellow' | 'red'} 
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{teamsAnalyzed}</div>
            <div className="text-sm text-gray-400">Teams Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{playersAnalyzed}</div>
            <div className="text-sm text-gray-400">Players Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{Math.round(cacheHitRate * 100)}%</div>
            <div className="text-sm text-gray-400">Cache Hit Rate</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-white">{formatLastUpdate(lastUpdate)}</div>
            <div className="text-sm text-gray-400">Last Update</div>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300">{message}</p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Trigger AI Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              onClick={() => handleTriggerAnalysis('full')}
              disabled={triggering !== null || loading}
              size="sm"
              className="relative"
            >
              {triggering === 'full' && <LoadingSpinner size="sm" className="mr-2" />}
              Full Analysis
            </Button>
            
            <Button
              onClick={() => handleTriggerAnalysis('teams')}
              disabled={triggering !== null || loading}
              variant="outline"
              size="sm"
              className="relative"
            >
              {triggering === 'teams' && <LoadingSpinner size="sm" className="mr-2" />}
              Teams Only
            </Button>
            
            <Button
              onClick={() => handleTriggerAnalysis('players')}
              disabled={triggering !== null || loading}
              variant="outline"
              size="sm"
              className="relative"
            >
              {triggering === 'players' && <LoadingSpinner size="sm" className="mr-2" />}
              Players Only
            </Button>
            
            <Button
              onClick={() => handleTriggerAnalysis('insights')}
              disabled={triggering !== null || loading}
              variant="outline"
              size="sm"
              className="relative"
            >
              {triggering === 'insights' && <LoadingSpinner size="sm" className="mr-2" />}
              Insights Only
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>• Full analysis processes teams, players, and league insights</p>
          <p>• Analysis typically takes 2-5 minutes to complete</p>
          <p>• Results are cached for 7 days to optimize performance and costs</p>
        </div>
      </Card>
    </div>
  );
}

export default AIAnalysisPanel;