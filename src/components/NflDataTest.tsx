import { useTeams, useSchedule, useCacheMetadata } from '../hooks/useNflData'

export function NflDataTest() {
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams()
  const { data: schedule, isLoading: scheduleLoading } = useSchedule()
  const { data: metadata } = useCacheMetadata()

  if (teamsLoading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800">Loading NFL Data...</h2>
        <p className="text-blue-600">Fetching from cache or API...</p>
      </div>
    )
  }

  if (teamsError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800">Error Loading Data</h2>
        <p className="text-red-600">{teamsError.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800">✅ NFL Data Loaded Successfully!</h2>
        
        {metadata && (
          <div className="mt-2 text-sm text-green-700">
            <p><strong>Cache Version:</strong> {metadata.cache_version}</p>
            <p><strong>Last Updated:</strong> {new Date(metadata.export_date).toLocaleString()}</p>
            <p><strong>Current Season:</strong> {metadata.current_season}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800">Teams</h3>
          <p className="text-2xl font-bold text-blue-600">{teams.length}</p>
          <p className="text-sm text-gray-600">NFL Teams Loaded</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800">Games</h3>
          <p className="text-2xl font-bold text-green-600">{schedule?.all_games.length || 0}</p>
          <p className="text-sm text-gray-600">Games Scheduled</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800">Weeks</h3>
          <p className="text-2xl font-bold text-purple-600">{metadata?.weeks_available.length || 0}</p>
          <p className="text-sm text-gray-600">Weeks Available</p>
        </div>
      </div>

      <details className="bg-gray-50 rounded-lg p-4">
        <summary className="font-semibold cursor-pointer">View Sample Teams</summary>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {teams.slice(0, 8).map((team) => (
            <div key={team.id} className="text-sm">
              <div className="flex items-center space-x-2">
                {team.logo_url && (
                  <img src={team.logo_url} alt={team.name} className="w-6 h-6" />
                )}
                <span>{team.abbreviation}</span>
              </div>
              <p className="text-xs text-gray-600">{team.display_name}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}