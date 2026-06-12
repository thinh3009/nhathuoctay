import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import LandingSection from '@/components/landing/LandingSection'
import StoreHeroCarousel from '@/components/landing/StoreHeroCarousel'
import { commitments, products } from '@/lib/catalog'
import { CATEGORY_CONFIG, DEFAULT_CATEGORY_SLUG } from '@/lib/constants'
import { SITE_NAME, SITE_URL } from '@/config/site'

export const metadata: Metadata = {
  title: 'Thực phẩm chức năng chính hãng cho cả gia đình',
  description:
    'NutriHome cung cấp thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc với kiến trúc landing page tối ưu SEO bằng Next.js App Router.',
  keywords: [
    'thực phẩm chức năng',
    'vitamin',
    'omega 3',
    'collagen',
    'chăm sóc sức khỏe',
    'nhà thuốc online',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'NutriHome - Thực phẩm chức năng và chăm sóc sức khỏe',
    description:
      'Mua thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc trong một storefront được tối ưu SEO bằng Next.js.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'NutriHome storefront',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
}

const featuredProducts = products
  .filter((product) => product.topCategorySlug === DEFAULT_CATEGORY_SLUG)
  .sort((left, right) => right.rating - left.rating)
  .slice(0, 3)

const bestSellerProducts = [...products]
  .sort((left, right) => right.reviewCount - left.reviewCount)
  .slice(0, 4)

const skincareHighlight = products
  .filter((product) => product.topCategorySlug === 'cham-soc-da')
  .sort((left, right) => right.rating - left.rating)
  .slice(0, 3)

const deviceHighlight = products
  .filter((product) => product.topCategorySlug === 'thiet-bi-y-te')
  .sort((left, right) => right.rating - left.rating)
  .slice(0, 3)

const supportCards = [
  {
    title: 'Tư vấn theo nhu cầu',
    description: 'Gợi ý sản phẩm theo mục tiêu sức khỏe như tim mạch, đề kháng, đẹp da và xương khớp.',
  },
  {
    title: 'Danh mục rõ ràng',
    description: 'Mỗi nhóm sản phẩm có route riêng để thuận tiện cho SEO, điều hướng và mở rộng chiến dịch.',
  },
  {
    title: 'Mua hàng dễ mở rộng',
    description: 'Cấu trúc App Router giúp thêm landing campaign, blog hoặc danh mục mới mà không phải đập lại layout.',
  },
]

const comboGroups = [
  {
    title: 'Combo đề kháng mỗi ngày',
    description: 'Bộ gợi ý cho người cần bổ sung vitamin C, omega 3 và nhóm dưỡng chất nền tảng.',
    href: '/category/thuc-pham-chuc-nang',
    items: featuredProducts.slice(0, 2),
  },
  {
    title: 'Combo đẹp da và phục hồi',
    description: 'Gợi ý kết hợp collagen và chăm sóc da để kéo người dùng sang luồng mua hàng làm đẹp.',
    href: '/category/cham-soc-da',
    items: [featuredProducts[2], ...skincareHighlight.slice(0, 1)].filter(Boolean),
  },
  {
    title: 'Combo chăm sóc gia đình',
    description: 'Phù hợp cho nhà có trẻ nhỏ hoặc người lớn tuổi cần thiết bị theo dõi sức khỏe tại nhà.',
    href: '/category/thiet-bi-y-te',
    items: deviceHighlight.slice(0, 2),
  },
  {
    title: 'Combo tim mạch và xương khớp',
    description: 'Tập trung vào nhu cầu bồi bổ nền tảng cho người làm việc cường độ cao và người trưởng thành.',
    href: '/category/thuc-pham-chuc-nang',
    items: [featuredProducts[0], featuredProducts[1]].filter(Boolean),
  },
]

const testimonials = [
  {
    name: 'Ngọc Anh',
    role: 'Khách mua vitamin',
    quote:
      'Trang chủ đi thẳng vào nhóm thực phẩm chức năng nên mình tìm sản phẩm nhanh hơn, không bị rối giữa quá nhiều nội dung.',
  },
  {
    name: 'Minh Khang',
    role: 'Khách mua cho gia đình',
    quote:
      'Bố cục category và product rõ ràng, nhìn vào là biết website bán gì. Phần đánh giá và gợi ý sản phẩm liên quan cũng dễ xem.',
  },
  {
    name: 'Thanh Vy',
    role: 'Khách mua collagen',
    quote:
      'Landing page có cảm giác chuyên nghiệp hơn vì vừa giới thiệu được danh mục, vừa đưa ra sản phẩm nổi bật ngay từ đầu.',
  },
]

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITE_NAME,
  url: SITE_URL,
  description:
    'NutriHome là storefront bán thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc với kiến trúc Next.js tối ưu SEO.',
  makesOffer: featuredProducts.map((product) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Product',
      name: product.name,
    },
    priceCurrency: 'VND',
    price: product.price,
    availability: 'https://schema.org/InStock',
  })),
}

