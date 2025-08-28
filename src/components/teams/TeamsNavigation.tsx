import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronDown, ChevronRight, Shield, Users } from 'lucide-react';

// Team data organized by conference and division
const teamsStructure = {
  AFC: {
    North: [
      { name: 'Baltimore Ravens', abbreviation: 'BAL' },
      { name: 'Cincinnati Bengals', abbreviation: 'CIN' },
      { name: 'Cleveland Browns', abbreviation: 'CLE' },
      { name: 'Pittsburgh Steelers', abbreviation: 'PIT' }
    ],
    South: [
      { name: 'Houston Texans', abbreviation: 'HOU' },
      { name: 'Indianapolis Colts', abbreviation: 'IND' },
      { name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
      { name: 'Tennessee Titans', abbreviation: 'TEN' }
    ],
    East: [
      { name: 'Buffalo Bills', abbreviation: 'BUF' },
      { name: 'Miami Dolphins', abbreviation: 'MIA' },
      { name: 'New England Patriots', abbreviation: 'NE' },
      { name: 'New York Jets', abbreviation: 'NYJ' }
    ],
    West: [
      { name: 'Denver Broncos', abbreviation: 'DEN' },
      { name: 'Kansas City Chiefs', abbreviation: 'KC' },
      { name: 'Las Vegas Raiders', abbreviation: 'LV' },
      { name: 'Los Angeles Chargers', abbreviation: 'LAC' }
    ]
  },
  NFC: {
    North: [
      { name: 'Chicago Bears', abbreviation: 'CHI' },
      { name: 'Detroit Lions', abbreviation: 'DET' },
      { name: 'Green Bay Packers', abbreviation: 'GB' },
      { name: 'Minnesota Vikings', abbreviation: 'MIN' }
    ],
    South: [
      { name: 'Atlanta Falcons', abbreviation: 'ATL' },
      { name: 'Carolina Panthers', abbreviation: 'CAR' },
      { name: 'New Orleans Saints', abbreviation: 'NO' },
      { name: 'Tampa Bay Buccaneers', abbreviation: 'TB' }
    ],
    East: [
      { name: 'Dallas Cowboys', abbreviation: 'DAL' },
      { name: 'New York Giants', abbreviation: 'NYG' },
      { name: 'Philadelphia Eagles', abbreviation: 'PHI' },
      { name: 'Washington Commanders', abbreviation: 'WSH' }
    ],
    West: [
      { name: 'Arizona Cardinals', abbreviation: 'ARI' },
      { name: 'Los Angeles Rams', abbreviation: 'LAR' },
      { name: 'San Francisco 49ers', abbreviation: 'SF' },
      { name: 'Seattle Seahawks', abbreviation: 'SEA' }
    ]
  }
};

interface TeamsNavigationProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function TeamsNavigation({ isExpanded, onToggleExpanded }: TeamsNavigationProps) {
  const location = useLocation();
  const [expandedConferences, setExpandedConferences] = useState<Set<string>>(new Set(['AFC', 'NFC']));
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());

  const toggleConference = (conference: string) => {
    setExpandedConferences(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conference)) {
        newSet.delete(conference);
        // Also collapse all divisions in this conference
        const divisionsToCollapse = Object.keys(teamsStructure[conference as keyof typeof teamsStructure]);
        divisionsToCollapse.forEach(division => {
          const key = `${conference}-${division}`;
          setExpandedDivisions(prevDiv => {
            const newDivSet = new Set(prevDiv);
            newDivSet.delete(key);
            return newDivSet;
          });
        });
      } else {
        newSet.add(conference);
      }
      return newSet;
    });
  };

  const toggleDivision = (conference: string, division: string) => {
    const key = `${conference}-${division}`;
    setExpandedDivisions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const getDivisionColor = (division: string, conference: string) => {
    const colorMap = {
      'AFC-North': '#6366f1', // Indigo
      'AFC-South': '#10b981', // Emerald
      'AFC-East': '#3b82f6', // Blue
      'AFC-West': '#f59e0b', // Amber
      'NFC-North': '#8b5cf6', // Violet
      'NFC-South': '#06b6d4', // Cyan
      'NFC-East': '#ec4899', // Pink
      'NFC-West': '#ef4444', // Red
    };
    return colorMap[`${conference}-${division}` as keyof typeof colorMap] || '#64748b';
  };

  if (!isExpanded) return null;

  return (
    <div className="space-y-2">
      {Object.entries(teamsStructure).map(([conference, divisions]) => (
        <div key={conference}>
          {/* Conference Header */}
          <button
            onClick={() => toggleConference(conference)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white/80 group-hover:text-white transition-colors font-medium">
                {conference} Conference
              </span>
            </div>
            {expandedConferences.has(conference) ? (
              <ChevronDown className="h-4 w-4 text-white/70" />
            ) : (
              <ChevronRight className="h-4 w-4 text-white/70" />
            )}
          </button>

          {/* Divisions */}
          {expandedConferences.has(conference) && (
            <div className="ml-4 space-y-1">
              {Object.entries(divisions).map(([division, teams]) => {
                const divisionKey = `${conference}-${division}`;
                const divisionColor = getDivisionColor(division, conference);
                
                return (
                  <div key={division}>
                    {/* Division Header */}
                    <button
                      onClick={() => toggleDivision(conference, division)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: divisionColor }}
                        />
                        <span className="text-white/70 group-hover:text-white transition-colors text-sm">
                          {conference} {division}
                        </span>
                      </div>
                      {expandedDivisions.has(divisionKey) ? (
                        <ChevronDown className="h-3 w-3 text-white/70" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-white/70" />
                      )}
                    </button>

                    {/* Teams */}
                    {expandedDivisions.has(divisionKey) && (
                      <div className="ml-6 space-y-1">
                        {teams.map((team) => (
                          <Link
                            key={team.abbreviation}
                            to="/team/$teamId"
                            params={{ teamId: team.abbreviation }}
                            className={`
                              flex items-center gap-3 p-2 rounded-lg transition-colors text-sm
                              ${isCurrentPath(`/team/${team.abbreviation}`) 
                                ? 'bg-sky-500/20 text-sky-300' 
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            <Users className="h-3 w-3" />
                            <span>{team.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Quick Links */}
      <div className="border-t border-white/10 pt-2 mt-4">
        <div className="text-white/50 text-xs font-medium uppercase tracking-wider px-2 mb-2">
          Quick Access
        </div>
        <div className="space-y-1">
          <Link
            to="/teams/all"
            className={`
              flex items-center gap-3 p-2 rounded-lg transition-colors text-sm
              ${isCurrentPath('/teams/all') 
                ? 'bg-sky-500/20 text-sky-300' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Shield className="h-4 w-4" />
            <span>All Teams</span>
          </Link>
          <Link
            to="/teams/afc"
            className={`
              flex items-center gap-3 p-2 rounded-lg transition-colors text-sm
              ${isCurrentPath('/teams/afc') 
                ? 'bg-sky-500/20 text-sky-300' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Shield className="h-4 w-4" />
            <span>AFC Overview</span>
          </Link>
          <Link
            to="/teams/nfc"
            className={`
              flex items-center gap-3 p-2 rounded-lg transition-colors text-sm
              ${isCurrentPath('/teams/nfc') 
                ? 'bg-sky-500/20 text-sky-300' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Shield className="h-4 w-4" />
            <span>NFC Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TeamsNavigation;