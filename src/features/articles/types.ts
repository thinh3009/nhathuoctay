import type { articles } from '@/db/schema'

/** Bản ghi bài viết thô từ DB (Drizzle). */
export type ArticleRecord = typeof articles.$inferSelect

export type ArticleStatus = 'draft' | 'published'

// Đầu vào tạo/cập nhật bài viết (dùng bởi articles/queries.ts).
export type ArticleInput = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string | null
  category: string
  status: ArticleStatus
  authorId?: string | null
  publishedAt?: Date | null
  sourceUrl?: string | null
}
