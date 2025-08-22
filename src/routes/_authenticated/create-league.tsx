import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import ContentWrapper from '../../components/layout/ContentWrapper';

function CreateLeagueContent() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        entryFee: 0,
        maxMembers: 10,
        isPrivate: false,
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating league:', formData);
        // Future: Submit to API
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                   type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    return (
        <ContentWrapper 
            title="Create New League" 
            subtitle="Set up your own pick'em league and invite friends to compete"
            showSearchBar={false}
        >
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* League Name */}
                    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">League Details</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                                    League Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                                    placeholder="Enter league name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200 resize-none"
                                    placeholder="Describe your league"
                                />
                            </div>
                        </div>
                    </div>

                    {/* League Settings */}
                    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">League Settings</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="entryFee" className="block text-sm font-medium text-white/80 mb-2">
                                    Entry Fee ($)
                                </label>
                                <input
                                    type="number"
                                    id="entryFee"
                                    name="entryFee"
                                    value={formData.entryFee}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label htmlFor="maxMembers" className="block text-sm font-medium text-white/80 mb-2">
                                    Max Members
                                </label>
                                <input
                                    type="number"
                                    id="maxMembers"
                                    name="maxMembers"
                                    value={formData.maxMembers}
                                    onChange={handleInputChange}
                                    min="2"
                                    max="50"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPrivate"
                                    name="isPrivate"
                                    checked={formData.isPrivate}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-sky-400 bg-white/[0.05] border-white/20 rounded focus:ring-sky-400 focus:ring-2"
                                />
                                <label htmlFor="isPrivate" className="ml-3 text-sm text-white/80">
                                    Make this league private (requires password to join)
                                </label>
                            </div>

                            {formData.isPrivate && (
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                        League Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200"
                                        placeholder="Enter password"
                                        required={formData.isPrivate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/60">League Name:</span>
                                <span className="text-white">{formData.name || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Entry Fee:</span>
                                <span className="text-white">${formData.entryFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Max Members:</span>
                                <span className="text-white">{formData.maxMembers}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Total Prize Pool:</span>
                                <span className="text-sky-400">${formData.entryFee * formData.maxMembers}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Privacy:</span>
                                <span className="text-white">{formData.isPrivate ? 'Private' : 'Public'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="flex-1 px-6 py-3 bg-white/[0.05] border border-white/20 text-white rounded-lg hover:bg-white/[0.08] hover:border-white/30 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.name}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-sunset-500 to-sunrise-500 text-white rounded-lg hover:from-sunset-600 hover:to-sunrise-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Create League
                        </button>
                    </div>
                </form>
            </div>
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/create-league')({
    component: CreateLeagueContent,
});