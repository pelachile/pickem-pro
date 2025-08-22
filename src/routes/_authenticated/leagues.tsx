import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus, Users } from 'lucide-react';
import ContentWrapper from '../../components/layout/ContentWrapper';

// Sample leagues data
const sampleLeagues = [
    { 
        id: 1, 
        name: 'Office League', 
        members: 12, 
        position: 3, 
        initial: 'O',
        entryFee: 20,
        totalPot: 240,
        status: 'active',
        nextDeadline: '2025-09-12T19:00:00Z'
    },
    { 
        id: 2, 
        name: 'Family Picks', 
        members: 8, 
        position: 1, 
        initial: 'F',
        entryFee: 0,
        totalPot: 0,
        status: 'active',
        nextDeadline: '2025-09-12T19:00:00Z'
    },
    { 
        id: 3, 
        name: 'College Friends', 
        members: 15, 
        position: 7, 
        initial: 'C',
        entryFee: 10,
        totalPot: 150,
        status: 'active',
        nextDeadline: '2025-09-12T19:00:00Z'
    },
];

function LeaguesContent() {
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

            {/* Active Leagues */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Active Leagues</h2>
                
                <div className="grid gap-6">
                    {sampleLeagues.map((league) => (
                        <div key={league.id} className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-sunset-500 to-sunrise-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                        {league.initial}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{league.name}</h3>
                                        <p className="text-white/60">{league.members} members</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-sky-400">#{league.position}</div>
                                    <div className="text-xs text-white/60">Current Rank</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                    <div className="text-lg font-semibold text-white">
                                        ${league.entryFee}
                                    </div>
                                    <div className="text-xs text-white/60">Entry Fee</div>
                                </div>
                                <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                    <div className="text-lg font-semibold text-white">
                                        ${league.totalPot}
                                    </div>
                                    <div className="text-xs text-white/60">Total Pot</div>
                                </div>
                                <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                                    <div className="text-lg font-semibold text-white">
                                        {new Date(league.nextDeadline).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-white/60">Next Deadline</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    league.status === 'active' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                    {league.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                                <div className="space-x-3">
                                    <Link
                                        to="/make-picks"
                                        className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors duration-200"
                                    >
                                        Make Picks
                                    </Link>
                                    <button className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* League Stats */}
            <div className="mt-12 bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">League Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-sky-400 mb-2">3</div>
                        <div className="text-white/60">Active Leagues</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-sunrise-500 mb-2">$370</div>
                        <div className="text-white/60">Total Prize Pool</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-sunset-500 mb-2">67%</div>
                        <div className="text-white/60">Average Win Rate</div>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/leagues')({
    component: LeaguesContent,
});