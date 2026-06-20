import { useMutation } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import type { RecommendationsRequest, RecommendationsResponse } from '@/types/api'

export function useRecommendations() {
  const { getToken } = useAuth()

  return useMutation<RecommendationsResponse, Error, RecommendationsRequest>({
    mutationFn: async (answers) => {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answers),
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error ?? `Failed to get AI recommendations: ${response.status}`)
      }

      return response.json() as Promise<RecommendationsResponse>
    },
  })
}

