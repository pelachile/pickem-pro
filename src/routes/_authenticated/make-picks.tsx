import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { GameCard } from '../../components/ui/GameCard';
import type { Status } from '../../components/types';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { useTeams } from '../../hooks/useNflData';
import { useGamesByDate } from '../../hooks/useSmartGames';
import { DataSourceIndicator } from '../../components/dev';
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
    const weekDescription = getNFLWeekDescription(currentNFLWeek);

    const { 
        gamesByDate, 
        sortedDates, 
        dateCount,
        isLoading: gamesLoading, 
        error: gamesError,
        data: smartGameData
    } = useGamesByDate(); // Let the hook determine the correct week
    const { isLoading: teamsLoading } = useTeams();
    
    const currentWeekGames = smartGameData?.games || [];
    
    const {
        picks: existingPicks,
        deadlines,
        isLoading: picksLoading,
        error: picksError,
        refetch: refetchPicks
    } = usePicksWithDeadlines(leagueId, currentWeek);
    
    const submitPicksMutation = useSubmitPicks();

    const teamRecords: Record<string, string> = {
        'DAL': '8-3', 'PHI': '9-2', 'KC': '10-1', 'LAC': '6-5',
        'TB': '7-4', 'ATL': '5-6', 'CIN': '8-3', 'CLE': '4-7',
        'MIA': '7-4', 'IND': '6-5', 'LV': '5-6', 'NE': '3-8',
        'ARI': '6-5', 'NO': '7-4', 'PIT': '8-3', 'NYJ': '4-7',
        'TEN': '5-6', 'DEN': '6-5', 'SF': '9-2', 'SEA': '7-4',
        'DET': '10-1', 'GB': '8-3', 'BAL': '9-2', 'BUF': '8-3'
    };

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

    const gamesGroupedByDate = useMemo(() => {
        return sortedDates.map(date => {
            const dateGames = gamesByDate[date] || [];
            
            return {
                date,
                games: dateGames, // Use the enhanced games directly
                gameCount: dateGames.length,
            };
        });
    }, [gamesByDate, sortedDates]);

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
            subtitle={`${weekDescription} - Select the winners for this week's games`}
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

            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={handleSubmitPicks}
                    disabled={Object.keys(userPicks).length === 0 || submitPicksMutation.isPending}
                    className="w-full sm:w-auto bg-sky-400 hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    {submitPicksMutation.isPending && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {submitPicksMutation.isPending ? 'Submitting...' : `Submit Picks (${Object.keys(userPicks).length}/${currentWeekGames.length})`}
                </button>
                
                {existingPicks && existingPicks.length > 0 && (
                    <span className="text-white/60 text-sm">
                        {existingPicks.length} existing pick{existingPicks.length !== 1 ? 's' : ''} loaded
                    </span>
                )}
            </div>

            <div className="mb-4 flex items-center gap-3">
                <DataSourceIndicator 
                    source={smartGameData?.source}
                    lastUpdated={smartGameData?.lastUpdated}
                    size="md"
                />
                {smartGameData?.games.length && (
                    <span className="text-white/60 text-sm">
                        {smartGameData.games.length} games loaded
                    </span>
                )}
            </div>

            <div className="space-y-8">
                {gamesGroupedByDate.map(({ date, games: dateGames, gameCount }) => (
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
                                
                                const isGameCompleted = game.status === 'final' || game.status === 'live';
                                const shouldShowPicks = !isExpired && !isGameCompleted;
                                const shouldShowStats = isGameCompleted;
                                
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
                ))}
            </div>

            {Object.keys(userPicks).length > 0 && (
                <div className="mt-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Picks Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(userPicks).map(([gameId, teamId]) => {
                            let game: ReturnType<typeof normalizeGameData> | null = null;
                            for (const { games: dateGames } of gamesGroupedByDate) {
                                game = dateGames.find(g => g.id.toString() === gameId);
                                if (game) break;
                            }
                            
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
                </div>
            )}
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/make-picks')({
    component: MakePicksContent,
});

export default MakePicksContent;