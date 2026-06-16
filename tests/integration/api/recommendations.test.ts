import { describe, it, expect, vi } from 'vitest'

vi.mock('next/server', () => {
  return {
    NextRequest: class extends Request {
      constructor(input: URL | RequestInfo, init?: RequestInit) {
        super(input, init)
      }
    },
    NextResponse: {
      json: (body: any, init?: ResponseInit) => {
        const headers = new Headers(init?.headers)
        headers.set('content-type', 'application/json')
        return new Response(JSON.stringify(body), {
          ...init,
          headers,
        })
      }
    }
  }
})

vi.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: vi.fn(),
  credential: {
    cert: vi.fn(),
  },
  auth: vi.fn().mockReturnValue({
    verifyIdToken: vi.fn().mockResolvedValue({ uid: 'mock-user-uid' }),
    getUser: vi.fn().mockResolvedValue({
      uid: 'mock-user-uid',
      email: 'mock@example.com',
    }),
  }),
  firestore: vi.fn().mockReturnValue({
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    set: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
  }),
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn(),
      startChat: vi.fn(),
    }),
  })),
}))

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
