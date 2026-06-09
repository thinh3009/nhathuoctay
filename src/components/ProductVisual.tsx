import type { Product } from '../data/products'

type ProductVisualProps = {
  product: Product
  imageLabel: string
  variant?: 'hero' | 'card' | 'thumb'
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

function ProductVisual({
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

  if (variant === 'card') {
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

  return (
    <div className={`relative overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br ${theme.shell} p-6 shadow-sm`}>
      <div className="absolute inset-x-0 top-0 h-20 bg-white/40" />
      <div className="relative grid min-h-[430px] gap-4 sm:grid-cols-[1fr_1.2fr]">
        <div className="flex items-end justify-center">
          <div className={`relative h-72 w-32 rounded-[2rem] border border-white/70 ${theme.panel} shadow-lg`}>
            <div className="absolute left-4 right-4 top-5 rounded-full bg-white px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {product.unit}
            </div>
            <div className="absolute inset-x-4 top-16 rounded-xl bg-white px-3 py-4 text-center shadow-sm">
              <p className={`text-[10px] font-semibold uppercase tracking-wide ${theme.ink}`}>
                {product.topCategory}
              </p>
              <p className="mt-2 text-lg font-bold leading-tight text-slate-950">
                {product.name}
              </p>
            </div>
            <div className={`absolute bottom-6 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full ${theme.accent} text-center text-xs font-bold leading-[56px] text-white`}>
              {product.unit}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-80 w-full max-w-[260px] rounded-2xl border border-white/70 bg-white/85 p-5 shadow-lg">
            <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${theme.accent}`}>
              {imageLabel}
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {product.manufacturer}
            </p>
            <h3 className="mt-2 text-4xl font-bold leading-none text-slate-950">
              {product.name.split(' ')[0]}
            </h3>
            <p className="mt-1 text-xl font-semibold text-slate-800">
              {product.name.split(' ').slice(1).join(' ')}
            </p>
            <div className={`mt-8 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${theme.ink} ${theme.panel}`}>
              {product.ingredientHighlight}
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Quy cách</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{product.specification}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductVisual
