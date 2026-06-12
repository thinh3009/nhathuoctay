import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { redirects } from '@/config/redirects'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const rule = redirects.find((item) => item.source === pathname)

  if (!rule) {
    return NextResponse.next()
  }

  const destination = new URL(`${rule.destination}${search}`, request.url)
  return NextResponse.redirect(destination, rule.permanent ? 308 : 307)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
