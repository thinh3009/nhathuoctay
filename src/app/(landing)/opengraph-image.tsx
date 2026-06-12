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
            'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 65%, #fef3c7 100%)',
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
          NutriHome
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 920 }}>
            Thực phẩm chức năng và chăm sóc sức khỏe cho cả gia đình
          </div>
          <div style={{ fontSize: 28, color: '#365314', maxWidth: 860, lineHeight: 1.4 }}>
            Bố cục landing page bán hàng được dựng bằng Next.js App Router với metadata, sitemap và redirect tối ưu SEO.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: '#15803d' }}>
          supplements • skincare • medical devices • pharmacy
        </div>
      </div>
    ),
    size,
  )
}
