import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByEmail, getUserByPhone, createUser } from '@/features/users/queries'
import { classifyIdentifier } from '@/lib/identifier'
import { hashPassword } from '@/lib/password'
import { signJWT, setAuthCookie } from '@/lib/auth'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'

const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự'),
  // Định danh: email hoặc số điện thoại.
  identifier: z.string().trim().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

// Chống tạo tài khoản hàng loạt: tối đa 5 lần/phút/IP (best-effort in-memory, xem lib/rateLimit).
const isRateLimited = createRateLimiter(5, 60_000)

export async function POST(request: Request) {
  try {
    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json(
        { error: 'Bạn thao tác quá nhiều lần, vui lòng đợi ít phút rồi thử lại.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' },
        { status: 400 }
      )
    }

    const { fullName, identifier, password } = parsed.data
    const id = classifyIdentifier(identifier)
    if (id.kind === 'invalid') {
      return NextResponse.json({ error: 'Email hoặc số điện thoại không hợp lệ' }, { status: 400 })
    }

    const email = id.kind === 'email' ? id.email : null
    const phone = id.kind === 'phone' ? id.phone : null

    const existing = email ? await getUserByEmail(email) : await getUserByPhone(phone!)
    if (existing) {
      return NextResponse.json(
        { error: email ? 'Email đã được sử dụng' : 'Số điện thoại đã được sử dụng' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const user = await createUser({ email, phone, passwordHash, fullName })

    const token = await signJWT({ userId: user.id, email: user.email, role: user.role })
    await setAuthCookie(token)

    return NextResponse.json({
      user: { id: user.id, email: user.email, phone: user.phone, fullName: user.fullName, role: user.role },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại' }, { status: 500 })
  }
}
