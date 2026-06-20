import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Rate Limiter Unit Tests', () => {
  beforeEach(() => {
    vi.resetModules()
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  it('gracefully bypasses if Upstash Redis credentials are not configured', async () => {
    const { checkRateLimit } = await import('@/lib/rate-limit')
    const result = await checkRateLimit('user-123')
    expect(result.success).toBe(true)
  })

  it('calls limit with user identifier when credentials are configured', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'mock-url'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-token'

    const { Ratelimit } = await import('@upstash/ratelimit')
    const limitSpy = vi.spyOn(Ratelimit.prototype, 'limit')
    limitSpy.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    } as any)

    const { checkRateLimit } = await import('@/lib/rate-limit')
    const result = await checkRateLimit('user-123', '127.0.0.1')

    expect(limitSpy).toHaveBeenCalledWith('user-123')
    expect(result.success).toBe(true)
  })

  it('falls back to rate limit by IP address if user identifier is missing', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'mock-url'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-token'

    const { Ratelimit } = await import('@upstash/ratelimit')
    const limitSpy = vi.spyOn(Ratelimit.prototype, 'limit')
    limitSpy.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    } as any)

    const { checkRateLimit } = await import('@/lib/rate-limit')
    const result = await checkRateLimit('', '192.168.1.1')

    expect(limitSpy).toHaveBeenCalledWith('ip:192.168.1.1')
    expect(result.success).toBe(true)
  })

  it('returns false and a custom 429 Response when rate limit is exceeded', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'mock-url'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-token'

    const { Ratelimit } = await import('@upstash/ratelimit')
    const limitSpy = vi.spyOn(Ratelimit.prototype, 'limit')
    const resetTime = Date.now() + 60000
    limitSpy.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: resetTime,
    } as any)

    const { checkRateLimit } = await import('@/lib/rate-limit')
    const result = await checkRateLimit('user-123')

    expect(result.success).toBe(false)
    expect(result.response).toBeDefined()
    expect(result.response!.status).toBe(429)

    const body = await result.response!.json()
    expect(body.error).toBe('Rate limit exceeded')
    expect(body.code).toBe('RATE_LIMIT_EXCEEDED')
    expect(body.reset).toBe(resetTime)
  })
})
