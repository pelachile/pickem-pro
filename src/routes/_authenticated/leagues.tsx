import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, Crown, Settings, LogOut, Eye, Loader2, AlertCircle, Trophy } from 'lucide-react';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { leagueApi } from '../../lib/api';
import type { UserLeague } from '../../types/league';

// Helper function to generate league initial from name
const getLeagueInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
};

// Loading skeleton component
const LeagueCardSkeleton = () => (
    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                <div>
                    <div className="h-6 bg-white/10 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-20"></div>
                </div>
            </div>
            <div className="text-right">
                <div className="h-8 bg-white/10 rounded w-12 mb-1"></div>
                <div className="h-3 bg-white/10 rounded w-16"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/[0.02] rounded-lg p-3">
                    <div className="h-6 bg-white/10 rounded w-12 mx-auto mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-16 mx-auto"></div>
                </div>
            ))}
        </div>
        <div className="flex justify-between items-center">
            <div className="h-6 bg-white/10 rounded w-16"></div>
            <div className="space-x-3">
                <div className="h-4 bg-white/10 rounded w-20 inline-block"></div>
                <div className="h-4 bg-white/10 rounded w-24 inline-block"></div>
            </div>
        </div>
    </div>
);

// Error component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-white/[0.03] backdrop-blur-lg border border-red-500/20 rounded-xl p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Leagues</h3>
        <p className="text-white/60 mb-4">{error}</p>
        <button
            onClick={onRetry}
            className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
            Try Again
        </button>
    </div>
);

// Empty state component
const EmptyState = () => (
    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-12 text-center">
        <Trophy className="h-16 w-16 text-white/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Leagues Yet</h3>
        <p className="text-white/60 mb-6">You haven't joined any leagues yet. Create one or join an existing league to get started!</p>
        <div className="space-x-4">
            <Link
                to="/create-league"
                className="bg-sunset-500 hover:bg-sunset-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
                <Plus className="h-4 w-4" />
                <span>Create League</span>
            </Link>
            <Link
                to="/join-league"
                className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white px-6 py-2 rounded-lg transition-all duration-200 inline-flex items-center space-x-2"
            >
                <Users className="h-4 w-4" />
                <span>Join League</span>
            </Link>
        </div>
    </div>
);

