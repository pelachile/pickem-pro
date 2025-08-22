import { createFileRoute } from '@tanstack/react-router';
import ContentWrapper from '../../components/layout/ContentWrapper';

function StatsContent() {
    return (
        <ContentWrapper 
            title="Statistics" 
            subtitle="Track your performance and analyze trends across all leagues"
            showSearchBar={false}
        >
            {/* Overall Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Season Overview</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-white/60">Total Picks</span>
                            <span className="text-white font-medium">136</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Correct Picks</span>
                            <span className="text-green-400 font-medium">84</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Accuracy</span>
                            <span className="text-sky-400 font-medium">61.8%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Rank Average</span>
                            <span className="text-sunset-500 font-medium">#3.7</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Weekly Trends</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-white/60">Best Week</span>
                            <span className="text-green-400 font-medium">Week 7 (14-2)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Worst Week</span>
                            <span className="text-red-400 font-medium">Week 3 (6-10)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Current Streak</span>
                            <span className="text-sunrise-500 font-medium">3 wins</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Best Streak</span>
                            <span className="text-sky-400 font-medium">7 wins</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">League Performance</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-white/60">Office League</span>
                            <span className="text-white font-medium">#3 of 12</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Family Picks</span>
                            <span className="text-green-400 font-medium">#1 of 8</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">College Friends</span>
                            <span className="text-white font-medium">#7 of 15</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Performance Analysis */}
            <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-6">Team Performance Analysis</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-medium text-white mb-4">Most Successful Picks</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        KC
                                    </div>
                                    <span className="text-white">Kansas City Chiefs</span>
                                </div>
                                <span className="text-green-400 font-medium">8-1 (89%)</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        BUF
                                    </div>
                                    <span className="text-white">Buffalo Bills</span>
                                </div>
                                <span className="text-green-400 font-medium">7-2 (78%)</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        BAL
                                    </div>
                                    <span className="text-white">Baltimore Ravens</span>
                                </div>
                                <span className="text-green-400 font-medium">6-2 (75%)</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-white mb-4">Most Challenging Picks</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        NYJ
                                    </div>
                                    <span className="text-white">New York Jets</span>
                                </div>
                                <span className="text-red-400 font-medium">2-5 (29%)</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        CLE
                                    </div>
                                    <span className="text-white">Cleveland Browns</span>
                                </div>
                                <span className="text-red-400 font-medium">1-4 (20%)</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        NE
                                    </div>
                                    <span className="text-white">New England Patriots</span>
                                </div>
                                <span className="text-red-400 font-medium">1-6 (14%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Breakdown */}
            <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Weekly Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-white/60 font-medium">Week</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium">Record</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium">Accuracy</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium">Rank Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-white/5">
                                <td className="py-3 px-4 text-white">Week 12</td>
                                <td className="py-3 px-4 text-white">12-4</td>
                                <td className="py-3 px-4 text-green-400">75%</td>
                                <td className="py-3 px-4 text-green-400">+1</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-3 px-4 text-white">Week 11</td>
                                <td className="py-3 px-4 text-white">10-6</td>
                                <td className="py-3 px-4 text-white">63%</td>
                                <td className="py-3 px-4 text-white/60">0</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-3 px-4 text-white">Week 10</td>
                                <td className="py-3 px-4 text-white">11-5</td>
                                <td className="py-3 px-4 text-green-400">69%</td>
                                <td className="py-3 px-4 text-green-400">+2</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-3 px-4 text-white">Week 9</td>
                                <td className="py-3 px-4 text-white">8-7</td>
                                <td className="py-3 px-4 text-red-400">53%</td>
                                <td className="py-3 px-4 text-red-400">-1</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 text-white">Week 8</td>
                                <td className="py-3 px-4 text-white">13-3</td>
                                <td className="py-3 px-4 text-green-400">81%</td>
                                <td className="py-3 px-4 text-green-400">+3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/stats')({
    component: StatsContent,
});