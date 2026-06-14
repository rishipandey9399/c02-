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

export async function checkRateLimit(identifier: string) {
  if (!ratelimit) {
    // Gracefully bypass if Upstash is not configured (e.g. locally or in testing)
    return
  }

  const { success, limit: limitVal, remaining, reset } = await ratelimit.limit(identifier)

  if (!success) {
    throw new Response(
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
}
