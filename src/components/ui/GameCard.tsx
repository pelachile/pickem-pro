import React, { useState } from 'react';
import { cn, formatGameTime, formatGameDate, getStatusText, shouldShowIndicator } from '../utils';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import type { GameCardProps, Team } from '../types';

/**
 * Simple icon component for game card actions
 * Replace with your preferred icon library (Heroicons, Lucide, etc.)
 */
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const iconMap: Record<string, string> = {
    check: '✓',
    plus: '+',
    refresh: '↻',
    home: '🏠',
    // Add more icons as needed
  };
  
  return (
    <span className={cn('flex items-center justify-center', className)}>
      {iconMap[name] || '?'}
    </span>
  );
};

/**
 * TeamLogo Component
 * 
 * Displays team logo with fallback to abbreviation badge
 * Uses team's alternate color for background when available
 */
const TeamLogo: React.FC<{
  team: Team;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}> = ({ team, size = 'md', className }) => {
  const [logoError, setLogoError] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };
  
  const badgeSizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
    '2xl': 'w-20 h-20 text-lg'
  };
  
  // Get logo URL from either logo_url or logo field
  const logoUrl = team.logo_url || team.logo;
  
  // Get background color - prefer alternate_color, fallback to color, then default
  const backgroundColor = team.alternate_color || team.color || '#374151';
  
  // Team-specific color overrides for known teams with correct colors
  const teamColorOverrides: Record<string, string> = {
    'IND': '#002C5F', // Colts blue
    'NYJ': '#FFFFFF', // Jets white background for contrast  
    'BUF': '#00338D', // Bills blue
    'NE': '#002244',  // Patriots navy
    'SEA': '#002244', // Seahawks navy
    'DET': '#0076B6'  // Lions blue
  };
  
  const finalBackgroundColor = teamColorOverrides[team.abbreviation] || backgroundColor;
  
  // Function to check if a color is dark (for contrast)
  const isColorDark = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness < 128;
  };
  
  // Use white text for dark backgrounds, dark text for light backgrounds
  const textColor = isColorDark(finalBackgroundColor) ? 'text-white' : 'text-gray-900';
  
  // If no logo URL or logo failed to load, show fallback badge
  if (!logoUrl || logoError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center rounded-full font-bold shadow-lg border-2 border-white/20',
          'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm',
          badgeSizeClasses[size],
          textColor,
          className
        )}
        style={{ backgroundColor: finalBackgroundColor }}
        title={`${team.name} logo`}
      >
        {team.abbreviation}
      </div>
    );
  }
  
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Team color background circle for better logo visibility */}
      <div 
        className="absolute inset-0 rounded-full shadow-lg border border-white/20" 
        style={{ backgroundColor: finalBackgroundColor }}
      />
      
      {/* Loading state */}
      {logoLoading && (
        <div className={cn(
          'absolute inset-0 bg-gray-200 rounded-full animate-pulse flex items-center justify-center',
          sizeClasses[size]
        )}>
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
        </div>
      )}
      
      {/* Team logo */}
      <img 
        src={logoUrl} 
        alt={`${team.name} logo`}
        className={cn(
          'relative z-10 w-full h-full object-contain rounded-full transition-opacity duration-200 p-0.5',
          logoLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setLogoLoading(false)}
        onError={() => {
          setLogoError(true);
          setLogoLoading(false);
        }}
      />
    </div>
  );
};

/**
 * TeamRow Component
 * 
 * Displays team information with scores and pick functionality
 */
