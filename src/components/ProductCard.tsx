import Link from 'next/link'
import { formatPrice } from '@/lib/catalog'
import { getPrimaryProductImage } from '@/lib/productImages'
import type { Product } from '@/lib/schemas'
import AddToCartButton from './AddToCartButton'
import ProductVisual from './ProductVisual'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = getPrimaryProductImage(product)

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {primaryImage ? <ProductVisual image={primaryImage} product={product} /> : null}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
          {product.badge}
        </span>
        <span className="text-xs font-medium text-slate-500">{product.rating.toFixed(1)} / 5</span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan-700">
        {product.subCategory}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-slate-950">{product.name}</h3>
      <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">{product.benefit}</p>
      <p className="mt-4 text-xl font-bold text-cyan-700">{formatPrice(product.price)}</p>
      <div className="mt-4 grid gap-2">
        <Link
          className="block rounded-lg bg-cyan-700 px-4 py-2 text-center font-medium text-white hover:bg-cyan-800"
          href={`/product/${product.slug}`}
        >
          Xem chi tiết
        </Link>
        <AddToCartButton
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:border-cyan-700 hover:text-cyan-700 disabled:opacity-60"
          productSlug={product.slug}
        />
      </div>
    </article>
  )
}