// League card component
const LeagueCard = ({ league }: { league: UserLeague }) => {
    const navigate = useNavigate();
    const totalPot = league.entry_fee * league.current_members;
    const nextDeadline = league.nextDeadline ? new Date(league.nextDeadline) : null;
    
    return (
        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sunset-500 to-sunrise-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {getLeagueInitial(league.name)}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold text-white">{league.name}</h3>
                            {league.userRole === 'owner' && (
                                <Crown className="h-4 w-4 text-sunrise-500" />
                            )}
                            {league.userRole === 'admin' && (
                                <Settings className="h-4 w-4 text-sky-400" />
                            )}
                        </div>
                        <p className="text-white/60">{league.current_members} of {league.max_members} members</p>
                    </div>
                </div>
                {league.position && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-sky-400">#{league.position}</div>
                        <div className="text-xs text-white/60">Current Rank</div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold text-white">
                        ${league.entry_fee}
                    </div>
                    <div className="text-xs text-white/60">Entry Fee</div>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold text-white">
                        ${totalPot}
                    </div>
                    <div className="text-xs text-white/60">Total Pot</div>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold text-white">
                        {nextDeadline ? nextDeadline.toLocaleDateString() : 'TBD'}
                    </div>
                    <div className="text-xs text-white/60">Next Deadline</div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    league.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : league.status === 'draft'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                }`}>
                    {league.status === 'active' ? 'Active' : league.status === 'draft' ? 'Draft' : 'Inactive'}
                </span>
                <div className="space-x-3">
                    {league.status === 'active' && (
                        <Link
                            to="/make-picks"
                            className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors duration-200"
                        >
                            Make Picks
                        </Link>
                    )}
                    <button 
                        onClick={() => {
                            console.log('Navigating to league detail:', league.id);
                            navigate({ to: '/league/$leagueId', params: { leagueId: league.id } });
                        }}
                        className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
                    >
                        <Eye className="h-4 w-4 inline mr-1" />
                        View Details
                    </button>
                    {(league.userRole === 'owner' || league.userRole === 'admin') && (
                        <Link
                            to="/league-manage/$leagueId"
                            params={{ leagueId: league.id }}
                            className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
                        >
                            <Settings className="h-4 w-4 inline mr-1" />
                            Manage
                        </Link>
                    )}
                    {league.userRole === 'member' && (
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
                            <LogOut className="h-4 w-4 inline mr-1" />
                            Leave
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

function LeaguesContent() {
    const { 
        data: leaguesData, 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['user-leagues'],
        queryFn: leagueApi.getUserLeagues,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    const leagues = leaguesData?.data || [];
    const hasError = error || (leaguesData && !leaguesData.success);
    const errorMessage = error?.message || leaguesData?.error || 'An unexpected error occurred';

    // Calculate aggregate stats
    const activeLeagues = leagues.filter(league => league.status === 'active');
    const totalPrizePool = leagues.reduce((sum, league) => sum + (league.entry_fee * league.current_members), 0);
    const averageWinRate = leagues.length > 0 
        ? Math.round(leagues.reduce((sum, league) => sum + (league.winRate || 0), 0) / leagues.length)
        : 0;

    return (
        <ContentWrapper 
            title="My Leagues" 
            subtitle="Manage your pick'em leagues and track your performance"
            showSearchBar={false}
        >
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Link
                    to="/create-league"
                    className="group relative bg-gradient-to-r from-sunset-500 to-sunrise-500 hover:from-sunset-600 hover:to-sunrise-600 text-white p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-between"
                >
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Create New League</h3>
                        <p className="text-white/80 text-sm">Start your own pick'em league</p>
                    </div>
                    <Plus className="h-8 w-8 text-white/80 group-hover:text-white transition-colors" />
                </Link>
                <Link
                    to="/join-league"
                    className="group relative bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-between"
                >
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Join League</h3>
                        <p className="text-white/60 text-sm">Enter an existing league</p>
                    </div>
                    <Users className="h-8 w-8 text-white/60 group-hover:text-white transition-colors" />
                </Link>
            </div>

            {/* Leagues Content */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">My Leagues</h2>
                    {isLoading && (
                        <Loader2 className="h-5 w-5 text-white/60 animate-spin" />
                    )}
                </div>
                
                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-6">
                        {[1, 2, 3].map((i) => <LeagueCardSkeleton key={i} />)}
                    </div>
                )}

                {/* Error State */}
                {hasError && !isLoading && (
                    <ErrorState error={errorMessage} onRetry={() => refetch()} />
                )}

                {/* Empty State */}
                {!isLoading && !hasError && leagues.length === 0 && (
                    <EmptyState />
                )}

                {/* Leagues List */}
                {!isLoading && !hasError && leagues.length > 0 && (
                    <div className="grid gap-6">
                        {leagues.map((league) => (
                            <LeagueCard key={league.id} league={league} />
                        ))}
                    </div>
                )}
            </div>

            {/* League Stats */}
            {!isLoading && !hasError && leagues.length > 0 && (
                <div className="mt-12 bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">League Performance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-sky-400 mb-2">{activeLeagues.length}</div>
                            <div className="text-white/60">Active Leagues</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-sunrise-500 mb-2">${totalPrizePool}</div>
                            <div className="text-white/60">Total Prize Pool</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-sunset-500 mb-2">{averageWinRate}%</div>
                            <div className="text-white/60">Average Win Rate</div>
                        </div>
                    </div>
                </div>
            )}
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/leagues')({
    component: LeaguesContent,
});