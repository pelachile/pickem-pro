import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Target, Zap, Shield, AlertTriangle, Calendar, RefreshCw, Trophy, Users, Brain, Sparkles } from 'lucide-react';
import { useAITeamAnalysis } from '../../hooks/useAIAnalysis';

// Define interfaces directly in component to avoid import issues
interface ComponentTeamData {
  conference: string;
  conferenceFull: string;
  filename: string;
  lastUpdated: string;
  aiGenerated: boolean;
  version: string;
  content: {
    overview: {
      title: string;
      summary: string;
      keyInsights: string[];
      totalTeams: number;
    };
    teams: ComponentTeam[];
    analysis: {
      trendingThemes: string[];
      keyFactors: string[];
      seasonOutlook: string;
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
    featuredTeams: string[];
    conferenceColors: { [conference: string]: string };
  };
}

interface ComponentTeam {
  id: string;
  name: string;
  location: string;
  abbreviation: string;
  displayName: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  tier: 'Contender' | 'Playoff-Bound' | 'Competitive' | 'Rebuilding' | 'Struggling';
  tierColor: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  
  quickStats: {
    playoffOdds: number;
    projectedWins: number;
    strengthOfSchedule: number;
    powerRanking: number;
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
  
  seasonStats?: {
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    pointsAgainst: number;
    pointDifferential: number;
    divisionRecord: string;
    conferenceRecord: string;
  };
  
  keyPlayers?: {
    quarterback: string;
    topSkillPlayer: string;
    defensiveLeader: string;
  };
  
  metadata: {
    lastUpdated: string;
    dataSource: 'ai' | 'manual' | 'hybrid';
    espnId: string;
  };
}

interface TeamDataDisplayProps {
  conference: string;
  title: string;
}

interface TeamCardProps {
  team: ComponentTeam;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface OverviewCardProps {
  title: string;
  summary: string;
  keyInsights: string[];
  totalTeams: number;
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
  seasonOutlook: string;
  riskFactors: string[];
}

// Overview Card Component
const OverviewCard: React.FC<OverviewCardProps> = ({ 
  title, 
  summary, 
  keyInsights, 
  totalTeams, 
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
            {totalTeams} teams analyzed • Updated {new Date(lastUpdated).toLocaleDateString()}
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

// Team Card Component
const TeamCard: React.FC<TeamCardProps & { aiInsights?: any }> = ({ team, isExpanded, onToggleExpand, aiInsights }) => {
  const getDivisionColor = (division: string, conference: string) => {
    const colorMap = {
      'AFC North': '#6366f1', // Indigo
      'AFC South': '#10b981', // Emerald
      'AFC East': '#3b82f6', // Blue
      'AFC West': '#f59e0b', // Amber
      'NFC North': '#8b5cf6', // Violet
      'NFC South': '#06b6d4', // Cyan
      'NFC East': '#ec4899', // Pink
      'NFC West': '#ef4444', // Red
    };
    return colorMap[`${conference} ${division}` as keyof typeof colorMap] || '#64748b';
  };

  const divisionColor = getDivisionColor(team.division, team.conference);

  return (
    <Card className="p-6" glass={true} hover={true}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {team.logoUrl && (
            <img 
              src={team.logoUrl} 
              alt={`${team.name} logo`} 
              className="w-12 h-12 object-contain"
            />
          )}
          <div>
            <Link 
              to="/team/$teamId" 
              params={{ teamId: team.abbreviation }} 
              className="text-xl font-semibold text-white hover:text-sky-400 transition-colors"
            >
              {team.displayName}
            </Link>
            <p className="text-white/60">{team.conference} {team.division}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: divisionColor + '20', 
              color: divisionColor,
              border: `1px solid ${divisionColor}40`
            }}
          >
            {team.conference} {team.division}
          </div>
          <span 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: team.tierColor + '20', 
              color: team.tierColor,
              border: `1px solid ${team.tierColor}40`
            }}
          >
            {team.tier}
          </span>
          {team.analysis.aiInsights?.trendingUp && (
            <TrendingUp className="h-4 w-4 text-green-400" />
          )}
          {team.analysis.aiInsights?.trendingUp === false && (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{team.quickStats.playoffOdds}%</div>
          <div className="text-xs text-white/60">Playoff Odds</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{team.quickStats.projectedWins}</div>
          <div className="text-xs text-white/60">Proj. Wins</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">#{team.quickStats.powerRanking}</div>
          <div className="text-xs text-white/60">Power Rank</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">#{team.quickStats.strengthOfSchedule}</div>
          <div className="text-xs text-white/60">SOS Rank</div>
        </div>
      </div>

      {/* Key Players */}
      {team.keyPlayers && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Key Players
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-white/60">QB: </span>
              <span className="text-white">{team.keyPlayers.quarterback}</span>
            </div>
            <div>
              <span className="text-white/60">Skill: </span>
              <span className="text-white">{team.keyPlayers.topSkillPlayer}</span>
            </div>
            <div>
              <span className="text-white/60">Defense: </span>
              <span className="text-white">{team.keyPlayers.defensiveLeader}</span>
            </div>
          </div>
        </div>
      )}

      {/* Season Record */}
      {team.seasonStats && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Season Record
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/60">Record: </span>
              <span className="text-white">{team.seasonStats.wins}-{team.seasonStats.losses}</span>
              {team.seasonStats.ties > 0 && <span className="text-white">-{team.seasonStats.ties}</span>}
            </div>
            <div>
              <span className="text-white/60">Div: </span>
              <span className="text-white">{team.seasonStats.divisionRecord}</span>
            </div>
            <div>
              <span className="text-white/60">Conf: </span>
              <span className="text-white">{team.seasonStats.conferenceRecord}</span>
            </div>
            <div>
              <span className="text-white/60">Diff: </span>
              <span className={`${team.seasonStats.pointDifferential >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {team.seasonStats.pointDifferential >= 0 ? '+' : ''}{team.seasonStats.pointDifferential}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Risk Alert */}
      {team.analysis.aiInsights?.riskAlert && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-orange-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{team.analysis.aiInsights.riskAlert}</span>
          </div>
        </div>
      )}

      {/* Headline */}
      <p className="text-white/80 mb-4 italic">{team.analysis.headline}</p>

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
                {team.analysis.strengths.map((strength, index) => (
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
                {team.analysis.concerns.map((concern, index) => (
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
                {team.analysis.keyFactors.map((factor, index) => (
                  <div key={index} className="p-2 bg-sky-400/10 rounded text-sky-200 text-sm">
                    {factor}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            {(team.analysis.aiInsights || aiInsights) && (
              <div className="md:col-span-2 border-t border-white/10 pt-4">
                <h4 className="text-purple-400 font-medium mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Analysis
                </h4>
                
                {/* Static AI insights from team data */}
                {team.analysis.aiInsights && (
                  <div className="mb-4">
                    <h5 className="text-white/80 text-sm mb-2">Confidence Score</h5>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-purple-400 h-2 rounded-full"
                            style={{ width: `${team.analysis.aiInsights.confidenceScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-white/80 text-sm">
                        {Math.round(team.analysis.aiInsights.confidenceScore * 100)}%
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Live AI insights from Lambda */}
                {aiInsights && (
                  <div className="space-y-3">
                    {aiInsights.season_outlook && (
                      <div>
                        <h5 className="text-white/80 text-sm mb-1">Season Outlook</h5>
                        <p className="text-white/70 text-sm bg-purple-500/10 p-3 rounded-lg">
                          {aiInsights.season_outlook}
                        </p>
                      </div>
                    )}
                    
                    {aiInsights.weekly_highlights && (
                      <div>
                        <h5 className="text-white/80 text-sm mb-1">This Week</h5>
                        <p className="text-white/70 text-sm bg-blue-500/10 p-3 rounded-lg">
                          {aiInsights.weekly_highlights}
                        </p>
                      </div>
                    )}
                    
                    {aiInsights.key_injuries && aiInsights.key_injuries.length > 0 && (
                      <div>
                        <h5 className="text-white/80 text-sm mb-2">Injury Report</h5>
                        <div className="space-y-2">
                          {aiInsights.key_injuries.map((injury: any, idx: number) => (
                            <div key={idx} className="bg-orange-500/10 p-2 rounded text-sm">
                              <span className="text-orange-200 font-medium">{injury.player}</span>
                              <span className="text-white/60 ml-2">- {injury.injury}</span>
                              {injury.impact && (
                                <div className="text-orange-300 text-xs mt-1">{injury.impact}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {aiInsights.ai_last_updated && (
                      <div className="text-xs text-white/50 pt-2 border-t border-white/10">
                        AI updated: {new Date(aiInsights.ai_last_updated).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
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
  seasonOutlook, 
  riskFactors 
}) => {
  return (
    <Card className="p-6" glass={true}>
      <h3 className="text-xl font-semibold text-white mb-6">Conference Analysis</h3>
      
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

      {/* Season Outlook */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-300 font-medium mb-2">Season Outlook</h4>
        <p className="text-white/80 text-sm">{seasonOutlook}</p>
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
export const TeamDataDisplay: React.FC<TeamDataDisplayProps> = ({ conference, title }) => {
  const [data, setData] = useState<ComponentTeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  
  // AI Analysis integration
  const { teams: aiTeams, loading: aiLoading, error: aiError, refresh: refreshAI, isContentFresh } = useAITeamAnalysis();

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/data/teamData-json/${conference}.json?t=${Date.now()}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`No team data found for ${conference}`);
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const jsonData: ComponentTeamData = await response.json();
        
        // Validate data structure
        if (!jsonData.content || !jsonData.content.teams) {
          throw new Error('Invalid team data format received');
        }
        
        setData(jsonData);
        console.log(`✅ Loaded ${jsonData.content.teams.length} teams for ${conference}`);
        
      } catch (err) {
        console.error('Error loading team data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load team data');
      } finally {
        setIsLoading(false);
      }
    };

    if (conference) {
      loadData();
    }
  }, [conference]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-sky-400 animate-spin mb-4" />
        <p className="text-white/70 text-lg">Loading {title} analysis...</p>
        <p className="text-white/50 text-sm mt-1">Fetching latest team data</p>
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

  // Group teams by division
  const teamsByDivision = data.content.teams.reduce((acc, team) => {
    if (!acc[team.division]) {
      acc[team.division] = [];
    }
    acc[team.division].push(team);
    return acc;
  }, {} as Record<string, ComponentTeam[]>);

  const divisions = ['North', 'South', 'East', 'West'];

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
              <h3 className="text-lg font-semibold text-white">AI Team Analysis</h3>
              <p className="text-white/60 text-sm">
                {aiTeams.length > 0 ? `${aiTeams.length} teams analyzed` : 'No AI analysis available'}
                {aiTeams.length > 0 && (
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
              onClick={() => refreshAI({ type: 'teams' })}
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

      {/* Overview */}
      <OverviewCard 
        title={data.content.overview.title}
        summary={data.content.overview.summary}
        keyInsights={data.content.overview.keyInsights}
        totalTeams={data.content.overview.totalTeams}
        lastUpdated={data.lastUpdated}
        weeklyUpdate={data.content.weeklyUpdate}
      />

      {/* Teams by Division */}
      {divisions.map(division => {
        const divisionTeams = teamsByDivision[division] || [];
        if (divisionTeams.length === 0) return null;

        return (
          <div key={division} className="space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">
              {data.conferenceFull} {division}
            </h2>
            <div className="space-y-4">
              {divisionTeams.map((team) => {
                // Find matching AI insights for this team
                const teamAIInsights = aiTeams.find(aiTeam => 
                  aiTeam.abbreviation === team.abbreviation || 
                  aiTeam.abbreviation === team.id
                );
                
                return (
                  <TeamCard 
                    key={team.id}
                    team={team}
                    isExpanded={expandedTeams.has(team.id)}
                    onToggleExpand={() => toggleTeamExpansion(team.id)}
                    aiInsights={teamAIInsights}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Conference Analysis */}
      <AnalysisCard 
        trendingThemes={data.content.analysis.trendingThemes}
        keyFactors={data.content.analysis.keyFactors}
        seasonOutlook={data.content.analysis.seasonOutlook}
        riskFactors={data.content.analysis.riskFactors}
      />
    </div>
  );
};