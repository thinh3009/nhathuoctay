import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import LandingPromoStrip from '@/components/landing/LandingPromoStrip'
import LandingSection from '@/components/landing/LandingSection'
import LandingShortcutGrid from '@/components/landing/LandingShortcutGrid'
import StoreHeroCarousel from '@/components/landing/StoreHeroCarousel'
import AnimateIn from '@/components/ui/AnimateIn'
import { commitments, products } from '@/lib/catalog'
import { CATEGORY_CONFIG, DEFAULT_CATEGORY_SLUG } from '@/lib/constants'
import { SITE_NAME, SITE_URL } from '@/config/site'

export const metadata: Metadata = {
  title: 'Thực phẩm chức năng chính hãng cho cả gia đình',
  description:
    'NutriHome cung cấp thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc với trang chủ tối ưu cho chuyển đổi và điều hướng mua hàng.',
  keywords: [
    'thực phẩm chức năng',
    'vitamin',
    'omega 3',
    'collagen',
    'chăm sóc sức khỏe',
    'nhà thuốc online',
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'NutriHome - Thực phẩm chức năng và chăm sóc sức khỏe',
    description:
      'Mua thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc trong một storefront được tối ưu cho mobile và SEO.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'NutriHome storefront' }],
    locale: 'vi_VN',
    type: 'website',
  },
}

/* ── Data ── */

const featuredProducts = products
  .filter((p) => p.topCategorySlug === DEFAULT_CATEGORY_SLUG)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 3)

const bestSellerProducts = [...products]
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 4)

const skincareHighlight = products
  .filter((p) => p.topCategorySlug === 'cham-soc-da')
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 3)

const deviceHighlight = products
  .filter((p) => p.topCategorySlug === 'thiet-bi-y-te')
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 3)

const promoCards = [
  {
    title: 'Ưu đãi đề kháng mỗi ngày',
    description: 'Vitamin, omega 3 và nhóm hỗ trợ miễn dịch được gom vào một luồng mua sắm rõ ràng.',
    badge: 'Ưu đãi nổi bật',
    href: `/category/${DEFAULT_CATEGORY_SLUG}`,
    ctaLabel: 'Mua ngay',
  },
  {
    title: 'Routine đẹp da dễ chọn',
    description: 'Serum, làm sạch và phục hồi — chọn nhanh không loãng trải nghiệm.',
    badge: 'Chăm sóc da',
    href: '/category/cham-soc-da',
    ctaLabel: 'Xem danh mục',
  },
  {
    title: 'Thiết bị theo dõi tại nhà',
    description: 'Nhiệt kế, máy đo và nhóm hỗ trợ gia đình — mua nhanh đúng nhu cầu.',
    badge: 'Gia đình',
    href: '/category/thiet-bi-y-te',
    ctaLabel: 'Xem thiết bị',
  },
]

const shortcutItems = [
  { title: 'Cần mua thuốc', href: '/category/thuoc', icon: 'pill' as const },
  { title: 'Tư vấn dược sĩ', href: `/category/${DEFAULT_CATEGORY_SLUG}`, icon: 'advisor' as const },
  { title: 'Đơn của tôi', href: '/cart', icon: 'note' as const },
  { title: 'Tìm nhà thuốc', href: '/category/thiet-bi-y-te', icon: 'pin' as const },
  { title: 'Tiêm vắc xin', href: '/category/thuc-pham-chuc-nang', icon: 'vaccine' as const },
  { title: 'Tra thuốc chính hãng', href: '/category/thuoc', icon: 'lookup' as const },
]

const comboGroups = [
  {
    title: 'Combo đề kháng mỗi ngày',
    description: 'Vitamin C, omega 3 và dưỡng chất nền tảng.',
    href: '/category/thuc-pham-chuc-nang',
    color: 'emerald',
    items: featuredProducts.slice(0, 2),
  },
  {
    title: 'Combo đẹp da và phục hồi',
    description: 'Collagen và chăm sóc da cho làn da sáng khoẻ.',
    href: '/category/cham-soc-da',
    color: 'teal',
    items: [featuredProducts[2], ...skincareHighlight.slice(0, 1)].filter(Boolean),
  },
  {
    title: 'Combo chăm sóc gia đình',
    description: 'Thiết bị theo dõi sức khỏe phù hợp mọi nhà.',
    href: '/category/thiet-bi-y-te',
    color: 'green',
    items: deviceHighlight.slice(0, 2),
  },
  {
    title: 'Combo tim mạch và xương khớp',
    description: 'Bồi bổ nền tảng cho người trưởng thành.',
    href: '/category/thuc-pham-chuc-nang',
    color: 'lime',
    items: [featuredProducts[0], featuredProducts[1]].filter(Boolean),
  },
]

