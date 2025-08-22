import React from 'react';
import { Link } from '@tanstack/react-router';
import { 
  HomeIcon, 
  TrophyIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  CogIcon 
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Make Picks', path: '/make-picks', icon: TrophyIcon },
    { name: 'Leagues', path: '/leagues', icon: CurrencyDollarIcon },
    { name: 'Stats', path: '/stats', icon: ChartBarIcon },
    { name: 'Settings', path: '/settings', icon: CogIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-navy-900/80 backdrop-blur-md border-r border-ocean-600/30 p-4 transition-all duration-300 ease-in-out">
      <div className="mb-10">
        <Link to="/" className="flex items-center justify-center mb-8">
          <TrophyIcon className="h-10 w-10 text-sky-400" />
          <span className="ml-2 text-2xl font-bold text-sky-400">Pick'em Pro</span>
        </Link>
      </div>

      <nav>
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
      </nav>
    </aside>
  );
};

export default Sidebar;