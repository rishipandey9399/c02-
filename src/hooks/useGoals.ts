import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import type { GoalCreateRequest, GoalUpdateRequest, GoalsListResponse } from '@/types/api'

export function useGoalsList() {
  const { user, getToken } = useAuth()

  return useQuery<GoalsListResponse, Error>({
    queryKey: ['goalsList', user?.uid],
    queryFn: async () => {
      const token = await getToken()
      if (!token) return []

      const response = await fetch('/api/goals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error || `Failed to fetch goals: ${response.status}`)
      }

      return response.json() as Promise<GoalsListResponse>
    },
    enabled: !!user,
  })
}

export function useCreateGoal() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<{ id: string; message: string }, Error, GoalCreateRequest>({
    mutationFn: async (goal) => {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goal),
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error || `Failed to create goal: ${response.status}`)
      }

      return response.json() as Promise<{ id: string; message: string }>
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['goalsList'] })
    },
  })
}

export function useUpdateGoal() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<
    { message: string },
    Error,
    { goalId: string; updates: GoalUpdateRequest }
  >({
    mutationFn: async ({ goalId, updates }) => {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error || `Failed to update goal: ${response.status}`)
      }

      return response.json() as Promise<{ message: string }>
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['goalsList'] })
    },
  })
}

export function useDeleteGoal() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (goalId) => {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errData.error || `Failed to delete goal: ${response.status}`)
      }

      return response.json() as Promise<{ message: string }>
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['goalsList'] })
    },
  })
}
