# Smart Data Layer Implementation

## Overview

The Smart Data Layer is an intelligent TanStack Query-based system that automatically chooses the optimal data source for NFL games based on context. It seamlessly fetches data from either:

- **Cache files** (Supabase Storage): For current/recent weeks with live game updates
- **Database**: For historical data and future weeks

## Architecture

### Core Components

1. **Smart Games Fetcher** (`src/lib/smartGamesFetcher.ts`)
   - Determines optimal data source based on week/year context
   - Handles fallback logic when primary source fails
   - Provides metadata about cache files and availability

2. **Smart Hooks** (`src/hooks/useSmartGames.ts`)
   - React Query hooks with intelligent caching strategies
   - Different refetch intervals based on data freshness needs
   - Automatic prefetching for adjacent weeks

3. **Enhanced Query Client** (`src/lib/queryClient.ts`)
   - Optimized configuration for NFL Pick'em use cases
   - Centralized query key factories
   - Smart retry and error handling logic

### Data Source Selection Logic

```typescript
function shouldUseCacheFile(week: number, year: number): boolean {
  const currentNFLWeek = getCurrentNFLWeek()
  
  // Use cache for:
  // 1. Current week (live updates)
  // 2. Recent weeks within 2 weeks of current (score updates)
  if (year === currentYear && Math.abs(week - currentWeek) <= 2) {
    return true
  }
  
  // Use database for historical/future data
  return false
}
```

## Available Hooks

### Primary Hooks

#### `useGames(week?, year?)`
- Smart hook that automatically chooses cache vs database
- Returns games with source information
- Auto-refreshes current week every 5 minutes

#### `useCurrentWeekGames()`
- Always fetches current week with live updates
- 1-minute stale time for maximum freshness
- Background refetching enabled

