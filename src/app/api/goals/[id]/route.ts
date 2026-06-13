import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthError } from '@/lib/auth/session'
import { updateUserGoal, deleteUserGoal } from '@/lib/firebase/firestore'
import { goalUpdateSchema } from '@/schemas/goal.schema'
import type { UserGoal } from '@/types/user'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  let uid: string
  try {
    uid = await requireAuth(request)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const goalId = params.id
  if (!goalId) {
    return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 })
  }

  const parsed = goalUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const updates = Object.fromEntries(
    Object.entries(parsed.data).filter(([_, v]) => v !== undefined)
  ) as Partial<Omit<UserGoal, 'id' | 'uid' | 'createdAt'>>

  try {
    await updateUserGoal(uid, goalId, updates)
    return NextResponse.json({ message: 'Goal updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error updating goal:', error)
    const err = error as Error
    if (err.message === 'Goal not found') {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  let uid: string
  try {
    uid = await requireAuth(request)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const goalId = params.id
  if (!goalId) {
    return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 })
  }

  try {
    await deleteUserGoal(uid, goalId)
    return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting goal:', error)
    const err = error as Error
    if (err.message === 'Goal not found') {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
