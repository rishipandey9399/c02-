import { z } from 'zod'

export const goalCreateSchema = z.object({
  title: z.string().min(3, 'Goal title must be at least 3 characters').max(100),
  category: z.enum(['transport', 'diet', 'energy', 'flights', 'goods']),
  difficulty: z.enum(['Easy', 'Medium', 'Committed']),
  saving: z.number().positive('Annual saving must be a positive number'),
  targetDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Target date must be a valid date string',
  }),
})

export const goalUpdateSchema = goalCreateSchema.partial().extend({
  completed: z.boolean().optional(),
})

export const goalDbSchema = goalCreateSchema.extend({
  completed: z.boolean(),
  createdAt: z.string(),
  completedAt: z.string().nullable().optional(),
})

