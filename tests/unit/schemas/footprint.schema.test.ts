import { describe, it, expect } from 'vitest'
import { footprintInputSchema } from '@/schemas/footprint.schema'

describe('footprintInputSchema', () => {
  it('accepts a valid complete input', () => {
    const result = footprintInputSchema.safeParse({
      transport: 'car-alone',
      diet: 'moderate-meat',
      energy: 'mixed',
      flights: 'occasional',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = footprintInputSchema.safeParse({ transport: 'car-alone' })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors).toHaveProperty('diet')
  })

  it('rejects invalid enum values', () => {
    const result = footprintInputSchema.safeParse({
      transport: 'submarine',
      diet: 'moderate-meat',
      energy: 'mixed',
      flights: 'occasional',
    })
    expect(result.success).toBe(false)
  })
})
