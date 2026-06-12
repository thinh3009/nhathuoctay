import type { Metadata } from 'next'
import LandingCodeBlock from '@/components/landing/LandingCodeBlock'
import LandingSection from '@/components/landing/LandingSection'
import { SITE_NAME, SITE_URL } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kiến trúc Landing Page Next.js tối ưu SEO và Redirect',
  description:
    'Mô hình landing page với App Router, Metadata API, sitemap, robots, Open Graph và middleware redirect cho production.',
  keywords: ['Next.js', 'landing page', 'SEO', 'redirect', 'metadata', 'middleware'],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Kiến trúc Landing Page Next.js tối ưu SEO và Redirect',
    description:
      'Server Components, Metadata API, sitemap, robots và middleware được tổ chức rõ ràng để phục vụ SEO và redirect.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Kiến trúc landing page Next.js',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
}

const folderStructure = String.raw`my-landing-page/
├── src/
│   ├── app/
│   │   ├── [locale]/               # (Tùy chọn) Hỗ trợ đa ngôn ngữ i18n
│   │   ├── (landing)/              # Route Group cho Landing Page
│   │   │   ├── page.tsx            # Trang landing page chính
│   │   │   ├── layout.tsx          # Layout riêng cho landing page
│   │   │   └── opengraph-image.tsx # Ảnh chia sẻ Open Graph động
│   │   ├── sitemap.ts              # Tạo sitemap tự động
│   │   ├── robots.ts               # Tạo robots.txt
│   │   └── layout.tsx              # Root layout tổng của ứng dụng
│   ├── components/
│   │   ├── common/                 # Button, Input, Card
│   │   └── landing/                # Hero, Features, Pricing, CTA
│   ├── config/
│   │   └── redirects.ts            # Danh sách các redirect rule
│   ├── middleware.ts               # Redirect ở tầng Edge
│   └── styles/
│       └── globals.css             # Tailwind / CSS Variables`

const metadataSnippet = String.raw`import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giải pháp Công nghệ Xanh cho Doanh nghiệp | Tên Thương Hiệu',
  description:
    'Landing page tối ưu hóa quy trình vận hành tự động, tiết kiệm 40% chi phí vận hành. Đăng ký tư vấn ngay.',
  keywords: ['tự động hóa', 'phần mềm doanh nghiệp', 'tối ưu quy trình'],
  alternates: {
    canonical: 'https://domain.com',
  },
  openGraph: {
    title: 'Giải pháp Công nghệ Xanh cho Doanh nghiệp',
    description:
      'Tiết kiệm 40% chi phí vận hành với hệ thống tự động hóa thế hệ mới.',
    url: 'https://domain.com',
    siteName: 'Tên Thương Hiệu',
    locale: 'vi_VN',
    type: 'website',
  },
}`

const sitemapSnippet = String.raw`// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://domain.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}`

const redirectSnippet = String.raw`// src/config/redirects.ts
export const redirects = [
  { source: '/home', destination: '/', permanent: true },
  { source: '/landing', destination: '/', permanent: true },
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/old-seo-guide', destination: '/', permanent: false },
]

// src/middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const rule = redirects.find((item) => item.source === request.nextUrl.pathname)
  if (!rule) return NextResponse.next()

  return NextResponse.redirect(
    new URL(rule.destination, request.url),
    rule.permanent ? 308 : 307,
  )
}`

const architecturePoints = [
  'Dùng App Router để tận dụng Server Components mặc định, tối ưu render cho bot và tốc độ tải lần đầu.',
  'Tách route landing bằng Route Group nếu site còn có dashboard, blog hoặc khu vực sản phẩm khác.',
  'Đưa Metadata API, sitemap, robots và Open Graph vào tầng app để quản lý tập trung.',
  'Dùng middleware để xử lý redirect sớm ở Edge thay vì chờ request đi sâu vào page logic.',
]

const seoPoints = [
  'Title, description, canonical và Open Graph nên được khai báo bằng Metadata API ngay tại route landing chính.',
  'Sitemap và robots nên được tự động sinh bằng file convention của Next.js để tránh quên cập nhật thủ công.',
  'Nếu landing có nhiều locale hoặc chiến dịch, canonical và alternates phải được quản lý rõ để tránh duplicate content.',
  'Giữ phần nội dung chính ở server-rendered markup để crawler đọc được ngay mà không phụ thuộc client hydration.',
]

const redirectPoints = [
  'Tập trung toàn bộ redirect rule ở một file config để dễ audit trước khi deploy.',
  'Middleware nên giữ logic mỏng: match path, giữ nguyên query string, trả 307 hoặc 308 đúng mục đích.',
  'Chỉ redirect ở middleware cho các rule phổ biến; các trường hợp business phức tạp có thể xử lý trong route riêng.',
  'Nên tránh xung đột giữa redirect từ middleware, next.config.js và layer reverse proxy.',
]

