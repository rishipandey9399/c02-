import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthError } from '@/lib/auth/session'
import { calculateFootprint } from '@/lib/carbon/calculator'
import { saveFootprintRecord } from '@/lib/firebase/firestore'
import { footprintInputSchema } from '@/schemas/footprint.schema'

export async function POST(request: NextRequest) {
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

  const parsed = footprintInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  try {
    const result = calculateFootprint(parsed.data, parsed.data.country)
    const recordId = await saveFootprintRecord(uid, result)
    return NextResponse.json({ id: recordId, result }, { status: 200 })
  } catch (error) {
    console.error('Error processing footprint calculation:', error)
    return NextResponse.json({ error: 'Failed to calculate footprint' }, { status: 500 })
  }
}
