import Link from 'next/link'
import { CATEGORY_CONFIG } from '@/lib/constants'

type StoreHeaderProps = {
  activeCategorySlug?: string
  cartCount: number
}

export default function StoreHeader({ activeCategorySlug, cartCount }: StoreHeaderProps) {
  return (
    <header className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">NutriHome</p>
        <Link className="mt-1 block text-2xl font-bold text-stone-900 sm:text-3xl" href="/">
          Nhà thuốc và chăm sóc sức khỏe
        </Link>
      </div>

      <div className="flex flex-col gap-3 border-t border-stone-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex flex-wrap gap-2">
          {CATEGORY_CONFIG.map((item) => (
            <Link
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeCategorySlug === item.slug
                  ? 'bg-emerald-700 text-white'
                  : 'text-stone-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
              href={`/category/${item.slug}`}
              key={item.slug}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className="self-start rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 lg:self-auto"
          href="/cart"
        >
          Giỏ hàng ({cartCount})
        </Link>
      </div>
    </header>
  )
}
