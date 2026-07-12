import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getUserById } from '@/features/users/queries'
import { addChatMessage, getUserMessages, markReadByUser } from '@/features/chat/queries'

// Chat tư vấn 2 chiều: khách gửi tin (POST) và lấy tin mới (GET) để hiện tin
// dược sĩ trả lời từ trang /admin/chat. Bắt buộc đăng nhập.
export const runtime = 'nodejs'

const postSchema = z.object({
  message: z.string().trim().min(1, 'Nội dung trống').max(2000),
})

// Chống spam đơn giản theo IP (in-memory, best-effort trên serverless).
const RATE_LIMIT = 12
const RATE_WINDOW_MS = 60_000
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Báo Telegram cho dược sĩ biết có tin mới (tuỳ chọn, không chặn nếu chưa cấu hình).
async function notifyTelegram(name: string, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  const text = [
    `🩺 <b>${escapeHtml(name)}</b> vừa nhắn tư vấn:`,
    '',
    escapeHtml(message),
    '',
    '↩️ Trả lời khách tại trang <b>Quản trị → Tư vấn</b>.',
  ].join('\n')
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })
  } catch (e) {
    console.error('Telegram notify failed:', e)
  }
}

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

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút.' }, { status: 429 })
  }

  const saved = await addChatMessage(authUser.userId, 'user', parsed.data.message)

  const dbUser = await getUserById(authUser.userId)
  void notifyTelegram(dbUser?.fullName?.trim() || 'Khách hàng', parsed.data.message)

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
