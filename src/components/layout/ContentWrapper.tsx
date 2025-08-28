import React from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { SearchBar } from '../ui';
import type { NFLTeamData } from '../types';
import AnimatedContent from './AnimatedContent';

interface ContentWrapperProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    showSearchBar?: boolean;
    className?: string;
}

export default function ContentWrapper({ 
    children, 
    title, 
    subtitle, 
    showSearchBar = true, 
    className = '' 
}: ContentWrapperProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleTeamSearch = (team: NFLTeamData) => {
        console.log('Team search in content:', team);
        console.log('Navigating to team page:', `/team/${team.abbreviation.toLowerCase()}`);
        // Navigate to team page
        navigate({ 
            to: '/team/$teamId', 
            params: { teamId: team.abbreviation.toLowerCase() } 
        });
    };

    // Determine if search bar should be hidden based on route
    const shouldHideSearchBar = ['/leagues', '/create-league', '/join-league', '/stats'].includes(location.pathname);

    return (
        <div className={className}>
            {/* Search Bar - positioned at top of content area */}
            {showSearchBar && !shouldHideSearchBar && (
                <div className="mb-6">
                    <SearchBar
                        variant="prominent"
                        placeholder="Search NFL teams, cities, or abbreviations..."
                        onTeamSelect={handleTeamSearch}
                        className="w-full max-w-4xl"
                    />
                </div>
            )}

            {/* Page Header with animation */}
            <AnimatedContent animation="slideUp" className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                {subtitle && <p className="text-sky-200">{subtitle}</p>}
            </AnimatedContent>

            {/* Animated content wrapper */}
            <AnimatedContent animation="fade" delay={150}>
                {children}
            </AnimatedContent>
        </div>
    );
}