import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import {
    Trophy,
    BarChart,
    PieChart,
    List,
} from 'lucide-react';
import { GameCard } from '../../components/ui/GameCard';
import type { Status } from '../../components/types';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { useSchedule, useTeams } from '../../hooks/useNflData';
import { CacheClearButton } from '../../components/CacheClearButton';

function DashboardContent() {
    const navigate = useNavigate();
    const [userPicks] = useState<Record<number, number>>({});

    // Get live data from TanStack Query
    const { allGames, isLoading: scheduleLoading, error: scheduleError } = useSchedule();
    const { data: teams, isLoading: teamsLoading } = useTeams();

    // Team win-loss records (dummy data for display)
    const teamRecords: Record<string, string> = {
        'DAL': '8-3', 'PHI': '9-2', 'KC': '10-1', 'LAC': '6-5',
        'TB': '7-4', 'ATL': '5-6', 'CIN': '8-3', 'CLE': '4-7',
        'MIA': '7-4', 'IND': '6-5', 'LV': '5-6', 'NE': '3-8',
        'ARI': '6-5', 'NO': '7-4', 'PIT': '8-3', 'NYJ': '4-7',
        'TEN': '5-6', 'DEN': '6-5', 'SF': '9-2', 'SEA': '7-4',
        'DET': '10-1', 'GB': '8-3', 'BAL': '9-2', 'BUF': '8-3'
    };

    // Convert live schedule data to the format expected by GameCard
    const games = useMemo(() => {
        if (!allGames) return [];
        
        return allGames.map((scheduleGame) => ({
            id: scheduleGame.id,
            status: (scheduleGame.status === 'final' ? 'final' : scheduleGame.status === 'live' ? 'live' : 'scheduled') as Status,
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
            gameTime: scheduleGame.date,
            venue: 'TBD', // Venue info not in current API structure
        }));
    }, [allGames, teamRecords]);

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

    const handlePickTeam = (_gameId: number, _teamId: number) => {
        // Navigate to make picks page when user tries to pick
        navigate({ to: '/make-picks' });
    };

    // Show loading state
    if (scheduleLoading || teamsLoading) {
        return (
            <ContentWrapper 
                title="Dashboard" 
                subtitle="Loading your NFL data..."
            >
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
                        <p className="text-white/80">Loading NFL schedule and teams...</p>
                    </div>
                </div>
            </ContentWrapper>
        );
    }

    // Show error state
    if (scheduleError) {
        return (
            <ContentWrapper 
                title="Dashboard" 
                subtitle="Error loading NFL data"
            >
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                    <p className="text-red-400 font-medium">Failed to load NFL schedule</p>
                    <p className="text-red-300/80 text-sm mt-2">{scheduleError.message}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper 
            title="Dashboard" 
            subtitle="Welcome back! Here's what's happening with your picks."
        >
            {/* Temporary Cache Clear Button */}
            <div className="mb-4 flex justify-end">
                <CacheClearButton />
            </div>

            {/* Quick Stats Cards */}
            <div className="relative isolate grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="relative bg-navy-900/50 border border-white/10 rounded-xl p-6 hover:bg-navy-900/60 hover:border-white/20 transition-all duration-200 ease-out glass-transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60">This Week</p>
                            <p className="text-2xl font-bold text-white">12-4</p>
                            <p className="text-xs text-sky-400">75% accuracy</p>
                        </div>
                        <Trophy className="h-8 w-8 text-sunset-500" />
                    </div>
                </div>

                <div className="relative bg-navy-900/50 border border-white/10 rounded-xl p-6 hover:bg-navy-900/60 hover:border-white/20 transition-all duration-200 ease-out glass-transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60">Season Record</p>
                            <p className="text-2xl font-bold text-white">84-52</p>
                            <p className="text-xs text-sky-400">61.8% accuracy</p>
                        </div>
                        <BarChart className="h-8 w-8 text-sunset-500" />
                    </div>
                </div>

                <div className="relative bg-navy-900/50 border border-white/10 rounded-xl p-6 hover:bg-navy-900/60 hover:border-white/20 transition-all duration-200 ease-out glass-transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60">League Rank</p>
                            <p className="text-2xl font-bold text-white">#3</p>
                            <p className="text-xs text-sky-400">of 12 members</p>
                        </div>
                        <PieChart className="h-8 w-8 text-sunset-500" />
                    </div>
                </div>

                <div className="relative bg-navy-900/50 border border-white/10 rounded-xl p-6 hover:bg-navy-900/60 hover:border-white/20 transition-all duration-200 ease-out glass-transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60">Active Leagues</p>
                            <p className="text-2xl font-bold text-white">3</p>
                            <p className="text-xs text-sky-400">2 pending picks</p>
                        </div>
                        <List className="h-8 w-8 text-sunset-500" />
                    </div>
                </div>
            </div>

            {/* League Actions */}
            <div>
                <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8 glass-transition">
                    <h2 className="text-xl font-semibold text-white mb-4">League Management</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/create-league"
                            className="group relative bg-gradient-to-r from-sunset-500 to-sunrise-500 hover:from-sunset-600 hover:to-sunrise-600 text-white p-6 rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Create League</h3>
                                <p className="text-white/80 text-sm">Start your own pick'em league</p>
                            </div>
                            <Trophy className="h-8 w-8 text-white/80 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                        </Link>
                        <Link
                            to="/join-league"
                            className="group relative bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white p-6 rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Join League</h3>
                                <p className="text-white/60 text-sm">Enter an existing league</p>
                            </div>
                            <List className="h-8 w-8 text-white/60 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Header with Make Picks Link */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">NFL Schedule</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-sunset-500 rounded-full" />
                    </div>
                    <Link 
                        to="/make-picks" 
                        className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-all duration-200 ease-out flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-lg"
                    >
                        Make picks →
                    </Link>
                </div>
            </div>

            {/* Games with smart sequential layout logic */}
            <div className="space-y-8">
                {gamesByDate.map(({ date, games: dateGames, gameCount }, index) => (
                    <div key={date}>
                        <div>
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
                    </div>
                ))}
            </div>

            {/* Recent Activity - Moved to secondary position */}
                <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 mt-8 glass-transition">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
                            <div>
                                <p className="text-white font-medium">Week 1 picks available</p>
                                <p className="text-white/60 text-sm">15 games ready for your picks</p>
                            </div>
                            <span className="text-xs text-sky-400 bg-sky-400/20 px-2 py-1 rounded-full">
                                New
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
                            <div>
                                <p className="text-white font-medium">Currently #3 in Office League</p>
                                <p className="text-white/60 text-sm">Ready to climb the leaderboard</p>
                            </div>
                            <span className="text-xs text-sunrise-500 bg-sunrise-500/20 px-2 py-1 rounded-full">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
                            <div>
                                <p className="text-white font-medium">Season starts September 5th</p>
                                <p className="text-white/60 text-sm">Cowboys @ Eagles Thursday Night</p>
                            </div>
                            <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                                Upcoming
                            </span>
                        </div>
                    </div>
                </div>
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/dashboard')({
    component: DashboardContent,
});