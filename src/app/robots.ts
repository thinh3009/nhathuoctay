import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Trang riêng tư/giao dịch/API: không có giá trị SEO, lãng phí crawl budget và
      // không nên lọt vào index. Chặn ở robots (không phải bảo mật — bảo mật vẫn dựa
      // vào requireAdmin per-action, xem CLAUDE.md mục 3).
      disallow: ['/admin', '/account', '/checkout', '/cart', '/auth', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
