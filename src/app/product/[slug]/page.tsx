import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/db/queries/catalog'
import ProductDetailHero from '@/components/ProductDetailHero'
import RelatedProductsSection from '@/components/RelatedProductsSection'
import ReviewSection from '@/components/ReviewSection'
import StoreFooter from '@/components/StoreFooter'
import StoreHeader from '@/components/StoreHeader'
import { getServerCartCount } from '@/lib/cart'

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const cartCount = await getServerCartCount()

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product)

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <StoreHeader activeCategorySlug={product.topCategorySlug} cartCount={cartCount} />
        <div className="mt-6">
          <Link
            className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
            href={`/category/${product.topCategorySlug}`}
          >
            ← Quay lại {product.topCategory.toLowerCase()}
          </Link>
        </div>
        <ProductDetailHero key={product.slug} product={product} />
        <RelatedProductsSection products={relatedProducts} />
        <ReviewSection product={product} />
        <StoreFooter />
      </div>
    </main>
  )
}