const heroSlides = [
  {
    eyebrow: 'Storefront chuẩn SEO',
    title: 'Thực phẩm chức năng chính hãng cho cả gia đình với trải nghiệm mua hàng rõ ràng và dễ mở rộng',
    description:
      'Homepage được đưa về đúng vai trò bán hàng: lấy thực phẩm chức năng làm trung tâm, hiển thị danh mục rõ ràng, đẩy sản phẩm nổi bật lên đầu và giữ nguyên lớp kỹ thuật SEO phía sau.',
    primaryCta: {
      label: 'Mua thực phẩm chức năng',
      href: `/category/${DEFAULT_CATEGORY_SLUG}`,
    },
    secondaryCta: {
      label: 'Xem best seller',
      href: '#best-seller',
    },
    stats: [
      {
        label: 'Social proof',
        value: '4.8/5',
        description: 'Điểm đánh giá trung bình cao cho nhóm sản phẩm chủ lực.',
      },
      {
        label: 'Mục tiêu chính',
        value: 'Bán nhanh hơn',
        description: 'Đi thẳng từ homepage vào danh mục và sản phẩm hot.',
      },
      {
        label: 'Cam kết',
        value: 'Chính hãng',
        description: commitments[0] ?? 'Sản phẩm rõ nguồn gốc.',
      },
    ],
    products: featuredProducts,
  },
  {
    eyebrow: 'Làm đẹp và phục hồi',
    title: 'Kéo thêm doanh thu từ nhóm chăm sóc da bằng cách đặt đúng luồng mua sắm trên hero',
    description:
      'Một slide riêng cho làm đẹp giúp homepage không chỉ bán thực phẩm chức năng mà còn mở luồng bán chéo sang serum, làm sạch và dưỡng ẩm.',
    primaryCta: {
      label: 'Xem chăm sóc da',
      href: '/category/cham-soc-da',
    },
    secondaryCta: {
      label: 'Xem combo đẹp da',
      href: '#combo-suc-khoe',
    },
    stats: [
      {
        label: 'Bán chéo',
        value: '2 luồng',
        description: 'Kết nối giữa collagen và routine chăm sóc da.',
      },
      {
        label: 'Mục tiêu',
        value: 'Đẹp da',
        description: 'Dành cho khách hàng quan tâm phục hồi và sáng da.',
      },
      {
        label: 'Tối ưu',
        value: 'Route riêng',
        description: 'Category riêng cho chăm sóc da hỗ trợ SEO và quảng cáo.',
      },
    ],
    products: skincareHighlight,
  },
  {
    eyebrow: 'Gia đình và theo dõi sức khỏe',
    title: 'Thiết bị y tế tại nhà nên có lối vào riêng để tăng độ tin cậy và tăng giá trị đơn hàng',
    description:
      'Hero slide cho thiết bị y tế giúp storefront dễ mở rộng sang combo máy đo, nhiệt kế và sản phẩm chăm sóc gia đình.',
    primaryCta: {
      label: 'Xem thiết bị y tế',
      href: '/category/thiet-bi-y-te',
    },
    secondaryCta: {
      label: 'Xem combo gia đình',
      href: '#combo-suc-khoe',
    },
    stats: [
      {
        label: 'Thiết bị',
        value: '3 nhóm',
        description: 'Nhiệt kế, máy đo huyết áp và máy xông khí dung.',
      },
      {
        label: 'Mục tiêu',
        value: 'Gia đình',
        description: 'Dành cho nhu cầu theo dõi sức khỏe tại nhà.',
      },
      {
        label: 'Upsell',
        value: 'Cao hơn',
        description: 'Nhóm sản phẩm có tiềm năng tăng giá trị giỏ hàng.',
      },
    ],
    products: deviceHighlight,
  },
]

