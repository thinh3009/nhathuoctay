import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedArticleBySlug } from '@/features/articles/queries'
import MarkdownContent from '@/components/ui/MarkdownContent'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { getServerCartCount } from '@/lib/cart'
import { JsonLd, toAbsoluteUrl } from '@/components/ui/JsonLd'
import { SITE_NAME, SITE_URL } from '@/config/site'

// Render theo từng request (không prerender lúc build) để build không cần DB.
export const dynamic = 'force-dynamic'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticleBySlug(slug)
  // notFound() ở generateMetadata → HTTP 404 thật cho slug sai (loading.tsx làm notFound() ở
  // component trả soft-404 200). Xem CLAUDE.md.
  if (!article) {
    notFound()
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

  const articleUrl = `${SITE_URL}/bai-viet/${article.slug}`
  const articleLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        image: article.coverImage ? [toAbsoluteUrl(article.coverImage)] : undefined,
        datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
        dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo_brand.svg` },
        },
        mainEntityOfPage: articleUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Bài viết', item: `${SITE_URL}/bai-viet` },
          { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-page)] text-stone-900">
      <JsonLd data={articleLd} />
      <SiteHeader activeCategorySlug="" cartCount={cartCount} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div>
          <Link className="text-sm font-semibold text-brand-700 hover:text-brand-800" href="/bai-viet">
            ← Tất cả bài viết
          </Link>
        </div>

        <article className="mt-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
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
      </main>

      <SiteFooter />
    </div>
  )
}
