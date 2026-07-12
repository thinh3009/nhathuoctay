import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getUserById } from '@/features/users/queries'

// Khung "chat" nay chi chuyen tiep tin nhan khach toi Telegram cua duoc si —
// khong con goi AI. Duoc si nhan tin trong Telegram va lien he lai voi khach.
export const runtime = 'nodejs'

const requestSchema = z.object({
  message: z.string().trim().min(1, 'Nội dung trống').max(2000),
  // Ngữ cảnh không bắt buộc: SĐT khách để lại + trang đang xem.
  contact: z.string().trim().max(120).optional(),
  pageUrl: z.string().trim().max(300).optional(),
})

// Chống spam đơn giản theo IP (in-memory, best-effort trên serverless).
const RATE_LIMIT = 8 // số tin / cửa sổ
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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Yêu cầu không hợp lệ' }, { status: 400 })
  }

  // Bắt buộc đăng nhập mới được gửi tư vấn (bảo mật hơn, tránh spam ẩn danh).
  const authUser = await getAuthUser()
  if (!authUser) {
    return Response.json({ error: 'Vui lòng đăng nhập để được tư vấn.' }, { status: 401 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    return Response.json(
      { error: 'Chưa cấu hình Telegram (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)' },
      { status: 500 },
    )
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút.' }, { status: 429 })
  }

  const { message, contact, pageUrl } = parsed.data

  // Tên lấy từ tài khoản đã đăng nhập (đáng tin, không cho client giả mạo).
  const dbUser = await getUserById(authUser.userId)
  const senderName = dbUser?.fullName?.trim() || 'Khách hàng'
  // Ưu tiên SĐT khách để lại trong ô liên hệ, nếu trống thì lấy SĐT hồ sơ.
  const contactPhone = contact?.trim() || dbUser?.phone || ''

  const lines = [
    `🩺 <b>Tư vấn từ ${escapeHtml(senderName)} (thành viên) — Quầy thuốc 16</b>`,
    '',
    escapeHtml(message),
  ]
  if (contactPhone) lines.push('', `📞 Liên hệ: ${escapeHtml(contactPhone)}`)
  if (pageUrl) lines.push(`🔗 Trang: ${escapeHtml(pageUrl)}`)
  lines.push(`🕒 ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`)

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('Telegram sendMessage failed:', res.status, detail)
      return Response.json({ error: 'Không gửi được tới dược sĩ, vui lòng thử lại.' }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error('Telegram error:', error)
    return Response.json({ error: 'Lỗi kết nối, vui lòng thử lại.' }, { status: 502 })
  }
}
