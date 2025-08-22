import { useQueryClient } from '@tanstack/react-query'
import { nflQueryKeys } from '../hooks/useNflData'

export function CacheClearButton() {
  const queryClient = useQueryClient()

  const clearCache = async () => {
    // Clear TanStack Query cache
    await queryClient.clear()
    
    // Clear IndexedDB
    if ('indexedDB' in window) {
      const databases = await indexedDB.databases()
      databases.forEach(db => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name)
        }
      })
    }
    
    // Reload page
    window.location.reload()
  }

  return (
    <button
      onClick={clearCache}
      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-colors text-sm"
    >
      Clear Cache & Reload
    </button>
  )
}