import React, { useState } from 'react';
import { Link, useRouter, useLocation } from '@tanstack/react-router';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import {
    Menu,
    Home,
    Trophy,
    List,
    PieChart,
    X,
    LogOut,
    Plus,
    Users,
    Settings,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useProfile';
import { useUserLeagues } from '../../hooks/useLeague';
import { UserAvatar } from '../ui/UserAvatar';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

// Helper function to generate league initial from name
const getLeagueInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
};

// Main navigation items
const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Make Picks', href: '/make-picks', icon: List },
    { name: 'Leagues', href: '/leagues', icon: Trophy },
    { name: 'Stats', href: '/stats', icon: PieChart },
];


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, signOut } = useAuth();
    const router = useRouter();
    const location = useLocation();
    
    // Fetch user profile for enhanced display
    const { data: profileResponse } = useUserProfile(user?.id);
    const profile = profileResponse?.data;

    // Fetch user's leagues using the proper hook with user-specific caching
    const { 
        data: leaguesData, 
        isLoading: leaguesLoading, 
        error: leaguesError 
    } = useUserLeagues(user?.id);

    const userLeagues = leaguesData?.data || [];
    const hasLeaguesError = leaguesError || (leaguesData && !leaguesData.success);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.navigate({ to: '/home' });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const isCurrentPage = (href: string) => {
        return location.pathname === href;
    };

    const Sidebar = () => (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-navy-900/95 backdrop-blur-lg border-r border-sky-400/20 px-6">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center">
                <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-sky-400 hover:text-sunrise-500 transition-colors duration-200">
                    <Trophy className="h-8 w-8" />
                    <span>Pick'em Pro</span>
                </Link>
            </div>

            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    {/* Main Navigation */}
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => {
                                const current = isCurrentPage(item.href);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.href}
                                            className={classNames(
                                                current
                                                    ? 'bg-sky-400/20 text-sky-400 border-l-2 border-sky-400'
                                                    : 'text-white/80 hover:bg-white/10 hover:text-sky-400 border-l-2 border-transparent hover:border-sky-400/50',
                                                'group flex gap-x-3 rounded-r-md p-3 text-sm font-semibold transition-all duration-200 ease-out',
                                            )}
                                        >
                                            <item.icon
                                                aria-hidden="true"
                                                className={classNames(
                                                    current
                                                        ? 'text-sky-400'
                                                        : 'text-white/60 group-hover:text-sky-400',
                                                    'size-6 shrink-0 transition-colors duration-200',
                                                )}
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>

                    {/* Quick Actions */}
                    <li>
                        <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                            Quick Actions
                        </div>
                        <ul role="list" className="-mx-2 space-y-1">
                            <li>
                                <Link
                                    to="/create-league"
                                    className="text-white/80 hover:bg-white/10 hover:text-sky-400 group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-all duration-200 ease-out"
                                >
                                    <Plus className="size-5 shrink-0 text-white/60 group-hover:text-sky-400 transition-colors duration-200" />
                                    Create League
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/join-league"
                                    className="text-white/80 hover:bg-white/10 hover:text-sky-400 group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-all duration-200 ease-out"
                                >
                                    <Users className="size-5 shrink-0 text-white/60 group-hover:text-sky-400 transition-colors duration-200" />
                                    Join League
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* My Leagues Section */}
                    <li>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                My Leagues
                            </div>
                            {leaguesLoading && (
                                <Loader2 className="h-3 w-3 text-white/40 animate-spin" />
                            )}
                        </div>
                        <ul role="list" className="-mx-2 space-y-1">
                            {/* Loading State */}
                            {leaguesLoading && (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <li key={`skeleton-${i}`} className="animate-pulse">
                                            <div className="flex gap-x-3 rounded-md p-2">
                                                <div className="size-6 bg-white/10 rounded-lg"></div>
                                                <div className="flex flex-col min-w-0 flex-1 space-y-1">
                                                    <div className="h-3 bg-white/10 rounded w-20"></div>
                                                    <div className="h-2 bg-white/10 rounded w-16"></div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </>
                            )}

                            {/* Error State */}
                            {hasLeaguesError && !leaguesLoading && (
                                <li>
                                    <div className="flex items-center gap-x-3 rounded-md p-2 text-red-400">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span className="text-xs">Failed to load leagues</span>
                                    </div>
                                </li>
                            )}

                            {/* Empty State */}
                            {!leaguesLoading && !hasLeaguesError && userLeagues.length === 0 && (
                                <li>
                                    <div className="text-center py-4">
                                        <Trophy className="h-8 w-8 text-white/20 mx-auto mb-2" />
                                        <p className="text-xs text-white/50 mb-3">No leagues yet</p>
                                        <Link
                                            to="/join-league"
                                            className="text-sky-400 hover:text-sky-300 text-xs font-medium transition-colors duration-200"
                                        >
                                            Join a league
                                        </Link>
                                    </div>
                                </li>
                            )}

                            {/* Leagues List */}
                            {!leaguesLoading && !hasLeaguesError && userLeagues.map((league) => (
                                <li key={league.id}>
                                    <Link
                                        to="/league/$leagueId"
                                        params={{ leagueId: league.id }}
                                        className="text-white/80 hover:bg-white/10 hover:text-sky-400 group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-all duration-200 ease-out"
                                    >
                                        <div className="relative">
                                            <span className="border-white/20 text-white/80 bg-white/10 group-hover:border-sky-400/50 group-hover:text-sky-400 group-hover:bg-sky-400/20 flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-bold transition-all duration-200">
                                                {getLeagueInitial(league.name)}
                                            </span>
                                            {league.status === 'active' && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border border-navy-900 rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate">{league.name}</span>
                                                {league.position && league.position <= 3 && (
                                                    <Trophy className="h-3 w-3 text-sunrise-500" />
                                                )}
                                            </div>
                                            <span className="text-xs text-white/50">
                                                {league.position ? `#${league.position} of ${league.current_members}` : `${league.current_members} members`}
                                                {league.status === 'active' && <span className="text-green-400 ml-1">• Active</span>}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* Enhanced User Profile at bottom */}
                    <li className="-mx-6 mt-auto">
                        <div className="border-t border-white/10 pt-4">
                            {/* Profile Section */}
                            <div className="px-6 py-3">
                                <div className="flex items-center gap-x-3 min-w-0 mb-3">
                                    <UserAvatar
                                        user={{
                                            name: profile?.full_name || profile?.username || user?.displayName || user?.firstName || user?.email || 'User',
                                            avatar_icon: profile?.avatar_icon,
                                            avatar_color: profile?.avatar_color as any
                                        }}
                                        size="lg"
                                    />
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-medium text-white truncate">
                                            {profile?.full_name || profile?.username || user?.displayName || user?.firstName || user?.email || 'User'}
                                        </span>
                                        <span className="text-xs text-sky-400 font-medium">
                                            {profile?.username ? `@${profile.username}` : 'Online'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Quick Profile Actions */}
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/settings"
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                                        title="Profile Settings"
                                    >
                                        <Settings className="size-4" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white/60 hover:text-sunset-500 bg-white/5 hover:bg-sunset-500/10 border border-white/10 hover:border-sunset-500/30 rounded-lg transition-all duration-200"
                                        title="Sign out"
                                    >
                                        <LogOut className="size-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400">
            {/* Mobile sidebar */}
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-40 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button 
                                    type="button" 
                                    onClick={() => setSidebarOpen(false)} 
                                    className="-m-2.5 p-2.5 text-white hover:text-sky-400 transition-colors duration-200"
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <X aria-hidden="true" className="size-6" />
                                </button>
                            </div>
                        </TransitionChild>

                        <Sidebar />
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-80 lg:flex-col">
                <Sidebar />
            </div>

            {/* Enhanced Mobile header with better touch targets */}
            <div className="sticky top-0 z-30 flex items-center gap-x-4 bg-navy-900/95 backdrop-blur-xl border-b border-sky-400/20 px-4 py-3 lg:hidden shadow-lg min-h-[60px]">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="-m-2.5 p-2.5 text-white/80 hover:text-sky-400 hover:bg-white/10 rounded-lg transition-all duration-200 touch-target focus-ring"
                    aria-label="Open navigation menu"
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu aria-hidden="true" className="size-6" />
                </button>
                
                {/* Logo/Title */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    <Trophy className="h-6 w-6 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">Pick'em Pro</div>
                    </div>
                </div>
                
                {/* Enhanced Mobile Profile Avatar with accessibility */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link 
                        to="/settings"
                        className="focus-ring touch-target"
                        aria-label={`Profile menu for ${profile?.full_name || profile?.username || user?.displayName || user?.firstName || user?.email || 'user'}`}
                    >
                        <UserAvatar
                            user={{
                                name: profile?.full_name || profile?.username || user?.displayName || user?.firstName || user?.email || 'User',
                                avatar_icon: profile?.avatar_icon,
                                avatar_color: profile?.avatar_color as any
                            }}
                            size="lg"
                            className="border-2 border-white/20 hover:border-white/40 transition-all duration-200"
                        />
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <main className="pt-6 pb-10 lg:pl-80">
                <div className="px-4 sm:px-6 lg:px-8 relative z-10 page-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}