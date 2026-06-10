import type { Product } from '@/lib/schemas'
import ProductCard from './ProductCard'

type RelatedProductsSectionProps = {
  products: Product[]
}

export default function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Gợi ý mua thêm</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-950">Sản phẩm liên quan</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
