import Link from 'next/link'
import { formatPrice } from '@/lib/catalog'
import { getPrimaryProductImage } from '@/lib/productImages'
import type { Product } from '@/lib/schemas'
import ProductVisual from '@/components/ProductVisual'

type StoreHeroVisualProps = {
  products: Product[]
}

export default function StoreHeroVisual({ products }: StoreHeroVisualProps) {
  const [primary, secondary, tertiary] = products

  if (!primary) {
    return null
  }

  const primaryImage = getPrimaryProductImage(primary)
  const secondaryImage = secondary ? getPrimaryProductImage(secondary) : null
  const tertiaryImage = tertiary ? getPrimaryProductImage(tertiary) : null

  return (
    <div className="relative mx-auto max-w-xl">
      <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-cyan-200/70 blur-3xl" />
      <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-emerald-200/80 blur-3xl" />

      <div className="relative rounded-[30px] border border-white/70 bg-white/90 p-4 shadow-lg shadow-cyan-100 backdrop-blur sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="rounded-[24px] border border-emerald-100 bg-white p-3 shadow-sm">
              {primaryImage ? <ProductVisual image={primaryImage} product={primary} /> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] bg-gradient-to-br from-emerald-700 to-teal-600 px-4 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Best seller
                </p>
                <p className="mt-2 text-lg font-bold">{primary.name}</p>
                <p className="mt-2 text-sm text-emerald-50">{formatPrice(primary.price)}</p>
              </div>

              <div className="rounded-[22px] border border-stone-200 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Cam kết
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Hình ảnh rõ ràng, điều hướng gọn và sản phẩm nổi bật được đẩy ngay ở màn đầu tiên.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {secondary && secondaryImage ? (
              <Link
                className="block rounded-[22px] border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                href={`/product/${secondary.slug}`}
              >
                <ProductVisual image={secondaryImage} product={secondary} />
                <p className="mt-3 text-sm font-semibold text-stone-900">{secondary.name}</p>
                <p className="mt-1 text-sm text-emerald-700">{formatPrice(secondary.price)}</p>
              </Link>
            ) : null}

            {tertiary && tertiaryImage ? (
              <Link
                className="block rounded-[22px] border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                href={`/product/${tertiary.slug}`}
              >
                <ProductVisual image={tertiaryImage} product={tertiary} />
                <p className="mt-3 text-sm font-semibold text-stone-900">{tertiary.name}</p>
                <p className="mt-1 text-sm text-emerald-700">{formatPrice(tertiary.price)}</p>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
