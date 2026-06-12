import Link from 'next/link'
import { CATEGORY_CONFIG } from '@/lib/constants'

type StoreHeaderProps = {
  activeCategorySlug?: string
  cartCount: number
}

export default function StoreHeader({ activeCategorySlug, cartCount }: StoreHeaderProps) {
  return (
    <header className="rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">NutriHome</p>
          <Link className="mt-1 block text-2xl font-bold text-stone-900 sm:text-3xl" href="/">
            Nhà thuốc và chăm sóc sức khỏe
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-emerald-600 hover:text-emerald-700"
            href="/"
          >
            Trang chủ
          </Link>
          <Link
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            href="/cart"
          >
            Giỏ hàng ({cartCount})
          </Link>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 border-t border-stone-200 px-4 py-3">
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
    </header>
  )
}
