import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { GameCard } from '../../components/ui/GameCard';
import type { Status } from '../../components/types';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { useSchedule, useTeams } from '../../hooks/useNflData';
import { usePicksWithDeadlines, useSubmitPicks } from '../../hooks/usePicks';
import type { PickSubmission } from '../../types/picks';

function MakePicksContent() {
    const [userPicks, setUserPicks] = useState<Record<string, number>>({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    // For now, we'll use a real league ID - in a real app this would come from route params or context
    const leagueId = '0208f571-d6b7-4f33-90f9-608c3dbcef72'; // TODO: Get from actual league context (using BFG league)
    const currentWeek = 1; // TODO: Get from current NFL week

    // Get live data from TanStack Query
    const { allGames, isLoading: scheduleLoading, error: scheduleError } = useSchedule();
    const { isLoading: teamsLoading } = useTeams();
    
    // Get picks data and game deadlines
    const {
        picks: existingPicks,
        deadlines,
        isLoading: picksLoading,
        error: picksError,
        refetch: refetchPicks
    } = usePicksWithDeadlines(leagueId, currentWeek);
    
    // Submit picks mutation
    const submitPicksMutation = useSubmitPicks();

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
            id: typeof scheduleGame.id === 'string' ? parseInt(scheduleGame.id, 10) : scheduleGame.id,
            status: (scheduleGame.status === 'final' ? 'final' : scheduleGame.status === 'live' ? 'live' : 'scheduled') as Status,
            homeTeam: {
                id: typeof scheduleGame.home_team.id === 'string' ? parseInt(scheduleGame.home_team.id, 10) : scheduleGame.home_team.id,
                name: scheduleGame.home_team.display_name,
                abbreviation: scheduleGame.home_team.abbreviation,
                color: scheduleGame.home_team.color,
                logo_url: scheduleGame.home_team.logo_url,
                record: teamRecords[scheduleGame.home_team.abbreviation] || '6-5',
            },
            awayTeam: {
                id: typeof scheduleGame.away_team.id === 'string' ? parseInt(scheduleGame.away_team.id, 10) : scheduleGame.away_team.id,
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

    // Initialize user picks with existing picks
    useEffect(() => {
        if (existingPicks && existingPicks.length > 0) {
            const picksMap: Record<string, number> = {};
            existingPicks.forEach(pick => {
                picksMap[pick.game_id] = pick.picked_team_id;
            });
            setUserPicks(picksMap);
        }
    }, [existingPicks]);
    
    // Check for expired games based on deadlines
    const expiredGameIds = useMemo(() => {
        return deadlines
            .filter(deadline => deadline.deadline_passed)
            .map(deadline => deadline.game_id);
    }, [deadlines]);

    // Group games by date with smart sequential layout logic
    const gamesByDate = useMemo(() => {
        const grouped = games.reduce((acc, game) => {
            const date = new Date(game.gameTime).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(game);
            return acc;
        }, {} as Record<string, any[]>);

        return Object.entries(grouped).map(([date, dateGames]) => ({
            date,
            games: dateGames,
            gameCount: dateGames.length,
        }));
    }, [games]);

    // Responsive grid layout logic
    const getGridClass = (gameCount: number) => {
        if (gameCount === 1) {
            return 'grid-cols-1'; // Full width for single game
        } else if (gameCount === 2) {
            return 'grid-cols-1 sm:grid-cols-2'; // Split for two games
        } else {
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'; // Standard responsive grid for 3+
        }
    };

    const handlePickTeam = (gameId: string | number, teamId: number) => {
        const gameIdStr = gameId.toString();
        
        // Don't allow picks on expired games
        if (expiredGameIds.includes(gameIdStr)) {
            return;
        }
        
        setUserPicks(prev => ({
            ...prev,
            [gameIdStr]: teamId,
        }));
        
        // Clear any existing error/success messages when user makes changes
        setSubmitError(null);
        setShowSuccessMessage(false);
    };

    const handleSubmitPicks = async () => {
        setSubmitError(null);
        setShowSuccessMessage(false);
        
        // Convert userPicks to PickSubmission format
        const pickSubmissions: PickSubmission[] = Object.entries(userPicks).map(([gameId, teamId]) => ({
            game_id: gameId,
            picked_team_id: teamId,
            confidence_points: 1, // Default confidence points for now
        }));
        
        if (pickSubmissions.length === 0) {
            setSubmitError('Please make at least one pick before submitting.');
            return;
        }
        
        try {
            const result = await submitPicksMutation.mutateAsync({
                league_id: leagueId,
                picks: pickSubmissions,
            });
            
            if (result.success) {
                setShowSuccessMessage(true);
                // Refetch picks to get updated data
                refetchPicks();
                
                // Hide success message after 5 seconds
                setTimeout(() => setShowSuccessMessage(false), 5000);
            } else {
                setSubmitError(result.error || 'Failed to submit picks. Please try again.');
            }
        } catch (error) {
            console.error('Pick submission error:', error);
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit picks. Please try again.');
        }
    };

    // Show loading state
    if (scheduleLoading || teamsLoading || picksLoading) {
        return (
            <ContentWrapper 
                title="Make Your Picks" 
                subtitle="Loading games..."
            >
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
                        <p className="text-white/80">Loading NFL schedule and your picks...</p>
                    </div>
                </div>
            </ContentWrapper>
        );
    }

    // Show error state
    if (scheduleError || picksError) {
        const error = scheduleError || picksError;
        return (
            <ContentWrapper 
                title="Make Your Picks" 
                subtitle="Error loading data"
            >
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                    <p className="text-red-400 font-medium">Failed to load data</p>
                    <p className="text-red-300/80 text-sm mt-2">{error?.message}</p>
                    <button 
                        onClick={() => {
                            if (scheduleError) {
                                window.location.reload();
                            } else {
                                refetchPicks();
                            }
                        }}
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
            title="Make Your Picks" 
            subtitle={`Week ${currentWeek} - Select the winners for this week's games`}
        >
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-400 font-medium">Picks submitted successfully!</p>
                    </div>
                </div>
            )}
            
            {/* Error Message */}
            {submitError && (
                <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-400 font-medium">{submitError}</p>
                    </div>
                </div>
            )}

            {/* Submit Button - Fixed at top on mobile, inline on desktop */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={handleSubmitPicks}
                    disabled={Object.keys(userPicks).length === 0 || submitPicksMutation.isPending}
                    className="w-full sm:w-auto bg-sky-400 hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    {submitPicksMutation.isPending && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {submitPicksMutation.isPending ? 'Submitting...' : `Submit Picks (${Object.keys(userPicks).length}/${games.length})`}
                </button>
                
                {existingPicks && existingPicks.length > 0 && (
                    <span className="text-white/60 text-sm">
                        {existingPicks.length} existing pick{existingPicks.length !== 1 ? 's' : ''} loaded
                    </span>
                )}
            </div>

            {/* Games with smart sequential layout logic */}
            <div className="space-y-8">
                {gamesByDate.map(({ date, games: dateGames, gameCount }) => (
                    <div key={date}>
                        {/* Date Header */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-4">
                                {new Date(date).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h2>
                            <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-sunset-500 rounded-full" />
                        </div>

                        {/* Smart Grid Layout Based on Game Count */}
                        <div className={`grid ${getGridClass(gameCount)} gap-4`}>
                            {dateGames.map((game) => {
                                const gameId = game.id.toString();
                                const isExpired = expiredGameIds.includes(gameId);
                                const deadline = deadlines.find(d => d.game_id === gameId);
                                
                                return (
                                    <GameCard
                                        key={game.id}
                                        game={game}
                                        userPickTeamId={userPicks[gameId] || null}
                                        layout={
                                            gameCount === 1 
                                                ? 'full' // Single game: full width with horizontal layout
                                                : gameCount === 2
                                                ? 'wide' // Two games: wide layout
                                                : 'default' // 3+ games: default vertical layout
                                        }
                                        showPicks={!isExpired}
                                        onPickTeam={(teamId) => handlePickTeam(gameId, teamId)}
                                        className={`h-full w-full ${isExpired ? 'opacity-60' : ''}`}
                                        // Add deadline warning if less than 30 minutes
                                        deadlineWarning={deadline && !deadline.deadline_passed && deadline.minutes_until_deadline && deadline.minutes_until_deadline < 30 ? 
                                            `${deadline.minutes_until_deadline} minutes left` : undefined
                                        }
                                    />
                                );
                            })}
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
                            const game = games.find(g => g.id.toString() === gameId);
                            const pickedTeam = game?.homeTeam.id === teamId ? game.homeTeam : game?.awayTeam;
                            const isExpired = expiredGameIds.includes(gameId);
                            
                            if (!game || !pickedTeam) return null;
                            
                            return (
                                <div key={gameId} className={`flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5 ${isExpired ? 'opacity-60' : ''}`}>
                                    <span className="text-white/60 text-sm">
                                        {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
                                        {isExpired && <span className="ml-2 text-red-400 text-xs">(Expired)</span>}
                                    </span>
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

export default MakePicksContent;