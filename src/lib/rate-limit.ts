import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

if (url && token) {
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, '1 m'), // default 10 requests/minute per user
    analytics: true,
  })
}

export async function checkRateLimit(
  identifier?: string,
  ip?: string
): Promise<{ success: boolean; response?: Response }> {
  if (!ratelimit) {
    // Gracefully bypass if Upstash is not configured (e.g. locally or in testing)
    return { success: true }
  }

  // 1. Rate limit by user identifier if provided
  if (identifier) {
    const idResult = await ratelimit.limit(identifier)
    if (!idResult.success) {
      return { success: false, response: buildLimitResponse(idResult) }
    }
  }

  // 2. Rate limit by client IP address if provided
  if (ip) {
    const ipResult = await ratelimit.limit(`ip:${ip}`)
    if (!ipResult.success) {
      return { success: false, response: buildLimitResponse(ipResult) }
    }
  }

  return { success: true }
}

function buildLimitResponse(result: { limit: number; remaining: number; reset: number }): Response {
  const { limit: limitVal, remaining, reset } = result
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      reset,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        'X-RateLimit-Limit': String(limitVal),
        'X-RateLimit-Remaining': String(remaining),
      },
    }
  )
}
