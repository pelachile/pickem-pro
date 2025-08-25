import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Search, Users, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { usePublicLeagues, useJoinLeague } from '../../hooks/useLeague';
import { useDebounce } from '../../hooks/useDebounce';
import type { PublicLeague } from '../../types/league';


function JoinLeagueContent() {
    const [activeTab, setActiveTab] = useState<'search' | 'code'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [password, setPassword] = useState('');
    const [joinError, setJoinError] = useState<string>('');
    const [joinSuccess, setJoinSuccess] = useState<string>('');
    const [joiningLeagueId, setJoiningLeagueId] = useState<string | null>(null);
    const [needsPassword, setNeedsPassword] = useState(false);

    // Debounce search query to reduce API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Fetch public leagues with search
    const {
        data: publicLeaguesData,
        isLoading: isLoadingPublicLeagues,
        error: publicLeaguesError,
        refetch: refetchPublicLeagues
    } = usePublicLeagues({
        search: debouncedSearchQuery || undefined,
        limit: 20,
        offset: 0
    });

    // Join league mutation
    const joinLeagueMutation = useJoinLeague();

    // Clear errors when switching tabs
    useEffect(() => {
        setJoinError('');
        setJoinSuccess('');
        setNeedsPassword(false);
    }, [activeTab]);

    // Clear join state when search query changes
    useEffect(() => {
        setJoinError('');
        setJoinSuccess('');
    }, [debouncedSearchQuery]);

    const handleJoinPublicLeague = async (league: PublicLeague) => {
        if (league.is_full) return;
        
        setJoiningLeagueId(league.id);
        setJoinError('');
        setJoinSuccess('');

        try {
            await joinLeagueMutation.mutateAsync({
                inviteCode: league.invite_code, // Use the actual invite code
            });
            
            setJoinSuccess(`Successfully joined "${league.name}"!`);
            setJoiningLeagueId(null);
            
            // Refetch to update member count
            refetchPublicLeagues();
        } catch (error) {
            setJoinError(error instanceof Error ? error.message : 'Failed to join league');
            setJoiningLeagueId(null);
        }
    };

    const handleJoinByCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setJoinError('');
        setJoinSuccess('');

        try {
            await joinLeagueMutation.mutateAsync({
                inviteCode: joinCode.trim(),
                password: password || undefined,
            });
            
            setJoinSuccess(`Successfully joined league!`);
            setJoinCode('');
            setPassword('');
            setNeedsPassword(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to join league';
            
            // Check if error indicates password is needed
            if (errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('required')) {
                setNeedsPassword(true);
                setJoinError('This league requires a password. Please enter the password and try again.');
            } else {
                setJoinError(errorMessage);
            }
        }
    };

    const publicLeagues = publicLeaguesData?.leagues || [];

    return (
        <ContentWrapper 
            title="Join a League" 
            subtitle="Find and join existing pick'em leagues"
            showSearchBar={false}
        >
            <div className="max-w-4xl mx-auto">
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-white/[0.03] p-1 rounded-xl mb-8">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'search'
                                ? 'bg-sky-400 text-white shadow-lg'
                                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                        }`}
                    >
                        Browse Public Leagues
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'code'
                                ? 'bg-sky-400 text-white shadow-lg'
                                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                        }`}
                    >
                        Join with Code
                    </button>
                </div>

                {activeTab === 'search' ? (
                    <div className="space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search leagues by name or description..."
                                className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                            />
                        </div>

                        {/* Loading state */}
                        {isLoadingPublicLeagues && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
                                <span className="ml-3 text-white/60">Loading leagues...</span>
                            </div>
                        )}

                        {/* Error state */}
                        {publicLeaguesError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                    <span className="text-red-400">Error loading leagues: {publicLeaguesError.message}</span>
                                </div>
                                <button
                                    onClick={() => refetchPublicLeagues()}
                                    className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Success message */}
                        {joinSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                    <span className="text-green-400">{joinSuccess}</span>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {joinError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                    <span className="text-red-400">{joinError}</span>
                                </div>
                            </div>
                        )}

                        {/* Public Leagues */}
                        {!isLoadingPublicLeagues && !publicLeaguesError && (
                            <div className="space-y-4">
                                {publicLeagues.map((league) => (
                                    <div key={league.id} className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sunset-500 rounded-lg flex items-center justify-center">
                                                    <Users className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                                        {league.name}
                                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                                            Public
                                                        </span>
                                                    </h3>
                                                    {league.description && (
                                                        <p className="text-white/60">{league.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleJoinPublicLeague(league)}
                                                disabled={league.is_full || joiningLeagueId === league.id}
                                                className="px-4 py-2 bg-sky-400 hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                                            >
                                                {joiningLeagueId === league.id ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Joining...
                                                    </>
                                                ) : league.is_full ? (
                                                    'Full'
                                                ) : (
                                                    'Join'
                                                )}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                                <div className="text-lg font-semibold text-white">
                                                    {league.current_members}/{league.max_members}
                                                </div>
                                                <div className="text-xs text-white/60">Members</div>
                                            </div>
                                            <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                                <div className="text-lg font-semibold text-white">
                                                    ${league.entry_fee}
                                                </div>
                                                <div className="text-xs text-white/60">Entry Fee</div>
                                            </div>
                                            <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                                <div className="text-lg font-semibold text-white">
                                                    ${league.prize_pool}
                                                </div>
                                                <div className="text-xs text-white/60">Prize Pool</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {!isLoadingPublicLeagues && !publicLeaguesError && publicLeagues.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
                                <p className="text-white/60">
                                    {debouncedSearchQuery 
                                        ? `No leagues found matching "${debouncedSearchQuery}".`
                                        : 'No public leagues available at the moment.'
                                    }
                                </p>
                                {debouncedSearchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-3 text-sky-400 hover:text-sky-300 text-sm transition-colors"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Join with League Code</h3>
                            
                            {/* Success message */}
                            {joinSuccess && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                        <span className="text-green-400">{joinSuccess}</span>
                                    </div>
                                </div>
                            )}

                            {/* Error message */}
                            {joinError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                        <span className="text-red-400">{joinError}</span>
                                    </div>
                                </div>
                            )}
                            
                            <form onSubmit={handleJoinByCode} className="space-y-4">
                                <div>
                                    <label htmlFor="joinCode" className="block text-sm font-medium text-white/80 mb-2">
                                        League Code
                                    </label>
                                    <input
                                        type="text"
                                        id="joinCode"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                                        placeholder="Enter league code (e.g., ABC123)"
                                        required
                                        disabled={joinLeagueMutation.isPending}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                        Password {needsPassword ? '(required)' : '(if required)'}
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full px-4 py-3 bg-white/[0.05] border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/[0.08] transition-all duration-200 ${
                                            needsPassword 
                                                ? 'border-orange-400 focus:border-orange-400' 
                                                : 'border-white/20 focus:border-sky-400'
                                        }`}
                                        placeholder="Enter password"
                                        disabled={joinLeagueMutation.isPending}
                                        required={needsPassword}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!joinCode || joinLeagueMutation.isPending}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-sunset-500 to-sunrise-500 text-white rounded-lg hover:from-sunset-600 hover:to-sunrise-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    {joinLeagueMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Joining League...
                                        </>
                                    ) : (
                                        'Join League'
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-white/60 text-sm">
                                Don't have a league code? Ask the league creator to share it with you, or browse public leagues above.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/join-league')({
    component: JoinLeagueContent,
});