import 'server-only'
import { type NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function requireAuth(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError(401, 'Unauthorized: Missing Authorization header')
  }

  const token = authHeader.split('Bearer ')[1]
  if (!token) {
    throw new AuthError(401, 'Unauthorized: Missing token')
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token, true) // checkRevoked = true
    return decoded.uid
  } catch (error) {
    throw new AuthError(401, 'Unauthorized: Invalid token')
  }
}
