import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { articles } from '@/db/schema'
import type { ArticleInput } from './types'

export type { ArticleStatus, ArticleInput } from './types'

// Admin: tất cả bài viết (cả nháp).
export async function listArticles() {
  return db
    .select({
      id: articles.id,
      slug: articles.slug,
      title: articles.title,
      category: articles.category,
      status: articles.status,
      publishedAt: articles.publishedAt,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .orderBy(desc(articles.updatedAt))
    .limit(500)
}

// Công khai: chỉ bài đã đăng.
export async function listPublishedArticles() {
  return db
    .select({
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      coverImage: articles.coverImage,
      category: articles.category,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(100)
}

export async function getPublishedArticleBySlug(slug: string) {
  const result = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, 'published')))
    .limit(1)
  return result[0] ?? null
}

export async function getArticleById(id: string) {
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1)
  return result[0] ?? null
}

export async function getArticleBySlug(slug: string) {
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1)
  return result[0] ?? null
}

export async function createArticle(data: ArticleInput) {
  const result = await db.insert(articles).values(data).returning()
  return result[0]!
}

export async function updateArticle(id: string, data: Partial<ArticleInput>) {
  await db
    .update(articles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(articles.id, id))
}

export async function deleteArticle(id: string) {
  await db.delete(articles).where(eq(articles.id, id))
}
