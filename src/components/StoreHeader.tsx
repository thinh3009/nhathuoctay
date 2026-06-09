import { Link, NavLink } from 'react-router-dom'
import { categoryNavItems, defaultCategorySlug } from '../data/products'

type StoreHeaderProps = {
  cartCount: number
  activeCategorySlug?: string
}

function StoreHeader({ cartCount, activeCategorySlug }: StoreHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">NutriHome</p>
          <Link
            className="mt-1 block text-2xl font-bold text-slate-950 sm:text-3xl"
            to={`/category/${defaultCategorySlug}`}
          >
            Nhà thuốc và chăm sóc sức khỏe
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-cyan-700 hover:text-cyan-700"
            to={`/category/${defaultCategorySlug}`}
          >
            Trang chủ
          </Link>
          <Link
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-800"
            to="/cart"
          >
            Giỏ hàng ({cartCount})
          </Link>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 border-t border-slate-200 px-4 py-3">
        {categoryNavItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive || activeCategorySlug === item.slug
                  ? 'bg-cyan-700 text-white'
                  : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-700'
              }`
            }
            key={item.slug}
            to={`/category/${item.slug}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default StoreHeader
