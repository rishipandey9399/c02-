import { describe, it, expect, vi, beforeEach } from 'vitest'

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

interface GoalMockType {
  id: string
  title: string
  category: 'transport' | 'diet' | 'energy' | 'flights' | 'goods'
  difficulty: 'Easy' | 'Medium' | 'Committed'
  saving: number
  targetDate: string
  completed: boolean
  createdAt: string
}

let mockGoals: GoalMockType[] = [
  {
    id: 'goal-1',
    title: 'Test Goal 1',
    category: 'transport',
    difficulty: 'Medium',
    saving: 2.5,
    targetDate: '2026-12-31T00:00:00.000Z',
    completed: false,
    createdAt: '2026-06-20T00:00:00.000Z',
  },
]

vi.mock('@/lib/firebase/firestore', () => ({
  getUserGoals: vi.fn().mockImplementation((uid) => {
    if (uid === 'mock-user-uid') {
      return Promise.resolve(mockGoals)
    }
    return Promise.resolve([])
  }),
  createUserGoal: vi.fn().mockImplementation((uid, goalData: Omit<GoalMockType, 'id' | 'completed' | 'createdAt'>) => {
    if (uid === 'mock-user-uid') {
      const newGoal: GoalMockType = {
        id: `goal-${Date.now()}`,
        ...goalData,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      mockGoals.push(newGoal)
      return Promise.resolve(newGoal.id)
    }
    return Promise.reject(new Error('Unauthorized'))
  }),
  updateUserGoal: vi.fn().mockImplementation((uid, goalId, updates: Partial<GoalMockType>) => {
    if (uid === 'mock-user-uid') {
      const goal = mockGoals.find((g) => g.id === goalId)
      if (!goal) {
        return Promise.reject(new Error('Goal not found'))
      }
      Object.assign(goal, updates)
      return Promise.resolve()
    }
    return Promise.reject(new Error('Unauthorized'))
  }),
  deleteUserGoal: vi.fn().mockImplementation((uid, goalId) => {
    if (uid === 'mock-user-uid') {
      const index = mockGoals.findIndex((g) => g.id === goalId)
      if (index === -1) {
        return Promise.reject(new Error('Goal not found'))
      }
      mockGoals.splice(index, 1)
      return Promise.resolve()
    }
    return Promise.reject(new Error('Unauthorized'))
  }),
}))

import { GET as getGoals, POST as createGoal } from '@/app/api/goals/route'
import { PATCH as updateGoal, DELETE as deleteGoal } from '@/app/api/goals/[id]/route'
import { NextRequest } from 'next/server'

describe('Goals API Endpoints', () => {
  beforeEach(() => {
    mockGoals = [
      {
        id: 'goal-1',
        title: 'Test Goal 1',
        category: 'transport',
        difficulty: 'Medium',
        saving: 2.5,
        targetDate: '2026-12-31T00:00:00.000Z',
        completed: false,
        createdAt: '2026-06-20T00:00:00.000Z',
      },
    ]
  })

  describe('GET /api/goals', () => {
    it('retrieves user goals for an authorized request', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-valid-token',
        },
      })

      const response = await getGoals(req)
      expect(response.status).toBe(200)

      const data = (await response.json()) as typeof mockGoals
      expect(data).toHaveLength(1)
      expect(data[0]?.title).toBe('Test Goal 1')
    })

    it('returns 401 for unauthorized request', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals', {
        method: 'GET',
      })

      const response = await getGoals(req)
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/goals', () => {
    it('creates a new goal for an authorized request with valid body', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Reduce plastic use',
          category: 'goods',
          difficulty: 'Easy',
          saving: 0.5,
          targetDate: '2026-08-31T00:00:00.000Z',
        }),
      })

      const response = await createGoal(req)
      expect(response.status).toBe(201)

      const data = (await response.json()) as { id: string; message: string }
      expect(data.id).toBeDefined()
      expect(mockGoals).toHaveLength(2)
      expect(mockGoals[1]?.title).toBe('Reduce plastic use')
    })

    it('returns 400 for invalid body validation', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'A', // too short
          category: 'invalid-category',
        }),
      })

      const response = await createGoal(req)
      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /api/goals/[id]', () => {
    it('updates a goal for an authorized request', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals/goal-1', {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: true,
        }),
      })

      const response = await updateGoal(req, { params: { id: 'goal-1' } })
      expect(response.status).toBe(200)
      expect(mockGoals[0]?.completed).toBe(true)
    })

    it('returns 404 for non-existent goal', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals/goal-nonexistent', {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: true,
        }),
      })

      const response = await updateGoal(req, { params: { id: 'goal-nonexistent' } })
      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /api/goals/[id]', () => {
    it('deletes a goal for an authorized request', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals/goal-1', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
        },
      })

      const response = await deleteGoal(req, { params: { id: 'goal-1' } })
      expect(response.status).toBe(200)
      expect(mockGoals).toHaveLength(0)
    })

    it('returns 404 for deleting a non-existent goal', async () => {
      const req = new NextRequest('http://localhost:3000/api/goals/goal-nonexistent', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
        },
      })

      const response = await deleteGoal(req, { params: { id: 'goal-nonexistent' } })
      expect(response.status).toBe(404)
    })
  })
})
