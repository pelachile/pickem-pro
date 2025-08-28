import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Home, 
  Trophy, 
  DollarSign, 
  BarChart,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Users,
  Target
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['fantasy', 'teams']));

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Make Picks', path: '/make-picks', icon: Trophy },
    { name: 'Leagues', path: '/leagues', icon: DollarSign },
    { name: 'Stats', path: '/stats', icon: BarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const fantasyItems = [
    { name: 'Quarterbacks', path: '/fantasy/quarterbacks' },
    { name: 'Running Backs', path: '/fantasy/running-backs' },
    { name: 'Wide Receivers', path: '/fantasy/wide-receivers' },
    { name: 'Tight Ends', path: '/fantasy/tightends' },
    { name: 'Defense/Kickers', path: '/fantasy/defense-kickers' },
  ];

  const teamItems = [
    { name: 'AFC Conference', path: '/teams/afc' },
    { name: 'NFC Conference', path: '/teams/nfc' },
    { name: 'All Teams', path: '/teams/all' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-navy-900/80 backdrop-blur-md border-r border-ocean-600/30 p-4 transition-all duration-300 ease-in-out">
      <div className="mb-10">
        <Link to="/" className="flex items-center justify-center mb-8">
          <Trophy className="h-10 w-10 text-sky-400" />
          <span className="ml-2 text-2xl font-bold text-sky-400">Pick'em Pro</span>
        </Link>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center p-3 mb-2 rounded-lg text-sky-400 hover:bg-white/10 hover:text-sunrise-500 transition-all duration-300 ease-out"
          >
            <item.icon className="h-6 w-6 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}

        {/* Fantasy Section */}
        <div className="mt-6">
          <button
            onClick={() => toggleSection('fantasy')}
            className="flex items-center justify-between w-full p-3 mb-2 rounded-lg text-sky-400 hover:bg-white/10 hover:text-sunrise-500 transition-all duration-300 ease-out"
          >
            <div className="flex items-center">
              <Target className="h-6 w-6 mr-3" />
              <span>Fantasy Analysis</span>
            </div>
            {expandedSections.has('fantasy') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('fantasy') && (
            <div className="ml-6 space-y-1">
              {fantasyItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center p-2 rounded-lg text-sky-400/80 hover:bg-white/5 hover:text-sky-300 transition-all duration-200 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-sky-400/60 mr-3 flex-shrink-0"></div>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Teams Section */}
        <div className="mt-4">
          <button
            onClick={() => toggleSection('teams')}
            className="flex items-center justify-between w-full p-3 mb-2 rounded-lg text-sky-400 hover:bg-white/10 hover:text-sunrise-500 transition-all duration-300 ease-out"
          >
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-3" />
              <span>Team Analysis</span>
            </div>
            {expandedSections.has('teams') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('teams') && (
            <div className="ml-6 space-y-1">
              {teamItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center p-2 rounded-lg text-sky-400/80 hover:bg-white/5 hover:text-sky-300 transition-all duration-200 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-sky-400/60 mr-3 flex-shrink-0"></div>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;