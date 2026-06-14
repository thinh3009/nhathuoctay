import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { redirects } from '@/config/redirects'
import { verifyJWT } from '@/lib/auth'
import { AUTH_COOKIE_NAME } from '@/lib/constants'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // ── Custom redirects ──
  const rule = redirects.find((item) => item.source === pathname)
  if (rule) {
    const destination = new URL(`${rule.destination}${search}`, request.url)
    return NextResponse.redirect(destination, rule.permanent ? 308 : 307)
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  // ── Admin routes — require admin role ──
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?from=/admin', request.url))
    }
    const payload = await verifyJWT(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // ── Account routes — require any auth ──
  if (pathname.startsWith('/account')) {
    if (!token) {
      return NextResponse.redirect(new URL(`/auth/login?from=${encodeURIComponent(pathname)}`, request.url))
    }
    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
