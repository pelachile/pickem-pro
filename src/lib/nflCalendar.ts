/**
 * NFL Calendar utilities for determining current week, season type, and year
 */

export interface NFLWeekInfo {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  seasonYear: number;
  isDeadPeriod?: boolean;
  displayWeek?: number;
  displaySeasonType?: 'preseason' | 'regular' | 'postseason';
  deadPeriodReason?: string;
}

/**
 * Determines the current NFL week based on the current date
 * NFL seasons typically start in August (preseason) and run through February (Super Bowl)
 */
export function getCurrentNFLWeek(): NFLWeekInfo {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  // NFL season year is the year the season starts (e.g., 2025 season runs Aug 2025 - Feb 2026)
  let seasonYear: number;
  let seasonType: 'preseason' | 'regular' | 'postseason';
  let week: number;

  if (currentMonth >= 8) {
    // August - December: current year season
    seasonYear = currentYear;
  } else {
    // January - July: previous year season (e.g., Jan 2026 is part of 2025 season)
    seasonYear = currentYear - 1;
  }

  // Determine season type and week based on month and day
  if (currentMonth === 8) {
    // August: Preseason
    seasonType = 'preseason';
    if (currentDay <= 15) {
      week = 1;
    } else if (currentDay <= 22) {
      week = 2;
    } else {
      week = 3;
    }
  } else if (currentMonth === 9 || (currentMonth === 1 && currentDay <= 7)) {
    // September or early January: Regular season
    seasonType = 'regular';
    
    if (currentMonth === 9) {
      // September weeks 1-4
      if (currentDay <= 7) week = 1;
      else if (currentDay <= 14) week = 2;
      else if (currentDay <= 21) week = 3;
      else week = 4;
    } else if (currentMonth === 10) {
      // October weeks 5-8
      if (currentDay <= 7) week = 5;
      else if (currentDay <= 14) week = 6;
      else if (currentDay <= 21) week = 7;
      else week = 8;
    } else if (currentMonth === 11) {
      // November weeks 9-12
      if (currentDay <= 7) week = 9;
      else if (currentDay <= 14) week = 10;
      else if (currentDay <= 21) week = 11;
      else week = 12;
    } else if (currentMonth === 12) {
      // December weeks 13-17
      if (currentDay <= 7) week = 13;
      else if (currentDay <= 14) week = 14;
      else if (currentDay <= 21) week = 15;
      else if (currentDay <= 28) week = 16;
      else week = 17;
    } else {
      // Early January week 18
      week = 18;
    }
  } else {
    // January (after week 18) - February: Postseason
    seasonType = 'postseason';
    
    if (currentMonth === 1) {
      if (currentDay <= 14) week = 1; // Wild Card
      else if (currentDay <= 21) week = 2; // Divisional
      else if (currentDay <= 28) week = 3; // Conference Championships
      else week = 4; // Pro Bowl week
    } else {
      // February
      if (currentDay <= 14) week = 4; // Super Bowl
      else week = 1; // Offseason/Draft prep
    }
  }

  // For development/testing: Enhanced logic for August 2025
  if (currentYear === 2025 && currentMonth === 8) {
    if (currentDay >= 25 && currentDay <= 31) {
      // Dead period between preseason and regular season (Aug 25-31)
      return {
        week: 1, // Next regular season week
        seasonType: 'regular',
        seasonYear: 2025,
        isDeadPeriod: true,
        displayWeek: 3, // Show last completed preseason week
        displaySeasonType: 'preseason',
        deadPeriodReason: 'Between preseason and regular season'
      };
    } else if (currentDay >= 21) {
      // Preseason week 3
      return {
        week: 3,
        seasonType: 'preseason',
        seasonYear: 2025
      };
    }
  }

  // Check for dead period between preseason and regular season (Aug 25 - Sep 3)
  if ((currentMonth === 8 && currentDay >= 25) || (currentMonth === 9 && currentDay <= 3)) {
    return {
      week: 1, // Next regular season week
      seasonType: 'regular',
      seasonYear: seasonYear,
      isDeadPeriod: true,
      displayWeek: 3, // Show last completed preseason week
      displaySeasonType: 'preseason',
      deadPeriodReason: 'Between preseason and regular season'
    };
  }

  return {
    week,
    seasonType,
    seasonYear
  };
}

/**
 * Converts season type to ESPN API format
 */
export function getESPNSeasonType(seasonType: string): string {
  switch (seasonType) {
    case 'preseason': return '1';
    case 'regular': return '2';
    case 'postseason': return '3';
    default: return '2';
  }
}

/**
 * Converts our internal week numbering to ESPN API week numbering
 * ESPN uses different week numbers for preseason:
 * - Preseason Week 1 = ESPN week 1
 * - Preseason Week 2 = ESPN week 2  
 * - Preseason Week 3 = ESPN week 4
 * - Regular season weeks map directly (Week 1 = ESPN week 1, etc.)
 */
export function getESPNWeekNumber(week: number, seasonType: string): number {
  if (seasonType === 'preseason') {
    // ESPN preseason week mapping
    switch (week) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 4; // This is the key fix!
      default: return week;
    }
  }
  
  // Regular season and postseason map directly
  return week;
}

/**
 * Gets a readable description of the current NFL week
 */
export function getNFLWeekDescription(weekInfo: NFLWeekInfo): string {
  const { week, seasonType, seasonYear } = weekInfo;
  
  if (seasonType === 'preseason') {
    return `${seasonYear} Preseason Week ${week}`;
  } else if (seasonType === 'regular') {
    return `${seasonYear} Week ${week}`;
  } else {
    const postseasonWeeks = ['Wild Card', 'Divisional', 'Conference Championships', 'Super Bowl'];
    return `${seasonYear} ${postseasonWeeks[week - 1] || 'Postseason'}`;
  }
}