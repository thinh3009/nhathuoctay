import type { Product } from '@/lib/schemas'

type ProductVisualProps = {
  product: Product
  imageLabel: string
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
  imageLabel,
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
            {imageLabel}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-600">{product.unit}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-36 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br ${theme.shell}`}>
      <div className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${theme.accent}`}>
        {product.subCategory}
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
        <div className={`h-20 w-12 rounded-[1.1rem] border border-white/60 ${theme.panel}`} />
        <div className="flex-1 rounded-lg border border-white/60 bg-white/80 p-3">
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${theme.ink}`}>
            {imageLabel}
          </p>
          <p className="mt-1 max-h-10 overflow-hidden text-sm font-semibold leading-5 text-slate-900">
            {product.name}
          </p>
        </div>
      </div>
    </div>
  )
}
