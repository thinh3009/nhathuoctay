import { requireAdmin } from '@/lib/auth'
import { listConversations } from '@/features/chat/queries'
import ChatInbox, { type ConversationVM } from '@/features/chat/components/ChatInbox'

export const dynamic = 'force-dynamic'

export default async function AdminChatPage() {
  await requireAdmin()
  const conversations = await listConversations()

  // Chuẩn hoá Date → ISO string để truyền sang Client Component.
  const initial: ConversationVM[] = conversations.map((c) => ({
    userId: c.userId,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    lastContent: c.lastContent,
    lastAt: c.lastAt.toISOString(),
    unread: c.unread,
  }))

  return <ChatInbox initialConversations={initial} />
}