const testimonials = [
  {
    name: 'Ngọc Anh',
    role: 'Khách mua vitamin',
    rating: 5,
    quote: 'Trang chủ đi thẳng vào nhóm thực phẩm chức năng nên mình tìm sản phẩm nhanh hơn, không bị rối giữa quá nhiều nội dung.',
    initials: 'NA',
  },
  {
    name: 'Minh Khang',
    role: 'Khách mua cho gia đình',
    rating: 5,
    quote: 'Bố cục category và product rõ ràng, nhìn vào là biết website bán gì. Phần gợi ý sản phẩm liên quan cũng rất dễ xem.',
    initials: 'MK',
  },
  {
    name: 'Thanh Vy',
    role: 'Khách mua collagen',
    rating: 5,
    quote: 'Landing page chuyên nghiệp vì vừa giới thiệu được danh mục, vừa đưa ra sản phẩm nổi bật ngay từ màn đầu.',
    initials: 'TV',
  },
]

const trustItems = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138Z" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    title: 'Chính hãng 100%',
    desc: 'Nguồn gốc rõ ràng, kiểm định chất lượng',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    title: 'Giao hàng nhanh',
    desc: 'Nội thành 2–4 giờ, toàn quốc 1–3 ngày',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 12h4l3 8 4-16 3 8h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    title: 'Đổi trả 30 ngày',
    desc: 'Không hài lòng, hoàn tiền toàn bộ',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    title: 'Dược sĩ tư vấn',
    desc: 'Hỗ trợ miễn phí từ 8:00 đến 22:00',
  },
]

const heroSlides = [
  {
    eyebrow: 'Chính hãng mỗi ngày',
    title: 'Thực phẩm chức năng chính hãng cho cả gia đình',
    description:
      'Lấy thực phẩm chức năng làm trung tâm, đẩy sản phẩm nổi bật lên đầu và giữ luồng mua sắm gọn cho người dùng điện thoại.',
    primaryCta: { label: 'Mua thực phẩm chức năng', href: `/category/${DEFAULT_CATEGORY_SLUG}` },
    secondaryCta: { label: 'Xem best seller', href: '#best-seller' },
    stats: [
      { label: 'Đánh giá', value: '4.8/5', description: 'Điểm đánh giá trung bình nhóm sản phẩm chủ lực' },
      { label: 'Sản phẩm', value: '500+', description: 'Sản phẩm chính hãng sẵn kho' },
      { label: 'Cam kết', value: 'Chính hãng', description: commitments[0] ?? 'Sản phẩm rõ nguồn gốc' },
    ],
    products: featuredProducts,
  },
  {
    eyebrow: 'Đẹp da và phục hồi',
    title: 'Luồng làm đẹp với nhóm chăm sóc da được tách rõ',
    description:
      'Một slide riêng cho làm đẹp giúp homepage mở thêm luồng bán chéo sang serum, làm sạch và dưỡng ẩm hiệu quả.',
    primaryCta: { label: 'Xem chăm sóc da', href: '/category/cham-soc-da' },
    secondaryCta: { label: 'Xem combo đẹp da', href: '#combo-suc-khoe' },
    stats: [
      { label: 'Bán chéo', value: '2 luồng', description: 'Kết nối giữa collagen và routine chăm sóc da' },
      { label: 'Mục tiêu', value: 'Đẹp da', description: 'Dành cho khách quan tâm phục hồi và sáng da' },
      { label: 'Route', value: 'Riêng biệt', description: 'Category riêng hỗ trợ SEO và quảng cáo' },
    ],
    products: skincareHighlight,
  },
  {
    eyebrow: 'Gia đình và sức khỏe',
    title: 'Thiết bị y tế tại nhà — lối vào riêng, tin cậy hơn',
    description:
      'Hero slide cho thiết bị y tế giúp storefront mở rộng sang combo máy đo, nhiệt kế và sản phẩm chăm sóc gia đình.',
    primaryCta: { label: 'Xem thiết bị y tế', href: '/category/thiet-bi-y-te' },
    secondaryCta: { label: 'Xem combo gia đình', href: '#combo-suc-khoe' },
    stats: [
      { label: 'Thiết bị', value: '3 nhóm', description: 'Nhiệt kế, máy đo huyết áp, máy xông' },
      { label: 'Mục tiêu', value: 'Gia đình', description: 'Theo dõi sức khỏe tại nhà dễ dàng' },
      { label: 'Upsell', value: 'Cao hơn', description: 'Tiềm năng tăng giá trị giỏ hàng tốt' },
    ],
    products: deviceHighlight,
  },
]

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITE_NAME,
  url: SITE_URL,
  description: 'NutriHome là storefront bán thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc với trang chủ tối ưu cho mobile.',
  makesOffer: featuredProducts.map((p) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Product', name: p.name },
    priceCurrency: 'VND',
    price: p.price,
    availability: 'https://schema.org/InStock',
  })),
}

