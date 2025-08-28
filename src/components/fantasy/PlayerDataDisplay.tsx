import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Target, Zap, Shield, AlertTriangle, Calendar, RefreshCw, Brain, Sparkles, Search, X, Filter } from 'lucide-react';
import { useAIPlayerAnalysis } from '../../hooks/useAIAnalysis';

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
  aiInsights?: any;
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
const PlayerCard: React.FC<PlayerCardProps> = ({ player, isExpanded, onToggleExpand, aiInsights }) => {
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
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'team' | 'tier'>('tier');
  
  // AI Analysis integration
  const { players: aiPlayers, loading: aiLoading, error: aiError, refresh: refreshAI, isContentFresh } = useAIPlayerAnalysis(undefined, undefined, position);

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

  // Filter and sort players based on search query and sort option
  const filteredAndSortedPlayers = useMemo(() => {
    if (!data || !data.content || !data.content.players || !Array.isArray(data.content.players)) {
      return [];
    }
    
    let filtered = [...data.content.players];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(player => 
        player && player.name && player.team && player.tier && player.position &&
        (player.name.toLowerCase().includes(query) ||
        player.team.toLowerCase().includes(query) ||
        player.tier.toLowerCase().includes(query) ||
        player.position.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'team':
          return (a.team || '').localeCompare(b.team || '');
        case 'tier':
          // Sort by tier priority (Tier 1 first, then 2, etc.)
          const tierOrder = { 'Tier 1': 1, 'Tier 2': 2, 'Tier 3': 3, 'Tier 4': 4, 'Tier 5': 5 };
          const aTier = tierOrder[(a.tier || '') as keyof typeof tierOrder] || 999;
          const bTier = tierOrder[(b.tier || '') as keyof typeof tierOrder] || 999;
          return aTier - bTier;
        default:
          return 0;
      }
    });

    return sorted;
  }, [data, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* AI Analysis Status */}
      <Card className="p-4 mb-6" glass={true}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Player Analysis</h3>
              <p className="text-white/60 text-sm">
                {aiPlayers.length > 0 ? `${aiPlayers.length} ${position} players analyzed` : `No AI analysis for ${position} players yet`}
                {aiPlayers.length > 0 && (
                  <span className={`ml-2 ${isContentFresh ? 'text-green-400' : 'text-orange-400'}`}>
                    • {isContentFresh ? 'Fresh' : 'Needs Update'}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {aiError && (
              <div className="text-red-400 text-sm mr-2">
                AI analysis unavailable
              </div>
            )}
            <Button
              onClick={() => refreshAI({ type: 'players' })}
              disabled={aiLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {aiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {aiLoading ? 'Analyzing...' : 'Refresh AI'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Player Search and Filter */}
      <Card className="p-4" glass={true}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-white/60" />
            <h3 className="text-lg font-semibold text-white">
              {filteredAndSortedPlayers.length} {position} Players
              {searchQuery && ` matching "${searchQuery}"`}
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'team' | 'tier')}
                className="bg-white/10 border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-transparent"
              >
                <option value="tier">Sort by Tier</option>
                <option value="name">Sort by Name</option>
                <option value="team">Sort by Team</option>
              </select>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${position.toLowerCase()} players...`}
                className="pl-8 pr-8 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-transparent min-w-[200px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchQuery && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">
                {filteredAndSortedPlayers.length === 0 
                  ? 'No players found' 
                  : `Found ${filteredAndSortedPlayers.length} of ${data?.content?.players?.length || 0} players`
                }
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sky-400 hover:text-sky-300 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </Card>

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
        {filteredAndSortedPlayers.length === 0 && searchQuery ? (
          <Card className="p-8 text-center" glass={true}>
            <Search className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No players found</h3>
            <p className="text-white/60 mb-4">
              No {position.toLowerCase()} players match "{searchQuery}"
            </p>
            <Button
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="mx-auto"
            >
              Clear search
            </Button>
          </Card>
        ) : (
          filteredAndSortedPlayers.map((player) => {
          // Find matching AI insights for this player
          const playerAIInsights = aiPlayers?.find(aiPlayer => 
            aiPlayer && player &&
            aiPlayer.name && player.name &&
            (aiPlayer.name === player.name || 
            aiPlayer.id === player.id ||
            aiPlayer.name.toLowerCase().includes(player.name.toLowerCase()) ||
            player.name.toLowerCase().includes(aiPlayer.name.toLowerCase()))
          );
          
          return (
            <PlayerCard 
              key={player?.id || `player-${Math.random()}`}
              player={player}
              isExpanded={player?.id ? expandedPlayers.has(player.id) : false}
              onToggleExpand={() => player?.id && togglePlayerExpansion(player.id)}
              aiInsights={playerAIInsights}
            />
          );
        })
        )}
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