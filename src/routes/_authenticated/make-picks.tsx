import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { GameCard } from '../../components/ui/GameCard';
import type { Status } from '../../components/types';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { useTeams } from '../../hooks/useNflData';
// import { useGamesByDate } from '../../hooks/useSmartGames'; // Disabled during AWS migration
import { useEnrichedNflData } from '../../hooks/useLiveData';
// import { DataSourceIndicator } from '../../components/dev'; // Disabled during AWS migration
import { usePicksWithDeadlines, useSubmitPicks } from '../../hooks/usePicks';
import type { PickSubmission } from '../../types/picks';
import { getCurrentNFLWeek, getNFLWeekDescription } from '../../lib/nflCalendar';

function MakePicksContent() {
    const [userPicks, setUserPicks] = useState<Record<string, number>>({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    const leagueId = '0208f571-d6b7-4f33-90f9-608c3dbcef72';
    
    const currentNFLWeek = getCurrentNFLWeek();
    const currentWeek = currentNFLWeek.week;

    // Use the new enriched NFL data
    const { data: nflData, isLoading: gamesLoading, getGamesByWeek } = useEnrichedNflData();
    const { isLoading: teamsLoading } = useTeams();
    
    // Get the current NFL week games for display
    const gamesData = useMemo(() => {
        if (!nflData) {
            return {
                games: [],
                gamesByDate: {},
                sortedDates: [],
                week: 1,
                weekDescription: 'Loading...',
            };
        }
        // Use the current NFL week, but fallback to latest available if current week not available
        const targetWeek = currentWeek;
        let weekGames = getGamesByWeek(targetWeek);
        
        // If current week data isn't available, fall back to latest available
        if (weekGames.length === 0 && nflData.meta.weeks_available.length > 0) {
            const latestWeek = Math.max(...nflData.meta.weeks_available);
            weekGames = getGamesByWeek(latestWeek);
            console.log(`No data for current week ${targetWeek}, showing latest available week ${latestWeek}`);
        }
        
        // Group games by date
        const gamesByDate = weekGames.reduce((acc, game) => {
            const date = new Date(game.date).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(game);
            return acc;
        }, {} as Record<string, typeof weekGames>);
        
        const sortedDates = Object.keys(gamesByDate).sort((a, b) => 
            new Date(a).getTime() - new Date(b).getTime()
        );
        
        const displayWeek = weekGames.length > 0 ? 
            (weekGames[0].week || targetWeek) : targetWeek;
        
        const isShowingFallback = weekGames.length > 0 && displayWeek !== targetWeek;
        
        return {
            games: weekGames,
            gamesByDate,
            sortedDates,
            dateCount: sortedDates.length,
            week: displayWeek,
            weekDescription: isShowingFallback ? 
                `2025 Preseason Week ${displayWeek} (Latest Available)` : 
                getNFLWeekDescription(currentNFLWeek),
        };
    }, [nflData, getGamesByWeek, currentWeek, currentNFLWeek]);
    
    const gamesError = null;
    
    const {
        picks: existingPicks,
        deadlines,
        isLoading: picksLoading,
        error: picksError,
        refetch: refetchPicks
    } = usePicksWithDeadlines(leagueId, currentWeek);
    
    const submitPicksMutation = useSubmitPicks();


    useEffect(() => {
        if (existingPicks && existingPicks.length > 0) {
            const picksMap: Record<string, number> = {};
            existingPicks.forEach(pick => {
                picksMap[pick.game_id] = pick.picked_team_id;
            });
            setUserPicks(picksMap);
        }
    }, [existingPicks]);
    
    const expiredGameIds = useMemo(() => {
        return deadlines
            .filter(deadline => deadline.deadline_passed)
            .map(deadline => deadline.game_id);
    }, [deadlines]);


    const getGridClass = (gameCount: number) => {
        if (gameCount === 1) {
            return 'grid-cols-1';
        } else if (gameCount === 2) {
            return 'grid-cols-1 sm:grid-cols-2';
        } else {
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
        }
    };

    const handlePickTeam = (gameId: string | number, teamId: number) => {
        const gameIdStr = gameId.toString();
        
        if (expiredGameIds.includes(gameIdStr)) {
            return;
        }
        
        setUserPicks(prev => ({
            ...prev,
            [gameIdStr]: teamId,
        }));
        
        setSubmitError(null);
        setShowSuccessMessage(false);
    };

    const handleSubmitPicks = async () => {
        setSubmitError(null);
        setShowSuccessMessage(false);
        
        const pickSubmissions: PickSubmission[] = Object.entries(userPicks).map(([gameId, teamId]) => ({
            game_id: gameId,
            picked_team_id: teamId,
            confidence_points: 1,
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
                refetchPicks();
                setTimeout(() => setShowSuccessMessage(false), 5000);
            } else {
                setSubmitError(result.error || 'Failed to submit picks. Please try again.');
            }
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit picks. Please try again.');
        }
    };

    if (gamesLoading || teamsLoading || picksLoading) {
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

    if (gamesError || picksError) {
        const error = gamesError || picksError;
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
                            if (gamesError) {
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
            subtitle={gamesData?.weekDescription || 'Loading...'}
        >
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

            {/* Picks submission UI hidden for historical games display */}

            <div className="mb-4 flex items-center gap-3">
                {/* DataSourceIndicator disabled during AWS migration */}
                {gamesData?.games && gamesData.games.length > 0 && (
                    <span className="text-white/60 text-sm">
                        {gamesData.games.length} games loaded
                    </span>
                )}
            </div>

            <div className="space-y-8">
                {gamesData?.sortedDates.map((date) => {
                    const dateGames = gamesData.gamesByDate[date] || [];
                    const gameCount = dateGames.length;
                    return (
                    <div key={date}>
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

                        <div className={`grid ${getGridClass(gameCount)} gap-4`}>
                            {dateGames.map((game) => {
                                const gameId = game.id.toString();
                                const isExpired = expiredGameIds.includes(gameId);
                                const deadline = deadlines.find(d => d.game_id === gameId);
                                
                                const isGameCompleted = game.status === 'STATUS_FINAL' || game.status === 'final' || game.status === 'live';
                                const shouldShowPicks = !isGameCompleted && !isExpired; // Show picks for upcoming games
                                const shouldShowStats = isGameCompleted; // Show stats only for completed games
                                
                                return (
                                    <GameCard
                                        key={`game-${game.id}-${gameId}`}
                                        game={game}
                                        userPickTeamId={userPicks[gameId] || null}
                                        layout={
                                            gameCount === 1 
                                                ? 'full'
                                                : gameCount === 2
                                                ? 'wide'
                                                : 'default'
                                        }
                                        showPicks={shouldShowPicks}
                                        showStats={shouldShowStats}
                                        onPickTeam={(teamId) => handlePickTeam(gameId, teamId)}
                                        className={`h-full w-full ${isExpired || isGameCompleted ? 'opacity-80' : ''}`}
                                        deadlineWarning={deadline && !deadline.deadline_passed && deadline.minutes_until_deadline && deadline.minutes_until_deadline < 30 ? 
                                            `${deadline.minutes_until_deadline} minutes left` : undefined
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                    );
                })}
            </div>

            {/* Picks Summary and Submit Section */}
            <div className="mt-8">
                {Object.keys(userPicks).length > 0 ? (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Your Picks Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(userPicks).map(([gameId, teamId]) => {
                                const game = gamesData?.games.find(g => g.id.toString() === gameId);
                                
                                const pickedTeam = game?.homeTeam.id === teamId ? game.homeTeam : game?.awayTeam;
                                const isExpired = expiredGameIds.includes(gameId);
                                
                                if (!game || !pickedTeam) return null;
                                
                                return (
                                    <div key={gameId} className={`flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 ${isExpired ? 'opacity-60' : ''}`}>
                                        <span className="text-white/60 text-sm">
                                            {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
                                            {isExpired && <span className="ml-2 text-red-400 text-xs">(Expired)</span>}
                                        </span>
                                        <span className="text-sky-400 font-medium">{pickedTeam.abbreviation}</span>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Submit Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleSubmitPicks}
                                disabled={submitPicksMutation.isPending}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {submitPicksMutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>Submit My Picks ({Object.keys(userPicks).length} games)</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    gamesData?.games.length > 0 && (
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center">
                            <div className="text-white/60 mb-4">
                                <svg className="w-12 h-12 mx-auto mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <p className="text-lg">Make your picks for Week 1!</p>
                                <p className="text-sm mt-1">Click on teams above to select your winners</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/make-picks')({
    component: MakePicksContent,
});

export default MakePicksContent;