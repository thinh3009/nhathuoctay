import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedArticleBySlug } from '@/db/queries/articles'
import MarkdownContent from '@/components/MarkdownContent'
import StoreFooter from '@/components/StoreFooter'
import StoreHeader from '@/components/StoreHeader'
import { getServerCartCount } from '@/lib/cart'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticleBySlug(slug)
  if (!article) {
    return { title: 'Không tìm thấy bài viết' }
  }
  return { title: article.title, description: article.excerpt }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const [article, cartCount] = await Promise.all([
    getPublishedArticleBySlug(slug),
    getServerCartCount(),
  ])

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#f6fbf4] px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-3xl">
        <StoreHeader cartCount={cartCount} />

        <div className="mt-6">
          <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-800" href="/bai-viet">
            ← Tất cả bài viết
          </Link>
        </div>

        <article className="mt-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {article.category}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-stone-900">{article.title}</h1>
          <p className="mt-2 text-sm text-stone-400">
            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : ''}
          </p>

          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={article.title}
              className="mt-5 w-full rounded-2xl object-cover"
              loading="lazy"
              src={article.coverImage}
            />
          ) : null}

          <p className="mt-5 text-lg leading-8 text-stone-600">{article.excerpt}</p>

          <div className="mt-5 border-t border-stone-100 pt-5">
            <MarkdownContent>{article.content}</MarkdownContent>
          </div>
        </article>

        <StoreFooter />
      </div>
    </main>
  )
}
