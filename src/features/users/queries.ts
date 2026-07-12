import 'server-only'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, orders, orderItems } from '@/db/schema'
import { classifyIdentifier } from '@/lib/identifier'
import type { UserRole } from './types'

export type { UserRole } from './types'

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1)
  return result[0] ?? null
}

export async function getUserByPhone(phone: string) {
  const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1)
  return result[0] ?? null
}

// Tìm user theo định danh đăng nhập: tự nhận biết email hay SĐT rồi tra đúng cột.
export async function getUserByIdentifier(identifier: string) {
  const c = classifyIdentifier(identifier)
  if (c.kind === 'email') return getUserByEmail(c.email)
  if (c.kind === 'phone') return getUserByPhone(c.phone)
  return null
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return result[0] ?? null
}

export async function createUser(data: {
  email?: string | null
  phone?: string | null
  passwordHash: string
  fullName: string
}) {
  const result = await db.insert(users).values(data).returning()
  return result[0]!
}

/* ── Quản lý user (admin) ── */

export async function listUsers() {
  return db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      phone: users.phone,
      role: users.role,
      isActive: users.isActive,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(500)
}

export async function createStaffUser(data: {
  email: string
  passwordHash: string
  fullName: string
  phone?: string
  role: UserRole
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
