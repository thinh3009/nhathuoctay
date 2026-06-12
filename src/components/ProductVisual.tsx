import Image from 'next/image'
import type { Product, ProductImage } from '@/lib/schemas'
import { getProductImageSrc } from '@/lib/productImages'

type ProductVisualProps = {
  product: Product
  image: ProductImage
  variant?: 'card' | 'thumb'
  active?: boolean
}

const theme = {
  accent: 'bg-emerald-700',
  ink: 'text-emerald-800',
}

export default function ProductVisual({
  product,
  image,
  variant = 'card',
  active = false,
}: ProductVisualProps) {
  if (variant === 'thumb') {
    return (
      <div
        className={`flex h-20 items-center justify-center rounded-lg border bg-white px-2 text-center shadow-sm ${
          active ? 'border-emerald-800 ring-2 ring-emerald-200' : 'border-stone-200'
        }`}
      >
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${theme.ink}`}>
            {image.label}
          </p>
          <p className="mt-1 text-xs font-medium text-stone-600">{product.unit}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-36 overflow-hidden rounded-lg border border-emerald-100 bg-emerald-950">
      <Image
        alt={`${product.name} - ${image.label}`}
        className="object-cover opacity-95"
        fill
        sizes="(max-width: 768px) 50vw, 320px"
        src={getProductImageSrc(image)}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950 via-emerald-950/35 to-transparent p-3">
        <div
          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${theme.accent}`}
        >
          {product.subCategory}
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{product.name}</p>
      </div>
    </div>
  )
}
