import { z } from 'zod'

export const userUpdateSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name cannot be empty')
    .max(50, 'Display name cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s.\-_]+$/, 'Display name contains invalid characters')
    .optional(),
  photoURL: z
    .string()
    .url('Invalid photo URL')
    .max(255, 'Photo URL cannot exceed 255 characters')
    .refine((url) => {
      if (!url) return true
      return url.startsWith('http://') || url.startsWith('https://')
    }, 'URL must use HTTP or HTTPS protocol')
    .optional(),
})

/** Schema for validating UserProfile data read back from Firestore. */
export const userProfileDbSchema = z.object({
  uid: z.string(),
  email: z.string(),
  displayName: z.string().optional().nullable(),
  photoURL: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

