import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  GameCard,
  StatusBadge, 
  UserAvatar 
} from '../ui';
import type { Game } from '../types';

/**
 * Games Dashboard Example
 * 
 * Demonstrates a complete dashboard layout using the GameCard component
 * and other UI elements in a sports application context.
 */
export const GamesDashboard: React.FC = () => {
  const [userPicks, setUserPicks] = useState<Record<number, number>>({
    1: 2, // User picked away team for game 1
    2: 3, // User picked home team for game 2
  });

  const currentUser = {
    name: "Alex Johnson",
    avatar_icon: "star",
    avatar_color: "sky-blue" as const
  };

  // Sample game data
  const games: Game[] = [
    {
      id: 1,
      status: 'live',
      homeTeam: { 
        id: 1, 
        name: 'Patriots', 
        abbreviation: 'NE', 
        logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
        color: '#002244' 
      },
      awayTeam: { 
        id: 2, 
        name: 'Bills', 
        abbreviation: 'BUF', 
        logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
        color: '#00338D' 
      },
      homeScore: 14,
      awayScore: 21,
      gameTime: new Date().toISOString(),
      venue: 'Gillette Stadium',
      isRedZone: true,
      possession: 'away'
    },
    {
      id: 2,
      status: 'final',
      homeTeam: { 
        id: 3, 
        name: 'Chiefs', 
        abbreviation: 'KC', 
        logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
        color: '#E31837' 
      },
      awayTeam: { 
        id: 4, 
        name: 'Raiders', 
        abbreviation: 'LV', 
        logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
        color: '#000000' 
      },
      homeScore: 28,
      awayScore: 17,
      gameTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      venue: 'Arrowhead Stadium'
    },
    {
      id: 3,
      status: 'scheduled',
      homeTeam: { 
        id: 5, 
        name: 'Cowboys', 
        abbreviation: 'DAL', 
        logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
        color: '#041E42' 
      },
      awayTeam: { 
        id: 6, 
        name: 'Giants', 
        abbreviation: 'NYG', 
        logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
        color: '#0B2265' 
      },
      gameTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      venue: 'AT&T Stadium'
    }
  ];

  const handlePickTeam = (gameId: number, teamId: number) => {
    setUserPicks(prev => ({
      ...prev,
      [gameId]: teamId
    }));
    console.log(`Picked team ${teamId} for game ${gameId}`);
  };

  const handleRefreshGame = (gameId: number) => {
    console.log(`Refreshing game ${gameId}`);
    // In a real app, this would trigger a data refresh
  };

  const liveGames = games.filter(game => game.status === 'live');
  const completedGames = games.filter(game => game.status === 'final');
  const upcomingGames = games.filter(game => game.status === 'scheduled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-navy/5 via-sky-blue/5 to-sunset-orange/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-midnight-navy dark:text-white">
              NFL Games Dashboard
            </h1>
            <p className="text-midnight-navy/70 dark:text-white/70 mt-1">
              Live scores, picks, and upcoming games
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusBadge status="live" animate showIndicator text={`${liveGames.length} Live`} />
            <div className="flex items-center gap-3">
              <UserAvatar user={currentUser} />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-midnight-navy dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-midnight-navy/60 dark:text-white/60">
                  {Object.keys(userPicks).length} picks made
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Live Games Section */}
        {liveGames.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-midnight-navy dark:text-white">
                Live Games
              </h2>
              <StatusBadge status="live" animate showIndicator size="sm" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  userPickTeamId={userPicks[game.id]}
                  showPicks={true}
                  enableRefresh={true}
                  onPickTeam={(teamId) => handlePickTeam(game.id, teamId)}
                  onRefresh={() => handleRefreshGame(game.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Games Section */}
        {upcomingGames.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-midnight-navy dark:text-white">
                Upcoming Games
              </h2>
              <StatusBadge status="scheduled" size="sm" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  userPickTeamId={userPicks[game.id]}
                  compact={true}
                  showPicks={true}
                  onPickTeam={(teamId) => handlePickTeam(game.id, teamId)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed Games Section */}
        {completedGames.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-midnight-navy dark:text-white">
                Final Scores
              </h2>
              <StatusBadge status="final" size="sm" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {completedGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  userPickTeamId={userPicks[game.id]}
                  compact={true}
                  showPicks={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Picks Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-blue">
                  {Object.keys(userPicks).length}
                </div>
                <div className="text-sm text-midnight-navy/60 dark:text-white/60">
                  Total Picks
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sunrise-gold">
                  {liveGames.length}
                </div>
                <div className="text-sm text-midnight-navy/60 dark:text-white/60">
                  Live Games
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ocean-blue">
                  {upcomingGames.length}
                </div>
                <div className="text-sm text-midnight-navy/60 dark:text-white/60">
                  Upcoming
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-midnight-navy dark:text-white">
                  {completedGames.length}
                </div>
                <div className="text-sm text-midnight-navy/60 dark:text-white/60">
                  Completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg">
            View All Games
          </Button>
          <Button variant="outline" size="lg">
            Manage Picks
          </Button>
          <Button variant="ghost" size="lg">
            View Leaderboard
          </Button>
        </div>

      </div>
    </div>
  );
};

export default GamesDashboard;