import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublishedArticles } from '@/db/queries/articles'
import StoreFooter from '@/components/StoreFooter'
import StoreHeader from '@/components/StoreHeader'
import { getServerCartCount } from '@/lib/cart'

export const metadata: Metadata = {
  title: 'Bài viết sức khỏe',
  description: 'Tin tức, cẩm nang dùng thuốc và chăm sóc sức khỏe từ nhà thuốc.',
}

function formatDate(value: Date | null) {
  return value ? new Date(value).toLocaleDateString('vi-VN') : ''
}

export default async function BlogPage() {
  const [articles, cartCount] = await Promise.all([
    listPublishedArticles(),
    getServerCartCount(),
  ])

  return (
    <main className="min-h-screen bg-[#f6fbf4] px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <StoreHeader cartCount={cartCount} />

        <header className="mt-6">
          <h1 className="text-3xl font-black text-stone-900">Bài viết sức khỏe</h1>
          <p className="mt-1 text-stone-500">
            Tin tức, cẩm nang dùng thuốc và chăm sóc sức khỏe từ nhà thuốc.
          </p>
        </header>

        {articles.length === 0 ? (
          <div
            className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-white py-16 text-center"
            role="status"
          >
            <p className="text-lg font-semibold text-stone-700">Chưa có bài viết</p>
            <p className="mt-1 text-sm text-stone-500">Nội dung sẽ được cập nhật sớm.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                href={`/bai-viet/${article.slug}`}
                key={article.slug}
              >
                <div className="aspect-[16/9] overflow-hidden bg-emerald-50">
                  {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={article.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                      src={article.coverImage}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700">
                      <span className="text-sm font-semibold">{article.category}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {article.category}
                  </span>
                  <h2 className="mt-1 line-clamp-2 text-base font-bold text-stone-900">
                    {article.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-stone-600">{article.excerpt}</p>
                  <p className="mt-3 text-xs text-stone-400">{formatDate(article.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <StoreFooter />
      </div>
    </main>
  )
}
