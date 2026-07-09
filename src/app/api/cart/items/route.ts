import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { addCartItem } from '@/features/cart/queries'
import { jsonError } from '@/lib/api'
import { CART_COOKIE_NAME } from '@/lib/constants'
import { addToCartInputSchema } from '@/lib/schemas'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const input = addToCartInputSchema.parse(json)
    const cookieStore = await cookies()
    const token = cookieStore.get(CART_COOKIE_NAME)?.value
    const result = await addCartItem(token, input.productSlug, input.quantity)
    const response = NextResponse.json(result.cart)

    response.cookies.set(CART_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(400, 'Invalid request body', error.issues)
    }

    if (error instanceof Error && error.message === 'PRODUCT_NOT_FOUND') {
      return jsonError(404, 'Product not found')
    }

    throw error
  }
}
