import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getCartTokenFromCookies } from '@/lib/cart'
import { getExistingCart } from '@/features/cart/queries'
import { createOrder } from '@/features/orders/queries'
import { products as productsTable } from '@/db/schema'
import { db } from '@/lib/db'
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
  // Nguồn giỏ hàng do client gửi thẳng (storefront trang chủ dùng giỏ client-side).
  // Nếu bỏ trống → dùng giỏ theo cookie cart_token (trang /checkout thật).
  items: z
    .array(z.object({ slug: z.string().min(1), quantity: z.number().int().min(1).max(999) }))
    .min(1)
    .optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Thông tin không hợp lệ' }, { status: 400 })
    }

    const authUser = await getAuthUser()

    // Xác định nguồn dòng hàng: client gửi kèm `items`, hoặc giỏ theo cookie.
    let sourceLines: Array<{ productSlug: string; quantity: number }>
    if (parsed.data.items && parsed.data.items.length > 0) {
      // Gộp trùng slug (client có thể gửi lặp) và bỏ dòng số lượng ≤ 0.
      const merged = new Map<string, number>()
      for (const line of parsed.data.items) {
        merged.set(line.slug, (merged.get(line.slug) ?? 0) + line.quantity)
      }
      sourceLines = [...merged].map(([productSlug, quantity]) => ({ productSlug, quantity }))
    } else {
      const cartToken = await getCartTokenFromCookies()
      const cart = await getExistingCart(cartToken)
      if (!cart || !cart.items || cart.items.length === 0) {
        return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 })
      }
      sourceLines = cart.items.map((i) => ({ productSlug: i.productSlug, quantity: i.quantity }))
    }

    // Đọc giá hiện tại + trạng thái từ DB (không tin giá/tên client gửi).
    const slugs = sourceLines.map((l) => l.productSlug)
    const productRows = await db
      .select({
        slug: productsTable.slug,
        name: productsTable.name,
        price: productsTable.price,
        salePrice: productsTable.salePrice,
        isActive: productsTable.isActive,
      })
      .from(productsTable)
      .where(inArray(productsTable.slug, slugs))

    const productMap = new Map(productRows.map((p) => [p.slug, p]))

    // Chặn nếu có sản phẩm không tồn tại hoặc đã ẩn — tránh tạo đơn dữ liệu rác.
    const invalid = sourceLines.filter((l) => {
      const p = productMap.get(l.productSlug)
      return !p || !p.isActive
    })
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: 'Một số sản phẩm không còn khả dụng, vui lòng kiểm tra lại giỏ hàng' },
        { status: 400 },
      )
    }

    const orderItems = sourceLines.map((item) => {
      const product = productMap.get(item.productSlug)!
      return {
        productSlug: item.productSlug,
        productName: product.name,
        // Giá bán thực tế = giá giảm nếu có, ngược lại giá gốc.
        quantity: item.quantity,
        price: product.salePrice ?? product.price,
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
