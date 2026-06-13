import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/ai/recommendations/route'
import { NextRequest } from 'next/server'

describe('POST /api/ai/recommendations', () => {
  it('returns structured recommendations for a valid authenticated profile', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mock-valid-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transport: 'car-alone',
        diet: 'heavy-meat',
        energy: 'gas-fossil',
        flights: 'frequent',
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(200)

    const data = (await response.json()) as {
      recommendations: Array<{
        title: string
        detail: string
        saving: string
        difficulty: string
        category: string
      }>
      footprint: {
        total: number
      }
    }

    expect(data.recommendations).toHaveLength(1)
    expect(data.recommendations[0]?.title).toBe('Switch to public transit')
    expect(data.footprint.total).toBeGreaterThan(0)
  })

  it('returns 401 without a valid auth token', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transport: 'car-alone',
        diet: 'vegan',
        energy: 'renewable',
        flights: 'none',
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(401)
  })

  it('returns 400 with missing inputs', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mock-valid-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transport: 'car-alone',
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(400)
  })
})
