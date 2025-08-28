import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Card } from '../ui/Card';
import { Shield, Trophy } from 'lucide-react';

interface TeamNavigationProps {
  currentPath?: string;
}

export const TeamNavigation: React.FC<TeamNavigationProps> = ({ currentPath }) => {
  const location = useLocation();
  const activePath = currentPath || location.pathname;

  const navItems = [
    {
      name: 'AFC Conference',
      path: '/teams/afc',
      description: 'American Football Conference teams and analysis',
      color: '#004C99',
      icon: Shield,
    },
    {
      name: 'NFC Conference',
      path: '/teams/nfc',
      description: 'National Football Conference teams and analysis',
      color: '#CC0000',
      icon: Trophy,
    },
    {
      name: 'All Teams',
      path: '/teams/all',
      description: 'League-wide analysis of all 32 NFL teams',
      color: '#6366f1',
      icon: Shield,
    },
  ];

  return (
    <Card className="p-6 mb-6" glass={true}>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Team Analysis Navigation</h2>
        <p className="text-white/60 text-sm">
          Explore comprehensive team analysis by conference or view all teams at once
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group p-4 rounded-lg border transition-all duration-300
                ${isActive 
                  ? 'bg-white/10 border-sky-400/50 shadow-lg shadow-sky-400/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-sky-400/20' 
                      : 'bg-white/10 group-hover:bg-white/20'
                    }
                  `}
                  style={{ backgroundColor: isActive ? `${item.color}20` : undefined }}
                >
                  <IconComponent 
                    className={`h-5 w-5 ${isActive ? 'text-sky-400' : 'text-white/70'}`}
                    style={{ color: isActive ? item.color : undefined }}
                  />
                </div>
                <h3 
                  className={`font-semibold ${isActive ? 'text-sky-400' : 'text-white'}`}
                  style={{ color: isActive ? item.color : undefined }}
                >
                  {item.name}
                </h3>
              </div>
              
              <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                {item.description}
              </p>
              
              {isActive && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-xs text-sky-400 font-medium">Currently Viewing</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
};