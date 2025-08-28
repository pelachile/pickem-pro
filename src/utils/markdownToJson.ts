// Markdown to JSON Converter
// Converts existing player markdown files to structured JSON format

import { PlayerAnalysis, MarkdownPlayerSection, NFL_TEAMS, isValidTeam } from '../types/playerData';

export interface JsonPlayerData {
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'DEF';
  positionFull: string;
  lastUpdated: string;
  season: number;
  overview: {
    summary: string;
    totalPlayers: number;
    tiers: {
      [key: string]: number; // tier name -> player count
    };
  };
  players: PlayerAnalysis[];
  positionAnalysis: {
    trendingThemes: string[];
    keyFactors: string[];
    draftStrategy: string;
  };
}

export class MarkdownToJsonConverter {
  static async convertAllPositions(basePath: string = 'public/data/playerData'): Promise<Map<string, JsonPlayerData>> {
    const results = new Map<string, JsonPlayerData>();
    const positions = [
      { key: 'quarterbacks', code: 'QB', full: 'Quarterbacks' },
      { key: 'running-backs', code: 'RB', full: 'Running Backs' },
      { key: 'wide-receivers', code: 'WR', full: 'Wide Receivers' },
      { key: 'tightends', code: 'TE', full: 'Tight Ends' },
      { key: 'defense-kickers', code: 'DEF', full: 'Defense/Kickers' }
    ];

    // Import fs dynamically (for Node.js environment)
    const fs = await import('fs/promises');
    const path = await import('path');

    for (const position of positions) {
      try {
        console.log(`Converting ${position.full}...`);
        const filePath = path.join(process.cwd(), basePath, position.key, `${position.key}.md`);
        
        try {
          const markdown = await fs.readFile(filePath, 'utf-8');
          const jsonData = this.convertPositionToJson(markdown, position);
          results.set(position.key, jsonData);
          
          console.log(`✅ Converted ${position.full}: ${jsonData.players.length} players`);
        } catch (fileError) {
          console.warn(`Failed to read file ${filePath}:`, (fileError as Error).message);
          continue;
        }
        
      } catch (error) {
        console.error(`❌ Failed to convert ${position.key}:`, error);
      }
    }
    
    return results;
  }

  private static convertPositionToJson(
    markdown: string, 
    position: { key: string, code: 'QB' | 'RB' | 'WR' | 'TE' | 'DEF', full: string }
  ): JsonPlayerData {
    // Extract overview/introduction
    const overview = this.extractOverview(markdown);
    
    // Parse players
    const players = this.parsePlayersFromMarkdown(markdown, position.code);
    
    // Extract position analysis
    const positionAnalysis = this.extractPositionAnalysis(markdown);
    
    // Count tiers
    const tierCounts: { [key: string]: number } = {};
    players.forEach(player => {
      tierCounts[player.tier] = (tierCounts[player.tier] || 0) + 1;
    });

    return {
      position: position.code,
      positionFull: position.full,
      lastUpdated: new Date().toISOString(),
      season: 2025,
      overview: {
        summary: overview,
        totalPlayers: players.length,
        tiers: tierCounts
      },
      players,
      positionAnalysis
    };
  }

