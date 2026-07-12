import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getUserById } from '@/features/users/queries'
import { addChatMessage, getUserMessages, markReadByAdmin } from '@/features/chat/queries'

export const runtime = 'nodejs'

const replySchema = z.object({
  content: z.string().trim().min(1, 'Nội dung trống').max(2000),
})

type Ctx = { params: Promise<{ userId: string }> }

// Lấy toàn bộ tin nhắn của một khách (và đánh dấu admin đã đọc).
export async function GET(request: Request, ctx: Ctx) {
  const admin = await getAuthUser()
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Không có quyền' }, { status: 403 })
  }
  const { userId } = await ctx.params

  const afterParam = new URL(request.url).searchParams.get('after')
  const after = afterParam ? new Date(afterParam) : undefined
  const messages = await getUserMessages(userId, after && !Number.isNaN(after.getTime()) ? after : undefined)

  // Chỉ đánh dấu đã đọc khi tải toàn bộ (không phải poll tin mới).
  if (!after) {
    const user = await getUserById(userId)
    void markReadByAdmin(userId)
    return Response.json({
      messages,
      user: user
        ? { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone }
        : null,
    })
  }

  return Response.json({ messages })
}

// Dược sĩ/admin trả lời khách.
export async function POST(request: Request, ctx: Ctx) {
  const admin = await getAuthUser()
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Không có quyền' }, { status: 403 })
  }
  const { userId } = await ctx.params

  const body = await request.json().catch(() => null)
  const parsed = replySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? 'Yêu cầu không hợp lệ' }, { status: 400 })
  }

  const user = await getUserById(userId)
  if (!user) {
    return Response.json({ error: 'Không tìm thấy khách hàng' }, { status: 404 })
  }

  // Lưu tên dược sĩ/admin trả lời để hiện trong thông báo của khách.
  const adminUser = await getUserById(admin.userId)
  const saved = await addChatMessage(userId, 'admin', parsed.data.content, adminUser?.fullName?.trim() || 'Dược sĩ')
  return Response.json({ ok: true, message: saved })
}
