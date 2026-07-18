import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getUserById } from '@/features/users/queries'
import { addChatMessage } from '@/features/chat/queries'
import { notifyTelegramChat } from '@/features/chat/telegram'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import { isValidImageType, MAX_UPLOAD_BYTES, uploadPrescriptionImage } from '@/lib/supabaseStorage'

// "Đặt thuốc theo toa": khách gửi ảnh toa + SĐT. Bắt buộc đăng nhập — nội dung được lưu
// làm một tin nhắn tư vấn bình thường (chat_messages) để dược sĩ trả lời trong /admin/chat,
// không có bảng/luồng riêng.
export const runtime = 'nodejs'

const phoneSchema = z.string().trim().min(9, 'Số điện thoại chưa hợp lệ').max(20)

// Giới hạn thấp hơn chat thường vì đây là upload ảnh (tốn tài nguyên hơn 1 tin nhắn chữ).
const isRateLimited = createRateLimiter(6, 60_000)

export async function POST(request: Request) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return Response.json({ error: 'Vui lòng đăng nhập để gửi toa thuốc.' }, { status: 401 })
  }

  if (isRateLimited(getClientIp(request))) {
    return Response.json({ error: 'Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút.' }, { status: 429 })
  }

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return Response.json({ error: 'Yêu cầu không hợp lệ' }, { status: 400 })
  }

  const phoneParsed = phoneSchema.safeParse(formData.get('phone'))
  if (!phoneParsed.success) {
    return Response.json({ error: phoneParsed.error.issues[0]?.message ?? 'Số điện thoại chưa hợp lệ' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof Blob) || file.size === 0) {
    return Response.json({ error: 'Thiếu ảnh toa thuốc.' }, { status: 400 })
  }
  if (!isValidImageType(file.type)) {
    return Response.json(
      { error: 'Định dạng ảnh không hợp lệ (chỉ JPG, PNG, WebP, GIF, AVIF).' },
      { status: 400 },
    )
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: `Ảnh vượt quá ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB.` },
      { status: 400 },
    )
  }

  let imageUrl: string
  try {
    const uploaded = await uploadPrescriptionImage(file, file.type, authUser.userId)
    imageUrl = uploaded.publicUrl
  } catch (error) {
    console.error('[prescriptions] upload error', error)
    return Response.json({ error: 'Tải ảnh thất bại, vui lòng thử lại.' }, { status: 500 })
  }

  const content = [
    '📋 Yêu cầu đặt thuốc theo toa',
    `SĐT liên hệ: ${phoneParsed.data}`,
    `Ảnh toa thuốc: ${imageUrl}`,
  ].join('\n')

  const saved = await addChatMessage(authUser.userId, 'user', content)

  const dbUser = await getUserById(authUser.userId)
  void notifyTelegramChat('📋', dbUser?.fullName?.trim() || 'Khách hàng', 'vừa gửi toa thuốc', content)

  return Response.json({ ok: true, message: saved })
}
