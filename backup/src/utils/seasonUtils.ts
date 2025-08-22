/**
 * NFL Season Detection and Date Utilities
 * 
 * Provides utilities for detecting current NFL season phase,
 * calculating NFL weeks, and determining appropriate game types.
 */

export type NFLSeasonPhase = 'preseason' | 'regular' | 'playoffs' | 'offseason';

export interface NFLWeekInfo {
  season: number;
  phase: NFLSeasonPhase;
  week: number;
  weekStart: Date;
  weekEnd: Date;
  isCurrentWeek: boolean;
}

export interface SeasonConfig {
  season: number;
  preseasonStart: Date;
  regularSeasonStart: Date;
  playoffsStart: Date;
  offseasonStart: Date;
}

/**
 * NFL Season configurations
 * Approximate dates based on typical NFL calendar
 */
export const NFL_SEASON_CONFIGS: Record<number, SeasonConfig> = {
  2025: {
    season: 2025,
    preseasonStart: new Date('2025-08-01T00:00:00Z'),
    regularSeasonStart: new Date('2025-09-03T00:00:00Z'), // Approx first Tuesday after Labor Day
    playoffsStart: new Date('2026-01-07T00:00:00Z'), // Wild Card weekend
    offseasonStart: new Date('2026-02-18T00:00:00Z'), // Day after Super Bowl
  },
  2024: {
    season: 2024,
    preseasonStart: new Date('2024-08-01T00:00:00Z'),
    regularSeasonStart: new Date('2024-09-03T00:00:00Z'),
    playoffsStart: new Date('2025-01-11T00:00:00Z'),
    offseasonStart: new Date('2025-02-12T00:00:00Z'),
  },
};

/**
 * Determine current NFL season based on date
 */
export function getCurrentNFLSeason(date: Date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  // NFL season spans two calendar years
  // Season year is based on when it starts (not when it ends)
  if (month >= 8) {
    return year; // Aug-Dec = current year season
  } else {
    return year - 1; // Jan-Jul = previous year season
  }
}

/**
 * Determine current NFL season phase
 */
export function getCurrentSeasonPhase(date: Date = new Date()): NFLSeasonPhase {
  const season = getCurrentNFLSeason(date);
  const config = NFL_SEASON_CONFIGS[season];
  
  if (!config) {
    // Fallback for unknown seasons
    const month = date.getMonth() + 1;
    if (month >= 8 && month <= 8) return 'preseason';
    if (month >= 9 && month <= 12) return 'regular';
    if (month >= 1 && month <= 2) return 'playoffs';
    return 'offseason';
  }

  if (date >= config.preseasonStart && date < config.regularSeasonStart) {
    return 'preseason';
  } else if (date >= config.regularSeasonStart && date < config.playoffsStart) {
    return 'regular';
  } else if (date >= config.playoffsStart && date < config.offseasonStart) {
    return 'playoffs';
  } else {
    return 'offseason';
  }
}

/**
 * Get season type number for API filtering
 * 1 = Preseason, 2 = Regular Season, 3 = Playoffs
 */
export function getSeasonTypeNumber(phase: NFLSeasonPhase): number {
  switch (phase) {
    case 'preseason': return 1;
    case 'regular': return 2;
    case 'playoffs': return 3;
    case 'offseason': return 2; // Default to regular season during offseason
  }
}

/**
 * Calculate NFL week number based on date and season phase
 * NFL weeks run Tuesday-Monday
 */
export function getNFLWeekInfo(date: Date = new Date()): NFLWeekInfo {
  const season = getCurrentNFLSeason(date);
  const phase = getCurrentSeasonPhase(date);
  const config = NFL_SEASON_CONFIGS[season];
  
  if (!config) {
    // Fallback calculation
    return {
      season,
      phase,
      week: 1,
      weekStart: getWeekStart(date),
      weekEnd: getWeekEnd(date),
      isCurrentWeek: true,
    };
  }

  let seasonStartDate: Date;
  let weekNumber: number;

  switch (phase) {
    case 'preseason':
      seasonStartDate = config.preseasonStart;
      break;
    case 'regular':
      seasonStartDate = config.regularSeasonStart;
      break;
    case 'playoffs':
      seasonStartDate = config.playoffsStart;
      break;
    case 'offseason':
    default:
      // During offseason, return info for upcoming preseason
      seasonStartDate = config.preseasonStart;
      break;
  }

  // Find the Tuesday that starts the season week
  const seasonWeekStart = getWeekStart(seasonStartDate);
  const currentWeekStart = getWeekStart(date);
  
  // Calculate week number (1-based)
  const weekDiff = Math.floor((currentWeekStart.getTime() - seasonWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  weekNumber = Math.max(1, weekDiff + 1);

  return {
    season,
    phase,
    week: weekNumber,
    weekStart: currentWeekStart,
    weekEnd: getWeekEnd(date),
    isCurrentWeek: true,
  };
}

/**
 * Get the start of NFL week (Tuesday 12:00 AM)
 */
export function getWeekStart(date: Date): Date {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const tuesday = 2; // Tuesday is day 2
  
  // Calculate days to subtract to get to Tuesday
  let daysToTuesday;
  if (day >= tuesday) {
    daysToTuesday = day - tuesday;
  } else {
    daysToTuesday = day + 7 - tuesday;
  }
  
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - daysToTuesday);
  weekStart.setHours(0, 0, 0, 0);
  
  return weekStart;
}

/**
 * Get the end of NFL week (Monday 11:59 PM)
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Add 6 days to get to Monday
  weekEnd.setHours(23, 59, 59, 999);
  
  return weekEnd;
}

/**
 * Check if a date is in the current NFL week
 */
export function isInCurrentWeek(gameDate: Date | string, referenceDate: Date = new Date()): boolean {
  const game = typeof gameDate === 'string' ? new Date(gameDate) : gameDate;
  const weekStart = getWeekStart(referenceDate);
  const weekEnd = getWeekEnd(referenceDate);
  
  return game >= weekStart && game <= weekEnd;
}

/**
 * Get appropriate season types for current phase
 */
export function getRelevantSeasonTypes(phase: NFLSeasonPhase): number[] {
  switch (phase) {
    case 'preseason':
      return [1]; // Only preseason games
    case 'regular':
      return [2]; // Only regular season games
    case 'playoffs':
      return [3]; // Only playoff games
    case 'offseason':
      // During offseason, show regular season games for reference
      return [2];
    default:
      return [1, 2, 3]; // All types as fallback
  }
}

/**
 * Format season phase for display
 */
export function formatSeasonPhase(phase: NFLSeasonPhase): string {
  switch (phase) {
    case 'preseason': return 'Preseason';
    case 'regular': return 'Regular Season';
    case 'playoffs': return 'Playoffs';
    case 'offseason': return 'Off-Season';
  }
}

/**
 * Get descriptive text for current NFL context
 */
export function getCurrentNFLContext(date: Date = new Date()): string {
  const weekInfo = getNFLWeekInfo(date);
  const phaseText = formatSeasonPhase(weekInfo.phase);
  
  if (weekInfo.phase === 'offseason') {
    return `${weekInfo.season} NFL Off-Season`;
  }
  
  return `${weekInfo.season} NFL ${phaseText} - Week ${weekInfo.week}`;
}