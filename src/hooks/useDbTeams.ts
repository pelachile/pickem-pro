import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { queryKeys } from '../lib/queryClient'

export interface DbTeam {
  id: number
  name: string
  abbreviation: string
  conference: string
  division: string
  logo_url?: string
  display_name?: string
  location?: string
  nickname?: string
  primary_color?: string
  secondary_color?: string
}

// Hook for teams data directly from database
export function useDbTeams() {
  return useQuery({
    queryKey: [...queryKeys.nfl.all, 'db-teams'],
    queryFn: async (): Promise<DbTeam[]> => {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          abbreviation,
          conference,
          division,
          logo_url,
          display_name,
          location,
          nickname,
          primary_color,
          secondary_color
        `)
        .order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      return data || []
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - team data doesn't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  })
}

// Helper hook for team lookup by ID
export function useDbTeamById(teamId: number) {
  const { data: teams } = useDbTeams()
  return teams?.find(team => team.id === teamId)
}