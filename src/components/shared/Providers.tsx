'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Set reasonable defaults
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false, // typical preference for carbon tracker dashboards
          },
        },
      })
  )

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

