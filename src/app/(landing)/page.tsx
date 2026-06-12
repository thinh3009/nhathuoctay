import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import LandingSection from '@/components/landing/LandingSection'
import { commitments, products } from '@/lib/catalog'
import { CATEGORY_CONFIG, DEFAULT_CATEGORY_SLUG } from '@/lib/constants'
import { SITE_NAME, SITE_URL } from '@/config/site'

export const metadata: Metadata = {
  title: 'Thực phẩm chức năng chính hãng cho cả gia đình',
  description:
    'NutriHome cung cấp thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc với cấu trúc landing page tối ưu SEO bằng Next.js App Router.',
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

const highlightProducts = products
  .filter((product) => product.topCategorySlug !== DEFAULT_CATEGORY_SLUG)
  .sort((left, right) => right.rating - left.rating)
  .slice(0, 3)

const serviceHighlights = [
  {
    title: 'Tư vấn theo nhu cầu',
    description:
      'Nhóm nội dung được chia theo mục tiêu sức khỏe để người dùng tìm đúng sản phẩm nhanh hơn.',
  },
  {
    title: 'Danh mục rõ ràng',
    description:
      'Thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc được tách route riêng để thuận tiện SEO và điều hướng.',
  },
  {
    title: 'Kiến trúc sẵn sàng mở rộng',
    description:
      'Landing page, category page và product detail được tổ chức tách lớp, phù hợp để thêm content marketing hoặc campaign mới.',
  },
]

const faqItems = [
  {
    question: 'Website này phù hợp để bán những nhóm sản phẩm nào?',
    answer:
      'Trang chủ được thiết kế cho thực phẩm chức năng là trọng tâm, đồng thời vẫn mở rộng tốt cho chăm sóc da, thiết bị y tế và thuốc.',
  },
  {
    question: 'Kiến trúc hiện tại có tối ưu SEO không?',
    answer:
      'Có. App Router, metadata, sitemap, robots, Open Graph và middleware redirect đã được tách thành các lớp riêng để phục vụ SEO và điều hướng.',
  },
  {
    question: 'Có thể thêm landing campaign riêng sau này không?',
    answer:
      'Có. Route group `(landing)` giúp bạn thêm các route chiến dịch hoặc trang đích riêng mà không ảnh hưởng các khu vực category và product hiện tại.',
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

export default function LandingPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        type="application/ld+json"
      />

      <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-lime-50 p-8 shadow-sm shadow-emerald-100 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Landing page chuẩn storefront
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
              Website bán thực phẩm chức năng với kiến trúc Next.js rõ ràng, tối ưu SEO và sẵn sàng mở rộng
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-stone-600">
              Phần homepage đã được chỉnh lại đúng mục tiêu bán hàng: lấy thực phẩm chức năng làm trọng tâm, giữ lại kiến trúc App Router,
              metadata, sitemap, robots và redirect ở tầng code, còn giao diện hiển thị ra ngoài tập trung vào điều hướng danh mục, sản phẩm nổi bật
              và lý do mua hàng.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                href={`/category/${DEFAULT_CATEGORY_SLUG}`}
              >
                Xem thực phẩm chức năng
              </Link>
              <Link
                className="rounded-full border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
                href="#san-pham-noi-bat"
              >
                Xem sản phẩm nổi bật
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {CATEGORY_CONFIG.map((category) => (
                <Link
                  className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
                  href={`/category/${category.slug}`}
                  key={category.slug}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[28px] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Danh mục chính</p>
              <p className="mt-3 text-3xl font-black text-stone-900">4 nhóm</p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Tách route riêng cho thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc.
              </p>
            </article>

            <article className="rounded-[28px] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Mục tiêu SEO</p>
              <p className="mt-3 text-3xl font-black text-stone-900">SSR + Metadata</p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Trang chủ được render bằng server component với metadata, sitemap và robots tách riêng.
              </p>
            </article>

            <article className="rounded-[28px] bg-white p-5 shadow-sm sm:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Cam kết hiển thị</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-stone-600">
                {commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {serviceHighlights.map((item) => (
          <article
            className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm shadow-emerald-100"
            key={item.title}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">
              ✓
            </div>
            <h2 className="mt-4 text-lg font-bold text-stone-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        <LandingSection
          eyebrow="Danh mục trọng tâm"
          title="Đi nhanh vào từng nhóm sản phẩm"
          description="Giữ cấu trúc route rõ ràng để cả người dùng lẫn công cụ tìm kiếm đều hiểu website đang bán gì và mỗi nhóm sản phẩm nằm ở đâu."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {CATEGORY_CONFIG.map((category, index) => (
              <Link
                className={`rounded-[24px] px-5 py-5 text-white shadow-md ${
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

        <div id="san-pham-noi-bat">
          <LandingSection
            eyebrow="Sản phẩm nổi bật"
            title="Ba sản phẩm thực phẩm chức năng nên đưa lên landing đầu tiên"
            description="Phần này dùng lại card sản phẩm đang có trong storefront để tránh nhân đôi UI và giữ trải nghiệm mua hàng nhất quán giữa homepage và category page."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </LandingSection>
        </div>

        <LandingSection
          eyebrow="Mở rộng bán chéo"
          title="Các nhóm sản phẩm phụ vẫn giữ được vai trò trên trang chủ"
          description="Dù homepage lấy thực phẩm chức năng làm trung tâm, bạn vẫn nên hiển thị thêm vài sản phẩm từ nhóm chăm sóc da, thiết bị y tế hoặc thuốc để tăng lối đi mua sắm."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {highlightProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="SEO và nội dung"
          title="Homepage bán hàng nhưng vẫn được dựng trên kiến trúc tối ưu SEO"
          description="Phần kỹ thuật không hiển thị trực tiếp trên giao diện người dùng, nhưng đang hoạt động ở tầng code để giúp website dễ index và dễ mở rộng campaign về sau."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              'Route group `(landing)` tách homepage khỏi category và product.',
              'Metadata riêng cho homepage với title, description, canonical và Open Graph.',
              'Sitemap sinh tự động cho trang chủ, category và product.',
              'Middleware redirect giữ các alias cũ như `/shop` hoặc `/landing` trỏ đúng đích.',
            ].map((item, index) => (
              <article className="rounded-[22px] border border-stone-200 bg-stone-50 p-5" key={item}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Điểm {index + 1}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-700">{item}</p>
              </article>
            ))}
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="FAQ"
          title="Câu hỏi thường gặp cho landing page bán thực phẩm chức năng"
          description="FAQ giúp tăng chiều sâu nội dung trên homepage và hỗ trợ SEO tốt hơn cho các truy vấn thông tin."
        >
          <div className="space-y-4">
            {faqItems.map((item) => (
              <article className="rounded-[22px] border border-stone-200 bg-stone-50 p-5" key={item.question}>
                <h3 className="text-lg font-bold text-stone-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-stone-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </LandingSection>
      </div>
    </>
  )
}
