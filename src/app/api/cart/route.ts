import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getOrCreateCart } from '@/db/queries/cart'
import { CART_COOKIE_NAME } from '@/lib/constants'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(CART_COOKIE_NAME)?.value
  const result = await getOrCreateCart(token)

  const response = NextResponse.json(result.cart)
  response.cookies.set(CART_COOKIE_NAME, result.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  return response
}
