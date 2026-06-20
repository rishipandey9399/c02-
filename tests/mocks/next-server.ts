export class NextRequest extends Request {
  constructor(input: URL | RequestInfo, init?: RequestInit) {
    super(input, init)
  }
}

export const NextResponse = {
  json: (body: any, init?: ResponseInit) => {
    const headers = new Headers(init?.headers)
    headers.set('content-type', 'application/json')
    return new Response(JSON.stringify(body), {
      ...init,
      headers,
    })
  }
}