const COMBO_ACCENT: Record<string, string> = {
  emerald: 'border-emerald-400 bg-emerald-50 text-emerald-700',
  teal: 'border-teal-400 bg-teal-50 text-teal-700',
  green: 'border-green-500 bg-green-50 text-green-700',
  lime: 'border-lime-500 bg-lime-50 text-lime-700',
}

export default function LandingPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />

      {/* ── Hero ── */}
      <StoreHeroCarousel slides={heroSlides} />

      {/* ── Trust badges ── */}
      <AnimateIn className="mt-4 sm:mt-5" variant="up" delay={100}>
        <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-stone-100 bg-white p-4 shadow-sm shadow-emerald-100/50 sm:grid-cols-4 sm:gap-4 sm:rounded-[28px] sm:p-5">
          {trustItems.map((item) => (
            <div className="flex items-start gap-3" key={item.title}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-stone-900">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimateIn>

      {/* ── Shortcuts + Promos ── */}
      <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
        <LandingShortcutGrid items={shortcutItems} />
        <LandingPromoStrip items={promoCards} />
      </div>

      {/* ── Main content sections ── */}
      <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">

        {/* ── Categories ── */}
        <LandingSection
          eyebrow="Danh mục trọng tâm"
          title="Đi nhanh vào từng nhóm sản phẩm"
          description="Chọn đúng danh mục — tìm đúng sản phẩm. Mua nhanh, không bị loạn thông tin."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {CATEGORY_CONFIG.map((category, index) => {
              const gradients = [
                'from-emerald-800 to-green-500',
                'from-teal-700 to-emerald-500',
                'from-green-700 to-teal-500',
                'from-emerald-700 to-lime-500',
              ]
              return (
                <AnimateIn delay={index * 70} key={category.slug} variant="scale">
                  <Link
                    className={`group block rounded-[22px] bg-gradient-to-br px-5 py-5 text-white shadow-md transition-all duration-250 hover:-translate-y-1 hover:shadow-lg sm:rounded-[24px] ${gradients[index % gradients.length]}`}
                    href={`/category/${category.slug}`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
                      Danh mục
                    </p>
                    <p className="mt-2 text-xl font-black leading-tight">{category.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/85">{category.heroDescription}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/80 transition-all group-hover:text-white">
                      Xem ngay
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24">
                        <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </Link>
                </AnimateIn>
              )
            })}
          </div>
        </LandingSection>

        {/* ── Featured products ── */}
        <LandingSection
          eyebrow="Sản phẩm nổi bật"
          title="Top thực phẩm chức năng được chọn nhiều nhất"
          description="Nhóm sản phẩm xuất hiện đầu tiên để tăng khả năng click vào product detail hoặc thêm vào giỏ hàng ngay từ homepage."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product, i) => (
              <AnimateIn delay={i * 80} key={product.slug} variant="up">
                <ProductCard product={product} />
              </AnimateIn>
            ))}
          </div>
        </LandingSection>

        {/* ── Combo section ── */}
        <div id="combo-suc-khoe">
          <LandingSection
            eyebrow="Combo theo mục tiêu sức khỏe"
            title="Gợi ý mua theo nhu cầu, tăng giá trị đơn hàng"
            description="Thay vì bán từng sản phẩm lẻ, nhóm combo giúp người dùng hiểu ngay nên bắt đầu từ đâu."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {comboGroups.map((combo, i) => {
                const accent = COMBO_ACCENT[combo.color] ?? COMBO_ACCENT['emerald']!
                return (
                  <AnimateIn delay={i * 70} key={combo.title} variant="up">
                    <article className="flex h-full flex-col rounded-[22px] border border-stone-100 bg-stone-50 p-5 sm:rounded-[24px]">
                      <span className={`self-start rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${accent}`}>
                        Combo
                      </span>
                      <h3 className="mt-3.5 text-base font-black text-stone-900 leading-snug">
                        {combo.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-500">{combo.description}</p>

                      <div className="mt-4 flex-1 space-y-2">
                        {combo.items.map((item) => (
                          <div
                            className="rounded-2xl border border-white bg-white px-3.5 py-3 shadow-sm"
                            key={item.slug}
                          >
                            <p className="text-sm font-semibold text-stone-900 leading-tight">{item.name}</p>
                            <p className="mt-0.5 text-xs text-emerald-700">{item.subCategory}</p>
                          </div>
                        ))}
                      </div>

                      <Link
                        className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md"
                        href={combo.href}
                      >
                        Xem danh mục
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                        </svg>
                      </Link>
                    </article>
                  </AnimateIn>
                )
              })}
            </div>
          </LandingSection>
        </div>

        {/* ── Best sellers ── */}
        <div id="best-seller">
          <LandingSection
            eyebrow="Best seller"
            title="Sản phẩm được quan tâm nhiều nhất"
            description="Thêm một lớp nội dung best seller để tăng chuyển đổi và tạo tín hiệu xã hội rõ hơn cho người dùng mới."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {bestSellerProducts.map((product, i) => (
                <AnimateIn delay={i * 65} key={product.slug} variant="up">
                  <article className="group flex h-full flex-col rounded-[22px] border border-stone-100 bg-stone-50 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100/60 sm:rounded-[24px] sm:p-5">
                    <span className="self-start rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                      {product.badge}
                    </span>
                    <h3 className="mt-3 flex-1 text-base font-bold text-stone-900 leading-snug">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-500 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
                        </svg>
                        {product.reviewCount} đánh giá
                      </span>
                      <Link
                        className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-700 hover:text-white hover:shadow-md"
                        href={`/product/${product.slug}`}
                      >
                        Xem ngay
                      </Link>
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
          </LandingSection>
        </div>

        {/* ── Testimonials ── */}
        <LandingSection
          eyebrow="Khách hàng nói gì"
          title="Hơn 1.000 khách hàng tin tưởng NutriHome"
          description="Phản hồi thực từ khách hàng — tăng độ tin cậy và hỗ trợ quyết định mua hàng nhanh hơn."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item, i) => (
              <AnimateIn delay={i * 80} key={item.name} variant="up">
                <article className="flex h-full flex-col rounded-[22px] border border-stone-100 bg-white p-5 shadow-sm sm:rounded-[24px]">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, si) => (
                      <svg className="h-4 w-4 text-amber-400" fill="currentColor" key={si} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
                      </svg>
                    ))}
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-7 text-stone-600 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-xs font-black text-white shadow-sm">
                      {item.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-400">{item.role}</p>
                    </div>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>
        </LandingSection>

        {/* ── Bottom CTA banner ── */}
        <AnimateIn variant="scale">
          <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-6 py-10 text-center shadow-xl shadow-emerald-900/20 sm:rounded-[32px] sm:px-10 sm:py-14">
            {/* Decorations */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
            </div>

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                  Nhà thuốc tin cậy
                </span>
              </span>

              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Chăm sóc sức khỏe gia đình đơn giản hơn với NutriHome
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-100/70 sm:text-base">
                Hơn 500 sản phẩm chính hãng, giao nhanh toàn quốc. Dược sĩ tư vấn miễn phí — từ 8:00 đến 22:00 mỗi ngày.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-emerald-900 shadow-lg shadow-white/10 transition-all hover:scale-[1.03] hover:bg-emerald-50 hover:shadow-xl active:scale-95"
                  href={`/category/${DEFAULT_CATEGORY_SLUG}`}
                >
                  Xem tất cả sản phẩm
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
                  </svg>
                </Link>
                <Link
                  className="inline-flex rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  href="/cart"
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          </section>
        </AnimateIn>

      </div>
    </>
  )
}
