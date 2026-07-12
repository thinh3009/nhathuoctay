// Logo "Quầy Thuốc Tây Số 16" — ảnh thương hiệu cứng đặt tại public/logo_brand.svg.
// Hiển thị theo chiều cao cố định, chiều rộng tự co theo tỉ lệ (không méo ảnh).

const LOGO_SRC = '/logo_brand.svg'

export default function Logo({
  height = 46,
  title = 'Quầy Thuốc Tây Số 16',
}: {
  height?: number
  title?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt={title}
      style={{ height, width: 'auto', display: 'block', objectFit: 'contain' }}
    />
  )
}
