import { getAuthUser } from '@/lib/auth'
import { listConversations } from '@/features/chat/queries'

export const runtime = 'nodejs'

// Danh sách hội thoại tư vấn cho admin (polling từ trang /admin/chat).
export async function GET() {
  const admin = await getAuthUser()
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Không có quyền' }, { status: 403 })
  }
  const conversations = await listConversations()
  return Response.json({ conversations })
}
