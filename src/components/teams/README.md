# Enhanced AI Team Data Display Components

This directory contains a comprehensive set of components for displaying NFL team data with AI-powered analysis and rich visual content.

## Components Overview

### 1. EnhancedAITeamDataDisplay
The flagship component that renders comprehensive team analysis with AI insights, images, and interactive features.

**Key Features:**
- 📊 AI-powered team analysis with confidence scores
- 🖼️ Rich image support (stadium, action shots, banners)
- 📱 Responsive design with mobile optimization
- ⚡ Performance-optimized image loading
- 🎨 Glass morphism design system integration
- 🔄 Real-time data refresh capabilities
- 📈 Interactive performance metrics
- 🏥 Injury report with status indicators
- 🏆 Playoff odds and power rankings

### 2. TeamDataDisplay (Legacy)
The original team display component for backward compatibility.

### 3. AITeamDataDisplay (Original)
The original AI-focused component that has been enhanced.

### 4. TeamPageExample
Example implementation showing how to use the enhanced components in a full page context.

## Quick Start

```tsx
import { EnhancedAITeamDataDisplay } from './components/teams/EnhancedAITeamDataDisplay';
import { useEnhancedTeamData } from './hooks/useEnhancedTeamData';

function TeamPage({ teamId }: { teamId: string }) {
  const {
    teamData,
    loading,
    refreshAI,
    aiLoading
  } = useEnhancedTeamData({
    teamAbbreviation: teamId,
    enableImagePreloading: true,
    enableAutoRefresh: false
  });

  if (loading || !teamData) return <div>Loading...</div>;

  return (
    <EnhancedAITeamDataDisplay
      teamData={teamData}
      loading={loading}
      onRefreshAI={refreshAI}
      aiLoading={aiLoading}
      showTeamStats={true}
      showPerformanceMetrics={true}
      enableImageGallery={true}
      viewMode="detailed"
    />
  );
}
```

## Data Structure

### EnhancedTeamData Interface

```typescript
interface EnhancedTeamData {
  basic: {
    id: string;
    name: string;
    location: string;
    abbreviation: string;
    displayName: string;
    conference: 'AFC' | 'NFC';
    division: 'North' | 'South' | 'East' | 'West';
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    established?: number;
    stadiumName?: string;
    headCoach?: string;
  };
  visuals: {
    stadiumImage?: string;
    teamPhoto?: string;
    bannerImage?: string;
    actionShots?: string[];
    alternateLogos?: string[];
    galleryImages?: Array<{
      url: string;
      caption: string;
      type: 'stadium' | 'action' | 'celebration' | 'training' | 'fan';
    }>;
  };
  record?: {
    wins: number;
    losses: number;
    ties: number;
    divisionWins?: number;
    divisionLosses?: number;
    homeRecord?: string;
    awayRecord?: string;
  };
  aiAnalysis?: EnhancedAITeamAnalysis;
}
```

### EnhancedAITeamAnalysis Interface

```typescript
interface EnhancedAITeamAnalysis {
  id: string;
  abbreviation: string;
  season_year: number;
  season_outlook?: string;
  strengths?: string[];
  weaknesses?: string[];
  key_injuries?: Array<{
    player: string;
    injury: string;
    impact: string;
    status: 'Questionable' | 'Doubtful' | 'Out' | 'IR' | 'Probable';
    estimated_return?: string;
  }>;
  weekly_highlights?: string;
  game_preview?: string;
  ai_last_updated?: string;
  confidence_score?: number;
  trending_direction?: 'up' | 'down' | 'stable';
  playoff_odds?: number;
  power_ranking?: number;
  division_outlook?: string;
  key_matchups?: string[];
  fantasy_impact?: string;
  coaching_insights?: string;
  recent_news?: Array<{
    headline: string;
    summary: string;
    source: string;
    date: string;
  }>;
  performance_metrics?: {
    offensive_rank: number;
    defensive_rank: number;
    special_teams_rank: number;
    redzone_efficiency: number;
    turnover_differential: number;
  };
}
```

## Component Props

### EnhancedAITeamDataDisplay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `teamData` | `EnhancedTeamData` | required | Complete team data with AI analysis |
| `loading` | `boolean` | `false` | Loading state for team data |
| `onRefreshAI` | `() => void` | optional | Callback to refresh AI analysis |
| `aiLoading` | `boolean` | `false` | Loading state for AI refresh |
| `showTeamStats` | `boolean` | `true` | Show team statistics section |
| `showPerformanceMetrics` | `boolean` | `true` | Show performance analytics |
| `enableImageGallery` | `boolean` | `true` | Enable image gallery functionality |
| `showRecentNews` | `boolean` | `false` | Show recent news section |
| `onTeamClick` | `(teamId: string) => void` | optional | Handle team profile navigation |
| `viewMode` | `'detailed' \| 'compact' \| 'focus'` | `'detailed'` | Display mode |

