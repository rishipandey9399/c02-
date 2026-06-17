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
      displayName: 'Mock User',
      photoURL: 'https://example.com/avatar.png',
    }),
  }),
  firestore: vi.fn().mockReturnValue({
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    set: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
  }),
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
}))

let mockDbUser = {
  uid: 'mock-user-uid',
  email: 'mock@example.com',
  displayName: 'Mock User',
  photoURL: 'https://example.com/avatar.png',
  createdAt: '2026-06-09T00:00:00.000Z',
  updatedAt: '2026-06-09T00:00:00.000Z',
}

vi.mock('@/lib/firebase/firestore', () => ({
  getUserProfile: vi.fn().mockImplementation((uid) => {
    if (uid === 'mock-user-uid') {
      return Promise.resolve(mockDbUser)
    }
    return Promise.resolve(null)
  }),
  updateUserProfile: vi.fn().mockImplementation((uid, updates, email) => {
    if (uid === 'mock-user-uid') {
      mockDbUser = { ...mockDbUser, ...updates, updatedAt: new Date().toISOString() }
      if (email) mockDbUser.email = email
    }
    return Promise.resolve()
  }),
}))

import { GET, PATCH } from '@/app/api/user/route'
import { NextRequest } from 'next/server'

describe('User Profile API Endpoints', () => {
  describe('GET /api/user', () => {
    it('retrieves user profile for an authorized request', async () => {
      const req = new NextRequest('http://localhost:3000/api/user', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-valid-token',
        },
      })

      const response = await GET(req)
      expect(response.status).toBe(200)

      const data = (await response.json()) as {
        uid: string
        displayName: string
        email: string
      }

      expect(data.uid).toBe('mock-user-uid')
      expect(data.displayName).toBe('Mock User')
      expect(data.email).toBe('mock@example.com')
    })

    it('returns 401 for unauthorized requests', async () => {
      const req = new NextRequest('http://localhost:3000/api/user', {
        method: 'GET',
      })

      const response = await GET(req)
      expect(response.status).toBe(401)
    })
  })

  describe('PATCH /api/user', () => {
    it('updates profile and returns 200 for valid authorized requests', async () => {
      const req = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: 'Jane Doe',
          photoURL: 'https://example.com/new-avatar.png',
        }),
      })

      const response = await PATCH(req)
      expect(response.status).toBe(200)

      const data = (await response.json()) as {
        uid: string
        displayName: string
        photoURL: string
      }
      expect(data.displayName).toBe('Jane Doe')
      expect(data.photoURL).toBe('https://example.com/new-avatar.png')
    })

    it('returns 400 for invalid request body input', async () => {
      const req = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: 'John<script>',
          photoURL: 'javascript:bad-scheme',
        }),
      })

      const response = await PATCH(req)
      expect(response.status).toBe(400)

      const data = (await response.json()) as { error: string; issues: Record<string, string[]> }
      expect(data.error).toBe('Invalid input')
      expect(data.issues.displayName).toBeDefined()
      expect(data.issues.photoURL).toBeDefined()
    })

    it('returns 401 for unauthorized updates', async () => {
      const req = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: 'Jane Doe',
        }),
      })

      const response = await PATCH(req)
      expect(response.status).toBe(401)
    })
  })
})
