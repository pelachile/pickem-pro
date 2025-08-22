import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { MagnifyingGlassIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import ContentWrapper from '../../components/layout/ContentWrapper';

// Sample public leagues
const samplePublicLeagues = [
    {
        id: 1,
        name: 'NFL Fanatics',
        members: 23,
        maxMembers: 30,
        entryFee: 15,
        isPrivate: false,
        description: 'Competitive league for serious NFL fans'
    },
    {
        id: 2,
        name: 'Casual Sunday',
        members: 8,
        maxMembers: 12,
        entryFee: 0,
        isPrivate: false,
        description: 'Just for fun, no pressure!'
    },
    {
        id: 3,
        name: 'High Stakes',
        members: 15,
        maxMembers: 20,
        entryFee: 50,
        isPrivate: false,
        description: 'Big money league for experienced players'
    },
];

function JoinLeagueContent() {
    const [activeTab, setActiveTab] = useState<'search' | 'code'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [password, setPassword] = useState('');

    const handleJoinLeague = (leagueId: number) => {
        console.log('Joining league:', leagueId);
        // Future: Submit to API
    };

    const handleJoinByCode = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Joining by code:', { joinCode, password });
        // Future: Submit to API
    };

    const filteredLeagues = samplePublicLeagues.filter(league =>
        league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        league.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search leagues by name or description..."
                                className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                            />
                        </div>

                        {/* Public Leagues */}
                        <div className="space-y-4">
                            {filteredLeagues.map((league) => (
                                <div key={league.id} className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sunset-500 rounded-lg flex items-center justify-center">
                                                <UserGroupIcon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                                    {league.name}
                                                    {league.isPrivate && <LockClosedIcon className="h-4 w-4 text-white/60" />}
                                                </h3>
                                                <p className="text-white/60">{league.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleJoinLeague(league.id)}
                                            disabled={league.members >= league.maxMembers}
                                            className="px-4 py-2 bg-sky-400 hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                        >
                                            {league.members >= league.maxMembers ? 'Full' : 'Join'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-white">
                                                {league.members}/{league.maxMembers}
                                            </div>
                                            <div className="text-xs text-white/60">Members</div>
                                        </div>
                                        <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-white">
                                                ${league.entryFee}
                                            </div>
                                            <div className="text-xs text-white/60">Entry Fee</div>
                                        </div>
                                        <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-white">
                                                ${league.entryFee * league.maxMembers}
                                            </div>
                                            <div className="text-xs text-white/60">Prize Pool</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredLeagues.length === 0 && (
                            <div className="text-center py-12">
                                <UserGroupIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                                <p className="text-white/60">No leagues found matching your search.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Join with League Code</h3>
                            
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
                                        placeholder="Enter league code"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                        Password (if required)
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                                        placeholder="Enter password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!joinCode}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-sunset-500 to-sunrise-500 text-white rounded-lg hover:from-sunset-600 hover:to-sunrise-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Join League
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-white/60 text-sm">
                                Don't have a league code? Ask the league creator to share it with you.
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