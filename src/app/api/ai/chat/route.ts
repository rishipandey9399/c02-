import { type NextRequest } from 'next/server'
import { requireAuth, AuthError } from '@/lib/auth/session'
import { getGeminiModel } from '@/lib/gemini/client'
import { buildChatSystemPrompt } from '@/lib/gemini/prompts'
import { sanitiseForPrompt } from '@/lib/gemini/safety'
import { checkRateLimit } from '@/lib/rate-limit'
import { chatInputSchema } from '@/schemas/gemini.schema'

export async function POST(request: NextRequest) {
  let uid: string
  try {
    uid = await requireAuth(request)
  } catch (error) {
    if (error instanceof AuthError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const ip = request.headers.get('x-forwarded-for') || undefined
  const limitCheck = await checkRateLimit(`ai-chat:${uid}`, ip)
  if (!limitCheck.success && limitCheck.response) {
    return limitCheck.response
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const parsed = chatInputSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid input', issues: parsed.error.flatten().fieldErrors }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const { message, footprintContext } = parsed.data
  const sanitisedMessage = sanitiseForPrompt(message)
  const model = getGeminiModel('gemini-2.0-flash')

  try {
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: buildChatSystemPrompt(footprintContext) }],
        },
      ],
    })

    const result = await chat.sendMessageStream(sanitisedMessage)

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (err) {
          console.error('Streaming chunk error:', err)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Streaming error occurred' })}\n\n`
            )
          )
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Gemini chat error:', error)
    return new Response(
      JSON.stringify({ error: 'AI service temporarily unavailable' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
