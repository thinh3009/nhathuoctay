import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByIdentifier } from '@/features/users/queries'
import { comparePassword } from '@/lib/password'
import { signJWT, setAuthCookie } from '@/lib/auth'

const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' },
        { status: 400 }
      )
    }

    const { identifier, password } = parsed.data

    const user = await getUserByIdentifier(identifier)
    if (!user) {
      return NextResponse.json({ error: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Tài khoản đã bị khóa' }, { status: 403 })
    }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 401 })
    }

    const token = await signJWT({ userId: user.id, email: user.email, role: user.role })
    await setAuthCookie(token)

    return NextResponse.json({
      user: { id: user.id, email: user.email, phone: user.phone, fullName: user.fullName, role: user.role },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại' }, { status: 500 })
  }
}
