import React from 'react';
import { Card } from '../ui/Card';
import { Trophy, Award, BarChart3, MapPin, Users2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TeamHeroSectionProps {
  team: {
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
  record?: {
    wins: number;
    losses: number;
    ties: number;
    homeRecord?: string;
    awayRecord?: string;
  };
  aiData?: {
    trending_direction?: 'up' | 'down' | 'stable';
    power_ranking?: number;
    playoff_odds?: number;
    aiGeneratedAt?: string;
  };
  heroImage?: string;
  className?: string;
}

const TeamHeroSection: React.FC<TeamHeroSectionProps> = ({
  team,
  record,
  aiData,
  heroImage,
  className = ''
}) => {
  const getTrendingIcon = () => {
    if (!aiData?.trending_direction) return null;
    
    switch (aiData.trending_direction) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <Card className={`overflow-hidden p-0 ${className}`} glass={true}>
      {/* Hero Background */}
      <div className="relative">
        {/* Hero Image or Gradient Background */}
        <div className="relative h-64 lg:h-80 overflow-hidden">
          {heroImage ? (
            <img 
              src={heroImage}
              alt={`${team.name} ${team.stadiumName || 'stadium'}`}
              className="w-full h-full object-cover"
            />
          ) : (
            // Fallback gradient using team colors
            <div 
              className="w-full h-full bg-gradient-to-br"
              style={{
                background: `linear-gradient(135deg, ${team.primaryColor}22 0%, ${team.secondaryColor}22 100%)`
              }}
            />
          )}
          
          {/* Multi-layered gradient overlays for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-gray-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-transparent to-gray-900/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/30" />
        </div>
        
        {/* Team Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-6">
              {/* Enhanced Logo with Team Colors */}
              {team.logoUrl && (
                <div className="relative group">
                  <div className="w-20 h-20 bg-white/10 rounded-xl p-3 backdrop-blur-lg border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src={team.logoUrl} 
                      alt={`${team.name} logo`} 
                      className="w-full h-full rounded-lg object-contain"
                    />
                  </div>
                  {/* Team primary color accent */}
                  <div 
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                </div>
              )}
              
              {/* Team Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">{team.displayName}</h1>
                  {getTrendingIcon()}
                </div>
                
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-white/70" />
                    <span className="font-medium">{team.conference} {team.division}</span>
                  </div>
                  
                  {record && (
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-white/70" />
                      <span className="font-bold text-lg">
                        {record.wins}-{record.losses}{record.ties > 0 ? `-${record.ties}` : ''}
                      </span>
                    </div>
                  )}
                  
                  {aiData?.power_ranking && (
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-white/70" />
                      <span className="font-semibold">#{aiData.power_ranking} Power Rank</span>
                    </div>
                  )}
                </div>
                
                {/* Additional team metadata */}
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  {team.established && (
                    <span>Est. {team.established}</span>
                  )}
                  {team.stadiumName && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{team.stadiumName}</span>
                    </div>
                  )}
                  {team.headCoach && (
                    <div className="flex items-center gap-1">
                      <Users2 className="h-3 w-3" />
                      <span>{team.headCoach}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {(record || aiData?.playoff_odds) && (
        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {record && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{record.wins}</div>
                    <div className="text-xs text-white/60 uppercase tracking-wide">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{record.losses}</div>
                    <div className="text-xs text-white/60 uppercase tracking-wide">Losses</div>
                  </div>
                  {record.ties > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{record.ties}</div>
                      <div className="text-xs text-white/60 uppercase tracking-wide">Ties</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {((record.wins / (record.wins + record.losses + record.ties)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-white/60 uppercase tracking-wide">Win %</div>
                  </div>
                </>
              )}
            </div>
            
            {aiData?.playoff_odds && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{aiData.playoff_odds}%</div>
                <div className="text-xs text-white/60 uppercase tracking-wide">Playoff Odds</div>
              </div>
            )}
          </div>
          
          {/* Home/Away Record */}
          {record?.homeRecord && record?.awayRecord && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-white/60 uppercase tracking-wide text-xs mb-1">Home</div>
                  <div className="text-white font-semibold">{record.homeRecord}</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-white/60 uppercase tracking-wide text-xs mb-1">Away</div>
                  <div className="text-white font-semibold">{record.awayRecord}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default TeamHeroSection;