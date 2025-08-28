import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Target, Zap, Shield, AlertTriangle, Calendar, RefreshCw } from 'lucide-react';

// Define interfaces directly in component to avoid import issues
interface ComponentPlayerData {
  position: string;
  positionFull: string;
  filename: string;
  lastUpdated: string;
  aiGenerated: boolean;
  version: string;
  content: {
    overview: {
      title: string;
      summary: string;
      keyInsights: string[];
      totalPlayers: number;
    };
    players: ComponentPlayer[];
    analysis: {
      trendingThemes: string[];
      keyFactors: string[];
      draftStrategy: string;
      riskFactors: string[];
    };
    weeklyUpdate?: {
      headline: string;
      updates: string[];
      generatedAt: string;
    };
  };
  ui: {
    displayMode: 'cards' | 'list' | 'table';
    featuredPlayers: string[];
    tierColors: { [tier: string]: string };
  };
}

interface ComponentPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  tier: 'Elite' | 'High-Upside' | 'Volatile' | 'Sleeper' | 'Bust-Risk';
  tierColor: string;
  avatarUrl?: string;
  teamLogoUrl?: string;
  quickStats: {
    top5Likelihood: number;
    projectedRank: number;
    weeklyFloor: number;
    weeklyCeiling: number;
  };
  analysis: {
    headline: string;
    strengths: string[];
    concerns: string[];
    keyFactors: string[];
    aiInsights?: {
      trendingUp: boolean;
      confidenceScore: number;
      lastNewsUpdate: string;
      riskAlert?: string;
    };
  };
  detailedStats?: {
    [key: string]: number | string;
  };
  metadata: {
    lastUpdated: string;
    dataSource: 'ai' | 'manual' | 'hybrid';
    popularity?: number;
  };
}

interface PlayerDataDisplayProps {
  position: string;
  title: string;
}

