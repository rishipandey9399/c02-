import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthError } from '@/lib/auth/session'
import { adminAuth } from '@/lib/firebase/admin'
import { getUserProfile, updateUserProfile } from '@/lib/firebase/firestore'
import { userUpdateSchema } from '@/schemas/user.schema'
import type { UserProfile } from '@/types/user'

export async function GET(request: NextRequest) {
  let uid: string
  try {
    uid = await requireAuth(request)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }



  try {
    let profile = await getUserProfile(uid)
    if (!profile) {
      const firebaseUser = await adminAuth.getUser(uid)
      const updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>> = {}
      if (firebaseUser.displayName !== undefined) {
        updates.displayName = firebaseUser.displayName
      }
      if (firebaseUser.photoURL !== undefined) {
        updates.photoURL = firebaseUser.photoURL
      }
      await updateUserProfile(uid, updates, firebaseUser.email)
      profile = await getUserProfile(uid)
    }

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error('Error in user profile GET:', error)
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  let uid: string
  try {
    uid = await requireAuth(request)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 })
  }

  const parsed = userUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }



  const { displayName, photoURL } = parsed.data

  try {
    const firebaseUser = await adminAuth.getUser(uid)
    const updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>> = {}
    if (displayName !== undefined) {
      updates.displayName = displayName
    }
    if (photoURL !== undefined) {
      updates.photoURL = photoURL
    }
    await updateUserProfile(uid, updates, firebaseUser.email)
    const updatedProfile = await getUserProfile(uid)
    return NextResponse.json(updatedProfile, { status: 200 })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
  }
}
