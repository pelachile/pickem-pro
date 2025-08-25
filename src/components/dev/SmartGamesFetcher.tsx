import { useState } from 'react'
import { 
  useGames, 
  useCurrentWeekGames, 
  useHistoricalGames,
  useCacheMetadata,
  useAvailableWeeks,
  useRefreshGames
} from '../../hooks/useSmartGames'
import { getCurrentNFLWeek } from '../../lib/nflCalendar'

// Demo component to showcase smart games fetching capabilities
export function SmartGamesFetcher() {
  const [selectedWeek, setSelectedWeek] = useState<number>()
  const [selectedYear, setSelectedYear] = useState<number>()
  
  const currentNFLWeek = getCurrentNFLWeek()
  const currentWeekQuery = useCurrentWeekGames()
  const availableWeeksQuery = useAvailableWeeks()
  const refreshGames = useRefreshGames()
  
  // Selected week/year or current week
  const targetWeek = selectedWeek ?? currentNFLWeek.week
  const targetYear = selectedYear ?? currentNFLWeek.seasonYear
  
  const gamesQuery = useGames(selectedWeek, selectedYear)
  const historicalQuery = useHistoricalGames(targetWeek, targetYear)
  const cacheMetadata = useCacheMetadata(targetWeek, targetYear)
  
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white mb-2">Smart Games Fetcher Demo</h2>
        <p className="text-white/70 text-sm">
          This component demonstrates the intelligent data fetching system that automatically chooses
          between live cache files and database based on context.
        </p>
      </div>

      {/* Current NFL Week Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/80 mb-1">Current NFL Week</h3>
          <div className="text-lg font-bold text-white">
            {currentNFLWeek.seasonType === 'regular' 
              ? `Week ${currentNFLWeek.week}` 
              : `${currentNFLWeek.seasonType} ${currentNFLWeek.week}`
            }
          </div>
          <div className="text-sm text-white/60">{currentNFLWeek.seasonYear} Season</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/80 mb-1">Data Source</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              currentWeekQuery.data?.source === 'cache' ? 'bg-green-400' : 
              currentWeekQuery.data?.source === 'database' ? 'bg-blue-400' : 'bg-gray-400'
            }`} />
            <span className="text-sm text-white">
              {currentWeekQuery.data?.source === 'cache' ? 'Live Cache' :
               currentWeekQuery.data?.source === 'database' ? 'Database' : 'Loading...'}
            </span>
          </div>
          {currentWeekQuery.data?.lastUpdated && (
            <div className="text-xs text-white/60 mt-1">
              Updated: {new Date(currentWeekQuery.data.lastUpdated).toLocaleTimeString()}
            </div>
          )}
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/80 mb-1">Games Count</h3>
          <div className="text-lg font-bold text-white">
            {currentWeekQuery.data?.games.length || 0}
          </div>
          <div className="text-sm text-white/60">Current Week Games</div>
        </div>
      </div>

      {/* Week Selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Test Different Weeks</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Week</label>
            <select 
              value={selectedWeek || ''} 
              onChange={(e) => setSelectedWeek(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60"
            >
              <option value="">Current Week ({currentNFLWeek.week})</option>
              {Array.from({ length: 18 }, (_, i) => i + 1).map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Year</label>
            <select 
              value={selectedYear || ''} 
              onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60"
            >
              <option value="">Current Year ({currentNFLWeek.seasonYear})</option>
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Week Data */}
      {(selectedWeek || selectedYear) && (
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Week {targetWeek}, {targetYear} Data
            </h3>
            <button
              onClick={() => refreshGames.refreshWeek(targetWeek, targetYear)}
              className="px-3 py-1 text-sm bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Smart Query</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Source:</span>
                  <span className={`font-medium ${
                    gamesQuery.data?.source === 'cache' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {gamesQuery.data?.source || 'Loading...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Games:</span>
                  <span className="text-white">{gamesQuery.data?.games.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Status:</span>
                  <span className={`font-medium ${
                    gamesQuery.isLoading ? 'text-yellow-400' :
                    gamesQuery.isError ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {gamesQuery.isLoading ? 'Loading' : 
                     gamesQuery.isError ? 'Error' : 'Success'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Cache Metadata</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Exists:</span>
                  <span className={`font-medium ${
                    cacheMetadata.data?.exists ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {cacheMetadata.data?.exists ? 'Yes' : 'No'}
                  </span>
                </div>
                {cacheMetadata.data?.lastModified && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Modified:</span>
                    <span className="text-white text-xs">
                      {new Date(cacheMetadata.data.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {cacheMetadata.data?.size && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Size:</span>
                    <span className="text-white">
                      {Math.round(cacheMetadata.data.size / 1024)}KB
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Weeks */}
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Available Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Cache Files</h4>
            <div className="flex flex-wrap gap-2">
              {availableWeeksQuery.data?.cache.map(week => (
                <span 
                  key={`cache-${week}`}
                  className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-md"
                >
                  W{week}
                </span>
              )) || <span className="text-white/50 text-sm">Loading...</span>}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Database</h4>
            <div className="flex flex-wrap gap-2">
              {availableWeeksQuery.data?.database.map(week => (
                <span 
                  key={`db-${week}`}
                  className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md"
                >
                  W{week}
                </span>
              )) || <span className="text-white/50 text-sm">Loading...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={refreshGames.refreshCurrentWeek}
          className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg transition-colors"
        >
          Refresh Current Week
        </button>
        <button
          onClick={refreshGames.refreshAll}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
        >
          Refresh All Data
        </button>
        <button
          onClick={() => {
            setSelectedWeek(undefined)
            setSelectedYear(undefined)
          }}
          className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
        >
          Reset Selection
        </button>
      </div>
      
      {/* Error Display */}
      {(gamesQuery.isError || currentWeekQuery.isError) && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2">Error</h4>
          <p className="text-red-300 text-sm">
            {gamesQuery.error?.message || currentWeekQuery.error?.message}
          </p>
        </div>
      )}
    </div>
  )
}