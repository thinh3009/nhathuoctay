import type { MetadataRoute } from 'next'
import { products } from '@/lib/catalog'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { SITE_URL } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...CATEGORY_CONFIG.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
