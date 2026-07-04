import { desc, eq } from 'drizzle-orm'
import { db } from '@/db/client'
import { users, orders, orderItems } from '@/db/schema'

export type UserRole = 'customer' | 'admin' | 'pharmacist'

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

export async function updateUserRole(id: string, role: UserRole) {
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id))
}

export async function setUserActive(id: string, isActive: boolean) {
  await db.update(users).set({ isActive, updatedAt: new Date() }).where(eq(users.id, id))
}

export async function updateUserProfile(
  id: string,
  data: { fullName?: string; phone?: string | null; passwordHash?: string },
) {
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id))
}

// Xóa cứng người dùng. Các khóa ngoại tham chiếu users đã được cấu hình an toàn:
// đơn hàng/giỏ/bài viết → set null (giữ lịch sử), địa chỉ/wishlist → cascade.
export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id))
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
