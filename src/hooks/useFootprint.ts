import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import type { CalculateRequest, CalculateResponse } from '@/types/api'
import type { FootprintResult } from '@/types/carbon'

export function useCalculateFootprint() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<CalculateResponse, Error, CalculateRequest>({
    mutationFn: async (answers) => {
      const token = await getToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/footprint/calculate', {
        method: 'POST',
        headers,
        body: JSON.stringify(answers),
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error || `Failed to save calculation: ${response.status}`)
      }

      return response.json() as Promise<CalculateResponse>
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['footprintHistory'] })
    },
  })
}

export function useFootprintHistory() {
  const { user, getToken } = useAuth()

  return useQuery<FootprintResult[], Error>({
    queryKey: ['footprintHistory', user?.uid],
    queryFn: async () => {
      const token = await getToken()
      if (!token) return []

      const response = await fetch('/api/footprint/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error || `Failed to fetch history: ${response.status}`)
      }

      return response.json() as Promise<FootprintResult[]>
    },
    enabled: !!user,
  })
}
