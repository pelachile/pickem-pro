import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../utils';
import { teamsAndScheduleData } from '../../data/teams-and-schedule';
import type { NFLTeamData } from '../types';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onTeamSelect?: (team: NFLTeamData) => void;
  variant?: 'default' | 'prominent';
}

/**
 * SearchBar Component
 * 
 * A flexible search component for NFL teams with dropdown results
 * Features glass morphism design and responsive layout
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = "Search NFL teams...",
  onTeamSelect,
  variant = 'default'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Get teams data for search
  const teams = useMemo(() => teamsAndScheduleData.teams.all, []);

  // Filter teams based on search query
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return teams
      .filter((team: NFLTeamData) => 
        team.display_name.toLowerCase().includes(query) ||
        team.abbreviation.toLowerCase().includes(query) ||
        team.location.toLowerCase().includes(query) ||
        team.nickname.toLowerCase().includes(query)
      )
      .slice(0, 8); // Limit to 8 results
  }, [teams, searchQuery]);

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleTeamSelect = (team: NFLTeamData) => {
    setSearchQuery('');
    setShowSearchResults(false);
    onTeamSelect?.(team);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const containerStyles = cn(
    'relative w-full max-w-md',
    variant === 'prominent' && 'max-w-2xl',
    className
  );

  const inputStyles = cn(
    'w-full rounded-xl border border-white/20 pl-10 pr-12 py-3 text-white placeholder-white/60',
    'bg-white/[0.05] backdrop-blur-lg hover:bg-white/[0.08]',
    'focus:bg-white/[0.10] focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30 focus:outline-none',
    'transition-all duration-300 shadow-lg',
    variant === 'prominent' && 'py-3.5 text-base shadow-xl border-white/30 rounded-2xl'
  );

  return (
    <div className={containerStyles}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-400/60" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              clearSearch();
            }
          }}
          className={inputStyles}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-white/40 hover:text-white/60 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!searchQuery && (
            <div className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              ⌘K
            </div>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showSearchResults && filteredTeams.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900/95 backdrop-blur-xl border border-sky-400/30 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-white/10">
            <div className="text-xs text-sky-400 font-medium uppercase tracking-wider px-2 py-1">
              {filteredTeams.length} {filteredTeams.length === 1 ? 'Team' : 'Teams'} Found
            </div>
          </div>
          {filteredTeams.map((team: NFLTeamData) => (
            <button
              key={team.id}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-sky-400/10 hover:to-sunrise-500/10 hover:border-l-2 hover:border-sky-400 transition-all duration-200 group"
              onClick={() => handleTeamSelect(team)}
            >
              {team.logo_url && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-sky-400/50 transition-colors duration-200">
                  <img 
                    src={team.logo_url} 
                    alt={`${team.display_name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium group-hover:text-sky-400 transition-colors duration-200">{team.display_name}</div>
                <div className="text-white/60 text-sm">{team.conference} • {team.division}</div>
              </div>
              <div className="text-sky-400 font-bold text-sm bg-sky-400/10 px-2 py-1 rounded group-hover:bg-sky-400/20 transition-colors duration-200">{team.abbreviation}</div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showSearchResults && searchQuery && filteredTeams.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 p-6">
          <div className="text-center">
            <Search className="h-8 w-8 text-white/40 mx-auto mb-2" />
            <div className="text-white/60 font-medium">No teams found</div>
            <div className="text-white/40 text-sm mt-1">Try searching for team name, city, or abbreviation</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;