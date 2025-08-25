import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import {
    Trophy,
    BarChart,
    PieChart,
    List,
} from 'lucide-react';
import { GameCard } from '../../components/ui/GameCard';
import type { Status } from '../../components/types';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { useEnhancedGames } from '../../hooks/useSmartGames';
import { CacheClearButton } from '../../components/CacheClearButton';

function DashboardContent() {
    // Dashboard is now display-only - no navigation or picking functionality

    // Get enhanced games data from smart games system
    const { data: gamesData, isLoading: gamesLoading, error: gamesError } = useEnhancedGames();

    // Team win-loss records (2024 season final records - will be replaced with live ESPN data during regular season)
    const teamRecords: Record<string, string> = {
        'DAL': '2024: 8-3', 'PHI': '2024: 9-2', 'KC': '2024: 10-1', 'LAC': '2024: 6-5',
        'TB': '2024: 7-4', 'ATL': '2024: 5-6', 'CIN': '2024: 8-3', 'CLE': '2024: 4-7',
        'MIA': '2024: 7-4', 'IND': '2024: 6-5', 'LV': '2024: 5-6', 'NE': '2024: 3-8',
        'ARI': '2024: 6-5', 'NO': '2024: 7-4', 'PIT': '2024: 8-3', 'NYJ': '2024: 4-7',
        'TEN': '2024: 5-6', 'DEN': '2024: 6-5', 'SF': '2024: 9-2', 'SEA': '2024: 7-4',
        'DET': '2024: 10-1', 'GB': '2024: 8-3', 'BAL': '2024: 9-2', 'BUF': '2024: 8-3'
    };

    // Use the enhanced games directly - they're already in the correct format
    const games = useMemo(() => {
        return gamesData?.games || [];
    }, [gamesData?.games]);

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

    // Removed handlePickTeam - dashboard is now display-only

    // Show loading state
    if (gamesLoading) {
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
    if (gamesError) {
        return (
            <ContentWrapper 
                title="Dashboard" 
                subtitle="Error loading NFL data"
            >
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                    <p className="text-red-400 font-medium">Failed to load NFL games</p>
                    <p className="text-red-300/80 text-sm mt-2">{gamesError.message}</p>
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
            subtitle="Welcome back! Track your performance and view upcoming games."
        >
            {/* Temporary Cache Clear Button */}
            <div className="mb-4 flex justify-end">
                <CacheClearButton />
            </div>

            {/* Performance Stats Overview */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="group relative bg-white/[0.05] border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] hover:border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">This Week</p>
                            <p className="text-2xl font-bold text-white mb-1">12-4</p>
                            <p className="text-xs text-sky-400 font-medium">75% accuracy</p>
                        </div>
                        <div className="p-2 bg-sunset-500/20 rounded-lg group-hover:bg-sunset-500/30">
                            <Trophy className="h-6 w-6 text-sunset-500" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white/[0.05] border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] hover:border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Season Record</p>
                            <p className="text-2xl font-bold text-white mb-1">84-52</p>
                            <p className="text-xs text-sky-400 font-medium">61.8% accuracy</p>
                        </div>
                        <div className="p-2 bg-sunrise-500/20 rounded-lg group-hover:bg-sunrise-500/30">
                            <BarChart className="h-6 w-6 text-sunrise-500" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white/[0.05] border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] hover:border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">League Rank</p>
                            <p className="text-2xl font-bold text-white mb-1">#3</p>
                            <p className="text-xs text-sky-400 font-medium">of 12 members</p>
                        </div>
                        <div className="p-2 bg-sky-400/20 rounded-lg group-hover:bg-sky-400/30">
                            <PieChart className="h-6 w-6 text-sky-400" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white/[0.05] border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] hover:border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Active Leagues</p>
                            <p className="text-2xl font-bold text-white mb-1">3</p>
                            <p className="text-xs text-sky-400 font-medium">2 pending picks</p>
                        </div>
                        <div className="p-2 bg-ocean-600/20 rounded-lg group-hover:bg-ocean-600/30">
                            <List className="h-6 w-6 text-ocean-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* League Actions */}
            <div className="relative z-20">
                <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8 glass-transition">
                    <h2 className="text-xl font-semibold text-white mb-4">League Management</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/create-league"
                            className="group relative bg-gradient-to-r from-sunset-500 to-sunrise-500 hover:from-sunset-600 hover:to-sunrise-600 text-white p-6 rounded-xl flex items-center justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Create League</h3>
                                <p className="text-white/80 text-sm">Start your own pick'em league</p>
                            </div>
                            <Trophy className="h-8 w-8 text-white/80 group-hover:text-white" />
                        </Link>
                        <Link
                            to="/join-league"
                            className="group relative bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white p-6 rounded-xl flex items-center justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Join League</h3>
                                <p className="text-white/60 text-sm">Enter an existing league</p>
                            </div>
                            <List className="h-8 w-8 text-white/60 group-hover:text-white" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Header with Make Picks Link */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">NFL Schedule Overview</h2>
                        <p className="text-sm text-white/60 mb-2">View game information and team matchups</p>
                        <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-sunset-500 rounded-full" />
                    </div>
                    <Link 
                        to="/make-picks" 
                        className="group text-sky-400 hover:text-sky-300 text-sm font-medium transition-all duration-200 ease-out flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500/20 to-sunset-500/20 hover:from-sky-500/30 hover:to-sunset-500/30 border border-sky-400/30 hover:border-sky-400/50 hover:scale-105 hover:shadow-xl shadow-lg backdrop-blur-sm"
                    >
                        <span>Make picks</span>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                    </Link>
                </div>
            </div>

            {/* Games display-only - informational view */}
            <div className="space-y-8">
                {gamesByDate.map(({ date, games: dateGames, gameCount }) => (
                    <div key={date}>
                        <div>
                            {/* Enhanced Date Header with Game Count */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white mb-1">
                                            {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </h2>
                                        <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-sunset-500 rounded-full" />
                                    </div>
                                    <div className="text-sm text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                        {dateGames.length} {dateGames.length === 1 ? 'game' : 'games'}
                                    </div>
                                </div>
                            </div>

                            {/* Smart Grid Layout Based on Game Count */}
                            <div className={`grid ${getGridClass(gameCount)} gap-4`}>
                                {dateGames.map((game) => (
                                    <div key={game.id} className="relative group">
                                        <GameCard
                                            game={game}
                                            userPickTeamId={null}
                                            layout={
                                                gameCount === 1 
                                                    ? 'full' // Single game: full width with horizontal layout
                                                    : gameCount === 2
                                                    ? 'wide' // Two games: wide layout
                                                    : 'default' // 3+ games: default vertical layout
                                            }
                                            showPicks={false}
                                            onPickTeam={undefined}
                                            className="h-full w-full transition-all duration-200 hover:shadow-lg" 
                                        />
                                        
                                        {/* Placeholder areas for future stats - shown on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none">
                                            {/* Future stats overlay areas */}
                                            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                                {/* Left side - Community pick percentages */}
                                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white/80 border border-white/20">
                                                    <div className="text-[10px] text-white/60 mb-0.5">Community</div>
                                                    <div className="font-semibold">Coming soon</div>
                                                </div>
                                                
                                                {/* Right side - Betting lines */}
                                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white/80 border border-white/20">
                                                    <div className="text-[10px] text-white/60 mb-0.5">Spread</div>
                                                    <div className="font-semibold">Coming soon</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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