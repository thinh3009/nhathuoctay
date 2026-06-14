import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { redirects } from '@/config/redirects'

// Auth middleware tạm thời tắt — bật lại khi cần bảo vệ /admin và /account
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const rule = redirects.find((item) => item.source === pathname)
  if (rule) {
    const destination = new URL(`${rule.destination}${search}`, request.url)
    return NextResponse.redirect(destination, rule.permanent ? 308 : 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
