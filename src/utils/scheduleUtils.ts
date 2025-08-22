import type { ScheduleData, NFLGameData, Game, Team, Status } from '../components/types';

/**
 * Load schedule data from static JSON file
 */
export async function loadScheduleData(): Promise<ScheduleData> {
  try {
    console.log('Loading schedule data from static JSON file');
    // Add cache-busting parameter to ensure fresh data
    const cacheBuster = new Date().getTime();
    const response = await fetch(`/data/teams-and-schedule.json?v=${cacheBuster}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch schedule data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Loaded schedule data:', {
      currentWeek: data.meta?.current_week,
      currentSeasonType: data.meta?.current_season_type,
      totalGames: data.meta?.total_games,
      weeksAvailable: data.meta?.weeks_available
    });
    return data;
  } catch (error) {
    console.error('Error loading schedule data:', error);
    throw error;
  }
}


/**
 * Convert NFL API status to our component Status type
 */
function mapNFLStatusToStatus(nflStatus: string): Status {
  const statusMap: Record<string, Status> = {
    'STATUS_SCHEDULED': 'scheduled',
    'STATUS_IN_PROGRESS': 'live',
    'STATUS_FINAL': 'final',
    'STATUS_COMPLETED': 'completed',
    'STATUS_POSTPONED': 'pending',
    'STATUS_CANCELLED': 'inactive',
  };

  return statusMap[nflStatus] || 'default';
}

/**
 * Transform NFL team data to our Team interface
 */
function transformNFLTeam(nflTeam: ScheduleData['teams']['all'][0]): Team {
  return {
    id: nflTeam.id,
    name: nflTeam.name,
    abbreviation: nflTeam.abbreviation,
    logo_url: nflTeam.logo_url,
    color: nflTeam.color,
    alternate_color: nflTeam.alternate_color,
    espn_id: nflTeam.espn_id,
    location: nflTeam.location,
    nickname: nflTeam.nickname,
    display_name: nflTeam.display_name,
    short_display_name: nflTeam.short_display_name,
    slug: nflTeam.slug,
    conference: nflTeam.conference,
    division: nflTeam.division,
    is_active: nflTeam.is_active,
  };
}

/**
 * Transform NFL game data to our Game interface
 */
export function transformNFLGame(nflGame: NFLGameData): Game {
  return {
    id: nflGame.id,
    status: mapNFLStatusToStatus(nflGame.status),
    homeTeam: transformNFLTeam(nflGame.home_team),
    awayTeam: transformNFLTeam(nflGame.away_team),
    gameTime: nflGame.game_date,
    venue: nflGame.venue_name,
    espn_id: nflGame.espn_id,
    name: nflGame.name,
    short_name: nflGame.short_name,
    game_date: nflGame.game_date,
    season: nflGame.season,
    season_type: nflGame.season_type,
    season_type_label: nflGame.season_type_label,
    week: nflGame.week,
    venue_name: nflGame.venue_name,
    is_scheduled: nflGame.is_scheduled,
    is_in_progress: nflGame.is_in_progress,
    is_completed: nflGame.is_completed,
    has_started: nflGame.has_started,
  };
}

/**
 * Get games for a specific week with season-appropriate filtering
 * Shows preseason games in August, regular season games in September+
 */
export function getGamesForWeek(scheduleData: ScheduleData, week: number): Game[] {
  const today = new Date();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  
  // In August, show preseason games (season_type: 1)
  // In September+, show regular season games (season_type: 2)
  const targetSeasonType = month === 8 ? 1 : 2;
  
  const weekGames = scheduleData.schedule.by_week[week.toString()] || [];
  return weekGames
    .filter(game => game.season_type === targetSeasonType)
    .map(transformNFLGame);
}

/**
 * Get all games with season-appropriate filtering
 * Shows preseason games in August, regular season games in September+
 */
export function getAllGames(scheduleData: ScheduleData, limit?: number): Game[] {
  const today = new Date();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  
  // In August, show preseason games (season_type: 1)
  // In September+, show regular season games (season_type: 2)
  const targetSeasonType = month === 8 ? 1 : 2;
  
  let games = scheduleData.schedule.all_games
    .filter(game => game.season_type === targetSeasonType)
    .map(transformNFLGame);
  
  if (limit) {
    games = games.slice(0, limit);
  }
  
  return games;
}

/**
 * Group games by date for better display
 */
export function groupGamesByDate(games: Game[]): Record<string, Game[]> {
  return games.reduce((groups, game) => {
    const gameDate = new Date(game.gameTime).toDateString();
    if (!groups[gameDate]) {
      groups[gameDate] = [];
    }
    groups[gameDate].push(game);
    return groups;
  }, {} as Record<string, Game[]>);
}

/**
 * Format date for display
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format time for display
 */
export function formatTimeForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

/**
 * Get games for the current NFL week
 * Calculates the current NFL week and pulls games for that specific week
 */
export function getCurrentWeekGames(scheduleData: ScheduleData, referenceDate?: Date): Game[] {
  const currentDate = referenceDate || new Date();
  const nflWeek = calculateCurrentNFLWeek(currentDate);
  
  console.log('getCurrentWeekGames called:', { 
    date: currentDate.toDateString(), 
    nflWeek: nflWeek 
  });
  
  // Determine target season type based on current NFL phase
  const targetSeasonType = nflWeek.phase === 'preseason' ? 1 : 2;
  
  console.log('Target season type:', targetSeasonType, 'for week', nflWeek.week);
  
  // First try to get games by week structure
  const weekKey = nflWeek.week.toString();
  const weekGames = scheduleData.schedule.by_week[weekKey] || [];
  
  if (weekGames.length > 0) {
    const gamesForWeek = weekGames
      .filter(game => game.season_type === targetSeasonType)
      .map(transformNFLGame);
    
    console.log(`Found ${gamesForWeek.length} games for ${nflWeek.phase} week ${nflWeek.week}`);
    return gamesForWeek;
  }
  
  // Fallback: filter all games by season type and current week date range
  console.log('No week structure found, falling back to date filtering');
  
  const allGames = scheduleData.schedule.all_games
    .filter(game => game.season_type === targetSeasonType)
    .map(transformNFLGame);
  
  // Filter by current NFL week date range
  const filteredGames = allGames.filter(game => {
    const gameDate = new Date(game.gameTime);
    const currentWeekStart = getWeekStart(currentDate);
    const currentWeekEnd = getWeekEnd(currentDate);
    return gameDate >= currentWeekStart && gameDate <= currentWeekEnd;
  });
  
  console.log(`Fallback: Found ${filteredGames.length} games in current date range`);
  return filteredGames;
}

/**
 * Get the start of the current NFL week (Tuesday)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
  const diff = day >= 2 ? day - 2 : day + 5; // Calculate days since Tuesday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the current NFL week (Monday)
 */
function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Calculate the current NFL week based on date
 * NFL preseason typically starts around August 8-15
 * Each week runs Thursday-Wednesday (games Thu-Mon, new week starts Tuesday)
 */
function calculateCurrentNFLWeek(date: Date) {
  // const year = date.getFullYear();
  
  // NFL 2025 Preseason actual dates based on ESPN API data
  // Preseason weeks: 1, 2, 3 (3 weeks total)
  // Week 3 games are Aug 15-18, so week 1 starts around Aug 1
  // Regular season starts ~September 5, 2025
  
  const preseasonStart = new Date(2025, 7, 1); // August 1, 2025 (month is 0-indexed)
  const regularSeasonStart = new Date(2025, 8, 5); // September 5, 2025
  
  if (date < preseasonStart) {
    return { phase: 'offseason', week: 0 };
  } else if (date < regularSeasonStart) {
    // Calculate preseason week
    const weeksSinceStart = Math.floor((date.getTime() - preseasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const preseasonWeek = Math.min(Math.max(weeksSinceStart + 1, 1), 3); // Weeks 1-3
    return { phase: 'preseason', week: preseasonWeek };
  } else {
    // Calculate regular season week  
    const weeksSinceStart = Math.floor((date.getTime() - regularSeasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const regularWeek = Math.min(Math.max(weeksSinceStart + 1, 1), 18); // Weeks 1-18
    return { phase: 'regular', week: regularWeek };
  }
}

/**
 * Get the current NFL week number and context
 */
export function getCurrentWeekInfo() {
  const today = new Date();
  const nflWeek = calculateCurrentNFLWeek(today);
  
  console.log('Current NFL Week calculation:', { 
    date: today.toDateString(), 
    phase: nflWeek.phase, 
    week: nflWeek.week 
  });
  
  return {
    season: 2025,
    phase: nflWeek.phase,
    week: nflWeek.week,
    isCurrentWeek: true
  };
}

/**
 * Get current NFL context string for display
 */
export function getNFLContextString(date?: Date): string {
  const currentDate = date || new Date();
  const weekInfo = calculateCurrentNFLWeek(currentDate);
  
  if (weekInfo.phase === 'preseason') {
    return `2025 NFL Preseason - Week ${weekInfo.week}`;
  } else if (weekInfo.phase === 'regular') {
    return `2025 NFL Regular Season - Week ${weekInfo.week}`;
  } else if (weekInfo.phase === 'postseason') {
    return `2025 NFL Postseason - Week ${weekInfo.week}`;
  } else {
    return '2025 NFL Offseason';
  }
}

// Type definitions for missing interfaces
type NFLSeasonPhase = 'preseason' | 'regular' | 'postseason' | 'offseason';

function getCurrentSeasonPhase(): NFLSeasonPhase {
  const today = new Date();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  
  if (month === 8) return 'preseason';
  if (month >= 9 && month <= 12) return 'regular';
  if (month === 1 || month === 2) return 'postseason';
  return 'offseason';
}

function getRelevantSeasonTypes(phase: NFLSeasonPhase): number[] {
  switch (phase) {
    case 'preseason': return [1];
    case 'regular': return [2];
    case 'postseason': return [3];
    default: return [2]; // Default to regular season
  }
}

/**
 * Get games for a date range
 */
export function getGamesInDateRange(
  scheduleData: ScheduleData, 
  startDate: Date, 
  endDate: Date, 
  seasonPhase?: NFLSeasonPhase
): Game[] {
  const currentPhase = seasonPhase || getCurrentSeasonPhase();
  const relevantSeasonTypes = getRelevantSeasonTypes(currentPhase);
  
  const allGames = scheduleData.schedule.all_games
    .filter(game => relevantSeasonTypes.includes(game.season_type))
    .map(transformNFLGame);
  
  return allGames.filter(game => {
    const gameDate = new Date(game.gameTime);
    return gameDate >= startDate && gameDate <= endDate;
  });
}

/**
 * Check if there are games available for the current week
 */
export function hasCurrentWeekGames(scheduleData: ScheduleData): boolean {
  const currentWeekGames = getCurrentWeekGames(scheduleData);
  return currentWeekGames.length > 0;
}

