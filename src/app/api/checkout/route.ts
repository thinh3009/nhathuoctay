import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getCartTokenFromCookies } from '@/lib/cart'
import { getExistingCart } from '@/db/queries/cart'
import { createOrder } from '@/db/queries/orders'
import { products as productsTable } from '@/db/schema'
import { db } from '@/db/client'
import { inArray } from 'drizzle-orm'

const schema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(9),
    addressLine: z.string().min(5),
    ward: z.string().optional(),
    district: z.string().optional(),
    city: z.string().min(2),
  }),
  paymentMethod: z.enum(['cod', 'bank_transfer', 'momo', 'vnpay']).default('cod'),
  note: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Thông tin không hợp lệ' }, { status: 400 })
    }

    const authUser = await getAuthUser()
    const cartToken = await getCartTokenFromCookies()
    const cart = await getExistingCart(cartToken)

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 })
    }

    // Get current product prices
    const slugs = cart.items.map((i) => i.productSlug)
    const productRows = await db
      .select({ slug: productsTable.slug, name: productsTable.name, price: productsTable.price })
      .from(productsTable)
      .where(inArray(productsTable.slug, slugs))

    const productMap = new Map(productRows.map((p) => [p.slug, p]))

    const orderItems = cart.items.map((item) => {
      const product = productMap.get(item.productSlug)
      if (!product) throw new Error(`Product not found: ${item.productSlug}`)
      return {
        productSlug: item.productSlug,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      }
    })

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shippingFee = subtotal >= 500000 ? 0 : 30000
    const totalAmount = subtotal + shippingFee

    const order = await createOrder({
      userId: authUser?.userId,
      totalAmount,
      shippingFee,
      paymentMethod: parsed.data.paymentMethod,
      shippingAddress: parsed.data.shippingAddress,
      note: parsed.data.note,
      items: orderItems,
    })

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
