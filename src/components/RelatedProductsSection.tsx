import { Link } from 'react-router-dom'
import { formatPrice, type Product } from '../data/products'
import ProductVisual from './ProductVisual'

type RelatedProductsSectionProps = {
  products: Product[]
}

function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            Gợi ý mua thêm
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Sản phẩm liên quan</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={product.slug}>
            <ProductVisual imageLabel={product.images[0]} product={product} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan-700">
              {product.subCategory}
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-950">{product.name}</h3>
            <p className="mt-2 min-h-10 text-sm text-slate-600">{product.benefit}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-lg font-bold text-cyan-700">{formatPrice(product.price)}</p>
              <Link
                className="rounded-lg border border-cyan-700 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50"
                to={`/product/${product.slug}`}
              >
                Xem chi tiết
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RelatedProductsSection
