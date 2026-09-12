import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/portal/auth'

// Protects the /portal UI and the /api/leads management endpoints behind the single-admin login.
// POST /api/leads (the public website quote-form submission) and the Facebook webhook are
// intentionally left out of the protected set — see the comments below.
export const config = {
  matcher: ['/portal/:path*', '/api/leads', '/api/leads/:path*'],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The login page itself must stay reachable without a session.
  if (pathname === '/portal/login') {
    return NextResponse.next()
  }

  // The website quote form POSTs here without auth — that's the public lead-capture endpoint.
  // Every other method/path under /api/leads (listing, updating) requires a session.
  if (pathname === '/api/leads' && request.method === 'POST') {
    return NextResponse.next()
  }

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (session) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/portal/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}
