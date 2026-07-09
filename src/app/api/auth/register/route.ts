import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByEmail, createUser } from '@/features/users/queries'
import { hashPassword } from '@/lib/password'
import { signJWT, setAuthCookie } from '@/lib/auth'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ').optional(),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' },
        { status: 400 }
      )
    }

    const { fullName, email, phone, password } = parsed.data

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await createUser({ email, passwordHash, fullName, phone })

    const token = await signJWT({ userId: user.id, email: user.email, role: user.role })
    await setAuthCookie(token)

    return NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại' }, { status: 500 })
  }
}
