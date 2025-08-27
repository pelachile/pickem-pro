import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Amplify } from 'aws-amplify'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './components/auth'
import './App.css'
import App from './App.tsx'
import outputs from '../amplify_outputs.json'

// Configure AWS Amplify with backend resources
Amplify.configure(outputs)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
