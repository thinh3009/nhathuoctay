import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background:
            'linear-gradient(135deg, #ecfccb 0%, #d9f99d 20%, #dcfce7 50%, #ffffff 100%)',
          color: '#14532d',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'fit-content',
            padding: '12px 20px',
            borderRadius: '999px',
            background: '#166534',
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Next.js Landing Architecture
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 920 }}>
            Kiến trúc landing page tối ưu SEO, redirect và metadata với App Router
          </div>
          <div style={{ fontSize: 28, color: '#365314', maxWidth: 860, lineHeight: 1.4 }}>
            Sitemap, robots, middleware, canonical và Open Graph được tổ chức rõ ràng để triển khai production.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: '#15803d' }}>
          nextjs • seo • redirect • metadata
        </div>
      </div>
    ),
    size,
  )
}
