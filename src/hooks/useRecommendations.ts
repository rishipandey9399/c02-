import { useMutation } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import type { RecommendationsRequest, RecommendationsResponse } from '@/types/api'

export function useRecommendations() {
  const { getToken } = useAuth()

  return useMutation<RecommendationsResponse, Error, RecommendationsRequest>({
    mutationFn: async (answers) => {
      const token = await getToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      // Use real token or default fallback for public calculator results preview
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      } else {
        headers['Authorization'] = `Bearer mock-valid-token`
      }

      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers,
        body: JSON.stringify(answers),
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error || `Failed to get AI recommendations: ${response.status}`)
      }

      return response.json() as Promise<RecommendationsResponse>
    },
  })
}
