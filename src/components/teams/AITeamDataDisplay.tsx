import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle,
  Calendar,
  Zap,
  Target,
  Brain,
  Sparkles,
  Star,
  AlertCircle,
  Trophy,
  Activity,
  Clock
} from 'lucide-react';

// AI Team Analysis Data Structure (matches what Lambda returns)
export interface AITeamAnalysis {
  id: string;
  abbreviation: string;
  season_year: number;
  season_outlook?: string;
  strengths?: string[];
  weaknesses?: string[];
  key_injuries?: Array<{
    player: string;
    injury: string;
    impact: string;
    status: 'Questionable' | 'Doubtful' | 'Out' | 'IR' | 'Probable';
    estimated_return?: string;
  }>;
  weekly_highlights?: string;
  game_preview?: string;
  ai_last_updated?: string;
  confidence_score?: number;
  trending_direction?: 'up' | 'down' | 'stable';
  playoff_odds?: number;
  power_ranking?: number;
  division_outlook?: string;
  key_matchups?: string[];
  fantasy_impact?: string;
}

// Enhanced Team Data with visuals
export interface EnhancedTeamData {
  basic: {
    id: string;
    name: string;
    location: string;
    abbreviation: string;
    displayName: string;
    conference: 'AFC' | 'NFC';
    division: 'North' | 'South' | 'East' | 'West';
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
  };
  visuals: {
    stadiumImage?: string;
    teamPhoto?: string;
    bannerImage?: string;
  };
  record?: {
    wins: number;
    losses: number;
    ties: number;
  };
  aiAnalysis?: AITeamAnalysis;
}

interface AITeamDataDisplayProps {
  teamData: EnhancedTeamData;
  loading?: boolean;
  onRefreshAI?: () => void;
  aiLoading?: boolean;
}

