import { eq } from 'drizzle-orm'
import { db } from '@/db/client'
import { users, orders, orderItems } from '@/db/schema'

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return result[0] ?? null
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return result[0] ?? null
}

export async function createUser(data: {
  email: string
  passwordHash: string
  fullName: string
  phone?: string
}) {
  const result = await db.insert(users).values(data).returning()
  return result[0]!
}

export async function getOrdersByUserId(userId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(orders.createdAt)
}

export async function getOrderWithItems(orderId: string) {
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!order[0]) return null

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
  return { ...order[0], items }
}
