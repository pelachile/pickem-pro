import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { StatusBadge } from '../ui/StatusBadge';
import { AIAnalysisService } from '../../services/aiAnalysisService';
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
  Clock,
  ImageIcon,
  ExternalLink,
  BarChart3,
  Users2,
  Award,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Gauge,
  Minus
} from 'lucide-react';

// Enhanced AI Team Analysis Data Structure (matches Bedrock Lambda output)
export interface EnhancedAITeamAnalysis {
  id: string;
  abbreviation: string;
  displayName: string;
  seasonOutlook: string;
  strengths: string[];
  weaknesses: string[];
  keyInjuries: Array<{
    player: string;
    position: string;
    status: string;
    impact: string;
    fantasyImpact: string;
  }>;
  weeklyHighlights: string;
  gamePreview: string;
  fantasyInsights: string;
  record?: {
    wins: number;
    losses: number;
    ties: number;
  };
  recentGames: Array<{
    opponent: string;
    result: 'W' | 'L' | 'T';
    score: string;
    date: string;
  }>;
  upcomingGames: Array<{
    opponent: string;
    date: string;
    homeAway: 'home' | 'away';
  }>;
  aiGeneratedAt: string;
  // Optional enhanced fields for UI display
  season_year?: number;
  confidence_score?: number;
  trending_direction?: 'up' | 'down' | 'stable';
  playoff_odds?: number;
  power_ranking?: number;
  division_outlook?: string;
  key_matchups?: string[];
  coaching_insights?: string;
  performance_metrics?: {
    offensive_rank: number;
    defensive_rank: number;
    special_teams_rank: number;
    redzone_efficiency: number;
    turnover_differential: number;
  };
}

// Enhanced Team Data with comprehensive visuals and metadata
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
    established?: number;
    stadiumName?: string;
    headCoach?: string;
  };
  visuals: {
    stadiumImage?: string;
    teamPhoto?: string;
    bannerImage?: string;
    actionShots?: string[];
    alternateLogos?: string[];
    galleryImages?: Array<{
      url: string;
      caption: string;
      type: 'stadium' | 'action' | 'celebration' | 'training' | 'fan';
    }>;
  };
  record?: {
    wins: number;
    losses: number;
    ties: number;
    divisionWins?: number;
    divisionLosses?: number;
    homeRecord?: string;
    awayRecord?: string;
  };
  aiAnalysis?: EnhancedAITeamAnalysis;
}

// Image utility interfaces
interface TeamImage {
  url: string;
  alt: string;
  type: 'stadium' | 'action' | 'logo' | 'banner';
  fallback?: string;
}

interface ImageLoadState {
  loaded: boolean;
  error: boolean;
}

interface EnhancedAITeamDataDisplayProps {
  teamData: EnhancedTeamData;
  loading?: boolean;
  onRefreshAI?: () => void;
  aiLoading?: boolean;
  showTeamStats?: boolean;
  showPerformanceMetrics?: boolean;
  enableImageGallery?: boolean;
  showRecentNews?: boolean;
  onTeamClick?: (teamId: string) => void;
  viewMode?: 'detailed' | 'compact' | 'focus';
}

// Enhanced Image component with sophisticated fallback handling
const TeamImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}> = ({ src, alt, className = '', fallback, onLoad, onError, priority = false }) => {
  const [imageState, setImageState] = useState<ImageLoadState>({ loaded: false, error: false });
  const [currentSrc, setCurrentSrc] = useState(src);

  // Update currentSrc when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setImageState({ loaded: false, error: false });
  }, [src]);

  const handleLoad = () => {
    setImageState({ loaded: true, error: false });
    onLoad?.();
  };

  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
    } else {
      setImageState({ loaded: false, error: true });
    }
    onError?.();
  };

  if (imageState.error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 ${className}`}>
        <div className="text-center space-y-2">
          <ImageIcon className="h-8 w-8 text-white/40 mx-auto" />
          <span className="text-xs text-white/30">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!imageState.loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 ${
          imageState.loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};

// Image Gallery Component
const ImageGallery: React.FC<{
  images: Array<{ url: string; caption: string; type: string }>;
  teamName: string;
}> = ({ images, teamName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Team Gallery ({images.length})
        </h4>
        {images.length > 1 && (
          <div className="flex gap-1">
            <button
              onClick={prevImage}
              className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-3 w-3 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-3 w-3 text-white" />
            </button>
          </div>
        )}
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-24 rounded-lg overflow-hidden hover:ring-2 hover:ring-white/30 transition-all group"
        >
          <TeamImage
            src={images[currentIndex].url}
            alt={images[currentIndex].caption}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
            {images[currentIndex].caption}
          </div>
        </div>
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-12 h-8 rounded overflow-hidden border-2 transition-colors ${
                currentIndex === index ? 'border-white/60' : 'border-white/20'
              }`}
            >
              <TeamImage
                src={image.url}
                alt={image.caption}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Performance Metrics Component
