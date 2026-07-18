import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getUserById } from '@/features/users/queries'
import { addChatMessage, getUserMessages, markReadByUser } from '@/features/chat/queries'
import { notifyTelegramChat } from '@/features/chat/telegram'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'

// Chat tư vấn 2 chiều: khách gửi tin (POST) và lấy tin mới (GET) để hiện tin
// dược sĩ trả lời từ trang /admin/chat. Bắt buộc đăng nhập.
export const runtime = 'nodejs'

const postSchema = z.object({
  message: z.string().trim().min(1, 'Nội dung trống').max(2000),
})

const isRateLimited = createRateLimiter(12, 60_000)

export async function POST(request: Request) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return Response.json({ error: 'Vui lòng đăng nhập để được tư vấn.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? 'Yêu cầu không hợp lệ' }, { status: 400 })
  }

  if (isRateLimited(getClientIp(request))) {
    return Response.json({ error: 'Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút.' }, { status: 429 })
  }

  const saved = await addChatMessage(authUser.userId, 'user', parsed.data.message)

  const dbUser = await getUserById(authUser.userId)
  void notifyTelegramChat('🩺', dbUser?.fullName?.trim() || 'Khách hàng', 'vừa nhắn tư vấn', parsed.data.message)

  return Response.json({ ok: true, message: saved })
}

export async function GET(request: Request) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return Response.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  const afterParam = new URL(request.url).searchParams.get('after')
  const after = afterParam ? new Date(afterParam) : undefined
  const messages = await getUserMessages(authUser.userId, after && !Number.isNaN(after.getTime()) ? after : undefined)

  // Khách vừa xem → đánh dấu tin của admin là đã đọc.
  void markReadByUser(authUser.userId)

  return Response.json({ messages })
}
