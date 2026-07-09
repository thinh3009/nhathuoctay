import Link from 'next/link'
import { formatPrice } from '@/utils/format'
import { getPrimaryProductImage } from '@/lib/productImages'
import type { Product } from '@/features/products/types'
import AddToCartButton from '@/features/cart/components/AddToCartButton'
import ProductVisual from './ProductVisual'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = getPrimaryProductImage(product)

  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm shadow-emerald-100/60">
      {primaryImage ? <ProductVisual image={primaryImage} product={product} /> : null}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          {product.badge}
        </span>
        <span className="text-xs font-medium text-stone-500">{product.rating.toFixed(1)} / 5</span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {product.subCategory}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-stone-900">{product.name}</h3>
      <p className="mt-2 min-h-10 text-sm leading-5 text-stone-600">{product.benefit}</p>
      <p className="mt-4 text-xl font-bold text-emerald-800">{formatPrice(product.price)}</p>
      <div className="mt-4 grid gap-2">
        <Link
          className="block rounded-xl bg-emerald-700 px-4 py-2 text-center font-medium text-white transition hover:bg-emerald-800"
          href={`/product/${product.slug}`}
        >
          Xem chi tiết
        </Link>
        <AddToCartButton
          className="rounded-xl border border-emerald-300 px-4 py-2 font-medium text-emerald-700 transition hover:border-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          productSlug={product.slug}
        />
      </div>
    </article>
  )
}