const PerformanceMetrics: React.FC<{
  metrics: EnhancedAITeamAnalysis['performance_metrics'];
}> = ({ metrics }) => {
  if (!metrics) return null;

  const getRankColor = (rank: number, total: number = 32) => {
    const percentage = rank / total;
    if (percentage <= 0.25) return 'text-green-400';
    if (percentage <= 0.5) return 'text-yellow-400';
    if (percentage <= 0.75) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card className="p-6" glass={true}>
      <div className="flex items-center gap-3 mb-6">
        <Gauge className="h-5 w-5 text-sky-400" />
        <h3 className="text-lg font-semibold text-white">Performance Analytics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Offense Rank</span>
            <span className={`font-bold ${getRankColor(metrics.offensive_rank)}`}>
              #{metrics.offensive_rank}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Defense Rank</span>
            <span className={`font-bold ${getRankColor(metrics.defensive_rank)}`}>
              #{metrics.defensive_rank}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Special Teams</span>
            <span className={`font-bold ${getRankColor(metrics.special_teams_rank)}`}>
              #{metrics.special_teams_rank}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Red Zone %</span>
            <span className="text-white font-bold">
              {metrics.redzone_efficiency}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Turnover +/-</span>
            <span className={`font-bold ${
              metrics.turnover_differential >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics.turnover_differential >= 0 ? '+' : ''}{metrics.turnover_differential}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export function EnhancedAITeamDataDisplay({ 
  teamData, 
  loading = false, 
  onRefreshAI, 
  aiLoading = false,
  showTeamStats = true,
  showPerformanceMetrics = true,
  enableImageGallery = true,
  showRecentNews = false,
  onTeamClick,
  viewMode = 'detailed'
}: EnhancedAITeamDataDisplayProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  if (loading || !teamData) {
    return (
      <div className="space-y-6">
        <Card className="p-8" glass={true}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" color="sky" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Loading team analysis...</h3>
                <p className="text-white/60">Gathering latest insights and data</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Safe destructuring after null check
  const { basic, visuals, record, aiAnalysis } = teamData;

  const getInjuryStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'out': return 'sunset-orange';
      case 'ir': return 'sunset-orange';
      case 'doubtful': return 'sunrise-gold';
      case 'questionable': return 'sunrise-gold';
      case 'probable': return 'sky-blue';
      default: return 'ocean-blue';
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
        return <Minus className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* AI Analysis Content */}
      {aiAnalysis && viewMode !== 'compact' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Season Outlook */}
            {aiAnalysis.seasonOutlook && (
              <Card className="p-6" glass={true}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Season Outlook</h2>
                </div>
                <p className="text-white/80 leading-relaxed mb-4">{aiAnalysis.seasonOutlook}</p>
                
                {aiAnalysis.division_outlook && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Division Outlook
                    </h3>
                    <p className="text-white/70 text-sm">{aiAnalysis.division_outlook}</p>
                  </div>
                )}
                
                {aiAnalysis.coaching_insights && (
                  <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h3 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
                      <Users2 className="h-4 w-4" />
                      Coaching Insights
                    </h3>
                    <p className="text-white/70 text-sm">{aiAnalysis.coaching_insights}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Weekly Highlights & Game Preview */}
            {(aiAnalysis.weeklyHighlights || aiAnalysis.gamePreview) && (
              <Card className="p-6" glass={true}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">This Week's Focus</h2>
                </div>
                
                {aiAnalysis.weeklyHighlights && (
                  <div className="mb-6">
                    <h3 className="text-yellow-300 font-medium mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Weekly Highlights
                    </h3>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-white/80">{aiAnalysis.weeklyHighlights}</p>
                    </div>
                  </div>
                )}
                
                {aiAnalysis.gamePreview && (
                  <div>
                    <h3 className="text-yellow-300 font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Upcoming Game Preview
                    </h3>
                    <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                      <p className="text-white/80">{aiAnalysis.gamePreview}</p>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Strengths & Weaknesses */}
            {(aiAnalysis.strengths?.length || aiAnalysis.weaknesses?.length) && (
              <Card className="p-6" glass={true}>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Team Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  {aiAnalysis.strengths?.length && (
                    <div>
                      <h3 className="text-green-400 font-medium mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Key Strengths
                      </h3>
                      <div className="space-y-3">
                        {aiAnalysis.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20 hover:bg-green-500/15 transition-colors">
                            <Star className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/80 text-sm leading-relaxed">{strength}</span>
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
                        Areas for Improvement
                      </h3>
                      <div className="space-y-3">
                        {aiAnalysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20 hover:bg-orange-500/15 transition-colors">
                            <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/80 text-sm leading-relaxed">{weakness}</span>
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
            {/* Enhanced Quick Stats */}
            {showTeamStats && (
              <Card className="p-6" glass={true}>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-5 w-5 text-sky-400" />
                  <h3 className="text-lg font-semibold text-white">Team Metrics</h3>
                </div>
                
                <div className="space-y-4">
                  {aiAnalysis.playoff_odds && (
                    <div className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Playoff Odds</span>
                        <span className="text-white font-bold text-lg">{aiAnalysis.playoff_odds}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700 group-hover:shadow-lg group-hover:shadow-green-500/25"
                          style={{ width: `${aiAnalysis.playoff_odds}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {aiAnalysis.power_ranking && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <span className="text-white/70 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Power Ranking
                      </span>
                      <span className="text-white font-bold text-xl">#{aiAnalysis.power_ranking}</span>
                    </div>
                  )}
                  
                  {record && (
                    <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Season Record</span>
                        <span className="text-white font-bold">
                          {record.wins}-{record.losses}{record.ties > 0 ? `-${record.ties}` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Win Percentage</span>
                        <span className="text-white font-semibold">
                          {((record.wins / (record.wins + record.losses + record.ties)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      {record.homeRecord && record.awayRecord && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-white/5 rounded">
                            <div className="text-white/60">Home</div>
                            <div className="text-white font-medium">{record.homeRecord}</div>
                          </div>
                          <div className="text-center p-2 bg-white/5 rounded">
                            <div className="text-white/60">Away</div>
                            <div className="text-white font-medium">{record.awayRecord}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {aiAnalysis.trending_direction && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <span className="text-white/70 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Team Momentum
                      </span>
                      <div className="flex items-center gap-2">
                        {getTrendingIcon()}
                        <span className="text-white font-semibold capitalize">
                          {aiAnalysis.trending_direction}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {aiAnalysis.confidence_score && (
                    <div className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          AI Confidence
                        </span>
                        <span className="text-purple-300 font-semibold">
                          {Math.round(aiAnalysis.confidence_score * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-400 h-2.5 rounded-full transition-all duration-700 group-hover:shadow-lg group-hover:shadow-purple-500/25"
                          style={{ width: `${aiAnalysis.confidence_score * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Performance Metrics */}
            {showPerformanceMetrics && aiAnalysis.performance_metrics && (
              <PerformanceMetrics metrics={aiAnalysis.performance_metrics} />
            )}

            {/* Image Gallery */}
            {enableImageGallery && visuals.galleryImages && visuals.galleryImages.length > 0 && (
              <Card className="p-6" glass={true}>
                <ImageGallery images={visuals.galleryImages} teamName={basic.name} />
              </Card>
            )}

            {/* Injury Report */}
            {aiAnalysis.keyInjuries?.length && (
              <Card className="p-6" glass={true}>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Injury Report</h3>
                </div>
                <div className="space-y-3">
                  {aiAnalysis.keyInjuries.map((injury, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/8 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{injury.player}</span>
                        <StatusBadge 
                          status={injury.status.toLowerCase().replace(' ', '_')} 
                          variant={getInjuryStatusColor(injury.status)}
                          size="sm"
                        >
                          {injury.status}
                        </StatusBadge>
                      </div>
                      {injury.impact && (
                        <div className="text-orange-300 text-xs mb-2 p-2 bg-orange-500/10 rounded">
                          <strong>Impact:</strong> {injury.impact}
                        </div>
                      )}
                      {injury.fantasyImpact && (
                        <div className="text-purple-300 text-xs p-2 bg-purple-500/10 rounded">
                          <strong>Fantasy:</strong> {injury.fantasyImpact}
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
                  <Calendar className="h-5 w-5 text-sky-400" />
                  Key Matchups to Watch
                </h3>
                <div className="space-y-3">
                  {aiAnalysis.key_matchups.map((matchup, index) => (
                    <div key={index} className="p-3 bg-sky-500/10 rounded-lg border border-sky-500/20 hover:bg-sky-500/15 transition-colors">
                      <p className="text-sky-200 text-sm leading-relaxed">{matchup}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Fantasy Impact */}
            {aiAnalysis.fantasyInsights && (
              <Card className="p-6" glass={true}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  Fantasy Insights
                </h3>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-white/80 text-sm leading-relaxed">{aiAnalysis.fantasyInsights}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* No AI Data State */}
      {!aiAnalysis && (
        <Card className="p-8 text-center" glass={true}>
          <div className="max-w-md mx-auto space-y-6">
            <div className="p-4 bg-purple-500/20 rounded-full w-fit mx-auto">
              <Brain className="h-12 w-12 text-purple-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">AI Analysis Unavailable</h3>
              <p className="text-white/60">
                No AI insights have been generated for {basic.displayName} yet. 
                Our AI system can provide comprehensive analysis including season outlook, 
                player performance, injury impact, and strategic insights.
              </p>
            </div>
            {onRefreshAI && (
              <Button 
                onClick={onRefreshAI} 
                disabled={aiLoading}
                className="flex items-center gap-2 mx-auto bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
              >
                {aiLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate AI Analysis
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export default EnhancedAITeamDataDisplay;