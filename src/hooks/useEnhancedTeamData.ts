import { useState, useEffect } from 'react';
import { useAITeamAnalysis } from './useAIAnalysis';
import { 
  preloadTeamImagesWithFallbacks, 
  createTeamCSSVars,
  type TeamColors 
} from '../utils/teamImageUtils';
import type { EnhancedTeamData } from '../components/teams/EnhancedAITeamDataDisplay';

interface UseEnhancedTeamDataOptions {
  teamAbbreviation: string;
  enableImagePreloading?: boolean;
  autoRefresh?: boolean;
}

interface UseEnhancedTeamDataReturn {
  teamData: EnhancedTeamData | null;
  loading: boolean;
  error: string | null;
  refreshAI: () => void;
  aiLoading: boolean;
  teamCSSVars?: React.CSSProperties; // New: CSS custom properties for theming
}

// NFL team data with stadium images
const NFL_TEAMS_DATA = {
  'PIT': {
    id: 'pit',
    name: 'Steelers',
    location: 'Pittsburgh',
    abbreviation: 'PIT',
    displayName: 'Pittsburgh Steelers',
    conference: 'AFC' as const,
    division: 'North' as const,
    logoUrl: '/images/teams/pit.png',
    primaryColor: '#FFB612',
    secondaryColor: '#000000',
    stadium: {
      name: 'Acrisure Stadium',
      location: 'Pittsburgh, PA',
      capacity: 68400,
      imageUrl: '/images/stadiums/acrisure-stadium.jpg'
    }
  },
  'BAL': {
    id: 'bal',
    name: 'Ravens',
    location: 'Baltimore',
    abbreviation: 'BAL',
    displayName: 'Baltimore Ravens',
    conference: 'AFC' as const,
    division: 'North' as const,
    logoUrl: '/images/teams/bal.png',
    primaryColor: '#241773',
    secondaryColor: '#000000',
    stadium: {
      name: 'M&T Bank Stadium',
      location: 'Baltimore, MD',
      capacity: 71008,
      imageUrl: '/images/stadiums/mt-bank-stadium.jpg'
    }
  },
  // Add more teams as needed...
};

