import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle, XCircle, Copy } from 'lucide-react';
import ContentWrapper from '../../components/layout/ContentWrapper';
// Remove useAuth import since we'll get session directly from Supabase
import { supabase } from '../../lib/supabase';

// API response interface
interface CreateLeagueResponse {
    success: boolean;
    data?: {
        id: string;
        name: string;
        inviteCode: string;
        description?: string;
        entryFee: number;
        maxMembers: number;
        isPrivate: boolean;
    };
    error?: string;
}

// API function to create league
const createLeague = async (formData: any, token: string): Promise<CreateLeagueResponse> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
    const response = await fetch(`${supabaseUrl}/functions/v1/create-league`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            description: formData.description || null,
            entryFee: formData.entryFee,
            maxMembers: formData.maxMembers,
            isPrivate: formData.isPrivate,
            password: formData.isPrivate ? formData.password : null,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
};

function CreateLeagueContent() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        entryFee: 0,
        maxMembers: 10,
        isPrivate: false,
        password: '',
    });
    const [successData, setSuccessData] = useState<CreateLeagueResponse['data'] | null>(null);
    const [apiError, setApiError] = useState<string>('');
    const [inviteCodeCopied, setInviteCodeCopied] = useState(false);

    // TanStack Query mutation for creating league
    const createLeagueMutation = useMutation({
        mutationFn: async () => {
            // Clear any previous errors
            setApiError('');
            
            // Get fresh session token
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session?.access_token) {
                throw new Error('Authentication required. Please sign in again.');
            }

            return createLeague(formData, session.access_token);
        },
        onSuccess: (data) => {
            if (data.success && data.data) {
                setSuccessData(data.data);
                // Invalidate and refetch user leagues to show new league immediately
                queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
                // Navigate to leagues page after showing success message
                setTimeout(() => {
                    navigate({ to: '/leagues' });
                }, 5000); // Show success message for 5 seconds
            } else {
                setApiError(data.error || 'Failed to create league');
            }
        },
        onError: (error: Error) => {
            console.error('League creation error:', error);
            setApiError(error.message || 'An unexpected error occurred');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name.trim()) {
            setApiError('League name is required');
            return;
        }
        
        if (formData.isPrivate && !formData.password.trim()) {
            setApiError('Password is required for private leagues');
            return;
        }
        
        createLeagueMutation.mutate();
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
            <div className="max-w-2xl mx-auto relative">
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
                                    disabled={createLeagueMutation.isPending || !!successData}
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                                    disabled={createLeagueMutation.isPending || !!successData}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 resize-none"
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
                                    disabled={createLeagueMutation.isPending || !!successData}
                                    min="0"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                                    disabled={createLeagueMutation.isPending || !!successData}
                                    min="2"
                                    max="50"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                                    disabled={createLeagueMutation.isPending || !!successData}
                                    className="w-4 h-4 text-sky-400 bg-white/[0.05] border-white/20 rounded focus:ring-sky-400 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        disabled={createLeagueMutation.isPending || !!successData}
                                        className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                            onClick={() => navigate({ to: '/leagues' })}
                            disabled={createLeagueMutation.isPending}
                            className="flex-1 px-6 py-3 bg-white/[0.05] border border-white/20 text-white rounded-lg hover:bg-white/[0.08] hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.name || createLeagueMutation.isPending}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-sunset-500 to-sunrise-500 text-white rounded-lg hover:from-sunset-600 hover:to-sunrise-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            {createLeagueMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create League'
                            )}
                        </button>
                    </div>

                    {/* Error Message */}
                    {apiError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-red-400 font-medium mb-1">Error Creating League</h4>
                                <p className="text-red-300 text-sm">{apiError}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {successData && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-green-400 font-semibold mb-2">League Created Successfully!</h4>
                                    <p className="text-green-300 text-sm mb-4">
                                        Your league "{successData.name}" has been created. Share the invite code below with friends to join.
                                    </p>
                                    
                                    <div className="bg-white/[0.05] border border-white/10 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/80 text-sm font-medium">Invite Code:</span>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await navigator.clipboard.writeText(successData.inviteCode);
                                                        setInviteCodeCopied(true);
                                                        setTimeout(() => setInviteCodeCopied(false), 2000);
                                                    } catch (err) {
                                                        console.error('Failed to copy:', err);
                                                    }
                                                }}
                                                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                                {inviteCodeCopied ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                        <div className="text-2xl font-mono font-bold text-white bg-white/[0.05] rounded-lg p-3 text-center">
                                            {successData.inviteCode}
                                        </div>
                                    </div>
                                    
                                    <p className="text-green-300/80 text-xs mt-3">
                                        Redirecting to leagues page in a few seconds...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Loading and success overlay */}
                {createLeagueMutation.isPending && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="bg-white/[0.05] backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center">
                            <Loader2 className="w-12 h-12 text-sky-400 animate-spin mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Creating League...</h3>
                            <p className="text-white/60">Setting up your league and generating invite code</p>
                        </div>
                    </div>
                )}

                {/* Success overlay */}
                {successData && !createLeagueMutation.isPending && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="bg-green-500/10 backdrop-blur-lg border border-green-500/20 rounded-xl p-8 text-center max-w-md">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-white mb-2">League Created! 🎉</h3>
                            <p className="text-white/80 mb-4">
                                "{successData.name}" is ready for action!
                            </p>
                            
                            <div className="bg-white/[0.05] border border-white/20 rounded-lg p-4 mb-4">
                                <p className="text-sm text-white/60 mb-2">Share this invite code:</p>
                                <div className="flex items-center justify-center gap-2">
                                    <code className="bg-white/[0.1] px-3 py-2 rounded text-sky-400 font-mono text-lg tracking-wider">
                                        {successData.inviteCode}
                                    </code>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await navigator.clipboard.writeText(successData.inviteCode);
                                                setInviteCodeCopied(true);
                                                setTimeout(() => setInviteCodeCopied(false), 2000);
                                            } catch (err) {
                                                console.error('Failed to copy:', err);
                                            }
                                        }}
                                        className="p-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 rounded transition-colors"
                                    >
                                        {inviteCodeCopied ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-white/60" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-sm text-white/60">
                                Redirecting to your leagues in a few seconds...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error overlay */}
                {apiError && !createLeagueMutation.isPending && !successData && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-xl p-8 text-center max-w-md">
                            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
                            <p className="text-red-200 mb-6">
                                {apiError}
                            </p>
                            <button
                                onClick={() => setApiError('')}
                                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/create-league')({
    component: CreateLeagueContent,
});