import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleById } from '@/features/articles/queries'
import ArticleForm from '@/features/articles/components/ArticleForm'
import { deleteArticleAction } from '@/features/articles/actions'

type EditArticlePageProps = {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const article = await getArticleById(id)

  if (!article) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            href="/admin/articles"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="mt-2 text-3xl font-black text-stone-900">Sửa bài viết</h1>
        </div>
        <form action={deleteArticleAction}>
          <input name="id" type="hidden" value={article.id} />
          <button
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            type="submit"
          >
            Xóa bài
          </button>
        </form>
      </div>

      <ArticleForm
        article={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          coverImage: article.coverImage,
          category: article.category,
          status: article.status as 'draft' | 'published',
        }}
      />
    </div>
  )
}
