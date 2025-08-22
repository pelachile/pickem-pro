import { QueryClient } from '@tanstack/react-query'

// Create query client with minimal configuration to debug ENOTSUP error
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Minimal settings to avoid filesystem issues
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes  
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      // Use online mode instead of offlineFirst
      networkMode: 'online',
    },
  },
})

// TODO: Add IndexedDB persistence back once we resolve the ENOTSUP error