  private static extractOverview(markdown: string): string {
    // Extract the introductory paragraph(s) before the first tier section
    const beforeFirstTier = markdown.split(/#{2,3}\s*(Elite|High-Upside|Volatile|Tier)/i)[0];
    
    // Get the main introduction paragraph (usually after the title)
    const lines = beforeFirstTier.split('\n').filter(line => line.trim());
    const titleIndex = lines.findIndex(line => line.startsWith('#'));
    
    if (titleIndex >= 0 && titleIndex < lines.length - 1) {
      // Return everything after the title, joined as paragraphs
      return lines.slice(titleIndex + 1)
        .filter(line => !line.startsWith('#') && !line.startsWith('---'))
        .join('\n\n')
        .trim();
    }
    
    return 'Fantasy football analysis for the 2025 season.';
  }

  private static parsePlayersFromMarkdown(markdown: string, position: 'QB' | 'RB' | 'WR' | 'TE' | 'DEF'): PlayerAnalysis[] {
    const players: PlayerAnalysis[] = [];
    
    // Split by player sections (looking for **Name (Team)** pattern)
    const playerRegex = /\*\*([^(]+)\(([^)]+)\)\*\*/g;
    let match;
    const playerMatches: Array<{name: string, team: string, index: number, content: string}> = [];
    
    // Find all player matches
    while ((match = playerRegex.exec(markdown)) !== null) {
      playerMatches.push({
        name: match[1].trim(),
        team: match[2].trim(),
        index: match.index,
        content: ''
      });
    }
    
    // Extract content for each player
    for (let i = 0; i < playerMatches.length; i++) {
      const currentPlayer = playerMatches[i];
      const nextPlayer = playerMatches[i + 1];
      
      const startIndex = currentPlayer.index;
      const endIndex = nextPlayer ? nextPlayer.index : markdown.length;
      
      currentPlayer.content = markdown.substring(startIndex, endIndex);
    }
    
    // Convert each player match to PlayerAnalysis
    for (const playerMatch of playerMatches) {
      try {
        const player = this.parsePlayerFromContent(playerMatch, position);
        players.push(player);
      } catch (error) {
        console.warn(`Failed to parse player ${playerMatch.name}:`, error);
      }
    }
    
    return players;
  }

  private static parsePlayerFromContent(
    playerMatch: {name: string, team: string, content: string},
    position: 'QB' | 'RB' | 'WR' | 'TE' | 'DEF'
  ): PlayerAnalysis {
    const { name, team, content } = playerMatch;
    
    // Extract tier from context
    const tier = this.extractTierFromContent(content);
    
    // Extract likelihood
    const likelihood = this.extractLikelihood(content);
    
    // Extract analysis content
    const analysis = this.extractAnalysisContent(content);
    
    // Normalize team name
    const normalizedTeam = this.normalizeTeamName(team);
    
    return {
      id: `${name.replace(/\s+/g, '-').toLowerCase()}-${normalizedTeam.toLowerCase()}`,
      name,
      team: normalizedTeam as any, // We'll validate this
      position,
      tier,
      projections: {
        top5Likelihood: likelihood,
        fantasyPoints: this.estimateFantasyPoints(likelihood),
        weeklyFloor: this.estimateFloor(likelihood),
        weeklyCeiling: this.estimateCeiling(likelihood)
      },
      stats2024: {
        gamesPlayed: 16,
        injuryHistory: this.extractInjuries(content),
        fantasyRank: 0, // Will be assigned based on likelihood
        positionStats: this.extractPositionStats(content, position)
      },
      analysis,
      aiGenerated: {
        lastUpdated: new Date().toISOString(),
        newsAnalysis: `Analysis converted from markdown: ${analysis.summary.substring(0, 100)}...`,
        trendingFactors: analysis.keyFactors,
        sentimentScore: this.calculateSentimentScore(content)
      }
    };
  }

  private static extractTierFromContent(content: string): PlayerAnalysis['tier'] {
    const tierPatterns = [
      { pattern: /elite tier|elite contender/i, tier: 'Elite' as const },
      { pattern: /high-upside|breakout candidate/i, tier: 'High-Upside' as const },
      { pattern: /volatile|potential bust/i, tier: 'Volatile' as const },
      { pattern: /sleeper/i, tier: 'Sleeper' as const },
      { pattern: /bust/i, tier: 'Bust-Risk' as const }
    ];

    for (const { pattern, tier } of tierPatterns) {
      if (pattern.test(content)) {
        return tier;
      }
    }

    // Default based on likelihood
    const likelihood = this.extractLikelihood(content);
    if (likelihood >= 75) return 'Elite';
    if (likelihood >= 50) return 'High-Upside';
    if (likelihood >= 25) return 'Volatile';
    return 'Sleeper';
  }

  private static extractLikelihood(content: string): number {
    const patterns = [
      /Top\s+5\s+Likelihood:\s*(\d+)%/i,
      /Final\s+Top-?5\s+Probability:\s*(\d+)%/i,
      /(\d+)%\s*probability/i,
      /(\d+)%\s*likelihood/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }

    return 0;
  }

  private static extractAnalysisContent(content: string) {
    // Extract summary (first substantial paragraph after player name)
    const lines = content.split('\n').filter(line => line.trim());
    let summary = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('**') && !line.startsWith('#') && !line.startsWith('-') && line.length > 50) {
        summary = line;
        break;
      }
    }

    // Extract bullet points and categorize
    const strengths: string[] = [];
    const concerns: string[] = [];
    const keyFactors: string[] = [];
    
    const bulletPoints = content.match(/[-•]\s*([^\n]+)/g) || [];
    bulletPoints.forEach(point => {
      const cleaned = point.replace(/[-•]\s*/, '').trim();
      if (this.isStrength(cleaned)) {
        strengths.push(cleaned);
      } else if (this.isConcern(cleaned)) {
        concerns.push(cleaned);
      } else {
        keyFactors.push(cleaned);
      }
    });

    // Extract upside/floor
    const upsideMatch = content.match(/upside[^.]*\.?/i);
    const floorMatch = content.match(/floor[^.]*\.?/i);
    
