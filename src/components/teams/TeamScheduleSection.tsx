import React from 'react';
import { Card } from '../ui/Card';
import { Calendar, MapPin, Trophy, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface TeamGame {
  opponent: string;
  date: string;
  homeAway?: 'home' | 'away';
  result?: 'W' | 'L' | 'T';
  score?: string;
}

interface TeamScheduleSectionProps {
  teamName: string;
  recentGames?: TeamGame[];
  upcomingGames?: TeamGame[];
  className?: string;
}

const TeamScheduleSection: React.FC<TeamScheduleSectionProps> = ({
  teamName,
  recentGames = [],
  upcomingGames = [],
  className = ''
}) => {
  const getResultColor = (result?: string) => {
    switch (result) {
      case 'W': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'L': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'T': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-white/70 bg-white/5 border-white/10';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        time: date.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      };
    } catch {
      return {
        month: 'TBD',
        day: '--',
        weekday: 'TBD',
        time: 'TBD'
      };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recent Games */}
      {recentGames.length > 0 && (
        <Card className="p-6" glass={true}>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Recent Games</h3>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-white/60 text-sm">Last 5 games</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {recentGames.slice(0, 5).map((game, index) => {
              const dateInfo = formatDate(game.date);
              const resultStyle = getResultColor(game.result);
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/8 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Result Badge */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm ${resultStyle}`}>
                      {game.result || '?'}
                    </div>
                    
                    {/* Game Details */}
                    <div>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <span className="text-white/60 text-sm">
                          {game.homeAway === 'home' ? 'vs' : '@'}
                        </span>
                        <span>{game.opponent}</span>
                        {game.homeAway === 'home' ? (
                          <div className="w-2 h-2 bg-green-400 rounded-full" title="Home game" />
                        ) : (
                          <MapPin className="h-3 w-3 text-orange-400" title="Away game" />
                        )}
                      </div>
                      <div className="text-white/60 text-sm">
                        {dateInfo.weekday}, {dateInfo.month} {dateInfo.day}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score */}
                  {game.score && (
                    <div className="text-right">
                      <div className="text-white font-mono font-semibold">{game.score}</div>
                      <div className="text-white/60 text-xs">
                        {game.result === 'W' && <TrendingUp className="h-3 w-3 text-green-400 inline" />}
                        {game.result === 'L' && <TrendingDown className="h-3 w-3 text-red-400 inline" />}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Recent Performance Summary */}
          {recentGames.length >= 3 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Recent Form:</span>
                <div className="flex gap-1">
                  {recentGames.slice(0, 5).map((game, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        getResultColor(game.result)
                      }`}
                    >
                      {game.result || '?'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <Card className="p-6" glass={true}>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Upcoming Schedule</h3>
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="h-4 w-4 text-white/60" />
              <span className="text-white/60 text-sm">Next {upcomingGames.length} games</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {upcomingGames.slice(0, 4).map((game, index) => {
              const dateInfo = formatDate(game.date);
              const isNextGame = index === 0;
              
              return (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isNextGame 
                    ? 'bg-purple-500/10 border border-purple-500/20 ring-1 ring-purple-500/30' 
                    : 'bg-white/5 hover:bg-white/8'
                }`}>
                  <div className="flex items-center gap-4">
                    {/* Date Info */}
                    <div className="text-center min-w-[60px]">
                      <div className={`text-lg font-bold ${
                        isNextGame ? 'text-purple-300' : 'text-white'
                      }`}>
                        {dateInfo.day}
                      </div>
                      <div className={`text-xs uppercase ${
                        isNextGame ? 'text-purple-400' : 'text-white/60'
                      }`}>
                        {dateInfo.month}
                      </div>
                    </div>
                    
                    {/* Game Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          isNextGame ? 'text-purple-400' : 'text-white/60'
                        }`}>
                          {game.homeAway === 'home' ? 'vs' : '@'}
                        </span>
                        <span className={`font-medium ${
                          isNextGame ? 'text-white' : 'text-white/90'
                        }`}>
                          {game.opponent}
                        </span>
                        {game.homeAway === 'home' ? (
                          <div className="w-2 h-2 bg-green-400 rounded-full" title="Home game" />
                        ) : (
                          <MapPin className="h-3 w-3 text-orange-400" title="Away game" />
                        )}
                        {isNextGame && (
                          <div className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300 font-semibold">
                            NEXT
                          </div>
                        )}
                      </div>
                      <div className={`text-sm ${
                        isNextGame ? 'text-purple-300' : 'text-white/60'
                      }`}>
                        {dateInfo.weekday} • {dateInfo.time}
                      </div>
                    </div>
                  </div>
                  
                  {/* Home/Away Indicator */}
                  <div className="text-right">
                    <div className={`text-xs uppercase tracking-wide ${
                      game.homeAway === 'home' 
                        ? 'text-green-400' 
                        : 'text-orange-400'
                    }`}>
                      {game.homeAway === 'home' ? 'HOME' : 'AWAY'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Upcoming Schedule Summary */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <div className="text-white/60 text-sm">
              Next {upcomingGames.filter(g => g.homeAway === 'home').length} home, {upcomingGames.filter(g => g.homeAway === 'away').length} away
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeamScheduleSection;