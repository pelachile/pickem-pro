import { createFileRoute } from '@tanstack/react-router'
import { useGamesByDate } from '../../hooks/useSmartGames'
import { GameCard } from '../../components/ui/GameCard'
import ContentWrapper from '../../components/layout/ContentWrapper'
import { getCurrentNFLWeek } from '../../lib/nflCalendar'

function TestVenuesPage() {
  const currentNFLWeek = getCurrentNFLWeek()
  const { gamesByDate, sortedDates, data, isLoading, error } = useGamesByDate(currentNFLWeek.week)
  
  if (isLoading) {
    return <div className="p-6">Loading games...</div>
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>
  }
  
  const games = data?.games || []
  
  return (
    <ContentWrapper>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Venue Test Page</h1>
          <p className="text-white/70">Testing venue information display in GameCards</p>
        </div>
        
        {/* Raw data debug */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Raw Data Debug</h2>
          <div className="text-sm text-white/70">
            <p>Games found: {games.length}</p>
            <p>Data source: {data?.source}</p>
          </div>
          <pre className="mt-2 text-xs text-green-400 bg-black/30 p-2 rounded overflow-x-auto">
            {JSON.stringify(games.slice(0, 2), null, 2)}
          </pre>
        </div>
        
        {/* GameCard display */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">GameCards with Venue Information</h2>
          {games.slice(0, 6).map(game => (
            <div key={game.id} className="border border-white/20 p-2 rounded">
              <div className="text-sm text-white/60 mb-2">
                Game {game.id} - Venue: {game.venue || 'NO VENUE'} - venue_name: {game.venue_name || 'NO VENUE_NAME'}
              </div>
              <GameCard
                game={game}
                showPicks={false}
                compact={false}
              />
            </div>
          ))}
        </div>
      </div>
    </ContentWrapper>
  )
}

export const Route = createFileRoute('/_authenticated/test-venues')({
  component: TestVenuesPage,
})