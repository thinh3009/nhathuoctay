import Image from 'next/image'
import type { Product, ProductImage } from '@/lib/schemas'
import { getProductImageSrc } from '@/lib/productImages'

type ProductVisualProps = {
  product: Product
  image: ProductImage
  variant?: 'card' | 'thumb'
  active?: boolean
}

const themeByCategory: Record<
  Product['topCategorySlug'],
  { shell: string; panel: string; accent: string; ink: string }
> = {
  'thuc-pham-chuc-nang': {
    shell: 'from-cyan-50 to-white',
    panel: 'bg-cyan-100',
    accent: 'bg-cyan-600',
    ink: 'text-cyan-700',
  },
  'cham-soc-da': {
    shell: 'from-rose-50 to-white',
    panel: 'bg-rose-100',
    accent: 'bg-rose-500',
    ink: 'text-rose-700',
  },
  'thiet-bi-y-te': {
    shell: 'from-emerald-50 to-white',
    panel: 'bg-emerald-100',
    accent: 'bg-emerald-600',
    ink: 'text-emerald-700',
  },
  thuoc: {
    shell: 'from-amber-50 to-white',
    panel: 'bg-amber-100',
    accent: 'bg-amber-500',
    ink: 'text-amber-700',
  },
}

export default function ProductVisual({
  product,
  image,
  variant = 'card',
  active = false,
}: ProductVisualProps) {
  const theme = themeByCategory[product.topCategorySlug]

  if (variant === 'thumb') {
    return (
      <div
        className={`flex h-20 items-center justify-center rounded-lg border bg-white px-2 text-center shadow-sm ${
          active ? 'border-cyan-700 ring-2 ring-cyan-200' : 'border-slate-200'
        }`}
      >
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${theme.ink}`}>
            {image.label}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-600">{product.unit}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-36 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <Image
        alt={`${product.name} - ${image.label}`}
        className="object-cover"
        fill
        sizes="(max-width: 768px) 50vw, 320px"
        src={getProductImageSrc(image)}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent p-3">
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
