import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getProductBySlug, getRelatedProducts } from '@/features/products/queries'
import ProductDetailHero from '@/features/products/components/ProductDetailHero'
import RelatedProductsSection from '@/features/products/components/RelatedProductsSection'
import ReviewSection from '@/features/products/components/ReviewSection'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { getServerCartCount } from '@/lib/cart'
import { JsonLd, toAbsoluteUrl } from '@/components/ui/JsonLd'
import { SITE_NAME, SITE_URL } from '@/config/site'
import type { Product } from '@/lib/schemas'

// Structured data cho trang sản phẩm: Product (+ Offer, + AggregateRating nếu có review thật)
// và BreadcrumbList. Dùng dữ liệu thật trong DB — KHÔNG bịa rating khi chưa có đánh giá
// (Google phạt manual action nếu markup rating giả).
function buildProductJsonLd(product: Product) {
  const url = `${SITE_URL}/product/${product.slug}`
  const description =
    product.shortDescription?.trim() || product.benefit?.trim() || product.description?.trim() || product.name

  const productLd: Record<string, unknown> = {
    '@type': 'Product',
    name: product.name,
    description,
    image: product.images?.map((image) => toAbsoluteUrl(image.src)) ?? [],
    sku: product.sku || undefined,
    ...(product.manufacturer ? { brand: { '@type': 'Brand', name: product.manufacturer } } : {}),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url,
    },
  }

  // Chỉ nhúng AggregateRating khi thực sự có đánh giá (reviewCount > 0).
  if (product.reviewCount > 0) {
    productLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    }
  }

  const breadcrumbLd = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.topCategory,
        item: `${SITE_URL}/category/${product.topCategorySlug}`,
      },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  }

  return { '@context': 'https://schema.org', '@graph': [productLd, breadcrumbLd] }
}

// Render theo từng request (không prerender lúc build) để build không cần DB.
export const dynamic = 'force-dynamic'

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
}

// Title/description/canonical/OG riêng cho từng sản phẩm — nếu thiếu, mọi trang sản phẩm
// sẽ dùng chung title mặc định và không có gì để search index (xem CLAUDE.md mục 10).
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  // notFound() ngay trong generateMetadata (resolve TRƯỚC khi stream <head>/loading.tsx) để trả
  // HTTP 404 THẬT. Nếu chỉ dựa vào notFound() trong component bên dưới, loading.tsx đã flush shell
  // 200 trước → soft-404 (status 200 cho slug sai, hại SEO). Xem CLAUDE.md.
  if (!product) {
    notFound()
  }

  const rawDescription =
    product.shortDescription?.trim() ||
    product.benefit?.trim() ||
    product.description?.trim() ||
    `${product.name} chính hãng tại ${SITE_NAME}.`
  const description = rawDescription.slice(0, 300)
  const canonical = `/product/${product.slug}`
  const image = product.images?.[0]?.src

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
  }
}

// Khối "sản phẩm liên quan" tự truy vấn DB riêng và được stream qua Suspense,
// để phần thông tin sản phẩm chính (hero + đánh giá) hiện trước, không phải chờ.
async function RelatedProducts({ product }: { product: Product }) {
  const relatedProducts = await getRelatedProducts(product)
  return <RelatedProductsSection products={relatedProducts} />
}

function RelatedProductsSkeleton() {
  return (
    <section className="mt-8 animate-pulse rounded-2xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-100/60">
      <div className="h-6 w-48 rounded bg-stone-200" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-56 rounded-2xl bg-stone-100" key={index} />
        ))}
      </div>
    </section>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  // Truy vấn song song để giảm thời gian chờ (thay vì tuần tự từng cái).
  const [product, cartCount] = await Promise.all([
    getProductBySlug(slug),
    getServerCartCount(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-page)] text-stone-900">
      <JsonLd data={buildProductJsonLd(product)} />
      <SiteHeader activeCategorySlug={product.topCategorySlug} cartCount={cartCount} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div>
          <Link
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            href={`/category/${product.topCategorySlug}`}
          >
            ← Quay lại {product.topCategory.toLowerCase()}
          </Link>
        </div>
        <ProductDetailHero key={product.slug} product={product} />
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts product={product} />
        </Suspense>
        <ReviewSection product={product} />
      </main>
      <SiteFooter />
    </div>
  )
}
