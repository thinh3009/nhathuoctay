import { getAuthUser } from '@/lib/auth'
import { countUnreadForUser, getUserNotifications } from '@/features/chat/queries'

export const runtime = 'nodejs'

// Thông báo cho khách: số tin dược sĩ chưa đọc + danh sách tin trả lời gần đây.
export async function GET() {
  const authUser = await getAuthUser()
  if (!authUser) {
    return Response.json({ authed: false, unread: 0, notifications: [] }, { status: 200 })
  }
  const [unread, notifications] = await Promise.all([
    countUnreadForUser(authUser.userId),
    getUserNotifications(authUser.userId, 10),
  ])
  return Response.json({ authed: true, unread, notifications })
}
