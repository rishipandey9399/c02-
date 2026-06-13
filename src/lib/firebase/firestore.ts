import 'server-only'
import { adminDb } from './admin'
import type { FootprintResult } from '@/types/carbon'
import type { UserGoal, UserProfile } from '@/types/user'

export async function saveFootprintRecord(uid: string, data: FootprintResult): Promise<string> {
  const ref = adminDb
    .collection('footprints')
    .doc(uid)
    .collection('records')
    .doc()

  const record = {
    ...data,
    id: ref.id,
    createdAt: new Date().toISOString(),
    uid,
  }

  await ref.set(record)
  return ref.id
}

export async function getFootprintHistory(uid: string, limit = 12): Promise<FootprintResult[]> {
  const snapshot = await adminDb
    .collection('footprints')
    .doc(uid)
    .collection('records')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map((doc) => doc.data() as FootprintResult)
}

export async function getUserGoals(uid: string): Promise<UserGoal[]> {
  const snapshot = await adminDb
    .collection('goals')
    .doc(uid)
    .collection('items')
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const goal: UserGoal = {
      id: doc.id,
      uid,
      title: data.title as string,
      category: data.category as 'transport' | 'diet' | 'energy' | 'flights' | 'goods',
      difficulty: data.difficulty as 'Easy' | 'Medium' | 'Committed',
      saving: data.saving as number,
      targetDate: data.targetDate as string,
      completed: data.completed as boolean,
      createdAt: data.createdAt as string,
    }
    if (data.completedAt !== undefined && data.completedAt !== null) {
      goal.completedAt = data.completedAt as string
    }
    return goal
  })
}

export async function createUserGoal(
  uid: string,
  goal: Omit<UserGoal, 'id' | 'uid' | 'createdAt' | 'completed'>
): Promise<string> {
  const ref = adminDb
    .collection('goals')
    .doc(uid)
    .collection('items')
    .doc()

  const record: UserGoal = {
    ...goal,
    id: ref.id,
    uid,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  await ref.set(record)
  return ref.id
}

export async function updateUserGoal(
  uid: string,
  goalId: string,
  updates: Partial<Omit<UserGoal, 'id' | 'uid' | 'createdAt'>>
): Promise<void> {
  const ref = adminDb
    .collection('goals')
    .doc(uid)
    .collection('items')
    .doc(goalId)

  const doc = await ref.get()
  if (!doc.exists) {
    throw new Error('Goal not found')
  }

  const dataToUpdate: Record<string, unknown> = { ...updates }
  if (updates.completed !== undefined) {
    dataToUpdate.completedAt = updates.completed ? new Date().toISOString() : null
  }

  await ref.update(dataToUpdate)
}

export async function deleteUserGoal(uid: string, goalId: string): Promise<void> {
  const ref = adminDb
    .collection('goals')
    .doc(uid)
    .collection('items')
    .doc(goalId)

  const doc = await ref.get()
  if (!doc.exists) {
    throw new Error('Goal not found')
  }

  await ref.delete()
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const doc = await adminDb.collection('users').doc(uid).get()
  if (!doc.exists) return null
  const data = doc.data()!
  const profile: UserProfile = {
    uid,
    email: data.email as string,
    createdAt: data.createdAt as string,
    updatedAt: data.updatedAt as string,
  }
  if (data.displayName !== undefined && data.displayName !== null) {
    profile.displayName = data.displayName as string
  }
  if (data.photoURL !== undefined && data.photoURL !== null) {
    profile.photoURL = data.photoURL as string
  }
  return profile
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>,
  emailFallback?: string
): Promise<void> {
  const ref = adminDb.collection('users').doc(uid)
  const doc = await ref.get()

  if (!doc.exists) {
    const now = new Date().toISOString()
    const newProfile: UserProfile = {
      uid,
      email: emailFallback || '',
      createdAt: now,
      updatedAt: now,
    }
    if (updates.displayName !== undefined) {
      newProfile.displayName = updates.displayName
    }
    if (updates.photoURL !== undefined) {
      newProfile.photoURL = updates.photoURL
    }
    await ref.set(newProfile)
  } else {
    const dataToUpdate = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    await ref.update(dataToUpdate)
  }
}
