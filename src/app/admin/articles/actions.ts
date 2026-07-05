'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  type ArticleStatus,
} from '@/db/queries/articles'
import { STOREFRONT_CACHE_TAG } from '@/db/queries/storefront'
import { requireAdmin } from '@/lib/auth'

export type ArticleFormState = { error?: string }

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function saveArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const admin = await requireAdmin()

  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const excerpt = String(formData.get('excerpt') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim() || 'Tin sức khỏe'
  const coverImage = String(formData.get('coverImage') ?? '').trim() || null
  const status: ArticleStatus =
    String(formData.get('status') ?? 'draft') === 'published' ? 'published' : 'draft'
  const slugInput = String(formData.get('slug') ?? '').trim()

  if (title.length < 3) return { error: 'Tiêu đề tối thiểu 3 ký tự.' }
  if (!excerpt) return { error: 'Vui lòng nhập tóm tắt.' }
  if (!content) return { error: 'Vui lòng nhập nội dung.' }

  const slug = slugify(slugInput || title) || `bai-viet-${Date.now()}`

  const existing = await getArticleBySlug(slug)
  if (existing && existing.id !== id) {
    return { error: 'Đường dẫn (slug) đã tồn tại — hãy đổi tiêu đề hoặc slug.' }
  }

  if (id) {
    const current = await getArticleById(id)
    if (!current) return { error: 'Không tìm thấy bài viết.' }
    const publishedAt = status === 'published' ? (current.publishedAt ?? new Date()) : null
    await updateArticle(id, { slug, title, excerpt, content, category, coverImage, status, publishedAt })
  } else {
    const publishedAt = status === 'published' ? new Date() : null
    await createArticle({
      slug,
      title,
      excerpt,
      content,
      category,
      coverImage,
      status,
      authorId: admin.userId,
      publishedAt,
    })
  }

  revalidatePath('/admin/articles')
  revalidatePath('/bai-viet')
  revalidatePath(`/bai-viet/${slug}`)
  updateTag(STOREFRONT_CACHE_TAG) // mục tin tức trên trang chủ cập nhật ngay
  redirect('/admin/articles')
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (id) {
    await deleteArticle(id)
    revalidatePath('/admin/articles')
    revalidatePath('/bai-viet')
    updateTag(STOREFRONT_CACHE_TAG) // mục tin tức trên trang chủ cập nhật ngay
  }
  redirect('/admin/articles')
}
