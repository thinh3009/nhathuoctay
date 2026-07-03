import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getProductBySlug, getRelatedProducts } from '@/db/queries/catalog'
import ProductDetailHero from '@/components/ProductDetailHero'
import RelatedProductsSection from '@/components/RelatedProductsSection'
import ReviewSection from '@/components/ReviewSection'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getServerCartCount } from '@/lib/cart'
import type { Product } from '@/lib/schemas'

// Render theo từng request (không prerender lúc build) để build không cần DB.
export const dynamic = 'force-dynamic'

// Khối "sản phẩm liên quan" tự truy vấn DB riêng và được stream qua Suspense,
// để phần thông tin sản phẩm chính (hero + đánh giá) hiện trước, không phải chờ.
async function RelatedProducts({ product }: { product: Product }) {
  const relatedProducts = await getRelatedProducts(product)
  return <RelatedProductsSection products={relatedProducts} />
}

function RelatedProductsSkeleton() {
  return (
    <section className="mt-8 animate-pulse rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100/60">
      <div className="h-6 w-48 rounded bg-stone-200" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-56 rounded-2xl bg-stone-100" key={index} />
        ))}
      </div>
    </section>
  )
}

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
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
    <div className="flex min-h-screen flex-col bg-[#f6faf7] text-stone-900">
      <SiteHeader activeCategorySlug={product.topCategorySlug} cartCount={cartCount} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div>
          <Link
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
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
