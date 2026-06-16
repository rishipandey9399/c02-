import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthError } from '@/lib/auth/session'
import { calculateFootprint } from '@/lib/carbon/calculator'
import { getGeminiModel } from '@/lib/gemini/client'
import { buildRecommendationPrompt } from '@/lib/gemini/prompts'
import { checkRateLimit } from '@/lib/rate-limit'
import { footprintInputSchema } from '@/schemas/footprint.schema'
import { recommendationResponseSchema } from '@/schemas/gemini.schema'

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

  const ip = request.headers.get('x-forwarded-for') || undefined
  const limitCheck = await checkRateLimit(`ai-recommendations:${uid}`, ip)
  if (!limitCheck.success && limitCheck.response) {
    return limitCheck.response
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

  const footprintResult = calculateFootprint(parsed.data, parsed.data.country)
  const prompt = buildRecommendationPrompt(parsed.data, footprintResult)
  const model = getGeminiModel('gemini-2.0-flash')

  try {
    const response = await model.generateContent(prompt)
    const text = response.response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch?.[0]) {
      throw new Error('No valid JSON in Gemini response')
    }

    const geminiParsed = recommendationResponseSchema.safeParse(JSON.parse(jsonMatch[0]))
    if (!geminiParsed.success) {
      throw new Error('Gemini response did not match expected schema')
    }

    return NextResponse.json({
      recommendations: geminiParsed.data.recommendations,
      footprint: footprintResult,
    })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 503 }
    )
  }
}
