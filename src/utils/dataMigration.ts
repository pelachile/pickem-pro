// Data Migration Utilities
// Converts existing markdown player data to structured JSON format

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { PlayerAnalysis, MarkdownPlayerSection, MigrationResult, isValidPosition, isValidTier, isValidTeam } from '../types/playerData';

const client = generateClient<Schema>();

// Markdown parsing utilities
export class MarkdownParser {
  static parsePlayerData(markdown: string, position: string): MarkdownPlayerSection[] {
    const sections: MarkdownPlayerSection[] = [];
    
    // Split by player sections (looking for **Name (Team)** pattern)
    const playerRegex = /\*\*([^(]+)\(([^)]+)\)\*\*[\s\S]*?(?=\*\*[^(]+\([^)]+\)\*\*|\n---|\n##|\n#|$)/g;
    
    let match;
    while ((match = playerRegex.exec(markdown)) !== null) {
      const fullMatch = match[0];
      const name = match[1].trim();
      const team = match[2].trim();
      
      // Extract tier from section context
      const tier = this.extractTier(markdown, match.index);
      
      // Extract likelihood percentage
      const likelihood = this.extractLikelihood(fullMatch);
      
      sections.push({
        name,
        team,
        tier,
        likelihood,
        content: fullMatch
      });
    }
    
    return sections;
  }
  
  private static extractTier(markdown: string, playerIndex: number): MarkdownPlayerSection['tier'] {
    // Look backwards from player position to find tier header
    const beforePlayer = markdown.substring(0, playerIndex);
    const tierHeaders = [
      { pattern: /## Elite Tier|### Elite Tier|Elite Contenders/i, tier: 'Elite' as const },
      { pattern: /## High-Upside|High-Upside and Breakout|### High-Upside/i, tier: 'High-Upside' as const },
      { pattern: /## Volatile|### Volatile|Potential Busts/i, tier: 'Volatile' as const },
      { pattern: /## Sleeper|### Sleeper/i, tier: 'Sleeper' as const },
      { pattern: /## Bust|### Bust/i, tier: 'Bust-Risk' as const }
    ];
    
    // Find the last tier header before this player
    let lastTierIndex = -1;
    let matchedTier: MarkdownPlayerSection['tier'] = 'High-Upside';
    
    for (const { pattern, tier } of tierHeaders) {
      const matches = Array.from(beforePlayer.matchAll(new RegExp(pattern.source, 'gi')));
      for (const match of matches) {
        if (match.index !== undefined && match.index > lastTierIndex) {
          lastTierIndex = match.index;
          matchedTier = tier;
        }
      }
    }
    
    return matchedTier;
  }
  
  private static extractLikelihood(content: string): number {
    // Look for patterns like "Top 5 Likelihood: 75%" or "**Top 5 Likelihood: 75%**"
    const likelihoodRegex = /Top\s+5\s+Likelihood:\s*(\d+)%/i;
    const match = content.match(likelihoodRegex);
    return match ? parseInt(match[1]) : 0;
  }
  
  static extractAnalysisContent(content: string) {
    // Extract summary (first paragraph after player name)
    const summaryMatch = content.match(/\*\*[^*]+\*\*\s*([^*]+?)(?=\n\n|\*\*Top 5)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';
    
    // Extract key factors, strengths, concerns from content
    const strengths: string[] = [];
    const concerns: string[] = [];
    const keyFactors: string[] = [];
    
    // Look for bullet points or key phrases
    const bulletPoints = content.match(/[-•]\s*([^\n]+)/g) || [];
    bulletPoints.forEach(point => {
      const cleaned = point.replace(/[-•]\s*/, '').trim();
      if (cleaned.toLowerCase().includes('strength') || 
          cleaned.toLowerCase().includes('advantage') ||
          cleaned.toLowerCase().includes('elite') ||
          cleaned.toLowerCase().includes('strong')) {
        strengths.push(cleaned);
      } else if (cleaned.toLowerCase().includes('concern') || 
                 cleaned.toLowerCase().includes('risk') ||
                 cleaned.toLowerCase().includes('difficult') ||
                 cleaned.toLowerCase().includes('challenge')) {
        concerns.push(cleaned);
      } else {
        keyFactors.push(cleaned);
      }
    });
    
    // Extract upside and floor information
    let upside = '';
    let floor = '';
    
    const upsideMatch = content.match(/upside[^.]*\.?/i);
    if (upsideMatch) upside = upsideMatch[0];
    
    const floorMatch = content.match(/floor[^.]*\.?/i);
    if (floorMatch) floor = floorMatch[0];
    
    return {
      summary: summary.length > 500 ? summary.substring(0, 497) + '...' : summary,
      strengths,
      concerns,
      keyFactors,
      upside,
      floor
    };
  }
}

// Position-specific migration handlers
export class PlayerMigrator {
  static async migratePosition(
    position: 'quarterbacks' | 'running-backs' | 'wide-receivers' | 'tightends' | 'defense-kickers',
    markdownContent: string
  ): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      playersProcessed: 0,
      errors: []
    };
    
    try {
      const sections = MarkdownParser.parsePlayerData(markdownContent, position);
      
      for (const section of sections) {
        try {
          const playerData = this.createPlayerFromSection(section, position);
          await this.savePlayer(playerData);
          result.playersProcessed++;
        } catch (error) {
          result.errors.push({
            player: `${section.name} (${section.team})`,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          result.success = false;
        }
      }
      
      console.log(`Migration completed for ${position}: ${result.playersProcessed} players processed`);
      
    } catch (error) {
      result.success = false;
      result.errors.push({
        player: 'Position migration',
        error: error instanceof Error ? error.message : 'Failed to parse markdown'
      });
    }
    
    return result;
  }
  
  private static createPlayerFromSection(
    section: MarkdownPlayerSection,
    position: string
  ): any {
    const analysis = MarkdownParser.extractAnalysisContent(section.content);
    const positionCode = this.getPositionCode(position);
    
    // Validate data
    if (!isValidPosition(positionCode)) {
      throw new Error(`Invalid position: ${positionCode}`);
    }
    
    if (!isValidTier(section.tier)) {
      throw new Error(`Invalid tier: ${section.tier}`);
    }
    
    // Try to clean up team name to match our abbreviations
    const cleanTeam = this.normalizeTeamName(section.team);
    
    return {
      name: section.name,
      team: cleanTeam,
      position: positionCode,
      tier: section.tier,
      top5Likelihood: section.likelihood,
      fantasyPoints: this.estimateFantasyPoints(section.likelihood),
      weeklyFloor: this.estimateFloor(section.likelihood),
      weeklyCeiling: this.estimateCeiling(section.likelihood),
      gamesPlayed: 16, // Default
      injuryHistory: this.extractInjuries(section.content),
      fantasyRank: 0, // Will be updated later
      positionStats: JSON.stringify(this.extractPositionStats(section.content, positionCode)),
      summary: analysis.summary,
      strengths: analysis.strengths,
      concerns: analysis.concerns,
      keyFactors: analysis.keyFactors,
      upside: analysis.upside,
      floor: analysis.floor,
      aiLastUpdated: new Date().toISOString(),
      newsAnalysis: `Migrated from markdown analysis: ${analysis.summary}`,
      injuryUpdate: this.extractInjuryUpdate(section.content),
      trendingFactors: analysis.keyFactors,
      sentimentScore: this.calculateSentimentScore(section.content),
      seasonYear: 2025,
      week: 1
    };
  }
  
  private static getPositionCode(position: string): string {
    switch (position) {
      case 'quarterbacks': return 'QB';
      case 'running-backs': return 'RB';
      case 'wide-receivers': return 'WR';
      case 'tightends': return 'TE';
      case 'defense-kickers': return 'DEF';
      default: return 'QB';
    }
  }
  
  private static normalizeTeamName(team: string): string {
    // Map common team name variations to standard abbreviations
    const teamMap: Record<string, string> = {
      'Baltimore Ravens': 'BAL',
      'Buffalo Bills': 'BUF',
      'Cincinnati Bengals': 'CIN',
      'Cleveland Browns': 'CLE',
      'Denver Broncos': 'DEN',
      'Houston Texans': 'HOU',
      'Indianapolis Colts': 'IND',
      'Jacksonville Jaguars': 'JAX',
      'Kansas City Chiefs': 'KC',
      'Las Vegas Raiders': 'LV',
      'Los Angeles Chargers': 'LAC',
      'Miami Dolphins': 'MIA',
      'New England Patriots': 'NE',
      'New York Jets': 'NYJ',
      'Pittsburgh Steelers': 'PIT',
      'Tennessee Titans': 'TEN',
      'Arizona Cardinals': 'ARI',
      'Atlanta Falcons': 'ATL',
      'Carolina Panthers': 'CAR',
      'Chicago Bears': 'CHI',
      'Dallas Cowboys': 'DAL',
      'Detroit Lions': 'DET',
      'Green Bay Packers': 'GB',
      'Los Angeles Rams': 'LAR',
      'Minnesota Vikings': 'MIN',
      'New Orleans Saints': 'NO',
      'New York Giants': 'NYG',
      'Philadelphia Eagles': 'PHI',
      'San Francisco 49ers': 'SF',
      'Seattle Seahawks': 'SEA',
      'Tampa Bay Buccaneers': 'TB',
      'Washington Commanders': 'WAS'
    };
    
    return teamMap[team] || team;
  }
  
  private static estimateFantasyPoints(likelihood: number): number {
    return Math.round(200 + (likelihood * 2.5));
  }
  
  private static estimateFloor(likelihood: number): number {
    return Math.round(8 + (likelihood * 0.15));
  }
  
  private static estimateCeiling(likelihood: number): number {
    return Math.round(25 + (likelihood * 0.3));
  }
  
  private static extractInjuries(content: string): string[] {
    const injuryKeywords = ['injury', 'injured', 'sack', 'concussion', 'ankle', 'knee', 'shoulder', 'hamstring'];
    const injuries: string[] = [];
    
    injuryKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        injuries.push(`${keyword} concern mentioned in analysis`);
      }
    });
    
    return injuries;
  }
  
  private static extractInjuryUpdate(content: string): string {
    const injuryMatch = content.match(/(injury|injured|health|sack[a-z]*)[^.]*\./i);
    return injuryMatch ? injuryMatch[0] : 'No specific injury concerns noted in analysis';
  }
  
  private static extractPositionStats(content: string, position: string): any {
    // Extract numbers from content for position-specific stats
    const numberRegex = /(\d{1,4}(?:,\d{3})*)/g;
    const numbers = Array.from(content.matchAll(numberRegex)).map(m => parseInt(m[1].replace(/,/g, '')));
    
    const baseStats = {
      gamesPlayed: 16,
      injuryHistory: [],
      fantasyRank: 0
    };
    
    switch (position) {
      case 'QB':
        return {
          ...baseStats,
          passingYards: numbers.find(n => n > 3000 && n < 6000) || 3500,
          passingTouchdowns: numbers.find(n => n > 15 && n < 50) || 25,
          interceptions: numbers.find(n => n > 5 && n < 20) || 10,
          rushingYards: numbers.find(n => n > 200 && n < 1200) || 400,
          rushingTouchdowns: numbers.find(n => n > 2 && n < 15) || 5,
          completionPercentage: 65.0
        };
      case 'RB':
        return {
          ...baseStats,
          rushingYards: numbers.find(n => n > 800 && n < 2500) || 1200,
          rushingTouchdowns: numbers.find(n => n > 5 && n < 25) || 10,
          carries: numbers.find(n => n > 150 && n < 400) || 250,
          receivingYards: numbers.find(n => n > 200 && n < 800) || 300,
          receptions: numbers.find(n => n > 20 && n < 80) || 40,
          receivingTouchdowns: numbers.find(n => n > 1 && n < 8) || 3
        };
      default:
        return baseStats;
    }
  }
  
  private static calculateSentimentScore(content: string): number {
    const positiveWords = ['elite', 'strong', 'excellent', 'outstanding', 'dominant', 'premier'];
    const negativeWords = ['concern', 'risk', 'difficult', 'challenging', 'bust', 'inconsistent'];
    
    let score = 0;
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.some(pos => word.includes(pos))) score += 0.1;
      if (negativeWords.some(neg => word.includes(neg))) score -= 0.1;
    });
    
    return Math.max(-1, Math.min(1, score));
  }
  
  private static async savePlayer(playerData: any): Promise<void> {
    try {
      await client.models.Player.create(playerData);
    } catch (error) {
      console.error(`Failed to save player ${playerData.name}:`, error);
      throw error;
    }
  }
}

// Main migration orchestrator
export class DataMigrationService {
  static async migrateAllPositions(): Promise<MigrationResult[]> {
    const positions = ['quarterbacks', 'running-backs', 'wide-receivers', 'tightends', 'defense-kickers'] as const;
    const results: MigrationResult[] = [];
    
    for (const position of positions) {
      try {
        console.log(`Starting migration for ${position}...`);
        
        // Read markdown file from public directory
        const response = await fetch(`/data/playerData/${position}/${position}.md`);
        
        if (!response.ok) {
          throw new Error(`Failed to load ${position} data: ${response.statusText}`);
        }
        
        const markdownContent = await response.text();
        const result = await PlayerMigrator.migratePosition(position, markdownContent);
        results.push(result);
        
        console.log(`Completed migration for ${position}: ${result.playersProcessed} players`);
        
      } catch (error) {
        console.error(`Migration failed for ${position}:`, error);
        results.push({
          success: false,
          playersProcessed: 0,
          errors: [{
            player: `${position} migration`,
            error: error instanceof Error ? error.message : 'Unknown error'
          }]
        });
      }
    }
    
    return results;
  }
  
  static async getMigrationProgress(): Promise<{
    totalPlayers: number;
    migratedPlayers: number;
    pendingPositions: string[];
  }> {
    try {
      const allPlayers = await client.models.Player.list();
      const playersByPosition = {
        QB: allPlayers.data.filter(p => p.position === 'QB').length,
        RB: allPlayers.data.filter(p => p.position === 'RB').length,
        WR: allPlayers.data.filter(p => p.position === 'WR').length,
        TE: allPlayers.data.filter(p => p.position === 'TE').length,
        DEF: allPlayers.data.filter(p => p.position === 'DEF').length
      };
      
      const totalPlayers = allPlayers.data.length;
      const pendingPositions = Object.entries(playersByPosition)
        .filter(([_, count]) => count === 0)
        .map(([pos, _]) => pos);
      
      return {
        totalPlayers,
        migratedPlayers: totalPlayers,
        pendingPositions
      };
    } catch (error) {
      console.error('Failed to get migration progress:', error);
      return {
        totalPlayers: 0,
        migratedPlayers: 0,
        pendingPositions: ['QB', 'RB', 'WR', 'TE', 'DEF']
      };
    }
  }
}