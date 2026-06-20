import { describe, it, expect } from 'vitest'
import { goalCreateSchema, goalUpdateSchema, goalDbSchema } from '@/schemas/goal.schema'

describe('goalCreateSchema Validation', () => {
  it('passes with valid create data', () => {
    const result = goalCreateSchema.safeParse({
      title: 'Eat less beef',
      category: 'diet',
      difficulty: 'Easy',
      saving: 1.2,
      targetDate: '2026-12-31T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short titles', () => {
    const result = goalCreateSchema.safeParse({
      title: 'No',
      category: 'diet',
      difficulty: 'Easy',
      saving: 1.2,
      targetDate: '2026-12-31T00:00:00.000Z',
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative saving values', () => {
    const result = goalCreateSchema.safeParse({
      title: 'Eat less beef',
      category: 'diet',
      difficulty: 'Easy',
      saving: -1.2,
      targetDate: '2026-12-31T00:00:00.000Z',
    })
    expect(result.success).toBe(false)
  })
})

describe('goalDbSchema Validation', () => {
  it('passes with valid DB goal document data', () => {
    const result = goalDbSchema.safeParse({
      title: 'Eat less beef',
      category: 'diet',
      difficulty: 'Easy',
      saving: 1.2,
      targetDate: '2026-12-31T00:00:00.000Z',
      completed: false,
      createdAt: '2026-06-20T10:00:00.000Z',
      completedAt: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects goal when missing completed or createdAt fields', () => {
    const result = goalDbSchema.safeParse({
      title: 'Eat less beef',
      category: 'diet',
      difficulty: 'Easy',
      saving: 1.2,
      targetDate: '2026-12-31T00:00:00.000Z',
    })
    expect(result.success).toBe(false)
  })
})

describe('goalUpdateSchema Validation', () => {
  it('passes with partial data', () => {
    const result = goalUpdateSchema.safeParse({
      completed: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid title type', () => {
    const result = goalUpdateSchema.safeParse({
      title: 123,
    })
    expect(result.success).toBe(false)
  })
})

