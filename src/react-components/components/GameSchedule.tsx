import React, { useState, useEffect } from 'react';
import { GameCard } from './GameCard';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '../utils';
import type { GameScheduleProps, ScheduleData, Game } from '../types';
import { 
  loadScheduleData, 
  getGamesForWeek, 
  getAllGames,
  getCurrentWeekGames,
  getCurrentWeekInfo,
  getNFLContextString,
  groupGamesByDate,
  formatDateForDisplay
} from '../../utils/scheduleUtils';

/**
 * GameSchedule Component
 * 
 * Displays NFL games in an organized schedule format with date groupings.
 * Features week selection, game filtering, and responsive grid layout.
 */
export const GameSchedule: React.FC<GameScheduleProps> = ({
  week,
  showPicks = false,
  compact = false,
  maxGames,
  className,
  onPickTeam,
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | 'current'>(week || 'current');
  const [nflContext, setNflContext] = useState<string>('');

  // Load schedule data and set NFL context on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadScheduleData();
        setScheduleData(data);
        
        // Set NFL context for display
        const contextString = getNFLContextString();
        setNflContext(contextString);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get games based on week selection with intelligent filtering
  const games = React.useMemo(() => {
    if (!scheduleData) return [];
    
    let gamesData: Game[];
    if (selectedWeek === 'current') {
      // Show games for current NFL week
      gamesData = getCurrentWeekGames(scheduleData);
    } else if (typeof selectedWeek === 'number' && selectedWeek > 0) {
      gamesData = getGamesForWeek(scheduleData, selectedWeek);
    } else {
      gamesData = getAllGames(scheduleData, maxGames);
    }
    
    return gamesData;
  }, [scheduleData, selectedWeek, maxGames]);

  // Group games by date for better organization
  const gamesByDate = React.useMemo(() => {
    return groupGamesByDate(games);
  }, [games]);

  const handlePickTeam = (teamId: number) => {
    // Find the game this team belongs to
    const game = games.find(g => 
      g.homeTeam.id === teamId || g.awayTeam.id === teamId
    );
    
    if (game && onPickTeam) {
      onPickTeam(game.id, teamId);
    }
  };


  // Loading state
  if (loading) {
    return (
      <Card className={cn('p-6', className)} glass={true}>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-white/60">Loading schedule...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn('p-6', className)} glass={true}>
        <div className="text-center min-h-[200px] flex items-center justify-center">
          <div>
            <div className="text-sunset-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Schedule</h3>
            <p className="text-white/60 mb-4">{error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              className="bg-sky-400 hover:bg-sky-500"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // No games available
  if (games.length === 0) {
    const weekInfo = getCurrentWeekInfo();
    
    return (
      <Card className={cn('p-6', className)} glass={true}>
        <div className="text-center min-h-[200px] flex items-center justify-center">
          <div>
            <div className="text-6xl mb-4">🏈</div>
            <h3 className="text-lg font-semibold text-white mb-2">No Games Available</h3>
            <p className="text-white/60 mb-2">
              {selectedWeek === 'current'
                ? `No games scheduled for current week (Week ${weekInfo.week})`
                : typeof selectedWeek === 'number' 
                  ? `No games found for Week ${selectedWeek}`
                  : 'No games available in the schedule'
              }
            </p>
            <p className="text-white/40 text-sm">{nflContext}</p>
          </div>
        </div>
      </Card>
    );
  }

  const availableWeeks = scheduleData?.meta.weeks_available || [1];
  const dateKeys = Object.keys(gamesByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className={cn('space-y-6 bg-transparent', className)}>
      {/* NFL Context and Week selector */}
      <Card className="p-6 bg-navy-900/50 backdrop-blur-lg border border-white/10" glass={true}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div>
                <h3 className="text-lg font-semibold text-white">NFL Schedule</h3>
                <p className="text-sm text-white/60">{nflContext}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedWeek === 'current' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedWeek('current')}
            >
              Current Week
            </Button>
            <Button
              variant={selectedWeek === 0 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedWeek(0)}
            >
              All Weeks
            </Button>
            {availableWeeks.map((weekNum) => (
              <Button
                key={weekNum}
                variant={selectedWeek === weekNum ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedWeek(weekNum)}
              >
                Week {weekNum}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Games by date */}
      {dateKeys.map((dateKey) => {
        const dayGames = gamesByDate[dateKey];
        const formattedDate = formatDateForDisplay(dateKey);
        
        return (
          <div key={dateKey} className="space-y-4">
            {/* Date header */}
            <div className="flex items-center gap-4 p-4 bg-navy-900/30 backdrop-blur-sm border border-white/5 rounded-lg">
              <h2 className="text-xl font-bold text-white">{formattedDate}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-sky-400/50 to-transparent"></div>
              <span className="text-sm text-white/60">
                {dayGames.length} {dayGames.length === 1 ? 'game' : 'games'}
              </span>
            </div>

            {/* Games grid */}
            <div className={cn(
              'grid gap-4',
              // Dynamic grid based on number of games for optimal layout
              dayGames.length === 1 
                ? 'grid-cols-1' // Single game: full width
                : dayGames.length === 2
                ? 'grid-cols-1 lg:grid-cols-2' // Two games: stack on mobile, side-by-side on large screens
                : compact 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' // 3+ games compact: up to 4 columns
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' // 3+ games normal: up to 3 columns
            )}>
              {dayGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  compact={compact && dayGames.length > 2} // Only use compact mode for 3+ games
                  layout={
                    dayGames.length === 1 
                      ? 'full' // Single game: full width with horizontal layout
                      : dayGames.length === 2
                      ? 'wide' // Two games: wide layout
                      : 'default' // 3+ games: default vertical layout
                  }
                  showPicks={showPicks}
                  onPickTeam={handlePickTeam}
                  className={cn(
                    'hover:transform hover:scale-105 transition-transform duration-200',
                    // Ensure full width expansion for single/double games
                    dayGames.length <= 2 ? 'w-full' : ''
                  )}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Schedule metadata */}
      {scheduleData && (
        <Card className="p-6 bg-navy-900/50 backdrop-blur-lg border border-white/10" glass={true}>
          <div className="text-center text-sm text-white/60">
            <p>
              {scheduleData.meta.current_season} NFL Season • 
              {scheduleData.meta.total_games} Total Games • 
              Updated {new Date(scheduleData.meta.export_date).toLocaleDateString()}
            </p>
            {selectedWeek === 'current' && (
              <p className="mt-2 text-white/40">
                Showing games for current NFL week • Updates automatically
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default GameSchedule;