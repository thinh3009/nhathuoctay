import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createStaffUser, getUserByEmail } from '@/features/users/queries'
import { getAuthUser } from '@/lib/auth'
import { hashPassword } from '@/lib/password'

const createSchema = z.object({
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  role: z.enum(['customer', 'admin', 'pharmacist']),
})

export async function POST(request: Request) {
  // Chặn gọi trực tiếp: chỉ admin mới được tạo tài khoản.
  const admin = await getAuthUser()
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' },
        { status: 400 },
      )
    }

    const { fullName, email, phone, password, role } = parsed.data

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await createStaffUser({
      email,
      passwordHash,
      fullName,
      phone: phone || undefined,
      role,
    })
    revalidatePath('/admin/users')

    return NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại' }, { status: 500 })
  }
}
