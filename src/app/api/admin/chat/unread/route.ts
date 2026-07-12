import { getAuthUser } from '@/lib/auth'
import { countUnreadForAdmin } from '@/features/chat/queries'

export const runtime = 'nodejs'

// Tổng số tin khách chưa đọc (cho chuông thông báo trong khu quản trị).
export async function GET() {
  const admin = await getAuthUser()
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Không có quyền' }, { status: 403 })
  }
  const unread = await countUnreadForAdmin()
  return Response.json({ unread })
}
