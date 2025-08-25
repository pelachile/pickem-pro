import { useCurrentWeekGames } from '../../hooks/useSmartGames'
import { getCurrentNFLWeek } from '../../lib/nflCalendar'

interface DataSourceIndicatorProps {
  source?: 'cache' | 'database'
  lastUpdated?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Small indicator component to show data source in UI
export function DataSourceIndicator({ 
  source, 
  lastUpdated, 
  size = 'sm', 
  className = '' 
}: DataSourceIndicatorProps) {
  const currentWeekQuery = useCurrentWeekGames()
  const currentNFLWeek = getCurrentNFLWeek()
  
  const actualSource = source || currentWeekQuery.data?.source
  const actualLastUpdated = lastUpdated || currentWeekQuery.data?.lastUpdated
  
  if (!actualSource) return null
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5', 
    lg: 'text-base px-4 py-2'
  }
  
  const iconClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  return (
    <div className={`inline-flex items-center gap-2 rounded-full font-medium transition-all ${
      actualSource === 'cache' 
        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    } ${sizeClasses[size]} ${className}`}>
      <div className={`rounded-full ${
        actualSource === 'cache' ? 'bg-green-400' : 'bg-blue-400'
      } ${iconClasses[size]}`} />
      
      <span>
        {actualSource === 'cache' ? '🔴 Live' : '📀 Database'}
      </span>
      
      {actualLastUpdated && size !== 'sm' && (
        <span className="opacity-70">
          • {new Date(actualLastUpdated).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      )}
    </div>
  )
}

// Hook to get data source info for any component
export function useDataSourceInfo(week?: number, year?: number) {
  const currentWeekQuery = useCurrentWeekGames()
  const currentNFLWeek = getCurrentNFLWeek()
  
  const targetWeek = week ?? currentNFLWeek.week
  const targetYear = year ?? currentNFLWeek.seasonYear
  
  const isCurrentWeek = targetWeek === currentNFLWeek.week && targetYear === currentNFLWeek.seasonYear
  
  return {
    source: currentWeekQuery.data?.source,
    lastUpdated: currentWeekQuery.data?.lastUpdated,
    isLiveData: currentWeekQuery.data?.source === 'cache',
    isCurrentWeek,
    gamesCount: currentWeekQuery.data?.games.length || 0,
    isLoading: currentWeekQuery.isLoading,
    error: currentWeekQuery.error,
  }
}