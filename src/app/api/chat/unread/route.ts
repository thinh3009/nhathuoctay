import { getAuthUser } from '@/lib/auth'
import { countUnreadForUser } from '@/features/chat/queries'

export const runtime = 'nodejs'

// Số tin dược sĩ trả lời mà khách chưa đọc (cho chuông thông báo ở header).
export async function GET() {
  const authUser = await getAuthUser()
  if (!authUser) {
    return Response.json({ unread: 0, authed: false }, { status: 200 })
  }
  const unread = await countUnreadForUser(authUser.userId)
  return Response.json({ unread, authed: true })
}
