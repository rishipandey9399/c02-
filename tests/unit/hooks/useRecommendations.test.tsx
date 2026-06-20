import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRecommendations } from '@/hooks/useRecommendations'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderToString } from 'react-dom/server'
import React from 'react'

// Mock firebase client to prevent actual initialization and sandbox block
vi.mock('@/lib/firebase/client', () => ({
  auth: {
    currentUser: null,
  },
  googleProvider: {},
}))

// Mock useAuth
const mockGetToken = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}))
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}))

// Simple custom hook runner using react-dom/server to avoid @testing-library/react & JSDOM sandbox block
function renderRecommendationsHook(queryClient: QueryClient) {
  const result = { current: null as unknown as ReturnType<typeof useRecommendations> }

  function TestComponent() {
    result.current = useRecommendations()
    return null
  }

  renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(TestComponent)
    )
  )

  return result
}

describe('useRecommendations Hook', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.restoreAllMocks()
  })

  it('successfully calls API and returns recommendations', async () => {
    mockGetToken.mockResolvedValue('mock-jwt-token')

    const mockResponse = {
      recommendations: [
        {
          title: 'Switch to public transit',
          detail: 'Test detail',
          saving: '1.2t',
          difficulty: 'Medium',
          category: 'transport',
          timeframe: 'Immediate',
        },
      ],
      footprint: { total: 10 },
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
    vi.stubGlobal('fetch', fetchMock)

    const hookResult = renderRecommendationsHook(queryClient)

    const mutationPromise = hookResult.current.mutateAsync({
      transport: 'car-alone',
      diet: 'mixed',
      energy: 'mixed',
      flights: 'occasional',
    })

    await expect(mutationPromise).resolves.toEqual(mockResponse)

    expect(mockGetToken).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-jwt-token',
      },
      body: JSON.stringify({
        transport: 'car-alone',
        diet: 'mixed',
        energy: 'mixed',
        flights: 'occasional',
      }),
    })
  })

  it('throws error if auth token is missing', async () => {
    mockGetToken.mockResolvedValue(null)

    const hookResult = renderRecommendationsHook(queryClient)

    const mutationPromise = hookResult.current.mutateAsync({
      transport: 'car-alone',
      diet: 'mixed',
      energy: 'mixed',
      flights: 'occasional',
    })

    await expect(mutationPromise).rejects.toThrow('Authentication required')
  })

  it('throws error if API call fails', async () => {
    mockGetToken.mockResolvedValue('mock-jwt-token')

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Invalid answers' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const hookResult = renderRecommendationsHook(queryClient)

    const mutationPromise = hookResult.current.mutateAsync({
      transport: 'car-alone',
      diet: 'mixed',
      energy: 'mixed',
      flights: 'occasional',
    })

    await expect(mutationPromise).rejects.toThrow('Invalid answers')
  })
})
