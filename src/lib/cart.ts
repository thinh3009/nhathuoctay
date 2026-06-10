import { cookies } from 'next/headers'
import { CART_COOKIE_NAME } from './constants.ts'
import { getExistingCart } from '@/db/queries/cart'

export async function getCartTokenFromCookies() {
  const cookieStore = await cookies()
  return cookieStore.get(CART_COOKIE_NAME)?.value ?? null
}

export async function getServerCartCount() {
  const token = await getCartTokenFromCookies()
  const cart = await getExistingCart(token)
  return cart?.totalItems ?? 0
}