interface PlayerCardProps {
  player: ComponentPlayer;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface OverviewCardProps {
  title: string;
  summary: string;
  keyInsights: string[];
  totalPlayers: number;
  lastUpdated: string;
  weeklyUpdate?: {
    headline: string;
    updates: string[];
    generatedAt: string;
  };
}

interface AnalysisCardProps {
  trendingThemes: string[];
  keyFactors: string[];
  draftStrategy: string;
  riskFactors: string[];
}

// Overview Card Component
const OverviewCard: React.FC<OverviewCardProps> = ({ 
  title, 
  summary, 
  keyInsights, 
  totalPlayers, 
  lastUpdated, 
  weeklyUpdate 
}) => {
  return (
    <Card className="p-6 mb-6" glass={true}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/60 text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {totalPlayers} players analyzed • Updated {new Date(lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-white/80 mb-6 leading-relaxed">{summary}</p>

      {/* Key Insights */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-sky-400" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keyInsights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-sky-400 mt-2 flex-shrink-0"></div>
              <span className="text-white/80 text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Update */}
      {weeklyUpdate && (
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            This Week's Update
          </h3>
          <p className="text-yellow-200 font-medium mb-3">{weeklyUpdate.headline}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {weeklyUpdate.updates.map((update, index) => (
              <div key={index} className="text-white/70 text-sm">• {update}</div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

// Player Card Component
const PlayerCard: React.FC<PlayerCardProps> = ({ player, isExpanded, onToggleExpand }) => {
  return (
    <Card className="p-6" glass={true} hover={true}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{player.name}</h3>
          <p className="text-white/60">{player.team} • {player.position}</p>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: player.tierColor + '20', 
              color: player.tierColor,
              border: `1px solid ${player.tierColor}40`
            }}
          >
            {player.tier}
          </span>
          {player.analysis.aiInsights?.trendingUp && (
            <TrendingUp className="h-4 w-4 text-green-400" />
          )}
          {player.analysis.aiInsights?.trendingUp === false && (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.quickStats.top5Likelihood}%</div>
          <div className="text-xs text-white/60">Top-5 Chance</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">#{player.quickStats.projectedRank}</div>
          <div className="text-xs text-white/60">Projected Rank</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.quickStats.weeklyFloor}</div>
          <div className="text-xs text-white/60">Weekly Floor</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.quickStats.weeklyCeiling}</div>
          <div className="text-xs text-white/60">Weekly Ceiling</div>
        </div>
      </div>

      {/* Risk Alert */}
      {player.analysis.aiInsights?.riskAlert && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-orange-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{player.analysis.aiInsights.riskAlert}</span>
          </div>
        </div>
      )}

      {/* Headline */}
      <p className="text-white/80 mb-4 italic">{player.analysis.headline}</p>

      {/* Expandable Analysis */}
      <div className="space-y-4">
        <button
          onClick={onToggleExpand}
          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="text-white font-medium">Detailed Analysis</span>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {player.analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Concerns */}
            <div>
              <h4 className="text-orange-400 font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Concerns
              </h4>
              <ul className="space-y-2">
                {player.analysis.concerns.map((concern, index) => (
                  <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                    {concern}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Factors */}
            <div className="md:col-span-2">
              <h4 className="text-sky-400 font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Key Factors to Watch
              </h4>
              <div className="grid md:grid-cols-3 gap-2">
                {player.analysis.keyFactors.map((factor, index) => (
                  <div key={index} className="p-2 bg-sky-400/10 rounded text-sky-200 text-sm">
                    {factor}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            {player.analysis.aiInsights && (
              <div className="md:col-span-2 border-t border-white/10 pt-4">
                <h4 className="text-purple-400 font-medium mb-2">AI Confidence</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full"
                        style={{ width: `${player.analysis.aiInsights.confidenceScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-white/80 text-sm">
                    {Math.round(player.analysis.aiInsights.confidenceScore * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Analysis Card Component
const AnalysisCard: React.FC<AnalysisCardProps> = ({ 
  trendingThemes, 
  keyFactors, 
  draftStrategy, 
  riskFactors 
}) => {
  return (
    <Card className="p-6" glass={true}>
      <h3 className="text-xl font-semibold text-white mb-6">Position Analysis</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trending Themes */}
        <div>
          <h4 className="text-green-400 font-medium mb-3">Trending Themes</h4>
          <ul className="space-y-2">
            {trendingThemes.map((theme, index) => (
              <li key={index} className="text-white/70 text-sm">• {theme}</li>
            ))}
          </ul>
        </div>

        {/* Key Factors */}
        <div>
          <h4 className="text-sky-400 font-medium mb-3">Key Factors</h4>
          <ul className="space-y-2">
            {keyFactors.map((factor, index) => (
              <li key={index} className="text-white/70 text-sm">• {factor}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Draft Strategy */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-300 font-medium mb-2">Draft Strategy</h4>
        <p className="text-white/80 text-sm">{draftStrategy}</p>
      </div>

      {/* Risk Factors */}
      <div className="mt-4">
        <h4 className="text-orange-400 font-medium mb-3">Risk Factors</h4>
        <div className="grid md:grid-cols-2 gap-2">
          {riskFactors.map((risk, index) => (
            <div key={index} className="text-white/70 text-sm p-2 bg-orange-500/10 rounded">
              • {risk}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Main Component
export const PlayerDataDisplay: React.FC<PlayerDataDisplayProps> = ({ position, title }) => {
  const [data, setData] = useState<ComponentPlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set());

  const togglePlayerExpansion = (playerId: string) => {
    setExpandedPlayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/data/playerData-json/${position}.json?t=${Date.now()}`);
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
        
        setData(jsonData);
        console.log(`✅ Loaded ${jsonData.content.players.length} players for ${position}`);
        
      } catch (err) {
        console.error('Error loading player data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load player data');
      } finally {
        setIsLoading(false);
      }
    };

    if (position) {
      loadData();
    }
  }, [position]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-sky-400 animate-spin mb-4" />
        <p className="text-white/70 text-lg">Loading {title} analysis...</p>
        <p className="text-white/50 text-sm mt-1">Fetching latest player data</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center" glass={true}>
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Failed to Load {title} Data
            </h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <OverviewCard 
        title={data.content.overview.title}
        summary={data.content.overview.summary}
        keyInsights={data.content.overview.keyInsights}
        totalPlayers={data.content.overview.totalPlayers}
        lastUpdated={data.lastUpdated}
        weeklyUpdate={data.content.weeklyUpdate}
      />

      {/* Player Cards */}
      <div className="space-y-4">
        {data.content.players.map((player) => (
          <PlayerCard 
            key={player.id}
            player={player}
            isExpanded={expandedPlayers.has(player.id)}
            onToggleExpand={() => togglePlayerExpansion(player.id)}
          />
        ))}
      </div>

      {/* Position Analysis */}
      <AnalysisCard 
        trendingThemes={data.content.analysis.trendingThemes}
        keyFactors={data.content.analysis.keyFactors}
        draftStrategy={data.content.analysis.draftStrategy}
        riskFactors={data.content.analysis.riskFactors}
      />
    </div>
  );
};