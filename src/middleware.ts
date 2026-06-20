import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const path = request.nextUrl.pathname

  // Auth Protection Check
  const token = request.cookies.get('session')?.value
  const protectedPaths = ['/dashboard', '/chat', '/goals', '/history', '/settings']
  const isProtected = protectedPaths.some((p) => path === p || path.startsWith(p + '/'))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users from auth pages to dashboard
  const authPaths = ['/login', '/register']
  const isAuthPath = authPaths.some((p) => path === p)

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Generate CSP
  const isDev = process.env.NODE_ENV === 'development'
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com`
    : `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://apis.google.com`

  const cspHeader = `
    default-src 'self';
    ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://storage.googleapis.com https://lh3.googleusercontent.com;
    connect-src 'self' https://*.firestore.googleapis.com https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com;
    font-src 'self';
    frame-src 'none';
  `.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-action' },
      ],
    },
  ],
}