    return {
      summary: summary.length > 300 ? summary.substring(0, 297) + '...' : summary,
      strengths: strengths.slice(0, 5), // Limit to top 5
      concerns: concerns.slice(0, 5),
      keyFactors: keyFactors.slice(0, 5),
      upside: upsideMatch ? upsideMatch[0] : 'High ceiling potential',
      floor: floorMatch ? floorMatch[0] : 'Solid weekly production'
    };
  }

  private static isStrength(text: string): boolean {
    const strengthWords = ['strength', 'advantage', 'elite', 'strong', 'excellent', 'outstanding', 'proven', 'superior'];
    return strengthWords.some(word => text.toLowerCase().includes(word));
  }

  private static isConcern(text: string): boolean {
    const concernWords = ['concern', 'risk', 'difficult', 'challenging', 'worry', 'problem', 'issue'];
    return concernWords.some(word => text.toLowerCase().includes(word));
  }

  private static normalizeTeamName(team: string): string {
    // Map team names to standard abbreviations
    const teamMap: Record<string, string> = {
      'Baltimore Ravens': 'BAL', 'Buffalo Bills': 'BUF', 'Cincinnati Bengals': 'CIN',
      'Cleveland Browns': 'CLE', 'Denver Broncos': 'DEN', 'Houston Texans': 'HOU',
      'Indianapolis Colts': 'IND', 'Jacksonville Jaguars': 'JAX', 'Kansas City Chiefs': 'KC',
      'Las Vegas Raiders': 'LV', 'Los Angeles Chargers': 'LAC', 'Miami Dolphins': 'MIA',
      'New England Patriots': 'NE', 'New York Jets': 'NYJ', 'Pittsburgh Steelers': 'PIT',
      'Tennessee Titans': 'TEN', 'Arizona Cardinals': 'ARI', 'Atlanta Falcons': 'ATL',
      'Carolina Panthers': 'CAR', 'Chicago Bears': 'CHI', 'Dallas Cowboys': 'DAL',
      'Detroit Lions': 'DET', 'Green Bay Packers': 'GB', 'Los Angeles Rams': 'LAR',
      'Minnesota Vikings': 'MIN', 'New Orleans Saints': 'NO', 'New York Giants': 'NYG',
      'Philadelphia Eagles': 'PHI', 'San Francisco 49ers': 'SF', 'Seattle Seahawks': 'SEA',
      'Tampa Bay Buccaneers': 'TB', 'Washington Commanders': 'WAS'
    };

    return teamMap[team] || team;
  }

  private static extractPositionAnalysis(markdown: string) {
    // Extract key themes and strategy from the markdown
    const trendingThemes: string[] = [];
    const keyFactors: string[] = [];
    
    // Look for conclusion or summary sections
    const conclusionMatch = markdown.match(/#{1,3}\s*conclusion[\s\S]*$/i);
    const summaryText = conclusionMatch ? conclusionMatch[0] : markdown.substring(0, 1000);
    
    // Extract themes from headers and key phrases
    const headers = markdown.match(/#{2,3}\s*([^\n]+)/g) || [];
    headers.forEach(header => {
      const cleaned = header.replace(/#{2,3}\s*/, '').trim();
      if (cleaned.length > 10 && !cleaned.includes('Probability')) {
        trendingThemes.push(cleaned);
      }
    });

    // Default strategy based on position
    let draftStrategy = 'Focus on opportunity and situation over pure talent.';
    
    return {
      trendingThemes: trendingThemes.slice(0, 5),
      keyFactors: ['Opportunity', 'Health', 'Schedule Strength', 'Team Context'],
      draftStrategy
    };
  }

  private static extractInjuries(content: string): string[] {
    const injuries: string[] = [];
    const injuryKeywords = ['injury', 'injured', 'health', 'sack', 'concussion'];
    
    injuryKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        injuries.push(`${keyword} mentioned in analysis`);
      }
    });
    
    return injuries;
  }

  private static extractPositionStats(content: string, position: string): any {
    // Extract basic stats from content
    const numberRegex = /(\d{1,4}(?:,\d{3})*)/g;
    const numbers = Array.from(content.matchAll(numberRegex)).map(m => parseInt(m[1].replace(/,/g, '')));
    
    const baseStats = { gamesPlayed: 16, fantasyRank: 0 };
    
    switch (position) {
      case 'QB':
        return {
          ...baseStats,
          passingYards: numbers.find(n => n > 3000 && n < 6000) || 3500,
          passingTouchdowns: numbers.find(n => n > 15 && n < 50) || 25,
          rushingYards: numbers.find(n => n > 200 && n < 1200) || 400
        };
      case 'RB':
        return {
          ...baseStats,
          rushingYards: numbers.find(n => n > 800 && n < 2500) || 1200,
          rushingTouchdowns: numbers.find(n => n > 5 && n < 25) || 10
        };
      default:
        return baseStats;
    }
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

  private static calculateSentimentScore(content: string): number {
    const positiveWords = ['elite', 'strong', 'excellent', 'outstanding', 'dominant'];
    const negativeWords = ['concern', 'risk', 'difficult', 'challenging', 'inconsistent'];
    
    let score = 0;
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.some(pos => word.includes(pos))) score += 0.1;
      if (negativeWords.some(neg => word.includes(neg))) score -= 0.1;
    });
    
    return Math.max(-1, Math.min(1, score));
  }
}