import type { Metadata } from 'next'
import QuayThuoc16 from '@/components/quaythuoc/QuayThuoc16'
import { getStorefrontProducts } from '@/db/queries/storefront'
import { SITE_NAME, SITE_URL } from '@/config/site'

// ISR: cache HTML trang chủ, tự làm mới mỗi 60s. Khi admin thêm/sửa sản phẩm,
// action gọi revalidatePath('/') nên sản phẩm mới hiện ngay lập tức.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Quầy thuốc 16 — Nhà thuốc trực tuyến chính hãng',
  description:
    'Quầy thuốc 16: thuốc, thực phẩm chức năng, chăm sóc da và thiết bị y tế chính hãng. Dược sĩ tư vấn miễn phí, đặt thuốc theo toa, giao nhanh trong 2 giờ nội thành.',
  keywords: ['nhà thuốc online', 'quầy thuốc 16', 'thuốc', 'thực phẩm chức năng', 'thiết bị y tế', 'đặt thuốc theo toa'],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Quầy thuốc 16 — Tận tâm, tận lòng',
    description:
      'Nhà thuốc trực tuyến chính hãng 100%. Thuốc, thực phẩm chức năng, chăm sóc da, thiết bị y tế. Dược sĩ tư vấn 24/7, giao nhanh 2 giờ.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'vi_VN',
    type: 'website',
  },
}

export default async function LandingPage() {
  const products = await getStorefrontProducts()
  return <QuayThuoc16 products={products} />
}
