import type { Metadata } from 'next'
import QuayThuoc16 from '@/components/quaythuoc/QuayThuoc16'
import { getStorefrontProducts, getStorefrontNews, getStorefrontCombos, getStorefrontHeroImages } from '@/db/queries/storefront'
import { SITE_NAME, SITE_URL } from '@/config/site'

// Trang đọc searchParams (?screen=, ?cat=…) để server render đúng màn SPA đang xem —
// F5 giữ nguyên màn danh mục/sản phẩm, không nháy về trang chủ. Đọc searchParams
// khiến trang render động mỗi request (không còn cache ISR như trước).

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

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [products, news, combos, heroImages, params] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontNews(),
    getStorefrontCombos(),
    getStorefrontHeroImages(),
    searchParams,
  ])
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

  return (
    <QuayThuoc16
      combos={combos}
      heroImages={heroImages}
      initialParams={{
        screen: first(params.screen),
        cat: first(params.cat),
        deals: first(params.deals),
        p: first(params.p),
        q: first(params.q),
        rx: first(params.rx),
      }}
      news={news}
      products={products}
    />
  )
}