export function AITeamDataDisplay({ 
  teamData, 
  loading = false, 
  onRefreshAI, 
  aiLoading = false 
}: AITeamDataDisplayProps) {
  const { basic, visuals, record, aiAnalysis } = teamData;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6" glass={true}>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-white/70">Loading team analysis...</span>
          </div>
        </Card>
      </div>
    );
  }

  const getInjuryStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'out': return 'text-red-400 bg-red-500/20';
      case 'ir': return 'text-red-500 bg-red-600/20';
      case 'doubtful': return 'text-orange-400 bg-orange-500/20';
      case 'questionable': return 'text-yellow-400 bg-yellow-500/20';
      case 'probable': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTrendingIcon = () => {
    if (!aiAnalysis?.trending_direction) return null;
    
    switch (aiAnalysis.trending_direction) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Team Image */}
      <Card className="overflow-hidden" glass={true}>
        {/* Background Image */}
        {visuals.bannerImage || visuals.stadiumImage && (
          <div 
            className="relative h-48 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${visuals.bannerImage || visuals.stadiumImage})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-4">
                  {basic.logoUrl && (
                    <img 
                      src={basic.logoUrl} 
                      alt={`${basic.name} logo`} 
                      className="w-16 h-16 object-contain bg-white/10 rounded-lg p-2 backdrop-blur-sm"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{basic.displayName}</h1>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <span>{basic.conference} {basic.division}</span>
                      {record && (
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{record.wins}-{record.losses}{record.ties > 0 ? `-${record.ties}` : ''}</span>
                        </div>
                      )}
                      {getTrendingIcon()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Image Fallback */}
        {!visuals.bannerImage && !visuals.stadiumImage && (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {basic.logoUrl && (
                  <img 
                    src={basic.logoUrl} 
                    alt={`${basic.name} logo`} 
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{basic.displayName}</h1>
                  <div className="flex items-center gap-4 text-white/70">
                    <span>{basic.conference} {basic.division}</span>
                    {record && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{record.wins}-{record.losses}{record.ties > 0 ? `-${record.ties}` : ''}</span>
                      </div>
                    )}
                    {getTrendingIcon()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Status Bar */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-white font-medium text-sm">AI Analysis Status</div>
                <div className="text-white/60 text-xs">
                  {aiAnalysis ? (
                    <>
                      Last updated: {aiAnalysis.ai_last_updated ? 
                        new Date(aiAnalysis.ai_last_updated).toLocaleDateString() : 
                        'Recently'
                      }
                      {aiAnalysis.confidence_score && (
                        <span className="ml-2">• Confidence: {Math.round(aiAnalysis.confidence_score * 100)}%</span>
                      )}
                    </>
                  ) : (
                    'No AI analysis available'
                  )}
                </div>
              </div>
            </div>
            {onRefreshAI && (
              <Button
                onClick={onRefreshAI}
                disabled={aiLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {aiLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {aiLoading ? 'Analyzing...' : 'Refresh AI'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* AI Analysis Content */}
      {aiAnalysis && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Season Outlook */}
          <div className="lg:col-span-2 space-y-6">
            {aiAnalysis.season_outlook && (
              <Card className="p-6" glass={true}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Season Outlook</h2>
                </div>
                <p className="text-white/80 leading-relaxed">{aiAnalysis.season_outlook}</p>
                
                {aiAnalysis.division_outlook && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-blue-300 font-medium mb-2">Division Outlook</h3>
                    <p className="text-white/70 text-sm">{aiAnalysis.division_outlook}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Weekly Highlights & Game Preview */}
            {(aiAnalysis.weekly_highlights || aiAnalysis.game_preview) && (
              <Card className="p-6" glass={true}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">This Week</h2>
                </div>
                
                {aiAnalysis.weekly_highlights && (
                  <div className="mb-4">
                    <h3 className="text-yellow-300 font-medium mb-2">Weekly Highlights</h3>
                    <p className="text-white/80">{aiAnalysis.weekly_highlights}</p>
                  </div>
                )}
                
                {aiAnalysis.game_preview && (
                  <div>
                    <h3 className="text-yellow-300 font-medium mb-2">Upcoming Game Preview</h3>
                    <p className="text-white/80">{aiAnalysis.game_preview}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Strengths & Weaknesses */}
            {(aiAnalysis.strengths?.length || aiAnalysis.weaknesses?.length) && (
              <Card className="p-6" glass={true}>
                <h2 className="text-xl font-semibold text-white mb-6">Team Analysis</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  {aiAnalysis.strengths?.length && (
                    <div>
                      <h3 className="text-green-400 font-medium mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Strengths
                      </h3>
                      <div className="space-y-3">
                        {aiAnalysis.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                            <Star className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/80 text-sm">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {aiAnalysis.weaknesses?.length && (
                    <div>
                      <h3 className="text-orange-400 font-medium mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Areas of Concern
                      </h3>
                      <div className="space-y-3">
                        {aiAnalysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/80 text-sm">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6" glass={true}>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {aiAnalysis.playoff_odds && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Playoff Odds</span>
                    <span className="text-white font-semibold">{aiAnalysis.playoff_odds}%</span>
                  </div>
                )}
                {aiAnalysis.power_ranking && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Power Ranking</span>
                    <span className="text-white font-semibold">#{aiAnalysis.power_ranking}</span>
                  </div>
                )}
                {record && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Win Percentage</span>
                      <span className="text-white font-semibold">
                        {((record.wins / (record.wins + record.losses + record.ties)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </>
                )}
                {aiAnalysis.trending_direction && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Trending</span>
                    <div className="flex items-center gap-2">
                      {getTrendingIcon()}
                      <span className="text-white font-semibold capitalize">
                        {aiAnalysis.trending_direction}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Injury Report */}
            {aiAnalysis.key_injuries?.length && (
              <Card className="p-6" glass={true}>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Injury Report</h3>
                </div>
                <div className="space-y-3">
                  {aiAnalysis.key_injuries.map((injury, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{injury.player}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getInjuryStatusColor(injury.status)}`}>
                          {injury.status}
                        </span>
                      </div>
                      <div className="text-white/70 text-sm mb-1">{injury.injury}</div>
                      {injury.impact && (
                        <div className="text-orange-300 text-xs">{injury.impact}</div>
                      )}
                      {injury.estimated_return && (
                        <div className="text-white/50 text-xs mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Est. return: {injury.estimated_return}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Key Matchups */}
            {aiAnalysis.key_matchups?.length && (
              <Card className="p-6" glass={true}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Key Matchups to Watch
                </h3>
                <div className="space-y-3">
                  {aiAnalysis.key_matchups.map((matchup, index) => (
                    <div key={index} className="p-3 bg-sky-500/10 rounded-lg border border-sky-500/20">
                      <p className="text-sky-200 text-sm">{matchup}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Fantasy Impact */}
            {aiAnalysis.fantasy_impact && (
              <Card className="p-6" glass={true}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Fantasy Impact
                </h3>
                <p className="text-white/80 text-sm">{aiAnalysis.fantasy_impact}</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* No AI Data State */}
      {!aiAnalysis && (
        <Card className="p-8 text-center" glass={true}>
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No AI Analysis Available</h3>
          <p className="text-white/60 mb-4">
            AI analysis hasn't been generated for this team yet.
          </p>
          {onRefreshAI && (
            <Button 
              onClick={onRefreshAI} 
              disabled={aiLoading}
              className="flex items-center gap-2 mx-auto"
            >
              {aiLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate AI Analysis
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}

export default AITeamDataDisplay;