## Hooks

### useEnhancedTeamData

Comprehensive hook for managing team data, AI analysis, and image loading.

```typescript
const {
  teamData,
  loading,
  error,
  refreshAI,
  refreshTeamData,
  aiLoading,
  aiError,
  isContentFresh,
  lastUpdated,
  imageLoadingStates
} = useEnhancedTeamData({
  teamAbbreviation: 'KC',
  seasonYear: 2024,
  enableImagePreloading: true,
  enableAutoRefresh: false,
  refreshIntervalMs: 300000
});
```

### useEnhancedTeamsData

Hook for managing multiple teams' data simultaneously.

```typescript
const {
  teamsData,
  loadingStates,
  errors,
  refreshAll,
  refreshAllAI
} = useEnhancedTeamsData(['KC', 'BUF', 'CIN'], {
  enableImagePreloading: true,
  enableAutoRefresh: false
});
```

## Utilities

### teamImageUtils

Comprehensive utilities for team image management:

```typescript
import { 
  getStadiumImage, 
  getBannerImage, 
  generateTeamImageGallery,
  enhanceTeamDataWithImages,
  preloadTeamImages 
} from '../utils/teamImageUtils';

// Get optimized stadium image
const stadiumUrl = getStadiumImage('KC');

// Generate complete image gallery
const gallery = generateTeamImageGallery('KC', 'Kansas City Chiefs');

// Enhance team data with images
const enhancedData = enhanceTeamDataWithImages(basicTeamData);

// Preload critical images
await preloadTeamImages('KC');
```

## Styling & Design System

The components follow the existing ocean-to-sunset design system:

### Colors
- **Midnight Navy**: `#062440`
- **Ocean Blue**: `#005A7C`
- **Sky Blue**: `#4DA6D9`
- **Sunset Orange**: `#FF6B35`
- **Sunrise Gold**: `#FFB935`

### Glass Morphism Effects
- Backdrop blur with transparency
- Subtle borders with opacity
- Hover state micro-interactions
- Smooth transitions and animations

## Performance Optimization

### Image Loading
- Lazy loading for non-critical images
- Progressive enhancement with fallbacks
- Responsive image sets for different screen sizes
- Preloading for critical above-the-fold images

### Data Loading
- Efficient caching strategies
- Debounced refresh mechanisms
- Optimistic UI updates
- Error boundaries and graceful degradation

### Responsive Design
- Mobile-first approach
- Container queries where supported
- Touch-friendly interactions
- Optimized for various screen sizes

## Accessibility Features

- ARIA labels and roles
- Keyboard navigation support
- Screen reader optimization
- High contrast mode compatibility
- Focus management
- Semantic HTML structure

## Integration with Existing Systems

### AI Analysis Service
Components integrate seamlessly with the existing `AIAnalysisService` and Lambda functions.

### Supabase Integration
Ready for integration with Supabase real-time subscriptions and authentication.

### TanStack Router
Compatible with the existing routing system using TanStack Router.

## Customization

### Theme Customization
```typescript
// Override default colors
const customTheme = {
  primary: '#custom-color',
  secondary: '#another-color'
};

<EnhancedAITeamDataDisplay 
  teamData={data}
  customTheme={customTheme}
/>
```

### Image Source Customization
```typescript
// Override image sources
const customImageConfig = {
  stadiumImages: {
    'KC': '/custom/kc-stadium.jpg'
  }
};

// Use with teamImageUtils
```

## Best Practices

### Performance
1. Use `enableImagePreloading` selectively - only for critical pages
2. Implement proper error boundaries
3. Use `viewMode="compact"` for list/grid views
4. Cache team data appropriately

### UX
1. Provide loading states for all async operations
2. Show image loading indicators
3. Implement graceful fallbacks for missing data
4. Use appropriate view modes for different contexts

### Accessibility
1. Always provide alt text for images
2. Use semantic HTML structure
3. Implement proper focus management
4. Test with screen readers

## Troubleshooting

### Common Issues

**Images not loading:**
- Check image URLs in `teamImageUtils.ts`
- Verify fallback images are available
- Check network connectivity

**AI analysis not appearing:**
- Verify AWS Lambda function is running
- Check API endpoints in `aiAnalysisService.ts`
- Ensure team abbreviation matches expected format

**Styling issues:**
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Ensure glass morphism CSS is included

## Future Enhancements

- [ ] Video support for team highlights
- [ ] Interactive performance charts
- [ ] Social media integration
- [ ] Push notification support
- [ ] Offline data caching
- [ ] Advanced filtering and sorting
- [ ] Export functionality
- [ ] Print-friendly layouts

## Contributing

When adding new features:

1. Follow TypeScript strict mode
2. Maintain accessibility standards
3. Add proper error handling
4. Include loading states
5. Write comprehensive tests
6. Update documentation