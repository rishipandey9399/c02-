import { describe, it, expect, vi } from 'vitest'

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

vi.mock('@/lib/firebase/firestore', () => ({
  saveFootprintRecord: vi.fn().mockResolvedValue('mock-record-id'),
  getFootprintHistory: vi.fn().mockResolvedValue([
    {
      transport: 4.6,
      diet: 2.8,
      energy: 3.8,
      flights: 2.8,
      goods: 2.0,
      total: 16.0,
      createdAt: '2026-06-09T00:00:00.000Z',
    },
  ]),
}))

import { POST } from '@/app/api/footprint/calculate/route'
import { GET } from '@/app/api/footprint/history/route'
import { NextRequest } from 'next/server'

describe('Footprint API Endpoints', () => {
  describe('POST /api/footprint/calculate', () => {
    it('calculates, saves, and returns the result for an authorized request', async () => {
      const req = new NextRequest('http://localhost:3000/api/footprint/calculate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transport: 'car-alone',
          diet: 'moderate-meat',
          energy: 'gas-fossil',
          flights: 'frequent',
          country: 'US',
        }),
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      const data = (await response.json()) as {
        id: string
        result: {
          total: number
          goods: number
        }
      }

      expect(data.id).toBe('mock-record-id')
      expect(data.result.total).toBe(16.0)
      expect(data.result.goods).toBe(2.0)
    })

    it('returns 401 for unauthorized calculation requests', async () => {
      const req = new NextRequest('http://localhost:3000/api/footprint/calculate', {
        method: 'POST',
        headers: {
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
      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/footprint/history', () => {
    it('returns past history for authorized user', async () => {
      const req = new NextRequest('http://localhost:3000/api/footprint/history', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
        },
      })

      const response = await GET(req)
      expect(response.status).toBe(200)

      const data = (await response.json()) as Array<{
        total: number
      }>

      expect(data).toHaveLength(1)
      expect(data[0]?.total).toBe(16.0)
    })

    it('returns 401 for unauthorized history retrieval', async () => {
      const req = new NextRequest('http://localhost:3000/api/footprint/history', {
        method: 'GET',
      })

      const response = await GET(req)
      expect(response.status).toBe(401)
    })
  })
})
