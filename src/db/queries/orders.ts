import { desc, eq, sql } from 'drizzle-orm'
import { db } from '@/db/client'
import { orders, orderItems, users } from '@/db/schema'

function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${date}-${rand}`
}

export type CreateOrderInput = {
  userId?: string
  totalAmount: number
  shippingFee: number
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
  shippingAddress: {
    fullName: string
    phone: string
    addressLine: string
    ward?: string
    district?: string
    city: string
  }
  note?: string
  items: Array<{
    productSlug: string
    productName: string
    quantity: number
    price: number
  }>
}

export async function createOrder(input: CreateOrderInput) {
  const orderNumber = generateOrderNumber()

  const [order] = await db.insert(orders).values({
    userId: input.userId ?? null,
    orderNumber,
    totalAmount: input.totalAmount,
    shippingFee: input.shippingFee,
    paymentMethod: input.paymentMethod,
    shippingAddress: input.shippingAddress,
    note: input.note,
  }).returning()

  if (!order) throw new Error('Failed to create order')

  await db.insert(orderItems).values(
    input.items.map((item) => ({
      orderId: order.id,
      productSlug: item.productSlug,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }))
  )

  return order
}

export async function getAllOrders(limit = 50) {
  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      shippingAddress: orders.shippingAddress,
      createdAt: orders.createdAt,
      userId: orders.userId,
      userEmail: users.email,
      userFullName: users.fullName,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
}

export async function getOrderById(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) return null
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))
  return { ...order, items }
}

export async function updateOrderStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded'
) {
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id))
}

export async function getOrderStats() {
  const [stats] = await db
    .select({
      total: sql<number>`count(*)`,
      revenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
      pending: sql<number>`count(*) filter (where ${orders.status} = 'pending')`,
      delivered: sql<number>`count(*) filter (where ${orders.status} = 'delivered')`,
    })
    .from(orders)
  return stats ?? { total: 0, revenue: 0, pending: 0, delivered: 0 }
}
