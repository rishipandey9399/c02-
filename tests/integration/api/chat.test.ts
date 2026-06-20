import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/ai/chat/route'
import { NextRequest } from 'next/server'

vi.mock('@/lib/gemini/client', () => ({
  getGeminiModel: vi.fn().mockReturnValue({
    startChat: vi.fn().mockReturnValue({
      sendMessageStream: vi.fn().mockResolvedValue({
        stream: [
          { text: () => 'Hello' },
          { text: () => ' world' },
          { text: () => '!' },
        ],
      }),
    }),
  }),
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
}))

describe('POST /api/ai/chat', () => {
  it('returns a readable event-stream for valid authenticated requests', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mock-valid-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'How can I reduce my transportation emissions?',
        footprintContext: {
          transport: 4.6,
          diet: 2.8,
          energy: 3.8,
          flights: 2.8,
          goods: 2.0,
          total: 16.0,
        },
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/event-stream')

    const reader = response.body?.getReader()
    expect(reader).toBeDefined()

    const decoder = new TextDecoder()
    let text = ''
    while (true) {
      const { done, value } = await reader!.read()
      if (done) break
      text += decoder.decode(value)
    }

    expect(text).toContain('data: {"text":"Hello"}')
    expect(text).toContain('data: {"text":" world"}')
    expect(text).toContain('data: {"text":"!"}')
    expect(text).toContain('data: [DONE]')
  })

  it('returns 401 for unauthenticated requests', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello',
        footprintContext: {
          transport: 1,
          diet: 1,
          energy: 1,
          flights: 1,
          goods: 1,
          total: 5,
        },
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(401)
  })

  it('returns 400 for bad schema payload requests', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mock-valid-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '', // invalid: min length 1
        footprintContext: {
          transport: 1,
        },
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(400)
  })
})