const TeamRow: React.FC<{
  team: Team;
  score?: number;
  isWinner: boolean;
  isUserPick: boolean;
  isHome: boolean;
  compact?: boolean;
  layout?: 'default' | 'wide' | 'full';
  showPicks?: boolean;
  onPickTeam?: (teamId: number) => void;
}> = ({ 
  team, 
  score, 
  isWinner, 
  isUserPick, 
  isHome, 
  compact = false, 
  layout = 'default',
  showPicks = false, 
  onPickTeam 
}) => {
  // Convert team color hex to RGB for CSS custom properties
  const getTeamColorStyles = (color: string) => {
    // Remove # if present
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return {
      '--team-color': `${r}, ${g}, ${b}`,
    } as React.CSSProperties;
  };

  const teamColorStyles = team.color ? getTeamColorStyles(team.color) : {};

  return (
    <div 
      className={cn(
        'rounded-lg border transition-all duration-300 group relative',
        'bg-white/[0.03] backdrop-blur-lg border-white/10',
        isUserPick && 'ring-2 ring-sky-400/60 bg-sky-400/15 border-sky-400/40',
        isWinner && 'bg-sunrise-gold/20 border-sunrise-gold/50 shadow-sunrise-gold/30',
        showPicks && 'cursor-pointer hover:bg-white/[0.08] hover:border-white/30',
        !isUserPick && showPicks && 'hover:ring-2 hover:ring-white/30',
        // Dynamic padding based on layout with minimum touch targets
        layout === 'full' ? 'p-4' : layout === 'wide' ? 'p-3.5' : 'p-3',
        // Focus styles for accessibility
        showPicks && 'focus:outline-none focus:ring-2 focus:ring-sunrise-400 focus:ring-offset-2 focus:ring-offset-transparent'
      )}
      style={teamColorStyles}
      role={showPicks ? "button" : "group"}
      tabIndex={showPicks && !(layout === 'full' || layout === 'wide') ? 0 : -1}
      aria-label={`${team.name} ${isHome ? 'home' : 'away'} team${isUserPick ? ' - currently selected' : ''}${showPicks ? ' - click to select' : ''}`}
      aria-describedby={`team-${team.id}-details`}
      onClick={() => showPicks && onPickTeam && !(layout === 'full' || layout === 'wide') && onPickTeam(team.id)}
      onKeyDown={(e) => {
        if (showPicks && onPickTeam && !(layout === 'full' || layout === 'wide') && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onPickTeam(team.id);
        }
      }}
    >
      {/* Team color indicator bar */}
      {team.color && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: team.color }}
        />
      )}
      
      {/* Enhanced Selection indicator with better accessibility */}
      {isUserPick && (
        <div 
          className={cn(
            'absolute -top-1 -right-1 bg-sky-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/20',
            layout === 'full' ? 'w-8 h-8 text-sm -top-2 -right-2' : layout === 'wide' ? 'w-7 h-7 text-xs' : 'w-6 h-6 text-xs'
          )}
          aria-label="Selected team indicator"
          role="img"
        >
          <span aria-hidden="true">✓</span>
        </div>
      )}
      
      {/* Row 1: Score (for proportional layouts, badge moved to logo section) */}
      {(layout === 'full' || layout === 'wide') ? (
        /* Score only for proportional layouts */
        typeof score !== 'undefined' && (
          <div className={cn(
            'flex justify-end',
            layout === 'full' ? 'mb-4' : 'mb-3.5'
          )}>
            <div className={cn(
              'font-bold text-white',
              layout === 'full' ? 'text-4xl' : 'text-3xl',
              isWinner && 'text-sunrise-gold'
            )}>
              {score}
            </div>
          </div>
        )
      ) : (
        /* Original Row 1 for non-proportional layouts */
        <div className={cn(
          'flex items-center justify-between',
          'mb-3'
        )}>
          <span 
            className={cn(
              'inline-block font-semibold px-2 py-1 rounded border backdrop-blur-sm leading-none',
              compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-1',
              // Improved contrast for WCAG compliance
              isHome 
                ? 'bg-sunset-600/80 text-white border-sunset-500/60 shadow-lg'
                : 'bg-sky-500/80 text-white border-sky-400/60 shadow-lg'
            )}
            role="status"
            aria-label={`${isHome ? 'Home' : 'Away'} team designation`}
          >
            {isHome ? 'HOME' : 'AWAY'}
          </span>
          
          {typeof score !== 'undefined' && (
            <div className={cn(
              'font-bold text-white',
              compact ? 'text-lg' : 'text-xl',
              isWinner && 'text-sunrise-gold'
            )}>
              {score}
            </div>
          )}
        </div>
      )}
      
      {/* Row 2: Logo + Team Name (Proportional Layout for full/wide, standard for others) */}
      {(layout === 'full' || layout === 'wide') ? (
        /* Proportional layout: 1/3 for logo, 2/3 for team info using CSS Grid for proper proportions */
        <div className={cn(
          'grid grid-cols-12 items-center gap-2',
          layout === 'full' ? 'min-h-[6rem]' : 'min-h-[5rem]'
        )}>
          {/* Left 4/12 (33.33%): Logo Section */}
          <div className="col-span-4 flex flex-col items-center justify-center h-full relative">
            {/* AWAY/HOME badge positioned at top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
              <span 
                className={cn(
                  'inline-block font-semibold px-2 py-1 rounded border backdrop-blur-sm leading-none',
                  layout === 'full' ? 'text-xs px-3 py-1.5' : 'text-[11px] px-2.5 py-1',
                  // Improved contrast for WCAG compliance
                  isHome 
                    ? 'bg-sunset-600/80 text-white border-sunset-500/60 shadow-lg'
                    : 'bg-sky-500/80 text-white border-sky-400/60 shadow-lg'
                )}
                role="status"
                aria-label={`${isHome ? 'Home' : 'Away'} team designation`}
              >
                {isHome ? 'HOME' : 'AWAY'}
              </span>
            </div>
            
            {/* Team logo centered */}
            <div className="flex items-center justify-center flex-1 pt-6">
              <TeamLogo 
                team={team} 
                size={layout === 'full' ? '2xl' : 'xl'}
                className="flex-shrink-0"
              />
            </div>
          </div>
          
          {/* Dividing line - 1 column */}
          <div className="col-span-1 flex items-center justify-center h-full">
            <div className="w-px bg-white/20 h-3/4" />
          </div>
          
          {/* Right 7/12 (~58.33%): Team Info Section */}
          <div className="col-span-7 flex flex-col items-center justify-center h-full">
            <div className="text-center w-full space-y-2">
              {/* Team name container with fixed height for consistency */}
              <div className={cn(
                'flex items-center justify-center w-full overflow-hidden',
                layout === 'full' ? 'min-h-[4rem] max-h-[4rem] py-2' : 'min-h-[3rem] max-h-[3rem] py-1'
              )}>
                <h3 className={cn(
                  'font-bold text-white leading-tight text-center px-2',
                  // Responsive text sizing that handles long names better
                  layout === 'full' ? 'text-base sm:text-lg lg:text-xl' : 'text-sm sm:text-base lg:text-lg',
                  // Better line height for multi-line text and text wrapping
                  'leading-snug break-words hyphens-auto'
                )}>
                  {team.name}
                </h3>
              </div>
              
              {/* Record with complementary sizing */}
              <p className={cn(
                'text-white/80 font-semibold',
                layout === 'full' ? 'text-base lg:text-lg' : 'text-sm lg:text-base'
              )}>
                {team.record || '6-5'}
              </p>
              
              {/* Pick button with proper sizing and accessibility */}
              {showPicks && (
                <div className={cn(
                  'pt-2',
                  layout === 'full' ? 'pt-3' : 'pt-2'
                )}>
                  <button
                    className={cn(
                      'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full border shadow-lg',
                      // Ensure minimum touch target size
                      layout === 'full' ? 'text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3 min-h-[44px]' : 'text-xs lg:text-sm px-3 lg:px-5 py-2 lg:py-2.5 min-h-[44px]',
                      // Improved contrast and focus states
                      'focus:outline-none focus:ring-2 focus:ring-sunrise-400 focus:ring-offset-2',
                      isUserPick 
                        ? 'text-white bg-sky-500/40 border-sky-400/60 ring-2 ring-sky-400/40 backdrop-blur-lg' 
                        : 'text-white bg-white/15 border-white/40 hover:bg-white/25 hover:text-white hover:border-white/60 hover:shadow-xl backdrop-blur-lg'
                    )}
                    onClick={() => onPickTeam && onPickTeam(team.id)}
                    disabled={!onPickTeam}
                    aria-label={`${isUserPick ? 'Currently selected' : 'Select'} ${team.name} for this game`}
                    aria-pressed={isUserPick}
                    type="button"
                  >
                    {isUserPick ? (
                      <>
                        <span className="mr-1 lg:mr-2 text-sm lg:text-lg" aria-hidden="true">✓</span>
                        <span className="text-xs lg:text-sm">Your Pick</span>
                      </>
                    ) : (
                      <span className="text-xs lg:text-sm">Pick Team</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Standard flex layout for default/compact */
        <div className={cn(
          'flex items-center',
          'gap-3'
        )}>
          {/* Team logo */}
          <TeamLogo 
            team={team} 
            size={compact ? 'sm' : 'lg'}
            className="flex-shrink-0"
          />
          
          {/* Team information */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-semibold text-white truncate',
              compact ? 'text-sm' : 'text-base'
            )}>
              {compact ? team.abbreviation : team.name}
            </h3>
            {!compact && (
              <p className="text-white/60 truncate text-xs">
                {team.record || '6-5'}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Pick indicator for non-proportional layouts only - with better accessibility */}
      {showPicks && !(layout === 'full' || layout === 'wide') && (
        <div className="mt-3 text-center" id={`team-${team.id}-details`}>
          <span 
            className={cn(
              'font-medium transition-all duration-200 px-3 py-2 rounded-full backdrop-blur-sm',
              'text-xs min-h-[32px] inline-flex items-center justify-center',
              // Improved contrast
              isUserPick 
                ? 'text-white bg-sky-500/30 border border-sky-400/50' 
                : 'text-white/80 group-hover:text-white group-hover:bg-white/10 border border-white/20'
            )}
            role="status"
            aria-label={isUserPick ? 'This team is your current pick' : 'Click anywhere on this card to select this team'}
          >
            {isUserPick ? 'Your Pick' : 'Click to Pick'}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * GameCard Component
 * 
 * A comprehensive game display component with team information, scores,
 * status indicators, and optional pick functionality.
 * Simplified version without Laravel dependencies.
 * 
 * @example
 * <GameCard 
 *   game={gameData} 
 *   showPicks={true}
 *   onPickTeam={(teamId) => console.log('Picked team:', teamId)}
 * />
 */
export const GameCard: React.FC<GameCardProps> = ({
  game,
  userPickTeamId,
  compact = false,
  layout = 'default',
  showPicks = false,
  showStats = false,
  enableRefresh = false,
  className,
  deadlineWarning,
  onPickTeam,
  onRefresh,
  ...props
}) => {
  // Calculate game state
  const hasScores = typeof game.homeScore !== 'undefined' && typeof game.awayScore !== 'undefined';
  const winningTeam = hasScores 
    ? game.homeScore! > game.awayScore! ? 'home' 
    : game.awayScore! > game.homeScore! ? 'away' 
    : null
    : null;
  
  const isLive = game.status === 'live';
  const gameTime = formatGameTime(game.gameTime);
  const gameDate = formatGameDate(game.gameTime);
  
  // Determine if we should use horizontal layout for wide/full layouts
  // Force vertical layout on mobile (< md breakpoint) regardless of layout prop
  const useHorizontalLayout = (layout === 'wide' || layout === 'full');
  
  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        // Override default padding based on layout
        layout === 'full' ? '!p-6' : layout === 'wide' ? '!p-5' : compact ? '!p-3' : '!p-4',
        className
      )}
      glass={true}
      hover={true}
      padding="sm" // This will be overridden by the className padding
      role="region"
      aria-labelledby={`game-${game.id}-header`}
      aria-describedby={`game-${game.id}-teams`}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 via-transparent to-ocean-600/5 pointer-events-none rounded-xl" />
      
      
      {/* Status and Date Header */}
      <header className="flex items-center justify-between mb-4 relative z-10" id={`game-${game.id}-header`}>
        <div className="flex items-center gap-2">
          <StatusBadge
            status={game.status}
            animate={isLive}
            showIndicator={shouldShowIndicator(game.status)}
            text={isLive ? gameTime : getStatusText(game.status)}
            size={layout === 'full' ? 'lg' : compact ? 'sm' : 'default'}
          />
          
          {game.isRedZone && isLive && (
            <StatusBadge
              status="red_zone"
              animate={true}
              showIndicator={true}
              size={layout === 'full' ? 'default' : 'sm'}
            />
          )}
          
          {deadlineWarning && (
            <div className={cn(
              'text-yellow-400 font-medium px-2 py-1 bg-yellow-400/10 rounded-md border border-yellow-400/20',
              layout === 'full' ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1'
            )}>
              ⚠️ {deadlineWarning}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!compact && gameDate && (
            <time 
              className={cn(
                'text-white/70 font-medium px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm',
                layout === 'full' ? 'text-sm px-4 py-2' : layout === 'wide' ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1'
              )}
              dateTime={game.gameTime}
              aria-label={`Game date: ${gameDate}`}
            >
              {gameDate}
            </time>
          )}
          
          {!compact && isLive && enableRefresh && onRefresh && (
            <Button
              variant="ghost"
              size={layout === 'full' ? 'md' : 'sm'}
              className="text-white/60 hover:text-sunset-orange"
              onClick={onRefresh}
              aria-label="Refresh game data"
            >
              <Icon name="refresh" className={layout === 'full' ? 'w-5 h-5' : 'w-4 h-4'} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
        </div>
      </header>
      
      {/* Enhanced Matchup Header for Default Layout */}
      {/* Mobile: Always show matchup info. Desktop: Only for vertical layouts */}
      <div className="md:hidden">
        <div className="flex items-center justify-center mb-4 relative z-10">
          <div
            className={cn(
              'font-semibold text-white/90 border-white/20 bg-white/5 border transition-all duration-200',
              'px-6 py-3 text-sm rounded-full backdrop-blur-sm shadow-lg cursor-default'
            )}
          >
            {`${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}`}
          </div>
        </div>
      </div>
      
      {/* Desktop: Original logic */}
      <div className="hidden md:block">
      {!useHorizontalLayout && (
        <div className="flex items-center justify-center mb-4 relative z-10">
          <div
            className={cn(
              'font-semibold text-white/90 border-white/20 bg-white/5 border transition-all duration-200',
              'px-6 py-3 text-sm rounded-full backdrop-blur-sm shadow-lg cursor-default'
            )}
          >
            {(layout === 'default' || compact) 
              ? `${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}`
              : `${game.awayTeam.display_name || game.awayTeam.name} @ ${game.homeTeam.display_name || game.homeTeam.name}`
            }
          </div>
        </div>
      )}
      </div>
      
      {/* Teams and Scores */}
      <main 
        className={cn(
          'relative z-10',
          // Use vertical layout on mobile, horizontal on larger screens when layout is wide/full
          'md:space-y-0', // Reset spacing on md+ for horizontal layout
          useHorizontalLayout ? 'space-y-2 md:space-y-3' : 'space-y-2'
        )}
        id={`game-${game.id}-teams`}
        aria-label="Team matchup and scores"
      >
        {/* Mobile: Always use vertical layout. Desktop: Use layout prop */}
        <div className="md:hidden">
          {/* Mobile vertical layout - always use default layout behavior */}
          {/* Away Team */}
          <TeamRow
            team={game.awayTeam}
            score={game.awayScore}
            isWinner={winningTeam === 'away'}
            isUserPick={userPickTeamId === game.awayTeam.id}
            isHome={false}
            layout="default" // Force default layout on mobile
            compact={compact}
            showPicks={showPicks}
            onPickTeam={onPickTeam}
          />
          
          {/* VS indicator */}
          <div className="flex items-center justify-center py-1">
            <span className="text-white/40 text-xs font-bold">VS</span>
          </div>
          
          {/* Home Team */}
          <TeamRow
            team={game.homeTeam}
            score={game.homeScore}
            isWinner={winningTeam === 'home'}
            isUserPick={userPickTeamId === game.homeTeam.id}
            isHome={true}
            layout="default" // Force default layout on mobile
            compact={compact}
            showPicks={showPicks}
            onPickTeam={onPickTeam}
          />
        </div>
        
        {/* Desktop: Use original layout logic */}
        <div className="hidden md:block">
        {useHorizontalLayout ? (
          /* Horizontal layout for wide/full cards */
          <div className={cn(
            'space-y-6',
            layout === 'full' ? 'space-y-8' : 'space-y-6'
          )}>
            {/* Enhanced Matchup Header for Horizontal Layout */}
            <div className="flex items-center justify-center">
              <div
                className={cn(
                  'font-bold text-white border-white/20 bg-white/5 border transition-all duration-200',
                  'backdrop-blur-sm shadow-lg rounded-full cursor-default',
                  layout === 'full' 
                    ? 'px-8 py-4 text-lg' 
                    : 'px-6 py-3 text-base'
                )}
              >
                {(layout === 'full' || layout === 'wide')
                  ? `${game.awayTeam.display_name || game.awayTeam.name} @ ${game.homeTeam.display_name || game.homeTeam.name}`
                  : `${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}`
                }
              </div>
            </div>
            
            {/* Teams in horizontal layout */}
            <div className={cn(
              'flex items-stretch',
              layout === 'full' ? 'gap-4' : 'gap-3'
            )}>
              {/* Away Team */}
              <div className="flex-1 min-w-0">
                <TeamRow
                  team={game.awayTeam}
                  score={game.awayScore}
                  isWinner={winningTeam === 'away'}
                  isUserPick={userPickTeamId === game.awayTeam.id}
                  isHome={false}
                  layout={layout}
                  compact={layout === 'full' ? false : compact}
                  showPicks={showPicks}
                  onPickTeam={onPickTeam}
                />
              </div>
              
              {/* Enhanced VS indicator */}
              <div className="flex-shrink-0 flex items-center px-2">
                <div className={cn(
                  'flex items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg backdrop-blur-sm',
                  layout === 'full' ? 'w-16 h-16' : 'w-12 h-12'
                )}>
                  <span className={cn(
                    'text-white/80 font-bold',
                    layout === 'full' ? 'text-lg' : 'text-sm'
                  )}>
                    VS
                  </span>
                </div>
              </div>
              
              {/* Home Team */}
              <div className="flex-1 min-w-0">
                <TeamRow
                  team={game.homeTeam}
                  score={game.homeScore}
                  isWinner={winningTeam === 'home'}
                  isUserPick={userPickTeamId === game.homeTeam.id}
                  isHome={true}
                  layout={layout}
                  compact={layout === 'full' ? false : compact}
                  showPicks={showPicks}
                  onPickTeam={onPickTeam}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Vertical layout for default cards */
          <>
            {/* Away Team */}
            <TeamRow
              team={game.awayTeam}
              score={game.awayScore}
              isWinner={winningTeam === 'away'}
              isUserPick={userPickTeamId === game.awayTeam.id}
              isHome={false}
              layout={layout}
              compact={compact}
              showPicks={showPicks}
              onPickTeam={onPickTeam}
            />
            
            {/* VS indicator */}
            <div className="flex items-center justify-center py-1">
              <span className="text-white/40 text-xs font-bold">VS</span>
            </div>
            
            {/* Home Team */}
            <TeamRow
              team={game.homeTeam}
              score={game.homeScore}
              isWinner={winningTeam === 'home'}
              isUserPick={userPickTeamId === game.homeTeam.id}
              isHome={true}
              layout={layout}
              compact={compact}
              showPicks={showPicks}
              onPickTeam={onPickTeam}
            />
          </>
        )}
        </div>
      </main>
      
      {/* Enhanced Venue Information */}
      {!compact && game.venue && (
        <footer className={cn(
          'mt-4 pt-3 border-t border-white/10 relative z-10',
          layout === 'full' ? 'mt-6 pt-4' : 'mt-4 pt-3'
        )}>
          <div className={cn(
            'flex items-center gap-2 text-white/60',
            layout === 'full' ? 'text-sm gap-3' : layout === 'wide' ? 'text-sm gap-2.5' : 'text-xs gap-2'
          )}>
            <Icon name="home" className={cn(
              layout === 'full' ? 'w-4 h-4' : layout === 'wide' ? 'w-3.5 h-3.5' : 'w-3 h-3'
            )} />
            <span className="font-medium">{game.venue}</span>
          </div>
        </footer>
      )}
    </Card>
  );
};

export default GameCard;