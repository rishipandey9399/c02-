import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthError } from '@/lib/auth/session'
import { getFootprintHistory } from '@/lib/firebase/firestore'

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
    const history = await getFootprintHistory(uid)
    return NextResponse.json(history, { status: 200 })
  } catch (error) {
    console.error('Error fetching footprint history:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
