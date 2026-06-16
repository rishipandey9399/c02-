import { z } from 'zod'

export const recommendationResponseSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      saving: z.string(),
      difficulty: z.enum(['Easy', 'Medium', 'Committed']),
      category: z.enum(['transport', 'diet', 'energy', 'flights', 'goods']),
      timeframe: z.string(),
    })
  ),
})

export const chatInputSchema = z.object({
  message: z.string().min(1).max(2000),
  footprintContext: z.object({
    transport: z.number(),
    diet: z.number(),
    energy: z.number(),
    flights: z.number(),
    goods: z.number(),
    total: z.number(),
  }),
})
