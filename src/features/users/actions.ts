'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { hashPassword } from '@/lib/password'
import type { UserRole } from './queries'
import { editUserSchema, USER_ROLES } from './schemas'

export async function changeRole(formData: FormData) {
  const admin = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const role = String(formData.get('role') ?? '') as UserRole
  // Không cho tự đổi role của chính mình (tránh tự khóa quyền admin).
  if (!id || id === admin.userId || !USER_ROLES.includes(role)) return

  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath('/admin/users')
}

export async function toggleActive(formData: FormData) {
  const admin = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const next = String(formData.get('next') ?? '') === 'true'
  // Không cho tự khóa tài khoản của chính mình.
  if (!id || id === admin.userId) return

  await db.update(users).set({ isActive: next, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath('/admin/users')
}

export async function editUser(formData: FormData) {
  const admin = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  // Không cho tự sửa qua bảng này (giữ nhất quán với các thao tác khác).
  if (!id || id === admin.userId) return

  const parsed = editUserSchema.safeParse({
    fullName: formData.get('fullName') ?? '',
    phone: formData.get('phone') ?? '',
    password: formData.get('password') ?? '',
  })
  if (!parsed.success) return

  const { fullName, phone, password } = parsed.data
  const patch: { fullName: string; phone: string | null; passwordHash?: string } = { fullName, phone }
  // Chỉ đổi mật khẩu khi có nhập (đã validate độ dài trong schema).
  if (password) patch.passwordHash = await hashPassword(password)

  await db.update(users).set({ ...patch, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath('/admin/users')
}

export async function removeUser(formData: FormData) {
  const admin = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  // Không cho tự xóa tài khoản của chính mình.
  if (!id || id === admin.userId) return

  // Xóa cứng: FK tham chiếu users đã cấu hình an toàn (đơn/giỏ/bài viết → set null,
  // địa chỉ/wishlist → cascade), xem src/db/schema.ts.
  await db.delete(users).where(eq(users.id, id))
  revalidatePath('/admin/users')
}