export default function LandingPage() {
  return (
    <>
      <section className="rounded-[32px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-lime-50 p-8 shadow-sm shadow-emerald-100 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Blueprint thực chiến
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
              Kiến trúc landing page bằng Next.js cho SEO chuẩn, redirect rõ ràng và dễ mở rộng
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-stone-600">
              Trang này được tinh chỉnh lại đúng theo nội dung bạn đưa: giữ những phần layout còn tận dụng được,
              bỏ các block bán hàng không còn phù hợp, và thay bằng kiến trúc landing page tập trung vào App Router,
              Metadata API, sitemap, robots và middleware redirect.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                href="#kien-truc"
              >
                Xem cấu trúc đề xuất
              </a>
              <a
                className="rounded-full border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
                href="#redirect"
              >
                Xem flow redirect
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Điều đang có trong code
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              <li>
                <code>/</code> là landing page độc lập.
              </li>
              <li>
                <code>metadata</code>, <code>sitemap</code>, <code>robots</code>, <code>opengraph-image</code> đã được
                khai báo.
              </li>
              <li>
                <code>middleware.ts</code> và <code>config/redirects.ts</code> đã được thêm để mô phỏng redirect chuẩn.
              </li>
              <li>Phần nội dung cũ không đúng ngữ cảnh đã được loại bỏ thay vì xóa trắng toàn bộ.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {architecturePoints.map((item) => (
          <article
            className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm shadow-emerald-100"
            key={item}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">
              ✓
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-700">{item}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        <div id="kien-truc">
          <LandingSection
            eyebrow="1. Cấu trúc thư mục"
            title="Folder structure nên rõ phần landing, config và file SEO hệ thống"
            description="Đây là cấu trúc đề xuất chuẩn để landing page không bị lẫn với dashboard, blog hoặc các route nghiệp vụ khác. Route Group giúp tách logic gọn hơn mà không làm thay đổi URL public."
          >
            <LandingCodeBlock code={folderStructure} />
          </LandingSection>
        </div>

        <div id="seo">
          <LandingSection
            eyebrow="2. Tối ưu SEO"
            title="Metadata, canonical, Open Graph, sitemap và robots nên là lớp bắt buộc"
            description="Với landing page, tốc độ tải trang và metadata là hai phần cần ưu tiên. Next.js App Router đã cho bạn nền tảng tốt nhờ Server Components và Metadata API."
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="text-lg font-bold text-stone-900">Nguyên tắc triển khai</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                  {seoPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <LandingCodeBlock code={metadataSnippet} />
            </div>
          </LandingSection>
        </div>

        <LandingSection
          eyebrow="2b. Sitemap và Robots"
          title="Dùng file convention của Next.js để sinh sitemap.xml và robots.txt"
          description="Google Bot rất cần các file hệ thống này để index chính xác. Với Next.js App Router, bạn không cần generate thủ công bằng script ngoài nếu chỉ là các route cơ bản."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <LandingCodeBlock code={sitemapSnippet} />
            <div className="rounded-[24px] border border-stone-200 bg-white p-5">
              <h3 className="text-lg font-bold text-stone-900">Đang áp dụng trong dự án</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                <li>
                  <code>src/app/sitemap.ts</code>
                </li>
                <li>
                  <code>src/app/robots.ts</code>
                </li>
                <li>
                  <code>src/app/(landing)/opengraph-image.tsx</code>
                </li>
              </ul>
            </div>
          </div>
        </LandingSection>

        <div id="redirect">
          <LandingSection
            eyebrow="3. Redirect"
            title="Redirect sớm ở Edge bằng middleware để giảm vòng xử lý không cần thiết"
            description="Redirect nên được tổ chức riêng thay vì viết rải rác. Khi có chiến dịch mới, domain phụ hoặc route cũ, bạn chỉ cần cập nhật đúng một nguồn cấu hình."
          >
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="text-lg font-bold text-stone-900">Checklist redirect</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                  {redirectPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <LandingCodeBlock code={redirectSnippet} />
            </div>
          </LandingSection>
        </div>

        <div id="trien-khai">
          <LandingSection
            eyebrow="4. Triển khai"
            title="Thứ tự triển khai hợp lý để landing page vừa sạch code vừa tốt cho SEO"
            description="Nếu bạn muốn dựng project sạch ngay từ đầu, đây là phần nên ưu tiên trước khi viết các section bán hàng như Hero, Features, Pricing hay CTA."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                'Chốt cấu trúc thư mục và route group cho landing page.',
                'Khai báo metadata, canonical, Open Graph và ảnh chia sẻ.',
                'Thêm sitemap, robots, redirect config và middleware.',
                'Sau cùng mới tách các section giao diện như Hero, Features, CTA.',
              ].map((item, index) => (
                <article className="rounded-[22px] border border-stone-200 bg-stone-50 p-5" key={item}>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Bước {index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{item}</p>
                </article>
              ))}
            </div>
          </LandingSection>
        </div>
      </div>
    </>
  )
}
