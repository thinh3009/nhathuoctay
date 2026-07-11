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
          background: 'linear-gradient(135deg, #E4F4F1 0%, #BFE7E0 45%, #FFF6E9 100%)',
          color: '#263238',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'fit-content',
            padding: '12px 20px',
            borderRadius: '999px',
            background: '#00796B',
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Quầy thuốc 16
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 920 }}>
            Nhà thuốc trực tuyến chính hãng cho cả gia đình bạn
          </div>
          <div style={{ fontSize: 28, color: '#48555B', maxWidth: 860, lineHeight: 1.4 }}>
            Thuốc, thực phẩm chức năng, thiết bị y tế và chăm sóc da — dược sĩ tư vấn miễn phí, giao nhanh tận nơi.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: '#FF8A3D' }}>
          Tận tâm, tận lòng · quaythuoc16.vn
        </div>
      </div>
    ),
    size,
  )
}
