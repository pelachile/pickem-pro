import React from 'react';
import { GameCard } from '../ui/GameCard';
import type { Game } from '../types';

/**
 * GameCard Layout Example
 * 
 * Demonstrates the new layout prop functionality:
 * - 'full': Single game cards use full width with horizontal layout
 * - 'wide': Two games use wider layout
 * - 'default': 3+ games use standard vertical layout
 */
export const GameCardLayoutExample: React.FC = () => {
  // Sample game data
  const sampleGame: Game = {
    id: 1,
    status: 'scheduled',
    homeTeam: { 
      id: 1, 
      name: 'Dallas Cowboys', 
      abbreviation: 'DAL', 
      logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
      color: '#041E42',
      record: '8-3'
    },
    awayTeam: { 
      id: 2, 
      name: 'Philadelphia Eagles', 
      abbreviation: 'PHI', 
      logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
      color: '#004C54',
      record: '9-2'
    },
    gameTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    venue: 'AT&T Stadium'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-navy/5 via-sky-blue/5 to-sunset-orange/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-midnight-navy dark:text-white mb-2">
            GameCard Layout Examples
          </h1>
          <p className="text-midnight-navy/70 dark:text-white/70">
            Demonstrating responsive layout behavior
          </p>
        </div>

        {/* Single Game - Full Layout */}
        <section>
          <h2 className="text-xl font-semibold text-midnight-navy dark:text-white mb-4">
            Single Game (Full Layout)
          </h2>
          <p className="text-sm text-midnight-navy/60 dark:text-white/60 mb-4">
            Uses horizontal layout to fill the full width effectively
          </p>
          <div className="grid grid-cols-1 gap-4">
            <GameCard
              game={sampleGame}
              layout="full"
              showPicks={true}
              className="w-full"
            />
          </div>
        </section>

        {/* Two Games - Wide Layout with Different Name Lengths */}
        <section>
          <h2 className="text-xl font-semibold text-midnight-navy dark:text-white mb-4">
            Two Games (Wide Layout) - Uniform Heights
          </h2>
          <p className="text-sm text-midnight-navy/60 dark:text-white/60 mb-4">
            Cards maintain consistent heights despite different team name lengths. 
            "Philadelphia Eagles" and "Dallas Cowboys" now have uniform card heights.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GameCard
              game={sampleGame}
              layout="wide"
              showPicks={true}
              className="w-full"
            />
            <GameCard
              game={{
                ...sampleGame, 
                id: 2,
                homeTeam: { 
                  id: 3, 
                  name: 'New York Giants', 
                  abbreviation: 'NYG', 
                  logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
                  color: '#0B2265',
                  record: '4-7'
                },
                awayTeam: { 
                  id: 4, 
                  name: 'Washington Commanders', 
                  abbreviation: 'WAS', 
                  logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/was.png',
                  color: '#5A1414',
                  record: '6-5'
                }
              }}
              layout="wide"
              showPicks={true}
              className="w-full"
            />
          </div>
        </section>

        {/* Multiple Games - Default Layout */}
        <section>
          <h2 className="text-xl font-semibold text-midnight-navy dark:text-white mb-4">
            Multiple Games (Default Layout)
          </h2>
          <p className="text-sm text-midnight-navy/60 dark:text-white/60 mb-4">
            Standard vertical layout for 3+ games
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <GameCard
              game={sampleGame}
              layout="default"
              showPicks={true}
              compact={true}
            />
            <GameCard
              game={{...sampleGame, id: 3}}
              layout="default"
              showPicks={true}
              compact={true}
            />
            <GameCard
              game={{...sampleGame, id: 4}}
              layout="default"
              showPicks={true}
              compact={true}
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default GameCardLayoutExample;