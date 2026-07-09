import 'server-only'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { cartItems, carts } from '@/db/schema'
import { getProductBySlug } from '@/features/products/queries'
import { cartResponseSchema } from '@/lib/schemas'
import type { CartResponse } from './types'

type CartRow = typeof carts.$inferSelect & {
  items: Array<typeof cartItems.$inferSelect>
}

async function findCartByToken(token: string) {
  return db.query.carts.findFirst({
    where: eq(carts.cartToken, token),
    with: {
      items: true,
    },
  })
}

async function toCartResponse(cart: CartRow): Promise<CartResponse> {
  const items = (
    await Promise.all(
      cart.items.map(async (item) => {
        const product = await getProductBySlug(item.productSlug)

        if (!product) {
          return null
        }

        return {
          productSlug: item.productSlug,
          quantity: item.quantity,
          product,
          subtotal: product.price * item.quantity,
        }
      }),
    )
  )
    .filter(
      (
        item,
      ): item is {
        productSlug: string
        quantity: number
        product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>
        subtotal: number
      } => item !== null,
    )

  return cartResponseSchema.parse({
    id: cart.id,
    token: cart.cartToken,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.subtotal, 0),
    items,
  })
}

export async function getExistingCart(token?: string | null) {
  if (!token) {
    return null
  }

  const cart = await findCartByToken(token)
  return cart ? toCartResponse(cart) : null
}

export async function ensureCart(token?: string | null) {
  const normalizedToken = token ?? randomUUID()
  let cart = await findCartByToken(normalizedToken)

  if (!cart) {
    await db.insert(carts).values({
      cartToken: normalizedToken,
    })

    cart = await findCartByToken(normalizedToken)
  }

  if (!cart) {
    throw new Error('Unable to initialize cart.')
  }

  return {
    token: normalizedToken,
    cart,
  }
}

export async function getOrCreateCart(token?: string | null) {
  const ensured = await ensureCart(token)
  return {
    token: ensured.token,
    cart: await toCartResponse(ensured.cart),
  }
}

export async function addCartItem(token: string | null | undefined, productSlug: string, quantity: number) {
  const product = await getProductBySlug(productSlug)

  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND')
  }

  const ensured = await ensureCart(token)
  const existingItem = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, ensured.cart.id), eq(cartItems.productSlug, productSlug)),
  })

  if (existingItem) {
    await db
      .update(cartItems)
      .set({
        quantity: existingItem.quantity + quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, existingItem.id))
  } else {
    await db.insert(cartItems).values({
      cartId: ensured.cart.id,
      productSlug,
      quantity,
    })
  }

  return getOrCreateCart(ensured.token)
}

export async function updateCartItemQuantity(
  token: string | null | undefined,
  productSlug: string,
  quantity: number,
) {
  const cart = await getExistingCart(token)

  if (!cart) {
    throw new Error('CART_NOT_FOUND')
  }

  const row = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.id), eq(cartItems.productSlug, productSlug)),
  })

  if (!row) {
    throw new Error('CART_ITEM_NOT_FOUND')
  }

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, row.id))
  } else {
    await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, row.id))
  }

  return getOrCreateCart(cart.token)
}

export async function removeCartItem(token: string | null | undefined, productSlug: string) {
  const cart = await getExistingCart(token)

  if (!cart) {
    throw new Error('CART_NOT_FOUND')
  }

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productSlug, productSlug)))

  return getOrCreateCart(cart.token)
}