#### `useHistoricalGames(week, year)`
- Optimized for historical data (2-hour stale time)
- No auto-refetch (historical data doesn't change)
- Prefers database source

#### `useEnhancedGames(week?, year?)`
- Combines game data with team information
- Returns fully populated game objects with team details
- Handles loading states for both games and teams

#### `useGamesByDate(week?, year?)`
- Groups games by date for UI display
- Includes date sorting and game count per date
- Ready-to-use format for game cards

### Utility Hooks

#### `useCacheMetadata(week, year)`
- Check if cache files exist
- Get file size and last modified date
- Useful for debugging and monitoring

#### `useAvailableWeeks(year?)`
- Lists available weeks from both cache and database
- Helps determine data coverage
- Returns separate arrays for each source

#### `usePrefetchAdjacentWeeks(week?, year?)`
- Prefetch next/previous weeks for smooth navigation
- Improves perceived performance
- Smart prefetching based on user context

#### `useRefreshGames()`
- Manual refresh controls
- Invalidate specific weeks or all data
- Useful for "pull to refresh" functionality

## Integration Examples

### Basic Usage in Make-Picks Component

```tsx
import { useGamesByDate } from '../../hooks/useSmartGames'

function MakePicksComponent() {
  const { 
    gamesByDate, 
    sortedDates, 
    isLoading, 
    data: smartGameData 
  } = useGamesByDate() // Uses current week automatically
  
  // Data source info available
  console.log('Data source:', smartGameData?.source) // 'cache' or 'database'
  console.log('Last updated:', smartGameData?.lastUpdated)
  
  return (
    <div>
      {/* Show data source indicator */}
      <DataSourceIndicator 
        source={smartGameData?.source}
        lastUpdated={smartGameData?.lastUpdated}
      />
      
      {/* Render games grouped by date */}
      {sortedDates.map(date => (
        <div key={date}>
          <h2>{new Date(date).toLocaleDateString()}</h2>
          {gamesByDate[date].map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ))}
    </div>
  )
}
```

### Historical Data Access

```tsx
function WeeklyStatsComponent({ week, year }: { week: number, year: number }) {
  const { data: gameData, source } = useHistoricalGames(week, year)
  
  return (
    <div>
      <p>Data from: {source === 'cache' ? 'Live Cache' : 'Database'}</p>
      <p>Games: {gameData?.games.length}</p>
    </div>
  )
}
```

### Cache Monitoring

```tsx
function DataMonitoringComponent() {
  const currentWeek = getCurrentNFLWeek()
  const { data: cacheInfo } = useCacheMetadata(currentWeek.week, currentWeek.seasonYear)
  const { data: availableWeeks } = useAvailableWeeks()
  
  return (
    <div>
      <p>Cache file exists: {cacheInfo?.exists ? 'Yes' : 'No'}</p>
      <p>Available cache weeks: {availableWeeks?.cache.join(', ')}</p>
      <p>Available DB weeks: {availableWeeks?.database.join(', ')}</p>
    </div>
  )
}
```

## Performance Optimizations

### Stale Time Strategy
- **Current week**: 2 minutes (live games need fresh data)
- **Recent weeks**: 30 minutes (scores might be updated)
- **Historical data**: 2 hours (rarely changes)

### Refetch Intervals
- **Current week**: Every 5 minutes with background refetch
- **Historical data**: No auto-refetch
- **Cache metadata**: Every 10 minutes

### Prefetching
```tsx
const { prefetchBoth } = usePrefetchAdjacentWeeks()

// Prefetch when user navigates to a week
useEffect(() => {
  prefetchBoth() // Prefetches week ± 1
}, [currentWeek])
```

## Error Handling & Fallbacks

### Automatic Fallback
```typescript
// If cache fails, try database
// If database fails, try cache
// Only throw if both fail
try {
  return await fetchGamesFromCache(week, year)
} catch (error) {
  console.warn('Cache failed, trying database...')
  return await fetchGamesFromDatabase(week, year)
}
```

### Error Recovery
```tsx
const { data, error, refetch } = useGames(week, year)

if (error) {
  return (
    <div>
      <p>Error loading games: {error.message}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  )
}
```

## Development Tools

### Smart Games Fetcher Demo Component
Use `SmartGamesFetcher` component to:
- Test different weeks and years
- Monitor data sources in real-time
- Debug cache file availability
- Manually refresh data

```tsx
import { SmartGamesFetcher } from '../../components/dev'

// Add to any development route
<SmartGamesFetcher />
```

### Data Source Indicator
Visual indicator for production use:

```tsx
import { DataSourceIndicator } from '../../components/dev'

<DataSourceIndicator 
  size="md" 
  className="mb-4" 
/>
```

## Migration from Legacy System

### Backward Compatibility
The enhanced hooks maintain compatibility with existing code:

```tsx
// Legacy code continues to work
const { gamesByWeek } = useSchedule()

// But now includes smart data for current week
const currentWeekGames = gamesByWeek[currentWeek] // Enhanced with cache data
```

### Migration Steps
1. Update imports to use new hooks
2. Replace static data with smart hooks
3. Add data source indicators where helpful
4. Test with both cache and database scenarios

## Cache File Format

Expected format for cache files in Supabase Storage:

```json
{
  "games": [
    {
      "id": 1,
      "week": 3,
      "home_team_id": 5,
      "away_team_id": 12,
      "date": "2025-08-25T13:00:00Z",
      "status": "in_progress",
      "home_score": 14,
      "away_score": 7,
      "venue_name": "Stadium Name"
    }
  ],
  "meta": {
    "week": 3,
    "year": 2025,
    "last_updated": "2025-08-25T14:30:00Z",
    "total_games": 16
  }
}
```

## Performance Monitoring

### Key Metrics to Track
- Cache hit ratio (cache vs database usage)
- Data freshness (time since last update)
- Query response times
- Error rates by data source

### Debug Information
Enable query devtools to monitor:
```tsx
// In development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />
```

## Future Enhancements

1. **Real-time Subscriptions**: Add WebSocket connections for live score updates
2. **Predictive Prefetching**: Learn user patterns and prefetch likely-needed data
3. **Offline Support**: Cache data in IndexedDB for offline access
4. **Data Compression**: Optimize cache file sizes for faster loading
5. **CDN Integration**: Serve cache files from CDN for global performance

## Troubleshooting

### Common Issues

**Cache files not found**
- Check Supabase Storage bucket permissions
- Verify file naming convention: `games-cache-week-{week}-{year}.json`
- Ensure edge functions are running to populate cache

**Database queries slow**
- Check database indexes on `week` and `season_year` columns
- Monitor connection pool usage
- Consider read replicas for historical data

**Stale data**
- Check refetch intervals in query configuration
- Verify cache invalidation logic
- Monitor background refetch behavior

### Debug Commands

```tsx
// Check current query state
const queryClient = useQueryClient()
const queryState = queryClient.getQueryState(queryKeys.nfl.currentWeekGames())
console.log('Query state:', queryState)

// Manual cache inspection
const cacheData = queryClient.getQueryData(queryKeys.nfl.smartGames(3, 2025))
console.log('Cached data:', cacheData)
```

This smart data layer provides a robust, performant, and maintainable foundation for the NFL Pick'em application's data fetching needs.