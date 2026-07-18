'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticleBySlug,
  getArticleBySourceUrl,
  updateArticle,
  type ArticleStatus,
} from '@/features/articles/queries'
import { STOREFRONT_CACHE_TAG } from '@/features/storefront/queries'
import { requireAdmin } from '@/lib/auth'
import { fetchRssCandidates } from '@/lib/rss'

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

// Đồng bộ tin tức từ RSS (nút bấm thủ công ở /admin/articles, không có cron). Luôn tạo bài
// dưới dạng NHÁP (status='draft') — không bao giờ tự đăng, vì nội dung chỉ là tóm tắt lấy từ
// RSS (tránh vi phạm bản quyền), admin phải mở link nguồn viết lại trước khi xuất bản.
export async function syncNewsFromRssAction(): Promise<void> {
  const admin = await requireAdmin()
  const candidates = await fetchRssCandidates()

  let created = 0
  for (const candidate of candidates) {
    // Chống trùng: đã lấy link này trước đó thì bỏ qua (không phụ thuộc slug/tiêu đề).
    if (await getArticleBySourceUrl(candidate.sourceLink)) continue

    let slug = slugify(candidate.title) || `bai-viet-${Date.now()}`
    if (await getArticleBySlug(slug)) slug = `${slug}-${Date.now()}`

    const content = [
      candidate.excerpt || '(Chưa có tóm tắt — vui lòng mở link gốc bên dưới để viết lại nội dung.)',
      '',
      `*Nguồn: [${candidate.sourceName}](${candidate.sourceLink})*`,
      '',
      '> ⚠️ Nội dung trên chỉ là tóm tắt lấy từ RSS, KHÔNG phải bài đầy đủ. Vui lòng mở link nguồn, ' +
        'đọc và viết lại bằng lời văn của bạn trước khi đăng để tránh vi phạm bản quyền.',
    ].join('\n')

    await createArticle({
      slug,
      title: candidate.title,
      excerpt: candidate.excerpt || candidate.title,
      content,
      category: 'Tin sức khỏe',
      coverImage: null,
      status: 'draft',
      authorId: admin.userId,
      publishedAt: null,
      sourceUrl: candidate.sourceLink,
    })
    created += 1
  }

  revalidatePath('/admin/articles')
  redirect(`/admin/articles?synced=${created}`)
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
