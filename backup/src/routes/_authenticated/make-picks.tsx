import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { GameCard } from '../../components/ui/GameCard';
import { teamsAndScheduleData, type Game as ScheduleGame } from '../../data/teams-and-schedule';
import type { Status } from '../../components/types';
import ContentWrapper from '../../components/layout/ContentWrapper';

function MakePicksContent() {
    const [userPicks, setUserPicks] = useState<Record<number, number>>({});

    // Team win-loss records (dummy data for display)
    const teamRecords: Record<string, string> = {
        'DAL': '8-3', 'PHI': '9-2', 'KC': '10-1', 'LAC': '6-5',
        'TB': '7-4', 'ATL': '5-6', 'CIN': '8-3', 'CLE': '4-7',
        'MIA': '7-4', 'IND': '6-5', 'LV': '5-6', 'NE': '3-8',
        'ARI': '6-5', 'NO': '7-4', 'PIT': '8-3', 'NYJ': '4-7',
        'TEN': '5-6', 'DEN': '6-5', 'SF': '9-2', 'SEA': '7-4',
        'DET': '10-1', 'GB': '8-3', 'BAL': '9-2', 'BUF': '8-3'
    };

    // Convert schedule data to the format expected by GameCard
    const games = useMemo(() => {
        return teamsAndScheduleData.schedule.all_games.map((scheduleGame: ScheduleGame) => ({
            id: scheduleGame.id,
            status: (scheduleGame.is_completed ? 'final' : scheduleGame.is_in_progress ? 'live' : 'scheduled') as Status,
            homeTeam: {
                id: scheduleGame.home_team.id,
                name: scheduleGame.home_team.display_name,
                abbreviation: scheduleGame.home_team.abbreviation,
                color: scheduleGame.home_team.color,
                logo_url: scheduleGame.home_team.logo_url,
                record: teamRecords[scheduleGame.home_team.abbreviation] || '6-5',
            },
            awayTeam: {
                id: scheduleGame.away_team.id,
                name: scheduleGame.away_team.display_name,
                abbreviation: scheduleGame.away_team.abbreviation,
                color: scheduleGame.away_team.color,
                logo_url: scheduleGame.away_team.logo_url,
                record: teamRecords[scheduleGame.away_team.abbreviation] || '6-5',
            },
            gameTime: scheduleGame.game_date,
            venue: scheduleGame.venue_name,
        }));
    }, []);

    // Group games by date with smart sequential layout logic
    const gamesByDate = useMemo(() => {
        const grouped = games.reduce((acc, game) => {
            const date = new Date(game.gameTime).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(game);
            return acc;
        }, {} as Record<string, typeof games>);

        // Sort dates and maintain chronological order
        const sortedDates = Object.keys(grouped).sort((a, b) => 
            new Date(a).getTime() - new Date(b).getTime()
        );

        // Map to array with game count for smart layout
        return sortedDates.map(date => {
            const dateGames = grouped[date].sort((a, b) => 
                new Date(a.gameTime).getTime() - new Date(b.gameTime).getTime()
            );
            
            return {
                date,
                games: dateGames,
                gameCount: dateGames.length
            };
        });
    }, [games]);

    // Helper function to get grid class based on game count
    const getGridClass = (gameCount: number) => {
        if (gameCount === 1) {
            return 'grid-cols-1'; // Full width for single game
        } else if (gameCount === 2) {
            return 'grid-cols-1 sm:grid-cols-2'; // Split for two games
        } else {
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'; // Standard responsive grid for 3+
        }
    };

    const handlePickTeam = (gameId: number, teamId: number) => {
        setUserPicks(prev => ({
            ...prev,
            [gameId]: teamId,
        }));
    };

    const handleSubmitPicks = () => {
        console.log('Submitting picks:', userPicks);
        // Future: Submit picks to API
    };

    // Get current week from games
    const currentWeek = games.length > 0 ? teamsAndScheduleData.schedule.all_games[0]?.week || 1 : 1;

    return (
        <ContentWrapper 
            title="Make Your Picks" 
            subtitle={`Week ${currentWeek} - Select the winners for this week's games`}
        >
            {/* Submit Button - Fixed at top on mobile, inline on desktop */}
            <div className="mb-6">
                <button
                    onClick={handleSubmitPicks}
                    disabled={Object.keys(userPicks).length === 0}
                    className="w-full sm:w-auto bg-sky-400 hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Submit Picks ({Object.keys(userPicks).length}/{games.length})
                </button>
            </div>

            {/* Games with smart sequential layout logic */}
            <div className="space-y-8">
                {gamesByDate.map(({ date, games: dateGames, gameCount }) => (
                    <div key={date}>
                        {/* Date Header */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-white mb-1">
                                {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h2>
                            <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-sunset-500 rounded-full" />
                        </div>

                        {/* Smart Grid Layout Based on Game Count */}
                        <div className={`grid ${getGridClass(gameCount)} gap-4`}>
                            {dateGames.map((game) => (
                                <GameCard
                                    key={game.id}
                                    game={game}
                                    userPickTeamId={userPicks[game.id] || null}
                                    layout={
                                        gameCount === 1 
                                            ? 'full' // Single game: full width with horizontal layout
                                            : gameCount === 2
                                            ? 'wide' // Two games: wide layout
                                            : 'default' // 3+ games: default vertical layout
                                    }
                                    showPicks={true}
                                    onPickTeam={(teamId) => handlePickTeam(game.id, teamId)}
                                    className="h-full w-full" // Remove width constraints
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary at bottom */}
            {Object.keys(userPicks).length > 0 && (
                <div className="mt-8 bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Picks Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(userPicks).map(([gameId, teamId]) => {
                            const game = games.find(g => g.id === parseInt(gameId));
                            const pickedTeam = game?.homeTeam.id === teamId ? game.homeTeam : game?.awayTeam;
                            if (!game || !pickedTeam) return null;
                            
                            return (
                                <div key={gameId} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5">
                                    <span className="text-white/60 text-sm">{game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}</span>
                                    <span className="text-sky-400 font-medium">{pickedTeam.abbreviation}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/make-picks')({
    component: MakePicksContent,
});