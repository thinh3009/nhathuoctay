import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_COOKIE_NAME } from './constants'

// Production BẮT BUỘC có JWT_SECRET riêng — fallback chỉ dành cho dev local.
// Secret rơi vào git = ai cũng forge được token admin.
// Lazy (gọi trong hàm, không phải lúc import) để `next build` không cần env này.
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (secret) return new TextEncoder().encode(secret)
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET chưa được cấu hình. Đặt biến môi trường JWT_SECRET trước khi chạy production.')
  }
  return new TextEncoder().encode('nhathuoc16-dev-only-secret')
}

export type JWTPayload = {
  userId: string
  // Có thể null nếu tài khoản đăng ký bằng số điện thoại (không có email).
  email: string | null
  role: 'customer' | 'admin' | 'pharmacist'
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret())
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  return verifyJWT(token)
}

// Dùng trong server action / API: đảm bảo người gọi là admin (chặn gọi trực tiếp).
export async function requireAdmin(): Promise<JWTPayload> {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    redirect('/')
  }
  return user
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}
