import 'server-only'
import { and, asc, desc, eq, gt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chatMessages, users } from '@/db/schema'

export type ChatMessageRow = {
  id: string
  sender: 'user' | 'admin'
  content: string
  createdAt: Date
}

export type ChatConversation = {
  userId: string
  fullName: string
  email: string | null
  phone: string | null
  lastContent: string
  lastAt: Date
  unread: number
}

// Thêm một tin nhắn vào hội thoại của user. `senderName` = tên hiển thị (tên dược sĩ với tin admin).
export async function addChatMessage(
  userId: string,
  sender: 'user' | 'admin',
  content: string,
  senderName?: string,
) {
  const [row] = await db
    .insert(chatMessages)
    .values({ userId, sender, content, senderName: senderName ?? null })
    .returning({
      id: chatMessages.id,
      sender: chatMessages.sender,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    })
  return row!
}

export type ChatNotification = {
  id: string
  senderName: string | null
  content: string
  createdAt: Date
  read: boolean
}

// Thông báo cho khách: các tin dược sĩ trả lời gần đây (mới nhất trước).
export async function getUserNotifications(userId: string, limit = 10): Promise<ChatNotification[]> {
  const rows = await db
    .select({
      id: chatMessages.id,
      senderName: chatMessages.senderName,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
      read: chatMessages.readByUser,
    })
    .from(chatMessages)
    .where(and(eq(chatMessages.userId, userId), eq(chatMessages.sender, 'admin')))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit)
  return rows
}

// Tin nhắn của một user, tuỳ chọn chỉ lấy tin mới hơn `after` (cho polling).
export async function getUserMessages(userId: string, after?: Date): Promise<ChatMessageRow[]> {
  const where = after
    ? and(eq(chatMessages.userId, userId), gt(chatMessages.createdAt, after))
    : eq(chatMessages.userId, userId)
  return db
    .select({
      id: chatMessages.id,
      sender: chatMessages.sender,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(where)
    .orderBy(asc(chatMessages.createdAt))
    .limit(500)
}

// Đánh dấu tin của KHÁCH là admin đã đọc (khi admin mở hội thoại).
export async function markReadByAdmin(userId: string) {
  await db
    .update(chatMessages)
    .set({ readByAdmin: true })
    .where(and(eq(chatMessages.userId, userId), eq(chatMessages.sender, 'user'), eq(chatMessages.readByAdmin, false)))
}

// Đánh dấu tin của ADMIN là khách đã đọc (khi khách mở khung chat).
export async function markReadByUser(userId: string) {
  await db
    .update(chatMessages)
    .set({ readByUser: true })
    .where(and(eq(chatMessages.userId, userId), eq(chatMessages.sender, 'admin'), eq(chatMessages.readByUser, false)))
}

// Danh sách hội thoại cho admin: mỗi user + tin cuối + số tin khách chưa đọc.
export async function listConversations(): Promise<ChatConversation[]> {
  const rows = await db
    .select({
      userId: chatMessages.userId,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
      lastContent: sql<string>`(array_agg(${chatMessages.content} ORDER BY ${chatMessages.createdAt} DESC))[1]`,
      lastAt: sql<Date>`max(${chatMessages.createdAt})`,
      unread: sql<number>`count(*) FILTER (WHERE ${chatMessages.sender} = 'user' AND ${chatMessages.readByAdmin} = false)`,
    })
    .from(chatMessages)
    .innerJoin(users, eq(users.id, chatMessages.userId))
    .groupBy(chatMessages.userId, users.fullName, users.email, users.phone)
    .orderBy(sql`max(${chatMessages.createdAt}) DESC`)
    .limit(300)

  return rows.map((r) => ({
    userId: r.userId,
    fullName: r.fullName,
    email: r.email,
    phone: r.phone,
    lastContent: r.lastContent,
    lastAt: new Date(r.lastAt),
    unread: Number(r.unread),
  }))
}

// Xóa toàn bộ tin nhắn của một hội thoại (dọn bớt dữ liệu cũ, tiết kiệm bộ nhớ DB).
// KHÔNG thể hoàn tác — mất hết lịch sử tư vấn của user này.
export async function deleteConversation(userId: string) {
  await db.delete(chatMessages).where(eq(chatMessages.userId, userId))
}

// Tổng số tin khách chưa đọc (badge chuông trên nav admin).
export async function countUnreadForAdmin(): Promise<number> {
  const [row] = await db
    .select({ c: sql<number>`count(*)` })
    .from(chatMessages)
    .where(and(eq(chatMessages.sender, 'user'), eq(chatMessages.readByAdmin, false)))
  return Number(row?.c ?? 0)
}

// Số tin dược sĩ trả lời mà một khách chưa đọc (badge chuông cho khách).
export async function countUnreadForUser(userId: string): Promise<number> {
  const [row] = await db
    .select({ c: sql<number>`count(*)` })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.userId, userId),
        eq(chatMessages.sender, 'admin'),
        eq(chatMessages.readByUser, false),
      ),
    )
  return Number(row?.c ?? 0)
}
