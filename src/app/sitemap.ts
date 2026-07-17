import type { MetadataRoute } from 'next'
import { getCategoryNavItems } from '@/features/products/queries'
import { getStorefrontProducts } from '@/features/storefront/queries'
import { listPublishedArticles } from '@/features/articles/queries'
import { SITE_URL } from '@/config/site'

// Sitemap đọc THẲNG từ DB (không còn dùng danh mục/sản phẩm tĩnh trong lib/catalog) →
// sản phẩm admin thêm, danh mục bật/ẩn, và bài viết đã đăng đều vào sitemap đúng thực tế.
// getStorefrontProducts/... đã qua Data Cache (revalidate 60s) nên không đập DB mỗi lần
// crawler gọi /sitemap.xml.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const [products, categories, articles] = await Promise.all([
    getStorefrontProducts(),
    getCategoryNavItems(),
    listPublishedArticles(),
  ])

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/bai-viet`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      // `id` của sản phẩm storefront chính là slug (xem features/storefront/queries.ts).
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/bai-viet/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
