import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { removeCartItem, updateCartItemQuantity } from '@/db/queries/cart'
import { jsonError } from '@/lib/api'
import { CART_COOKIE_NAME } from '@/lib/constants'
import { updateCartItemInputSchema } from '@/lib/schemas'

type CartItemRouteProps = {
  params: Promise<{
    productSlug: string
  }>
}

export async function PATCH(request: Request, { params }: CartItemRouteProps) {
  try {
    const { productSlug } = await params
    const json = await request.json()
    const input = updateCartItemInputSchema.parse(json)
    const cookieStore = await cookies()
    const token = cookieStore.get(CART_COOKIE_NAME)?.value
    const result = await updateCartItemQuantity(token, productSlug, input.quantity)
    return NextResponse.json(result.cart)
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(400, 'Invalid request body', error.issues)
    }

    if (error instanceof Error && error.message === 'CART_NOT_FOUND') {
      return jsonError(404, 'Cart not found')
    }

    if (error instanceof Error && error.message === 'CART_ITEM_NOT_FOUND') {
      return jsonError(404, 'Cart item not found')
    }

    throw error
  }
}

export async function DELETE(_: Request, { params }: CartItemRouteProps) {
  try {
    const { productSlug } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get(CART_COOKIE_NAME)?.value
    const result = await removeCartItem(token, productSlug)
    return NextResponse.json(result.cart)
  } catch (error) {
    if (error instanceof Error && error.message === 'CART_NOT_FOUND') {
      return jsonError(404, 'Cart not found')
    }

    throw error
  }
}
