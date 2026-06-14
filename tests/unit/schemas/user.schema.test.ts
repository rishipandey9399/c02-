import { describe, it, expect } from 'vitest'
import { userUpdateSchema } from '@/schemas/user.schema'

describe('userUpdateSchema Validation', () => {
  it('passes with valid displayName and photoURL', () => {
    const result = userUpdateSchema.safeParse({
      displayName: 'John Doe',
      photoURL: 'https://example.com/avatar.png',
    })
    expect(result.success).toBe(true)
  })

  it('passes with partial values', () => {
    const result1 = userUpdateSchema.safeParse({ displayName: 'Alice' })
    expect(result1.success).toBe(true)

    const result2 = userUpdateSchema.safeParse({ photoURL: 'https://example.com/avatar.jpg' })
    expect(result2.success).toBe(true)
  })

  it('rejects empty displayName', () => {
    const result = userUpdateSchema.safeParse({ displayName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects displayName exceeding 50 characters', () => {
    const result = userUpdateSchema.safeParse({ displayName: 'a'.repeat(51) })
    expect(result.success).toBe(false)
  })

  it('rejects displayName with invalid characters', () => {
    const result = userUpdateSchema.safeParse({ displayName: 'John<script>' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid photoURL structure', () => {
    const result = userUpdateSchema.safeParse({ photoURL: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('rejects photoURL with unsafe protocol', () => {
    const result = userUpdateSchema.safeParse({ photoURL: 'javascript:alert(1)' })
    expect(result.success).toBe(false)
  })
})