export default function LandingPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        type="application/ld+json"
      />

      <StoreHeroCarousel slides={heroSlides} />

      <div className="mt-4 grid gap-3 lg:mt-6 lg:grid-cols-3 lg:gap-4">
        {supportCards.map((item) => (
          <article
            className="rounded-[22px] border border-stone-200 bg-white p-4 shadow-sm shadow-emerald-100 sm:rounded-[24px] sm:p-5"
            key={item.title}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">
              ✓
            </div>
            <h2 className="mt-3 text-lg font-bold text-stone-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
        <LandingSection
          eyebrow="Danh mục trọng tâm"
          title="Đi nhanh vào từng nhóm sản phẩm"
          description="Homepage cần dẫn người dùng vào đúng luồng mua sắm. Phần này giữ vai trò điều hướng chính, đồng thời giúp SEO hiểu được website đang bán gì."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 sm:gap-4">
            {CATEGORY_CONFIG.map((category, index) => (
              <Link
                className={`rounded-[22px] px-4 py-4 text-white shadow-md sm:rounded-[24px] sm:px-5 sm:py-5 ${
                  index % 4 === 0
                    ? 'bg-gradient-to-br from-emerald-800 to-green-500'
                    : index % 4 === 1
                      ? 'bg-gradient-to-br from-lime-700 to-emerald-500'
                      : index % 4 === 2
                        ? 'bg-gradient-to-br from-green-700 to-teal-500'
                        : 'bg-gradient-to-br from-emerald-700 to-lime-500'
                }`}
                href={`/category/${category.slug}`}
                key={category.slug}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Danh mục</p>
                <p className="mt-2 text-xl font-bold">{category.label}</p>
                <p className="mt-2 text-sm leading-6 text-white/90">{category.heroDescription}</p>
              </Link>
            ))}
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="Sản phẩm nổi bật"
          title="Ba sản phẩm nên đẩy lên màn hình đầu"
          description="Đây là nhóm thực phẩm chức năng xuất hiện đầu tiên để tăng khả năng click vào product detail hoặc thêm vào giỏ hàng ngay từ homepage."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </LandingSection>

        <div id="combo-suc-khoe">
          <LandingSection
            eyebrow="Combo theo mục tiêu sức khỏe"
            title="Gợi ý mua theo nhu cầu để tăng giá trị đơn hàng"
            description="Thay vì chỉ bán từng sản phẩm lẻ, nhóm combo giúp người dùng hiểu ngay nên bắt đầu từ đâu và cũng tạo cơ hội bán chéo tốt hơn."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {comboGroups.map((combo) => (
                <article className="rounded-[22px] border border-stone-200 bg-stone-50 p-4 sm:rounded-[24px] sm:p-5" key={combo.title}>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Combo</p>
                  <h3 className="mt-3 text-lg font-bold text-stone-900">{combo.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{combo.description}</p>

                  <div className="mt-4 space-y-2">
                    {combo.items.map((item) => (
                      <div
                        className="rounded-2xl border border-white bg-white px-3 py-3 text-sm shadow-sm"
                        key={item.slug}
                      >
                        <p className="font-semibold text-stone-900">{item.name}</p>
                        <p className="mt-1 text-emerald-700">{item.subCategory}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    href={combo.href}
                  >
                    Xem danh mục
                  </Link>
                </article>
              ))}
            </div>
          </LandingSection>
        </div>

        <div id="best-seller">
          <LandingSection
            eyebrow="Best seller"
            title="Các sản phẩm có độ quan tâm cao trên storefront"
            description="Thêm một lớp nội dung best seller để tăng chuyển đổi và tạo tín hiệu xã hội rõ hơn cho người dùng mới."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 sm:gap-4">
              {bestSellerProducts.map((product) => (
                <article className="rounded-[22px] border border-stone-200 bg-stone-50 p-4 sm:rounded-[24px] sm:p-5" key={product.slug}>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {product.badge}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-stone-900">{product.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{product.shortDescription}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-stone-500">{product.reviewCount} đánh giá</span>
                    <Link
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      href={`/product/${product.slug}`}
                    >
                      Xem ngay
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </LandingSection>
        </div>

        <LandingSection
          eyebrow="Khách hàng nói gì"
          title="Feedback để tăng độ tin cậy trên landing"
          description="Nhóm phản hồi ngắn này giúp trang chủ có cảm giác sống hơn và hỗ trợ quyết định mua hàng sớm hơn."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article className="rounded-[22px] border border-stone-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5" key={item.name}>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {item.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <p className="text-sm text-stone-500">{item.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-600">&ldquo;{item.quote}&rdquo;</p>
              </article>
            ))}
          </div>
        </LandingSection>
      </div>
    </>
  )
}