export function useEnhancedTeamData({ 
  teamAbbreviation, 
  enableImagePreloading = false, 
  autoRefresh = false 
}: UseEnhancedTeamDataOptions): UseEnhancedTeamDataReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<EnhancedTeamData | null>(null);
  const [teamCSSVars, setTeamCSSVars] = useState<React.CSSProperties>();

  // Use existing AI analysis hook
  const { teams: aiTeams, loading: aiLoading, refresh: refreshAI } = useAITeamAnalysis(teamAbbreviation);

  useEffect(() => {
    const loadTeamData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get basic team info from static data or NFL_TEAMS_DATA
        const staticTeamData = NFL_TEAMS_DATA[teamAbbreviation.toUpperCase() as keyof typeof NFL_TEAMS_DATA];
        
        if (!staticTeamData) {
          // Fallback: try to load from existing team data JSON files
          let foundTeam = null;
          
          // Check both AFC and NFC files since all.json has empty teams array
          const conferences = ['afc', 'nfc'];
          
          for (const conf of conferences) {
            try {
              const response = await fetch(`/data/teamData-json/${conf}.json`);
              if (!response.ok) continue;
              
              const data = await response.json();
              foundTeam = data.content.teams.find((t: any) => 
                t.abbreviation.toLowerCase() === teamAbbreviation.toLowerCase()
              );
              
              if (foundTeam) break;
            } catch (error) {
              console.warn(`Failed to load ${conf}.json:`, error);
              continue;
            }
          }
          
          if (!foundTeam) {
            throw new Error(`Team ${teamAbbreviation} not found`);
          }

          // Create team colors for gradient fallbacks
          const teamColors: TeamColors = {
            primary: foundTeam.primaryColor,
            secondary: foundTeam.secondaryColor
          };
          
          // Generate CSS custom properties for consistent theming
          const cssVars = createTeamCSSVars(teamColors, 'team');
          setTeamCSSVars(cssVars);
          
          // Preload images if enabled (with fallback support)
          if (enableImagePreloading) {
            preloadTeamImagesWithFallbacks([{
              abbreviation: foundTeam.abbreviation,
              primaryColor: foundTeam.primaryColor,
              secondaryColor: foundTeam.secondaryColor
            }]).catch(err => console.warn('Image preloading failed:', err));
          }

          // Create enhanced team data structure
          const enhancedData: EnhancedTeamData = {
            basic: {
              id: foundTeam.id,
              name: foundTeam.name,
              location: foundTeam.location,
              abbreviation: foundTeam.abbreviation,
              displayName: foundTeam.displayName,
              conference: foundTeam.conference,
              division: foundTeam.division,
              logoUrl: foundTeam.logoUrl,
              primaryColor: foundTeam.primaryColor,
              secondaryColor: foundTeam.secondaryColor,
            },
            visuals: {
              stadiumImage: `/images/stadiums/${foundTeam.abbreviation.toLowerCase()}-stadium.jpg`,
              teamPhoto: `/images/teams/${foundTeam.abbreviation.toLowerCase()}-team.jpg`,
              bannerImage: `/images/banners/${foundTeam.abbreviation.toLowerCase()}-banner.jpg`,
              // Enhanced visuals with fallback support
              alternateLogos: [],
              actionShots: [],
              galleryImages: [] // Will be populated by TeamImage component fallbacks
            },
            record: foundTeam.seasonStats ? {
              wins: foundTeam.seasonStats.wins,
              losses: foundTeam.seasonStats.losses,
              ties: foundTeam.seasonStats.ties || 0,
            } : undefined,
            aiAnalysis: aiTeams.find(ai => ai.abbreviation === foundTeam.abbreviation.toUpperCase()) || undefined
          };

          setTeamData(enhancedData);
        } else {
          // Use NFL_TEAMS_DATA structure
          const teamColors: TeamColors = {
            primary: staticTeamData.primaryColor,
            secondary: staticTeamData.secondaryColor
          };
          
          // Generate CSS custom properties for consistent theming
          const cssVars = createTeamCSSVars(teamColors, 'team');
          setTeamCSSVars(cssVars);
          
          // Preload images if enabled
          if (enableImagePreloading) {
            preloadTeamImagesWithFallbacks([{
              abbreviation: staticTeamData.abbreviation,
              primaryColor: staticTeamData.primaryColor,
              secondaryColor: staticTeamData.secondaryColor
            }]).catch(err => console.warn('Image preloading failed:', err));
          }
          
          const enhancedData: EnhancedTeamData = {
            basic: {
              id: staticTeamData.id,
              name: staticTeamData.name,
              location: staticTeamData.location,
              abbreviation: staticTeamData.abbreviation,
              displayName: staticTeamData.displayName,
              conference: staticTeamData.conference,
              division: staticTeamData.division,
              logoUrl: staticTeamData.logoUrl,
              primaryColor: staticTeamData.primaryColor,
              secondaryColor: staticTeamData.secondaryColor,
            },
            visuals: {
              stadiumImage: staticTeamData.stadium.imageUrl,
              teamPhoto: `/images/teams/${staticTeamData.abbreviation.toLowerCase()}-team.jpg`,
              bannerImage: `/images/banners/${staticTeamData.abbreviation.toLowerCase()}-banner.jpg`,
              // Enhanced visuals with fallback support
              alternateLogos: [],
              actionShots: [],
              galleryImages: []
            },
            record: {
              wins: 8,  // Mock data
              losses: 9,
              ties: 0,
            },
            aiAnalysis: aiTeams.find(ai => ai.abbreviation === staticTeamData.abbreviation.toUpperCase()) || undefined
          };

          setTeamData(enhancedData);
        }
      } catch (err) {
        console.error('Error loading team data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    if (teamAbbreviation) {
      loadTeamData();
    }
  }, [teamAbbreviation, aiTeams]); // Re-run when AI data changes

  return {
    teamData,
    loading,
    error,
    refreshAI,
    aiLoading,
    teamCSSVars
  };
}