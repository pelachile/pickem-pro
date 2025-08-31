import React from 'react';
import { Card } from '../ui/Card';
import { 
  Trophy, 
  Target, 
  Shield, 
  Zap, 
  TrendingUp, 
  Activity,
  BarChart3,
  Star,
  Gauge
} from 'lucide-react';

interface TeamStatsGridProps {
  teamData?: {
    record?: {
      wins: number;
      losses: number;
      ties: number;
    };
    aiAnalysis?: {
      power_ranking?: number;
      playoff_odds?: number;
      trending_direction?: 'up' | 'down' | 'stable';
      confidence_score?: number;
      performance_metrics?: {
        offensive_rank: number;
        defensive_rank: number;
        special_teams_rank: number;
        redzone_efficiency: number;
        turnover_differential: number;
      };
      strengths?: string[];
      weaknesses?: string[];
    };
  };
  className?: string;
  showAdvancedMetrics?: boolean;
}

const TeamStatsGrid: React.FC<TeamStatsGridProps> = ({
  teamData,
  className = '',
  showAdvancedMetrics = true
}) => {
  if (!teamData) return null;

  const { record, aiAnalysis } = teamData;

  const getRankColor = (rank: number, total: number = 32) => {
    const percentage = rank / total;
    if (percentage <= 0.25) return 'text-green-400';
    if (percentage <= 0.5) return 'text-yellow-400';
    if (percentage <= 0.75) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTrendingColor = () => {
    switch (aiAnalysis?.trending_direction) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Core Team Metrics */}
      <Card className="p-6" glass={true}>
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-white">Team Performance</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Win Percentage */}
          {record && (
            <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/8 transition-colors">
              <div className="text-2xl font-bold text-white">
                {((record.wins / (record.wins + record.losses + record.ties)) * 100).toFixed(1)}%
              </div>
              <div className="text-white/60 text-sm mt-1">Win Rate</div>
            </div>
          )}

          {/* Power Ranking */}
          {aiAnalysis?.power_ranking && (
            <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/8 transition-colors">
              <div className={`text-2xl font-bold ${getRankColor(aiAnalysis.power_ranking)}`}>
                #{aiAnalysis.power_ranking}
              </div>
              <div className="text-white/60 text-sm mt-1">Power Rank</div>
            </div>
          )}

          {/* Playoff Odds */}
          {aiAnalysis?.playoff_odds && (
            <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/8 transition-colors relative group">
              <div className="text-2xl font-bold text-green-400">
                {aiAnalysis.playoff_odds}%
              </div>
              <div className="text-white/60 text-sm mt-1">Playoff Odds</div>
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full transition-all duration-700 group-hover:shadow-lg group-hover:shadow-green-500/25"
                  style={{ width: `${Math.min(aiAnalysis.playoff_odds, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Team Momentum */}
          {aiAnalysis?.trending_direction && (
            <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/8 transition-colors">
              <div className={`text-2xl font-bold ${getTrendingColor()} capitalize`}>
                {aiAnalysis.trending_direction}
              </div>
              <div className="text-white/60 text-sm mt-1">Momentum</div>
              <div className="flex justify-center mt-2">
                {aiAnalysis.trending_direction === 'up' && <TrendingUp className={`h-4 w-4 ${getTrendingColor()}`} />}
                {aiAnalysis.trending_direction === 'down' && <TrendingUp className={`h-4 w-4 ${getTrendingColor()} rotate-180`} />}
                {aiAnalysis.trending_direction === 'stable' && <Activity className={`h-4 w-4 ${getTrendingColor()}`} />}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Advanced Performance Metrics */}
      {showAdvancedMetrics && aiAnalysis?.performance_metrics && (
        <Card className="p-6" glass={true}>
          <div className="flex items-center gap-3 mb-6">
            <Gauge className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Advanced Metrics</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Offensive Rank */}
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-sm">Offense</div>
                  <div className={`text-xl font-bold ${getRankColor(aiAnalysis.performance_metrics.offensive_rank)}`}>
                    #{aiAnalysis.performance_metrics.offensive_rank}
                  </div>
                </div>
                <Zap className="h-8 w-8 text-blue-400 opacity-60" />
              </div>
            </div>

            {/* Defensive Rank */}
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-sm">Defense</div>
                  <div className={`text-xl font-bold ${getRankColor(aiAnalysis.performance_metrics.defensive_rank)}`}>
                    #{aiAnalysis.performance_metrics.defensive_rank}
                  </div>
                </div>
                <Shield className="h-8 w-8 text-red-400 opacity-60" />
              </div>
            </div>

            {/* Special Teams */}
            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-sm">Special Teams</div>
                  <div className={`text-xl font-bold ${getRankColor(aiAnalysis.performance_metrics.special_teams_rank)}`}>
                    #{aiAnalysis.performance_metrics.special_teams_rank}
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-400 opacity-60" />
              </div>
            </div>

            {/* Red Zone Efficiency */}
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-sm">Red Zone %</div>
                  <div className="text-xl font-bold text-green-400">
                    {aiAnalysis.performance_metrics.redzone_efficiency}%
                  </div>
                </div>
                <Target className="h-8 w-8 text-green-400 opacity-60" />
              </div>
            </div>

            {/* Turnover Differential */}
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-sm">Turnover +/-</div>
                  <div className={`text-xl font-bold ${
                    aiAnalysis.performance_metrics.turnover_differential >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {aiAnalysis.performance_metrics.turnover_differential >= 0 ? '+' : ''}{aiAnalysis.performance_metrics.turnover_differential}
                  </div>
                </div>
                <Activity className="h-8 w-8 text-purple-400 opacity-60" />
              </div>
            </div>

            {/* AI Confidence Score */}
            {aiAnalysis.confidence_score && (
              <div className="p-4 bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/70 text-sm">AI Confidence</div>
                    <div className="text-xl font-bold text-sky-400">
                      {Math.round(aiAnalysis.confidence_score * 100)}%
                    </div>
                  </div>
                  <Gauge className="h-8 w-8 text-sky-400 opacity-60" />
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Strengths and Weaknesses Quick View */}
      {(aiAnalysis?.strengths?.length || aiAnalysis?.weaknesses?.length) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Strengths */}
          {aiAnalysis.strengths?.length && (
            <Card className="p-6" glass={true}>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Key Strengths</h3>
              </div>
              <div className="space-y-2">
                {aiAnalysis.strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-green-500/10 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-white/80 text-sm leading-relaxed">{strength}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Top Concerns */}
          {aiAnalysis.weaknesses?.length && (
            <Card className="p-6" glass={true}>
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-5 w-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Areas to Watch</h3>
              </div>
              <div className="space-y-2">
                {aiAnalysis.weaknesses.slice(0, 3).map((weakness, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-orange-500/10 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-white/80 text-sm leading-relaxed">{weakness}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamStatsGrid;