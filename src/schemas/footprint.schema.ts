import { z } from 'zod'

export const footprintInputSchema = z.object({
  transport: z.enum(['car-alone', 'carpool', 'public', 'cycling'], {
    required_error: 'Transportation choice is required',
  }),
  diet: z.enum(['heavy-meat', 'moderate-meat', 'mixed', 'vegetarian', 'vegan'], {
    required_error: 'Diet choice is required',
  }),
  energy: z.enum(['gas-fossil', 'mixed', 'electric-grid', 'renewable'], {
    required_error: 'Home energy choice is required',
  }),
  flights: z.enum(['none', 'occasional', 'frequent', 'very-frequent'], {
    required_error: 'Air travel choice is required',
  }),
  country: z.enum(['US', 'EU', 'IN', 'Global']).optional(),
})

export type FootprintInput = z.infer<typeof footprintInputSchema>

/** Schema for validating data read back from Firestore footprint records. */
export const footprintResultDbSchema = z.object({
  transport: z.number(),
  diet: z.number(),
  energy: z.number(),
  flights: z.number(),
  goods: z.number(),
  total: z.number(),
  createdAt: z.string().optional(),
  uid: z.string().optional(),
})
